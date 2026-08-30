// 默认入口保留 DSH node half；浏览器直接使用 ./browser 或 browser 条件导出。
export * from './browser.js'
export { inject, apply } from '../ui/plugin.js'
