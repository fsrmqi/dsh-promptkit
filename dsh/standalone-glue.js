// 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
// 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
//
// 配置（可选，用于语义增强）：
//   window.DSH_PROMPTKIT_CONFIG = { baseUrl, apiKey, model }
//   或 localStorage['dsh-promptkit.config.v1'] = JSON 同结构
// 未配置时语义增强按钮隐藏（组件按 enhancer 可选处理），方法工坊/模板/组合全部本地可用。

const promptkitConfig = (() => {
  try {
    return { ...(window.DSH_PROMPTKIT_CONFIG || {}), ...JSON.parse(window.localStorage.getItem('dsh-promptkit.config.v1') || '{}') }
  } catch { return {} }
})()

const promptkitMethodProvider = new StaticMethodProvider()

const promptkitEnhancer = promptkitConfig.baseUrl && promptkitConfig.apiKey
  ? new OpenAIEnhancer({ baseUrl: promptkitConfig.baseUrl, apiKey: promptkitConfig.apiKey, model: promptkitConfig.model || 'gpt-4o-mini' })
  : null

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
  React.useEffect(() => { composer.notify(input?.draft ?? '') }, [input?.draft, composer])
  return h(QuickEnhancer, { methodProvider: promptkitMethodProvider, composer, enhancer: promptkitEnhancer, messages })
}

// 方法工坊宿主：conversation.view 视图，onSend 走当前会话
function PromptkitStudioHost({ sessionId, onSend }) {
  return h(PromptStudio, { methodProvider: promptkitMethodProvider, onSend })
}

const promptkitApply = ctx => ctx.slots.inject('conversation.view', () => {
  const studio = [
    {
      name: 'conversation.view',
      id: 'dsh-promptkit-studio',
      order: 17,
      label: () => '方法工坊',
      inject: sessionId => {
        const session = ctx.sessions.binding(sessionId)?.session
        if (!session) throw new Error('dsh-promptkit: session unavailable')
        return { sessionId, onSend: text => session.prompt([{ type: 'text', text }], 'queue') }
      },
    },
    PromptkitStudioHost,
  ]
  const disposers = [
    ctx.slots.register(studio[0], studio[1]),
    ctx.slots.inject('conversation.input.right', () =>
      ctx.slots.register({ name: 'conversation.input.right', id: 'dsh-promptkit-quick-action', order: 85, label: () => '快捷助手' }, PromptkitQuickActionHost)),
  ]
  return () => disposers.forEach(dispose => dispose?.())
})
