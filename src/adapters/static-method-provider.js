import { MethodProvider } from '../core/method-provider.js'
import { BUILTIN_METHODS } from '../methods/builtin.js'

// 开源默认 MethodProvider：内置静态方法 + 本地 compose + localStorage 收藏/历史。
// 不依赖任何后端；闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。
const FAVORITES_KEY = 'promptkit.prompt-library.favorites.v1'
const HISTORY_KEY = 'promptkit.prompt-library.history.v1'
const HISTORY_LIMIT = 5

const readStore = (key, fallback) => {
  try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
}
const writeStore = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export class StaticMethodProvider extends MethodProvider {
  async list() { return BUILTIN_METHODS }

  async compose({ methodId, question, facts, constraints, options }) {
    const method = BUILTIN_METHODS.find(m => m.id === methodId) || BUILTIN_METHODS[0]
    const parts = [
      `# ${method.title}`,
      method.purpose && `目标：${method.purpose}`,
      method.outcome && `期望产出：${method.outcome}`,
      question && `问题：${question}`,
      facts && `事实：${facts}`,
      constraints && `约束：${constraints}`,
      options && `备选：${options}`,
    ].filter(Boolean)
    const prompt = parts.join('\n\n')
    return { prompt, estimated_chars: prompt.length, method }
  }

  async getTemplate(methodId) {
    const m = BUILTIN_METHODS.find(x => x.id === methodId)
    if (!m) return { prompt: '' }
    const lines = [`# ${m.title}`]
    if (m.purpose) lines.push(`目标：${m.purpose}`)
    lines.push('', '问题：', '（在此写入你的问题）')
    if (m.mode === 'guided') lines.push('', '请先就问题的模糊之处向我提问，每次只问一个最关键的问题。')
    return { prompt: lines.join('\n') }
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
