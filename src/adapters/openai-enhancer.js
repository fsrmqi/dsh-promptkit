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

  async enhance({ draft, extra, kind }) {
    // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
    // 此处示例实现统一的语义改写路径。
    this._abort = new AbortController()
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: `改写以下提示词，使其更清晰、可执行。补充要求：${extra || '无'}\n\n${draft}` }],
        }),
        signal: this._abort.signal,
      })
      const data = await res.json()
      return { prompt: data.choices?.[0]?.message?.content || draft, model: this.model }
    } finally {
      this._abort = null
    }
  }

  cancel() { this._abort?.abort() }
}
