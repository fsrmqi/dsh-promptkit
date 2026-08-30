import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseEnhanceOutput } from '../src/lib/enhance-output.js'
import { streamEnhanceWithCurrentSessionModel } from '../dsh/semantic-enhance.js'
import { createWorkspaceFileIndex } from '../dsh/workspace-files.js'
import { workspaceFilesRoute } from '../dsh/semantic-enhance.js'
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
    llm: { async *stream() { yield { type: 'text-delta', text: '[DIAG] concept_clarity: 未定义\n===PROMPT===\n' } } },
  }), /未返回改写正文/)
})

const file = name => ({ name, isFile: () => true, isDirectory: () => false })
const dir = name => ({ name, isFile: () => false, isDirectory: () => true })

test('知识缺口：过滤明确无问题陈述，保留真正的缺失项与转折', () => {
  for (const text of ['无', '没有隐含前提', '未发现隐含假设。', 'No hidden assumptions.', '[OK] 信息已齐全']) assert.equal(diagnosisFinding(text, 'hidden_premise'), null, text)
  for (const text of ['要求可验证', '要求可测试。', 'Requirements are testable.']) assert.equal(diagnosisFinding(text, 'falsifiability'), null, text)
  for (const text of ['没有验收标准', '无隐含前提，但缺少部署环境', '可验证性不足']) assert.equal(diagnosisFinding(text, 'falsifiability'), text)
  assert.equal(diagnosisFinding('[GAP] 未明确测试条件', 'falsifiability'), '未明确测试条件')
  const prefix = '相同背景'.repeat(40)
  assert.notEqual(diagnosisFingerprint('hidden_premise', prefix + '甲'), diagnosisFingerprint('hidden_premise', prefix + '乙'))
})

test('文件路由：会话工作区隔离，同目录共享缓存，未知会话不扫描启动目录', async () => {
  const reads = []
  const sessionRoots = { a: ['/work/a'], b: ['/work/b'], alias: ['/work/a'] }
  const route = workspaceFilesRoute({ resolveWorkspaceRoots: id => sessionRoots[id] || [], now: () => 0,
    fs: { readdirSync(path) { reads.push(path); return [file(path.endsWith('/a') ? 'alpha.js' : 'beta.js')] } },
  })
  const request = async query => {
    const res = { writeHead(status) { this.status = status }, end(text) { this.body = JSON.parse(text) } }
    await route.handler({ method: 'GET', url: '/dsh-promptkit/workspace-files?' + query }, res)
    return res
  }
  assert.deepEqual((await request('session_id=a')).body.files, ['alpha.js'])
  assert.deepEqual((await request('session_id=b')).body.files, ['beta.js'])
  assert.deepEqual((await request('session_id=alias')).body.files, ['alpha.js'])
  assert.deepEqual(reads, ['/work/a', '/work/b'])
  assert.equal((await request('session_id=unknown&root=/etc')).status, 404)
  assert.equal((await request('root=/etc')).status, 400)
  assert.equal(reads.length, 2)
})

test('文件索引：全候选排序、并发复用、到期刷新和跨根去重', async () => {
  let reads = 0
  let clock = 0
  let extra = []
  const fs = { readdirSync(path) {
    reads += 1
    return path.endsWith('/deep') ? Array.from({ length: 100 }, (_, i) => file(`match-${i}.js`)) : [dir('deep'), file('match.js'), ...extra]
  } }
  const index = createWorkspaceFileIndex({ workspaceRoots: ['/one', '/two'], fs, now: () => clock, ttlMs: 100 })
  const results = await Promise.all([index.search('match', 1), index.search('match', 2)])
  assert.deepEqual(results[0].files, ['match.js'])
  assert.equal(results[1].indexedFiles, 101)
  assert.equal(reads, 4, '并发查询只扫描一次两个根')
  extra = [file('new.js')]
  assert.deepEqual((await index.search('new')).files, [])
  assert.equal(reads, 4)
  clock = 101
  assert.deepEqual((await index.search('new')).files, ['new.js'])
  assert.equal(reads, 8)
  assert.equal((await index.search('', -2)).files.length, 1)
})

test('文件索引：无匹配也受条目/深度/时间预算约束，不跟随软链接', async () => {
  let reads = 0
  const fs = { readdirSync() { reads += 1; return [dir('child'), file('entry.js'), { name: 'link', isDirectory: () => false, isFile: () => false }] } }
  const bounded = createWorkspaceFileIndex({ workspaceRoots: ['/root'], fs, maxEntries: 6, now: () => 0 })
  assert.deepEqual(await bounded.search('不存在'), { files: [], truncated: true, indexedFiles: 2 })
  assert.equal(reads, 2)
  const shallow = await createWorkspaceFileIndex({ workspaceRoots: ['/root'], fs, maxDepth: 0, now: () => 0 }).search('')
  assert.equal(shallow.truncated, true)
  assert.deepEqual(shallow.files, ['entry.js'])
  let clock = 0
  const timed = await createWorkspaceFileIndex({ workspaceRoots: ['/root'], fs, maxScanMs: 5, now: () => clock++ }).search('')
  assert.equal(timed.truncated, true)
  assert.ok(clock < 15, '无匹配的树也不能无限扫描')
})
