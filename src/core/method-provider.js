// MethodProvider：方法源抽象。
// 解耦 PromptKit 与任何特定宿主（Memory Center / DSH / 通用前端）。
// 开源核心只依赖此接口；具体实现（内置静态方法、MC 私有 catalog、DSH 适配器）由宿主注入。

/**
 * @typedef {Object} Method
 * @property {string} id
 * @property {string} title
 * @property {string} [purpose]
 * @property {string} [category]
 * @property {'guided'|'structured'} [mode]
 * @property {string} [outcome]
 * @property {string} [tags]
 * @property {string} [template]
 */

export class MethodProvider {
  /** @returns {Promise<Method[]>} 全部方法 */
  async list() { throw new Error('MethodProvider.list() 未实现') }

  /** @param {string} query @returns {Promise<Method[]>} 按关键词搜索 */
  async search(query) {
    const all = await this.list()
    if (!query) return all
    const q = query.toLowerCase()
    return all.filter(m => `${m.title} ${m.purpose || ''} ${m.tags || ''}`.toLowerCase().includes(q))
  }

  /** @param {string} id @returns {Promise<Method|null>} 按 id 取单个 */
  async getById(id) { return (await this.list()).find(m => m.id === id) || null }

  /**
   * 组合生成最终 Prompt。
   * @param {{ methodId:string, question?:string, facts?:string, constraints?:string, options?:string }} input
   * @returns {Promise<{ prompt:string, estimated_chars:number, method:Method }>}
   */
  async compose(input) { throw new Error('MethodProvider.compose() 未实现') }

  /** @param {string} methodId @returns {Promise<{ prompt:string }>} 取模板（提示词库） */
  async getTemplate(methodId) { throw new Error('MethodProvider.getTemplate() 未实现') }

  /** @returns {Promise<string[]>} 收藏 id 列表（可选覆盖） */
  async getFavorites() { return [] }
  /** @param {string[]} ids */
  async setFavorites(ids) {}

  /** @returns {Promise<Array<{id:string,title:string,question?:string,at?:number}>>} 最近生成记录 */
  async getHistory() { return [] }
  /** @param {{id:string,title:string,question?:string}} item */
  async pushHistory(item) {}
  /** @param {(items:Array<{id:string,title:string,question?:string,at?:number}>)=>void} callback @returns {()=>void} */
  onHistoryChange(callback) { return () => {} }
}
