// Enhancer：语义 / 轻量增强的模型调用抽象。
// 开源版可接任意 LLM（如 OpenAI 兼容端点），闭源版接当前会话模型。

export class Enhancer {
  /** @returns {boolean} 是否正在增强 */
  get loading() { return false }

  /**
   * @param {{ draft:string, extra?:string, lang?:string, kind?:'light'|'semantic',
   *           strength?:'low'|'mid'|'high', hasContext?:boolean, method?:object }} input
   * @returns {Promise<{ prompt:string, model?:string, diagnosis?:object|null }>}
   */
  async enhance(input) { throw new Error('Enhancer.enhance() 未实现') }

  /**
   * 可选实现：流式增强。组件检测到此方法时走逐段上屏；
   * 未实现或中途失败（非 AbortError）时组件自动退回 enhance()。
   * @param {typeof input & { onDelta?:(text:string)=>void }} input
   * @returns {Promise<{ prompt:string, model?:string, diagnosis?:object|null }>}
   */
  async enhanceStream(input) { throw new Error('Enhancer.enhanceStream() 未实现') }

  /** 取消进行中的增强 */
  cancel() {}
}
