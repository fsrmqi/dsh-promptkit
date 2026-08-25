// PromptKit 公共入口。
// 注意：ui/studio.js 与 ui/quick-enhancer.js 当前仍是“从 Memory Center 原样搬迁”的版本，
// 内部仍引用 useResource/fetchView/useSession/inputActions 等私有运行时（见文件内 TODO）。
// 下一阶段接口化后，两个组件将改为接收注入的 deps（methodProvider / composer / enhancer / messages）。

export { PromptStudio } from './ui/studio.js'
export { QuickEnhancer } from './ui/quick-enhancer.js'

export * from './core/method-provider.js'
export * from './core/composer.js'
export * from './core/enhancer.js'

export { BUILTIN_METHODS } from './methods/builtin.js'
export { StaticMethodProvider } from './adapters/static-method-provider.js'
export { TextareaComposer } from './adapters/textarea-composer.js'
export { OpenAIEnhancer } from './adapters/openai-enhancer.js'

export * from './lib/utils.js'
