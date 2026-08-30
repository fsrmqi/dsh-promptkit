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
   * 仅抛出 fallback=true 且尚未输出时退回 enhance()；中途失败或取消不重复调用。
   * @param {typeof input & { onDelta?:(text:string)=>void }} input
   * @returns {Promise<{ prompt:string, model?:string, diagnosis?:object|null }>}
   */
  async enhanceStream(input) { throw Object.assign(new Error('Enhancer.enhanceStream() 未实现'), { fallback: true }) }

  /** 取消进行中的增强 */
  cancel() {}
}
