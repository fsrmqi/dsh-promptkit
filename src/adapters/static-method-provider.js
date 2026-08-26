import { MethodProvider } from '../core/method-provider.js'
import { loadBuiltinMethods } from '../methods/builtin.js'

// 开源默认 MethodProvider：从 builtin.json 加载完整方法（含 frontmatter 元数据 + prompt 模板）。
// 不依赖任何后端；闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。
// storagePrefix 用于宿主隔离收藏/历史数据（如 MC 用 'memory-center.' 沿用旧版 key）。

let _cachedMethods
async function getMethods() {
  if (_cachedMethods) return _cachedMethods
  _cachedMethods = await loadBuiltinMethods()
  return _cachedMethods
}

export class StaticMethodProvider extends MethodProvider {
  constructor({ storagePrefix = 'promptkit.' } = {}) {
    super()
    this.favoritesKey = `${storagePrefix}prompt-library.favorites.v1`
    this.historyKey = `${storagePrefix}prompt-library.history.v1`
    this.privateMethodsKey = `${storagePrefix}prompt-library.private-methods.v1`
    this.historyEvent = `${storagePrefix}prompt-library.history.changed.v1`
    this.historyListeners = new Set()
  }

  async list() { return [...await getMethods(), ...this._privateMethods()] }

  async search(query) {
    const methods = await this.list()
    if (!query) return methods
    const q = query.toLowerCase()
    return methods.filter(m =>
      (m.id || '').toLowerCase().includes(q) ||
      (m.title || '').toLowerCase().includes(q) ||
      (m.purpose || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      (Array.isArray(m.tags) ? m.tags.join(' ') : String(m.tags || '')).toLowerCase().includes(q) ||
      (Array.isArray(m.triggerKeywords) ? m.triggerKeywords.join(' ') : String(m.triggerKeywords || '')).toLowerCase().includes(q)
    )
  }

  // 与 MC 原 prompt_studio.composePrompt() 一致：模板原样保留（【…】占位符即方法对模型的
  // 填写指令），用户输入以「本次任务输入」结构块追加在模板之后，不做正则替换。
  async compose({ methodId, question, facts, constraints, options }) {
    const methods = await this.list()
    const method = methods.find(m => m.id === methodId) || methods[0]
    const base = method.prompt || ''
    const clean = value => String(value ?? '').trim()
    const sections = [
      '---',
      '# 本次任务输入',
      clean(question) ? `问题：${clean(question)}` : '',
      clean(facts) ? `已知事实：${clean(facts)}` : '',
      clean(constraints) ? `现实约束：${clean(constraints)}` : '',
      clean(options) ? `选项或备选路径：${clean(options)}` : '',
    ].filter(Boolean)
    const hasInput = sections.length > 1
    const full = hasInput
      ? `${base}\n\n${sections.join('\n')}\n\n请严格遵循上方方法；信息不足时按该方法要求提问，不要编造事实。`
      : base
    return { prompt: full, estimated_chars: full.length, method }
  }

  async getTemplate(methodId) {
    const methods = await this.list()
    const m = methods.find(x => x.id === methodId)
    if (!m) return { prompt: '' }
    return { prompt: m.prompt || '' }
  }

  async getFavorites() { return this._readStore(this.favoritesKey, []) }
  async setFavorites(ids) { this._writeStore(this.favoritesKey, Array.isArray(ids) ? ids : []) }

  async getHistory() { return this._readStore(this.historyKey, []) }
  async pushHistory(item) {
    const next = [item, ...this._readStore(this.historyKey, [])].slice(0, 20)
    this._writeStore(this.historyKey, next)
    this._notifyHistory(next)
    return next
  }

  onHistoryChange(callback) {
    this.historyListeners.add(callback)
    const refresh = () => { try { callback(this._readStore(this.historyKey, [])) } catch {} }
    const onCustom = event => { if (event?.detail?.key === this.historyKey) refresh() }
    const onStorage = event => { if (event?.key === this.historyKey) refresh() }
    window.addEventListener?.(this.historyEvent, onCustom)
    window.addEventListener?.('storage', onStorage)
    return () => {
      this.historyListeners.delete(callback)
      window.removeEventListener?.(this.historyEvent, onCustom)
      window.removeEventListener?.('storage', onStorage)
    }
  }

  _notifyHistory(items) {
    this.historyListeners.forEach(callback => { try { callback(items) } catch {} })
    try { window.dispatchEvent?.(new CustomEvent(this.historyEvent, { detail: { key: this.historyKey } })) } catch {}
  }

  /** 导入一张 Obsidian/Markdown 提示词卡片；仅保存到当前浏览器 localStorage。 */
  async importPrivateMarkdown(raw) {
    const method = this._privateMethodFromMarkdown(raw)
    this._writeStore(this.privateMethodsKey, [method, ...this._privateMethods()])
    return method
  }

  async updatePrivateMarkdown(id, raw) {
    const current = this._privateMethods()
    if (!current.some(method => method.id === id)) throw new Error('未找到要编辑的私有方法。')
    const updated = { ...this._privateMethodFromMarkdown(raw), id }
    this._writeStore(this.privateMethodsKey, current.map(method => method.id === id ? updated : method))
    return updated
  }

  async removePrivateMethod(id) {
    this._writeStore(this.privateMethodsKey, this._privateMethods().filter(method => method.id !== id))
  }

  async exportPrivateMethods() {
    return JSON.stringify({ version: 1, methods: this._privateMethods() }, null, 2)
  }

  async importPrivateBackup(raw) {
    let parsed
    try { parsed = JSON.parse(String(raw || '')) } catch { throw new Error('备份文件不是有效 JSON。') }
    const methods = Array.isArray(parsed?.methods) ? parsed.methods : []
    const valid = methods.filter(method => method && typeof method.title === 'string' && typeof method.prompt === 'string')
      .map(method => ({ ...method, id: `private:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, source: 'private' }))
    if (!valid.length) throw new Error('备份中没有可导入的私有方法。')
    this._writeStore(this.privateMethodsKey, [...valid, ...this._privateMethods()])
    return valid
  }

  _privateMethods() {
    return this._readStore(this.privateMethodsKey, []).filter(method => method && typeof method.id === 'string' && method.id.startsWith('private:') && typeof method.prompt === 'string')
  }
  _privateMethodFromMarkdown(raw) {
    const source = String(raw || '').trim()
    if (!source) throw new Error('请粘贴一张 Markdown 提示词卡片。')
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)
    const meta = Object.fromEntries((frontmatter?.[1] || '').split('\n').map(line => {
      const match = line.match(/^([^:]+):\s*(.*)$/)
      return match ? [match[1].trim(), match[2].trim()] : []
    }).filter(pair => pair.length))
    const body = source.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
    const title = meta.title || meta['标题'] || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || `我的方法 ${this._privateMethods().length + 1}`
    const prompt = body.match(/## Prompt\s*\n+```(?:\w+)?\n([\s\S]*?)```/)?.[1]?.trim() || body.replace(/^#\s+[^\n]+\n?/, '').trim()
    if (!prompt) throw new Error('卡片中没有可用的提示词正文。')
    return { id: `private:${Date.now().toString(36)}`, title, category: meta.category || meta['场景'] || '我的方法', purpose: meta.purpose || meta['用途'] || '从我的 Obsidian Prompt 卡片导入', tags: this._parseTags(meta.tags || meta['标签']), triggerKeywords: this._parseTags(meta.keywords || meta['触发词']), prompt, mode: 'structured', outcome: meta.outcome || '按我的私有方法组织输出', source: 'private' }
  }
  _parseTags(value) {
    return String(value || '').replace(/^\[|\]$/g, '').split(/[,，]/).map(item => item.trim()).filter(Boolean)
  }

  _readStore(key, fallback) {
    try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
  }
  _writeStore(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }
}
