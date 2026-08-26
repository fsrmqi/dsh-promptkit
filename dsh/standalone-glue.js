// 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
// 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
//
// 语义增强经 node 半区复用当前会话的模型路由；浏览器端不保存 API Key 或模型配置。

const promptkitMethodProvider = new StaticMethodProvider()

async function promptkitSearchMemory(sessionId, query) {
  const url = new URL('/memory-center/context-search', window.location.origin)
  url.searchParams.set('session_id', sessionId)
  url.searchParams.set('query', query)
  const response = await fetch(url)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.next_action || '项目记忆服务不可用；请安装并启用 Memory Center DSH 插件。')
  return String(body.suggested_context || '')
}

class DshSessionEnhancer {
  constructor(getSessionId) { this.getSessionId = getSessionId; this.controller = null }
  get loading() { return !!this.controller }
  async enhance({ draft, extra, lang, method }) {
    this.controller?.abort()
    this.controller = new AbortController()
    try {
      const response = await fetch(`/dsh-promptkit/semantic-enhance?session_id=${encodeURIComponent(this.getSessionId())}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft, extra, lang, method }),
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
  cancel() { this.controller?.abort(); this.controller = null }
}

// 桥接 DSH 会话输入框（conversation.input.right 注入的 props）为 Composer 接口
class DshDraftComposer {
  constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
  getDraft() { return this.input?.draft ?? '' }
  write(text) { this.inputActions?.setDraft(String(text ?? '')) }
  onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
  notify(draft) { for (const cb of this.listeners) cb(draft) }
}

// 快捷助手宿主：把 DSH 注入的 props 翻译为组件 deps
function PromptkitQuickActionHost({ sessionId, useSession, inputActions, input }) {
  const snapshot = useSession(value => value)
  const messages = React.useMemo(() => conversationMessages(snapshot), [snapshot?.nodes])
  const composer = React.useMemo(() => new DshDraftComposer(input, inputActions), [input, inputActions])
  const enhancer = React.useMemo(() => new DshSessionEnhancer(() => sessionId), [sessionId])
  const searchMemory = React.useCallback(query => promptkitSearchMemory(sessionId, query), [sessionId])
  React.useEffect(() => { composer.notify(input?.draft ?? '') }, [input?.draft, composer])
  return h(ConversationQuickAction, { methodProvider: promptkitMethodProvider, composer, enhancer, messages, searchMemory })
}

// 方法工坊宿主：conversation.view 视图，onSend 走当前会话
function PromptkitStudioHost({ sessionId, onSend }) {
  return h(PromptStudio, { methodProvider: promptkitMethodProvider, onSend })
}

const promptkitApply = ctx => {
  const studio = [
    {
      name: 'conversation.view',
      id: 'dsh-promptkit-studio',
      order: 90,
      label: () => '高级方法工坊',
      inject: sessionId => {
        const session = ctx.sessions.binding(sessionId)?.session
        if (!session) throw new Error('dsh-promptkit: session unavailable')
        return { sessionId, onSend: text => session.prompt([{ type: 'text', text }], 'queue') }
      },
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
