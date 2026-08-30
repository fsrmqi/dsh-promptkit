// PromptKit 公共入口。
// 两个 UI 组件零宿主依赖：外部能力（方法源 / 写入目标 / 模型调用 / 对话上下文 / 记忆检索）
// 全部经 props 注入，见组件文件头注释。

export { PromptStudio } from './ui/studio.js'
export { QuickEnhancer } from './ui/quick-enhancer.js'

export * from './core/method-provider.js'
export * from './core/composer.js'
export * from './core/enhancer.js'
export * from './core/asset-provider.js'

export { BUILTIN_METHODS } from './methods/builtin.js'
export { StaticMethodProvider } from './adapters/static-method-provider.js'
export { TextareaComposer } from './adapters/textarea-composer.js'
export { OpenAIEnhancer } from './adapters/openai-enhancer.js'
export { StaticAssetProvider } from './adapters/static-asset-provider.js'

export * from './lib/utils.js'
