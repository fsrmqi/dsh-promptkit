import { MethodProvider } from '../core/method-provider.js'
import { loadBuiltinMethods } from '../methods/builtin.js'

// 开源默认 MethodProvider：从 builtin.json 加载完整方法（含 frontmatter 元数据 + prompt 正文）。
// 不依赖任何后端；闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。

const FAVORITES_KEY = 'promptkit.prompt-library.favorites.v1'
const HISTORY_KEY = 'promptkit.prompt-library.history.v1'
const HISTORY_LIMIT = 5

const readStore = (key, fallback) => {
  try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
}
const writeStore = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }

let _cachedMethods
async function getMethods() {
  if (_cachedMethods) return _cachedMethods
  _cachedMethods = await loadBuiltinMethods()
  return _cachedMethods
}

export class StaticMethodProvider extends MethodProvider {
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

  async compose({ methodId, question, facts, constraints, options }) {
    const methods = await getMethods()
    const method = methods.find(m => m.id === methodId) || methods[0]
    const prompt = method.prompt || ''
    // 用用户填入的字段替换 prompt 中的占位符（如 【填写你的...】）
    let filled = prompt
    if (question) filled = filled.replace(/【填写你的问题】|【.*问题.*】/g, question)
    if (facts) filled = filled.replace(/【填写相关事实】|【.*事实.*】/g, facts)
    if (constraints) filled = filled.replace(/【填写约束】|【.*约束.*】/g, constraints)
    if (options) filled = filled.replace(/【填写选项】|【.*选项.*】/g, options)
    const full = filled + (question && !filled.includes(question) ? `\n\n问题：${question}` : '')
    return { prompt: full, estimated_chars: full.length, method }
  }

  async getTemplate(methodId) {
    const methods = await getMethods()
    const m = methods.find(x => x.id === methodId)
    if (!m) return { prompt: '' }
    // 返回完整 prompt 作为可编辑模板
    return { prompt: m.prompt || '' }
  }

  async getFavorites() { return readStore(FAVORITES_KEY, []) }

  async setFavorites(ids) { writeStore(FAVORITES_KEY, Array.isArray(ids) ? ids : []) }

  async getHistory() { return readStore(HISTORY_KEY, []) }

  async pushHistory(item) {
    const next = [item, ...readStore(HISTORY_KEY, [])].slice(0, HISTORY_LIMIT)
    writeStore(HISTORY_KEY, next)
    return next
  }
}
