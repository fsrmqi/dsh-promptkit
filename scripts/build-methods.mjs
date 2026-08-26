#!/usr/bin/env node
/**
 * 从 methods/<场景>/*.md 重新生成 methods/builtin.json。
 *
 * Markdown 约定：
 *   - frontmatter（--- 包裹）：场景 / 用途 / 标签: [a, b] / 触发词: 逗号分隔（可选）
 *   - 正文：首行 H1（与文件名一致）+ 叙述性说明 + 「## Prompt」代码块（真正的模板）
 *     prompt 字段优先提取「## Prompt」代码块（对齐 MC 原 prompt_studio.template()），
 *     无代码块时回退为完整正文（剥掉 frontmatter 与 H1）。
 *
 * mode/outcome 源文件 frontmatter 中不存在，由下方 OVERRIDES 显式声明：
 *   - guided：方法会先追问、依赖多轮对话（UI 显示「会逐步追问」）
 *   - structured（默认）：一次性生成结构化产出
 *
 * 用法：node scripts/build-methods.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const METHODS_DIR = join(ROOT, 'methods')

// 与源 frontmatter 无关、需要人工维护的元数据
const OVERRIDES = {
  双向钢人论证: { mode: 'guided', outcome: '先问一个最可能改变结论的问题，回答后给出明确判断与下一步行动' },
  用最小实验替代空想: { mode: 'structured', outcome: '一个最小可行实验方案与验证标准' },
  事实核查: { mode: 'structured', outcome: '逐条核查结论：属实 / 存疑 / 不实，并给出依据' },
  双层解释法: { mode: 'structured', outcome: '小白版 + 专业版双层解释' },
  反向拆解: { mode: 'structured', outcome: '成品为何有效的底层机制拆解清单' },
  横纵分析法: { mode: 'structured', outcome: '陌生领域的纵横框架与研究地图' },
  专家会诊: { mode: 'structured', outcome: '互补专家团的会诊意见与交锋结论' },
  第一性原理: { mode: 'structured', outcome: '回归问题本质的重新推导与重构方案' },
  跨领域借解: { mode: 'structured', outcome: '可迁移到当前问题的他领域解法清单' },
  人生设计术: { mode: 'structured', outcome: '《个人人生设计蓝图》' },
  挖掘隐藏天赋: { mode: 'guided', outcome: '《个人天赋使用说明书》' },
  苏格拉底式提问: { mode: 'guided', outcome: '通过多轮追问澄清出真正值得回答的问题' },
  技术方案设计: { mode: 'structured', outcome: '可评审的技术方案（目标/边界/模块/关键设计/风险/步骤）' },
  代码评审: { mode: 'structured', outcome: '按严重程度分档的代码评审报告' },
  接口文档生成: { mode: 'structured', outcome: '含请求/响应/示例/边界的标准接口文档' },
  论文深度拆解: { mode: 'structured', outcome: '论文拆解档案（贡献/方法/证据强度/局限/可复现性）' },
  数据分析: { mode: 'structured', outcome: '四段式分析报告（体检/探索/结论/行动）' },
}
const DEFAULT_META = { mode: 'structured', outcome: '结构化输出' }

const parseList = (value) => {
  const inner = value.trim().replace(/^\[|\]$/g, '')
  return inner ? inner.split(/[,，]\s*/).map(s => s.trim()).filter(Boolean) : []
}

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) throw new Error('缺少 frontmatter')
  const fm = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([\u4e00-\u9fff\w]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2]
  }
  return fm
}

// 与 MC 原 prompt_studio.template() 一致：提取「## Prompt」下的代码块作为干净模板，
// 剥离文章引言等叙述性内容；无代码块时回退为完整正文。
const extractTemplate = (raw) =>
  raw.match(/## Prompt\s*\n+```(?:\w+)?\n([\s\S]*?)```/)?.[1]?.trim() ?? ''

const categories = readdirSync(METHODS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort()

const methods = []
for (const category of categories) {
  const files = readdirSync(join(METHODS_DIR, category))
    .filter(f => f.endsWith('.md'))
    .sort()
  for (const file of files) {
    const title = file.replace(/\.md$/, '')
    const raw = readFileSync(join(METHODS_DIR, category, file), 'utf8')
    const fm = parseFrontmatter(raw)
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '').replace(/^\s*#\s[^\n]*\n/, '').trim()
    const prompt = extractTemplate(raw) || body
    if (!fm['场景'] || !fm['用途']) throw new Error(`${category}/${file} 缺少 场景/用途 字段`)
    methods.push({
      id: title,
      title,
      category: fm['场景'],
      purpose: fm['用途'].trim(),
      tags: parseList(fm['标签'] || ''),
      triggerKeywords: parseList(fm['触发词'] || ''),
      prompt,
      ...DEFAULT_META,
      ...(OVERRIDES[title] || {}),
    })
  }
}

writeFileSync(join(METHODS_DIR, 'builtin.json'), JSON.stringify(methods, null, 2) + '\n')
console.log(`[methods] builtin.json 生成完毕（${methods.length} 个方法）`)
