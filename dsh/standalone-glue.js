// 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
// 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
//
// 语义增强经 node 半区复用当前会话的模型路由；浏览器端不保存 API Key 或模型配置。
// 语义增强默认走 SSE 流式路由；路由 404（旧 host）时自动降级为非流式 JSON 路由。
import { DshSessionEnhancer } from '../src/adapters/dsh-session-enhancer.js'

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
async function promptkitSearchFiles(sessionId, query) {
  const url = new URL('/dsh-promptkit/workspace-files', window.location.origin)
  url.searchParams.set('q', query)
  url.searchParams.set('session_id', sessionId)
  url.searchParams.set('limit', '20')
  const response = await fetch(url).catch(() => null)
  if (!response || !response.ok) return null
  const body = await response.json().catch(() => ({}))
  return { files: Array.isArray(body.files) ? body.files : [], truncated: Boolean(body.truncated) }
}


// 桥接 DSH 输入框：inputActions 由槽位体系注入（InputActions.setDraft / submit）。
// getDraft 读构造时传入的 draft 快照（新契约）或 useInput 订阅值（旧契约）。
class DshDraftComposer {
  constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
  getDraft() { return this.input?.draft ?? '' }
  write(text) { this.inputActions?.setDraft(String(text ?? '')) }
  onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
  notify(draft) { for (const cb of this.listeners) cb(draft) }
}

// 快捷助手宿主：适配两代 DSH 槽位契约。
//   0.1.2-alpha：InputZone.session 仅包含会话状态，消息由 useChat 订阅。
//     input 是含 draft 的点时快照；Chat.legacy.nodes 是消息兼容投影。
//   0.1.0-rc（旧）：props = { sessionId, useInput, useChat, inputActions }，经 hooks 订阅。
function PromptkitQuickActionHost(props) {
  const { sessionId, input, useInput, useChat, inputActions } = props
  // 草稿真源：新契约直接读 zone.input.draft；旧契约用 useInput hook 订阅。
  const zonedDraft = input?.draft
  const hookedInput = useInput ? useInput(value => value) : undefined
  const draft = zonedDraft !== undefined ? zonedDraft : hookedInput?.draft
  // 选择消息投影，避免无关的会话状态/工具流更新触发整段历史重算。
  const chatSnapshot = useChat ? useChat(value => value?.legacy ?? value) : undefined
  const messages = React.useMemo(() => conversationMessages(chatSnapshot), [chatSnapshot])
  const composer = React.useMemo(() => new DshDraftComposer({ draft }, inputActions), [sessionId, inputActions])
  composer.input = { draft }
  const enhancer = React.useMemo(() => new DshSessionEnhancer(() => sessionId), [sessionId])
  const searchMemory = React.useCallback(query => promptkitSearchMemory(sessionId, query), [sessionId])
  const searchFiles = React.useCallback(query => promptkitSearchFiles(sessionId, query), [sessionId])
  React.useEffect(() => { composer.notify(draft ?? '') }, [draft, composer])
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
