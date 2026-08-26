/**
 * dsh-promptkit node half（占位）。
 *
 * PromptKit 是纯浏览器端插件：方法工坊（PromptStudio）与快捷助手（QuickEnhancer）
 * 全部在 ui/client.js 中通过 dsh.client 客户端模块注册（inject slots/sessions，
 * apply 里用 ctx.slots 注入 conversation.view / conversation.input.right 插槽）。
 *
 * 本文件只是 Cordis 插件行的合法 node 入口：loader 能成功挂载 `dsh-promptkit/ui`
 * 行，客户端模块系统即可把 ui/client.js 加入 Web 启动图。node 侧无需任何行为。
 */
export const name = 'dsh-promptkit'

export function apply() {
  // node 侧无行为；浏览器侧装配全部在 ui/client.js 完成。
}
