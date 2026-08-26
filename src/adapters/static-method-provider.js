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
  }

  async list() { return getMethods() }

  async search(query) {
    const methods = await getMethods()
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
    const methods = await getMethods()
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
    const methods = await getMethods()
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
    return next
  }

  _readStore(key, fallback) {
    try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
  }
  _writeStore(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }
}
