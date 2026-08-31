export class DshSessionEnhancer {
  constructor(getSessionId) { this.getSessionId = getSessionId; this.controller = null }
  get loading() { return !!this.controller }
  async enhance({ draft, extra, lang, method, strength, hasContext, diagnose = false }) {
    this.controller?.abort()
    const controller = new AbortController()
    this.controller = controller
    try {
      const response = await fetch(`/dsh-promptkit/semantic-enhance?session_id=${encodeURIComponent(this.getSessionId())}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft, extra, lang, method, strength, hasContext, diagnose }),
        signal: controller.signal,
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
        throw new Error(body.next_action || body.error || '基于草稿改造失败')
      }
      return body
    } finally { if (this.controller === controller) this.controller = null }
  }
  // SSE 流式增强：onDelta 逐段回调（含诊断行）；onStage 收到阶段切换（diagnosing/writing）；
  // resolve 值与 enhance() 一致。404/501（旧 host 未注册流式路由）时抛 fallback 错误，调用方退回非流式。
  async enhanceStream({ draft, extra, lang, method, strength, hasContext, diagnose = false, onDelta, onStage }) {
    this.controller?.abort()
    const controller = new AbortController()
    this.controller = controller
    const signal = controller.signal
    try {
      const response = await fetch(`/dsh-promptkit/semantic-enhance/stream?session_id=${encodeURIComponent(this.getSessionId())}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft, extra, lang, method, strength, hasContext, diagnose }),
        signal,
      })
      if (response.status === 404 || response.status === 501) {
        const error = new Error('stream_unavailable')
        error.fallback = true
        throw error
      }
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}))
        if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
        throw new Error(body.next_action || body.error || '流式增强不可用')
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let final = null
      const consume = frame => {
          const lines = frame.split(/\r?\n/)
          const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim()
          const dataLine = lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n')
          if (!event || !dataLine) return
          const data = JSON.parse(dataLine)
          if (event === 'delta') onDelta?.(data.text)
          if (event === 'stage') onStage?.(data.phase, data.model)
          if (event === 'done') final = data
          if (event === 'error') throw Object.assign(new Error(data.message || data.error || '流式增强失败'), { timeout: Boolean(data.timeout) })
      }
      try {
        for (;;) {
          const { value, done } = await reader.read()
          if (signal.aborted) throw Object.assign(new Error('已取消'), { name: 'AbortError' })
          buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
          const frames = buffer.split(/\r?\n\r?\n/)
          buffer = frames.pop() || ''
          for (const frame of frames) consume(frame)
          if (done && buffer.trim()) consume(buffer)
          if (final || done) break
        }
        if (!final) throw new Error('流式增强连接中断。')
        return final
      } finally {
        await reader.cancel().catch(() => {}) // 取消或服务端提前断开时清理读锁。
        reader.releaseLock()
      }
    } finally { if (this.controller === controller) this.controller = null }
  }
  cancel() { this.controller?.abort(); this.controller = null }
}
