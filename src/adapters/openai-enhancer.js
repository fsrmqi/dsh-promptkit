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

  async enhance({ draft, extra, kind, method, strength, hasContext }) {
    // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
    // 此处示例实现统一的语义改写路径。
    this._abort = new AbortController()
    try {
      const strengthRule = strength === 'low'
        ? '只做措辞与结构润色，篇幅接近原文，不展开内容。'
        : strength === 'high'
          ? '充分展开背景、步骤与验收标准，篇幅约为草稿的 3 倍。'
          : '标准结构化整理，输出紧凑（约 1.5 倍原文）。'
      const contextRule = hasContext
        ? '会话上下文已提供：先提炼真实意图，再顺着草稿原有表达润色，不要重复追问上下文已给出的信息。'
        : '只依据草稿里已有的信息改写，不得虚构事实。缺失信息优先写成执行者的自查指令（查什么、用什么手段、查到怎么用）；只能由用户提供的决策类信息汇总成末尾一次性索取清单；不影响主干执行的至多标 1~2 条【待确认：…】，禁止把执行者可自行查到的信息反问用户。'
      const instruction = method?.template
        ? `按「${method.title}」的方法结构改写以下提示词。方法模板：\n\n${method.template}\n\n${strengthRule}${contextRule}`
        : `改写以下提示词，使其更清晰、可执行。${strengthRule}${contextRule}`
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
