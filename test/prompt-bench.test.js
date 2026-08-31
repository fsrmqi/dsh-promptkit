// mini-bench：提示词核心逻辑的评测夹具（2026-08-26 起）
//
// 用途：把"方法自动归类"这套提示词核心逻辑固化为可回归的测试，
//       每次改动方法卡触发词 / 强触发词 / classify 计分规则后跑一遍，
//       防止"改一处坏一片"。
// 5 条典型草稿覆盖：技术开发 / 代码评审 / 接口文档 / 数据分析 / 论文分析 等已注册场景卡。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { planPromptEnhancement, recommendMethods } from '../src/lib/utils.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const methods = JSON.parse(readFileSync(resolve(ROOT, 'methods/builtin.json'), 'utf8'))

// 每条：{ name, draft, expect, note }
const CASES = [
  { name: '技术方案设计', draft: '帮我设计一个技术方案，把登录拆成独立的认证服务，涉及接口设计和落库', expect: '技术方案设计', note: '技术方案+接口设计为强信号' },
  { name: '接口方案评审', draft: '请评审这个接口方案，列出兼容性风险并给出最小验证步骤', expect: '技术方案设计', note: '接口方案为强信号，不应被通用决策词抢占' },
  { name: '代码评审', draft: '帮我做一次代码评审，重点看有没有安全问题', expect: '代码评审', note: '代码评审为强信号（纯中文，避免触发中英混合分支）' },
  { name: '英文代码评审', draft: 'Please do a code review for this authentication change', expect: '代码评审', note: '英文触发词也应参与方法匹配' },
  { name: '接口文档生成', draft: '帮我写 API 文档，列出参数说明和错误码', expect: '接口文档生成', note: 'API 文档为强信号' },
  { name: '故障排查', draft: '接口一直报错，帮我排查一下原因', expect: '苏格拉底式提问', note: '报错/排查为强信号' },
  { name: '数据分析', draft: '数据分析一下这个转化率表的趋势', expect: '数据分析', note: '数据分析为强信号' },
  { name: '方案选型', draft: '两个方案哪个好，帮我对比一下选哪个', expect: '双向钢人论证', note: '哪个好/对比为强信号' },
  { name: '论文拆解', draft: '把这篇论文的核心方法拆解一下', expect: '论文深度拆解', note: '论文为强信号' },
  { name: '事实核查', draft: '帮我核查一下这个数据来源靠不靠谱', expect: '事实核查', note: '核查为强信号' },
  { name: '跨领域借解', draft: '想从其他领域借个思路，跨域迁移一下', expect: '跨领域借解', note: '跨域迁移为强信号' },
  { name: '专家会诊', draft: '来一次专家会诊，从不同视角看看这个问题', expect: '专家会诊', note: '会诊为强信号' },
  { name: '横纵分析', draft: '对这个小行业做一次横向纵向的研究盘点', expect: '横纵分析法', note: '横向+纵向双弱信号可命中' },
  { name: '反向拆解', draft: '逆向拆解一下这个竞品为什么做得好', expect: '反向拆解', note: '逆向拆解为强信号' },
  { name: '双层解释', draft: '把量子计算科普给没有基础的人', expect: '双层解释法', note: '科普为强信号' },
  { name: '人生设计', draft: '我最近很迷茫，帮我做一次人生设计的五年规划', expect: '人生设计术', note: '人生设计为强信号' },
  { name: '需求理解', draft: '这个需求我没太听懂，帮我做需求理解，把隐含假设挖出来', expect: '需求理解', note: '需求理解为强信号' },
  { name: '需求分析', draft: '把这条需求做一次需求分析，输出功能清单和优先级', expect: '需求分析', note: '需求分析为强信号' },
  { name: '需求拆解', draft: '把这个需求拆解成用户故事和验收标准', expect: '需求拆解', note: '用户故事为强信号' },
  { name: '需求评审', draft: '帮我做一次需求评审，重点看可测试性和歧义', expect: '需求评审', note: '需求评审为强信号' },
  { name: '需求评审后做方案', draft: '先做需求评审，重点检查可测试性和歧义；确认后再给技术方案', expect: '需求评审', note: '前置评审意图优先于后续方案' },
  { name: '论文数据分析', draft: '分析这篇论文里的实验数据和统计结果，判断证据够不够', expect: '论文深度拆解', note: '论文拆解优先于通用数据分析' },
]

test(`mini-bench：${CASES.length} 条典型草稿自动归类命中预期方法`, () => {
  for (const item of CASES) {
    const plan = planPromptEnhancement(item.draft, '', methods)
    assert.equal(plan.method, item.expect, `「${item.name}」应归为「${item.expect}」${item.note ? `（${item.note}）` : ''}`)
    assert.ok(plan.prompt && plan.prompt.length > 0, `「${item.name}」应产出可执行模板`)
  }
})

test('mini-bench：推荐方法为命中方法的 1~2 个候选', () => {
  const plan = planPromptEnhancement('帮我设计一个技术方案，涉及接口设计', '', methods)
  const recommended = recommendMethods(methods, '帮我设计一个技术方案，涉及接口设计')
  assert.equal(plan.method, '技术方案设计')
  assert.ok(recommended.length >= 1 && recommended.length <= 2)
  assert.equal(recommended[0].id, '技术方案设计', '推荐列表首位应为自动匹配的主方法')
})

test('mini-bench：无强信号时不强行套用方法，回退通用模板', () => {
  const plan = planPromptEnhancement('帮我把这段话整理一下', '', methods)
  assert.equal(plan.method, '', '无强信号不应指派方法')
  assert.ok(plan.prompt.includes('请直接处理这项任务'), '回退为通用轻量模板')
  assert.deepEqual(recommendMethods(methods, '我那个查询接口，能知道发送成功不'), [], '短接口疑问不应默认套进苏格拉底式问诊')
})

test('mini-bench：输入过短直接返回原文，不强增强', () => {
  const plan = planPromptEnhancement('好的', '', methods)
  assert.equal(plan.tooShort, true)
  assert.equal(plan.prompt, '好的')
})
