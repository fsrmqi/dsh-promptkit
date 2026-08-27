// AssetProvider：可复用提示词、片段与结论的资产库抽象。
// 它与 MethodProvider 并列，避免把方法定义、运行历史和用户沉淀混为一种数据。

export class AssetProvider {
  /** @returns {Promise<Array<{id:string,type:string,title:string,body:string,tags:string[],project?:string,parentId?:string,note?:string,createdAt:number,updatedAt:number,lastUsedAt?:number,favorite?:boolean,provenance?:object}>>} */
  async list() { throw new Error('AssetProvider.list() 未实现') }
  async getById(id) { return (await this.list()).find(item => item.id === id) || null }
  async search(query) {
    const q = String(query || '').trim().toLowerCase()
    const rows = await this.list()
    return !q ? rows : rows.filter(item => [item.title, item.body, item.note, ...(item.tags || [])].join('\n').toLowerCase().includes(q))
  }
  async save(asset) { throw new Error('AssetProvider.save() 未实现') }
  async remove(id) {}
  async toggleFavorite(id) { return null }
  async markUsed(id) { return null }
  async export() { return JSON.stringify({ version: 1, assets: await this.list() }, null, 2) }
  async import(raw) { throw new Error('AssetProvider.import() 未实现') }
  onChange(callback) { return () => {} }
}
