import { Enhancer } from '../core/enhancer.js'

// 示例 Enhancer：接任意 OpenAI 兼容端点（开源版用）。
// 闭源版（DSH 插件）可继承 Enhancer 并桥接到当前会话模型的语义增强接口。
export class OpenAIEnhancer extends Enhancer {
  constructor({ endpoint, apiKey, model = 'gpt-4o-mini' } = {}) {
    super()
    this.endpoint = endpoint
    this.apiKey = apiKey
    this.model = model
    this._abort = null
  }

  get loading() { return this._abort !== null }

  async enhance({ draft, extra, kind, method }) {
    // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
    // 此处示例实现统一的语义改写路径。
    this._abort = new AbortController()
    try {
      const instruction = method?.template
        ? `按「${method.title}」的方法结构改写以下提示词。方法模板：\n\n${method.template}`
        : '改写以下提示词，使其更清晰、可执行。'
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: `${instruction}\n\n补充要求：${extra || '无'}\n\n${draft}` }],
        }),
        signal: this._abort.signal,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 504) throw Object.assign(new Error('模型响应超时，请稍后重试。'), { timeout: true })
        throw new Error(data?.error?.message || `增强请求失败（HTTP ${res.status}）`)
      }
      return { prompt: data.choices?.[0]?.message?.content || draft, model: this.model }
    } finally {
      this._abort = null
    }
  }

  cancel() { this._abort?.abort() }
}
