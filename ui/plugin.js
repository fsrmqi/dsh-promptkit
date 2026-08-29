/**
 * dsh-promptkit node half。
 *
 * PromptKit 是纯浏览器端插件：方法工坊（PromptStudio）与快捷助手（QuickEnhancer）
 * 全部在 ui/client.js 中通过 dsh.client 客户端模块注册（inject slots/sessions，
 * apply 里用 ctx.slots 注入 conversation.view / conversation.input.right 插槽）。
 *
 * 除了让 Loader 发现浏览器模块，也复用当前会话的模型路由提供语义增强：
 *   - 非流式 JSON 路由（兼容旧客户端）
 *   - SSE 流式路由（逐段上屏 + 五维诊断）
 *   - 工作区文件检索路由（@ 文件引用补全的数据源）
 */
import { semanticEnhanceRoute, semanticEnhanceStreamRoute, workspaceFilesRoute } from '../dsh/semantic-enhance.js'

export const inject = ['webServer', 'llm']

export function apply(ctx) {
  const routes = new Map()
  ctx.effect(() => {
    ctx.on('agent/created', ({ agent }) => {
      routes.set(String(agent.session.id), { provider: agent.options.provider, model: agent.options.model })
    })
    ctx.on('agent/disposed', ({ agent }) => routes.delete(String(agent.session.id)))
    return () => routes.clear()
  }, 'dsh-promptkit session model routes')
  // 工作区根目录：优先取 DSH 注入的项目根，取不到时安全降级为空（文件菜单自动隐藏）。
  const workspaceRoots = [ctx.project?.root, ctx.workspace?.root, process.cwd()].filter(Boolean)
  ctx.effect(() => ctx.webServer.register(semanticEnhanceRoute({ llm: ctx.llm, routes })), 'dsh-promptkit semantic enhancement')
  ctx.effect(() => ctx.webServer.register(semanticEnhanceStreamRoute({ llm: ctx.llm, routes })), 'dsh-promptkit semantic enhancement (stream)')
  ctx.effect(() => ctx.webServer.register(workspaceFilesRoute({ workspaceRoots })), 'dsh-promptkit workspace files')
}
