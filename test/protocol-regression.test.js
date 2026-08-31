import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseEnhanceOutput } from '../src/lib/enhance-output.js'
import { streamEnhanceWithCurrentSessionModel } from '../dsh/semantic-enhance.js'
import { diagnosisFinding, diagnosisFingerprint } from '../src/lib/diagnosis-findings.js'

test('诊断：部分字段、中英文标签与围栏可恢复，缺项不编造', () => {
  const parsed = parseEnhanceOutput('```text\r\n[DIAG] 概念清晰：需要定义优化目标\r\n[diag] HIDDEN_PREMISE: Assumed availability\r\n=== PROMPT ===\r\n请确认目标和可用资源。\r\n```')
  assert.equal(parsed.prompt, '请确认目标和可用资源。')
  assert.deepEqual(parsed.diagnosis, { concept_clarity: '需要定义优化目标', hidden_premise: 'Assumed availability' })
  assert.equal(parsed.diagnosisMeta.status, 'partial')
  assert.deepEqual(parsed.diagnosisMeta.missingDimensions, ['falsifiability', 'actionability', 'context_fit'])
})

test('诊断：缺分隔符时隔离诊断；未知字段可观测且不混入草稿', () => {
  const result = parseEnhanceOutput('[DIAG] hidden_premise: 未知部署环境\n[DIAG] extra_field: 模型新增维度\n\n请确认部署环境。')
  assert.equal(result.prompt, '请确认部署环境。')
  assert.deepEqual(result.diagnosisMeta.warnings, ['unknown_dimension', 'missing_separator'])
  assert.equal(parseEnhanceOutput('请解释字符串 ===PROMPT=== 的作用。').prompt, '请解释字符串 ===PROMPT=== 的作用。')
  assert.equal(parseEnhanceOutput('```js\nconst x = 1\n```').prompt, '```js\nconst x = 1\n```')
})

test('诊断：分块传输中的标记不闪现为正文', () => {
  const source = '[DIAG] hidden_premise: 尚未确认\n===PROMPT===\n实际正文'
  for (let end = 1; end <= source.indexOf('实际正文'); end += 1) {
    assert.equal(parseEnhanceOutput(source.slice(0, end), { streaming: true }).prompt, '', `分块边界 ${end}`)
  }
  assert.equal(parseEnhanceOutput(source, { streaming: true }).prompt, '实际正文')
})

test('诊断：只有诊断没有正文时拒绝返回可应用结果', async () => {
  await assert.rejects(streamEnhanceWithCurrentSessionModel({
    route: { provider: 'test', model: 'test' }, draft: '优化提示词',
    llm: { async *stream() { yield { type: 'text-delta', text: '[DIAG] concept_clarity: 未定义\n===PROMPT===\n' }; yield { type: 'finish', reason: { kind: 'stop' } } } },
  }), /未返回改写正文/)
})

test('知识缺口：过滤明确无问题陈述，保留真正的缺失项与转折', () => {
  for (const text of ['无', '没有隐含前提', '未发现隐含假设。', 'No hidden assumptions.', '[OK] 信息已齐全']) assert.equal(diagnosisFinding(text, 'hidden_premise'), null, text)
  for (const text of ['要求可验证', '要求可测试。', 'Requirements are testable.']) assert.equal(diagnosisFinding(text, 'falsifiability'), null, text)
  for (const text of ['没有验收标准', '无隐含前提，但缺少部署环境', '可验证性不足']) assert.equal(diagnosisFinding(text, 'falsifiability'), text)
  assert.equal(diagnosisFinding('[GAP] 未明确测试条件', 'falsifiability'), '未明确测试条件')
  const prefix = '相同背景'.repeat(40)
  assert.notEqual(diagnosisFingerprint('hidden_premise', prefix + '甲'), diagnosisFingerprint('hidden_premise', prefix + '乙'))
})
