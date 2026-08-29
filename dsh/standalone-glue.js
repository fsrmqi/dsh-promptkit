// 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
// 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
//
// 语义增强经 node 半区复用当前会话的模型路由；浏览器端不保存 API Key 或模型配置。
// 语义增强默认走 SSE 流式路由；路由 404（旧 host）时自动降级为非流式 JSON 路由。

const promptkitMethodProvider = new StaticMethodProvider()
const promptkitAssetProvider = new StaticAssetProvider()

async function promptkitSearchMemory(sessionId, query) {
  const url = new URL('/memory-center/context-search', window.location.origin)
  url.searchParams.set('session_id', sessionId)
  url.searchParams.set('query', query)
  const response = await fetch(url)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.next_action || '项目记忆服务不可用；请安装并启用 Memory Center DSH 插件。')
  const wikiUrl = new URL('/memory-center/wiki-brief', window.location.origin)
  wikiUrl.searchParams.set('session_id', sessionId)
  wikiUrl.searchParams.set('task', query)
  const wiki = await fetch(wikiUrl).then(async value => value.ok ? value.json() : null).catch(() => null)
  const wikiItems = Object.entries(wiki?.groups || {}).flatMap(([group, rows]) => Array.isArray(rows) ? rows.slice(0, 3).map(item => ({ group, title: String(item?.title || '') })) : []).filter(item => item.title)
  return {
    text: String(body.suggested_context || ''),
    sources: [
      ...(body.suggested_context ? [{ kind: 'memory-center', label: 'Memory Center 项目记忆' }] : []),
      ...wikiItems.map(item => ({ kind: 'personal-wiki', label: `Personal Wiki · ${item.group} · ${item.title}` })),
    ],
  }
}

// @ 文件引用补全：经 node 半区的 workspace-files 路由检索工作区文件。
// 返回 null 表示服务不可用（旧 host 未注册路由），UI 据此隐藏文件菜单入口。
async function promptkitSearchFiles(query) {
  const url = new URL('/dsh-promptkit/workspace-files', window.location.origin)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '20')
  const response = await fetch(url).catch(() => null)
  if (!response || !response.ok) return null
  const body = await response.json().catch(() => ({}))
  return Array.isArray(body.files) ? body.files : []
}

class DshSessionEnhancer {
  constructor(getSessionId) { this.getSessionId = getSessionId; this.controller = null }
  get loading() { return !!this.controller }
  async enhance({ draft, extra, lang, method, strength, hasContext }) {
    this.controller?.abort()
    this.controller = new AbortController()
    try {
      const response = await fetch(`/dsh-promptkit/semantic-enhance?session_id=${encodeURIComponent(this.getSessionId())}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft, extra, lang, method, strength, hasContext, diagnose: true }),
        signal: this.controller.signal,
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
        throw new Error(body.next_action || body.error || '基于草稿改造失败')
      }
      return body
    } finally { this.controller = null }
  }
  // SSE 流式增强：onDelta 逐段回调（含诊断行）；resolve 值与 enhance() 一致。
  // 404/501（旧 host 未注册流式路由）时抛 fallback 错误，调用方退回非流式。
  async enhanceStream({ draft, extra, lang, method, strength, hasContext, diagnose = true, onDelta }) {
    this.controller?.abort()
    this.controller = new AbortController()
    const signal = this.controller.signal
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
      let errorMessage = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const frames = buffer.split('\n\n')
        buffer = frames.pop() || ''
        for (const frame of frames) {
          const lines = frame.split('\n')
          const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim()
          const dataLine = lines.find(line => line.startsWith('data:'))?.slice(5).trim()
          if (!event || !dataLine) continue
          const data = JSON.parse(dataLine)
          if (event === 'delta') onDelta?.(data.text)
          if (event === 'done') final = data
          if (event === 'error') errorMessage = data.message || data.error || '流式增强失败'
        }
      }
      if (errorMessage) throw new Error(errorMessage)
      if (!final) throw new Error('流式增强连接中断。')
      return final
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      if (error?.fallback || error?.timeout) throw error
      // 流式链路异常（网络截断等）且尚无输出时提示可重试；调用方决定是否退回非流式。
      throw error
    } finally { this.controller = null }
  }
  cancel() { this.controller?.abort(); this.controller = null }
}

// 桥接新版 DSH 会话输入框：InputState 由 useInput Hook 提供。
class DshDraftComposer {
  constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
  getDraft() { return this.input?.draft ?? '' }
  write(text) { this.inputActions?.setDraft(String(text ?? '')) }
  onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
  notify(draft) { for (const cb of this.listeners) cb(draft) }
}

// 快捷助手宿主：新版 DSH 的 useInput 是草稿真源，useChat 提供键控对话快照。
function PromptkitQuickActionHost({ sessionId, useInput, useChat, inputActions }) {
  const currentInput = useInput(value => value)
  const chatSnapshot = useChat(value => value)
  const messages = React.useMemo(() => conversationMessages(chatSnapshot), [chatSnapshot])
  const composer = React.useMemo(() => new DshDraftComposer(currentInput, inputActions), [currentInput, inputActions])
  const enhancer = React.useMemo(() => new DshSessionEnhancer(() => sessionId), [sessionId])
  const searchMemory = React.useCallback(query => promptkitSearchMemory(sessionId, query), [sessionId])
  const searchFiles = React.useCallback(promptkitSearchFiles, [])
  React.useEffect(() => { composer.notify(currentInput?.draft ?? '') }, [currentInput?.draft, composer])
  return h(ConversationQuickAction, { methodProvider: promptkitMethodProvider, assetProvider: promptkitAssetProvider, composer, enhancer, messages, searchMemory, searchFiles })
}

// 方法工坊宿主：写入新版输入机后交由 inputActions.submit() 发送。
function PromptkitStudioHost({ inputActions }) {
  const onSend = async text => { inputActions.setDraft(String(text ?? '')); inputActions.submit() }
  return h(PromptStudio, { methodProvider: promptkitMethodProvider, assetProvider: promptkitAssetProvider, onSend })
}

const promptkitApply = ctx => {
  const studio = [
    {
      name: 'conversation.view',
      id: 'dsh-promptkit-studio',
      order: 90,
      label: () => '高级方法工坊',
      inject: sessionId => ({ sessionId }),
    },
    PromptkitStudioHost,
  ]
  const disposers = [
    // 两个 slot 的挂载时机互不依赖。不能把 input.right 注册嵌在
    // conversation.view 的 inject 回调里：部分 DSH 页面会先挂输入框而暂未创建 view。
    ctx.slots.inject('conversation.view', () => ctx.slots.register(studio[0], studio[1])),
    ctx.slots.inject('conversation.input.right', () =>
      ctx.slots.register({ name: 'conversation.input.right', id: 'dsh-promptkit-quick-action', order: 85, label: () => '快捷助手' }, PromptkitQuickActionHost)),
  ]
  return () => disposers.forEach(dispose => dispose?.())
}
