import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  templateVariables, fillTemplateVariables, skillMentions, restoreLostSkillMentions,
  splitOutputSegments, shouldInterceptSend, parseEnhanceOutput, DIAGNOSIS_DIMENSIONS,
} from '../src/lib/utils.js'
import { workspaceFilesRoute, streamEnhanceWithCurrentSessionModel, DIAGNOSIS_LABELS } from '../dsh/semantic-enhance.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ── 模板变量 ──
test('模板变量：提取去重且保留首次出现顺序', () => {
  assert.deepEqual(
    templateVariables('请把 {{task}} 按 {{owner}} 的偏好整理；{{ task }} 与 {{task}} 视为同名。'),
    ['task', 'owner'],
  )
  assert.deepEqual(templateVariables('没有变量的普通文本 {{123}} {{}}'), [])
})

test('模板变量：填值替换，未提供的保留占位符', () => {
  const body = '任务：{{task}}；负责人：{{owner}}'
  assert.equal(fillTemplateVariables(body, { task: '重构登录' }), '任务：重构登录；负责人：{{owner}}')
  assert.equal(fillTemplateVariables(body, { task: '重构登录', owner: ' 张三 ' }), '任务：重构登录；负责人： 张三 ')
})

// ── 技能引用保留 ──
test('技能引用：识别斜杠记号，排除 /pk 与路径样式', () => {
  assert.deepEqual(skillMentions('先用 /tdd 审一遍，再 /code-review'), ['/tdd', '/code-review'])
  assert.deepEqual(skillMentions('调用 /pk 搜索灵感'), [])
  assert.deepEqual(skillMentions('看 src/app.js 和 /usr/local/bin'), [])
  assert.deepEqual(skillMentions('重复 /a 与 /a 只留一份'), ['/a'])
})

test('技能引用：改写丢失时原样补回，未丢失返回 null', () => {
  const before = '用 /tdd 和 /code-review 处理登录页'
  const after = '1. 用 /tdd 处理登录页'
  const repaired = restoreLostSkillMentions(before, after)
  assert.ok(repaired.startsWith(after), '修复稿以改写结果开头')
  assert.match(repaired, /## 技能引用/)
  assert.match(repaired, /\/code-review/)
  assert.equal(restoreLostSkillMentions(before, '保留两个 /tdd /code-review 记号的稿子'), null)
})

// ── 输出分段 ──
test('输出分段：按空行切段，丢掉空白段', () => {
  assert.deepEqual(splitOutputSegments('第一段\n\n第二段\n\n\n\n第三段'), ['第一段', '第二段', '第三段'])
  assert.deepEqual(splitOutputSegments(''), [])
  assert.deepEqual(splitOutputSegments('仅一段'), ['仅一段'])
})

// ── 发送拦截判定（fail-safe 语义）──
test('发送拦截：只拦普通 Enter；Shift/⌘/IME/空草稿一律放行', () => {
  const enabled = { enabled: true, draft: '一段草稿' }
  assert.equal(shouldInterceptSend({ event: { key: 'Enter' }, ...enabled }), true)
  assert.equal(shouldInterceptSend({ event: { key: 'Enter', shiftKey: true }, ...enabled }), false, 'Shift+Enter 换行放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter', metaKey: true }, ...enabled }), false, '⌘Enter 发送放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter', ctrlKey: true }, ...enabled }), false, 'CtrlEnter 放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter', isComposing: true }, ...enabled }), false, 'IME 组合中放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter', keyCode: 229 }, ...enabled }), false, 'IME keyCode 229 放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter' }, enabled: true, draft: '   ' }), false, '空草稿放行')
  assert.equal(shouldInterceptSend({ event: { key: 'Enter' }, enabled: false, draft: '草稿' }), false, '开关关闭放行')
})

// ── 语义增强输出解析（诊断 + 正文）──
test('输出解析：拆出五维诊断与提示词正文；缺诊断时 diagnosis 为 null', () => {
  const raw = ['[DIAG] concept_clarity: 「优化」未定义', '[DIAG] hidden_premise: 默认了日活十万', '[DIAG] falsifiability: 「体验更好」不可判定', '[DIAG] actionability: 产出一份改造方案', '[DIAG] context_fit: 与上下文无冲突', '===PROMPT===', '目标：…'].join('\n')
  const parsed = parseEnhanceOutput(raw)
  assert.equal(parsed.prompt, '目标：…')
  assert.equal(parsed.diagnosis.concept_clarity, '「优化」未定义')
  assert.deepEqual(Object.keys(parsed.diagnosis), [...DIAGNOSIS_DIMENSIONS], '诊断键与维度定义同序')
  assert.equal(parseEnhanceOutput('没有诊断块的旧输出').diagnosis, null, '旧格式兼容')
  assert.equal(parseEnhanceOutput('没有诊断块的旧输出').prompt, '没有诊断块的旧输出')
})

// ── 流式调用：onDelta 逐段回调 + 诊断合并 ──
test('流式增强：onDelta 收到全部增量，最终结果含诊断', async () => {
  let deltas = ''
  const llm = {
    async *stream() {
      yield { type: 'text-delta', text: '[DIAG] concept_clarity: 好\n' }
      yield { type: 'text-delta', text: '[DIAG] hidden_premise: 无\n[DIAG] falsifiability: 可判定\n[DIAG] actionability: 有产出\n[DIAG] context_fit: 契合\n===PROMPT===\n改写稿' }
    },
  }
  const result = await streamEnhanceWithCurrentSessionModel({
    llm,
    route: { provider: 'p', model: 'm' },
    sessionId: 's',
    draft: '草稿内容',
    onDelta: text => { deltas += text },
  })
  assert.match(deltas, /DIAG/)
  assert.match(deltas, /改写稿/)
  assert.equal(result.prompt, '改写稿')
  assert.equal(result.diagnosis.concept_clarity, '好')
  assert.equal(result.model, 'm')
})

// ── 方法感知诊断：诊断指令按匹配方法注入检查侧重 ──
test('方法感知诊断：苏格拉底式提问时指令带方法侧重，未匹配时为通用侧重', async () => {
  let capturedSystem
  const llm = { async *stream() { yield { type: 'text-delta', text: '正文' } } }
  const run = method => streamEnhanceWithCurrentSessionModel({
    llm, route: { provider: 'p', model: 'm' }, sessionId: 's', draft: '草稿内容', diagnose: true, method,
  }).then(() => capturedSystem)
  // 通过 llm.stream 的入参捕获 system
  const spy = {
    async *stream(value) { capturedSystem = value.system; yield { type: 'text-delta', text: '正文' } },
  }
  const withMethod = await streamEnhanceWithCurrentSessionModel({
    llm: spy, route: { provider: 'p', model: 'm' }, sessionId: 's', draft: '草稿内容', diagnose: true,
    method: { title: '苏格拉底式提问', template: '模板' },
  })
  assert.match(capturedSystem, /方法侧重：/, '诊断指令应包含方法侧重行')
  assert.match(capturedSystem, /未加审视/, '苏格拉底式提问的侧重内容应注入')
  capturedSystem = undefined
  const withoutMethod = await streamEnhanceWithCurrentSessionModel({
    llm: spy, route: { provider: 'p', model: 'm' }, sessionId: 's', draft: '草稿内容', diagnose: true,
    method: { title: '某个没有量表的方法', template: '模板' },
  })
  assert.doesNotMatch(capturedSystem, /方法侧重：/, '未命中量表的方法回退通用侧重')
  assert.match(capturedSystem, /concept_clarity/, '通用侧重仍保留五维诊断本体')
})

// ── workspace-files：忽略目录、关键词过滤、短路径优先 ──
test('workspace-files：忽略 node_modules/.git，短路径优先并截断 limit', async () => {
  const memFs = {
    readdirSync: dir => {
      if (dir === '/w') return [
        { name: 'node_modules', isDirectory: () => true, isFile: () => false },
        { name: '.git', isDirectory: () => true, isFile: () => false },
        { name: 'src', isDirectory: () => true, isFile: () => false },
        { name: 'bb.md', isDirectory: () => false, isFile: () => true },
        { name: 'a.md', isDirectory: () => false, isFile: () => true },
      ]
      if (dir === '/w/src') return [
        { name: 'deep', isDirectory: () => true, isFile: () => false },
        { name: 'index.js', isDirectory: () => false, isFile: () => true },
      ]
      return [{ name: 'x.js', isDirectory: () => false, isFile: () => true }]
    },
    statSync: () => ({}),
  }
  const route = workspaceFilesRoute({ workspaceRoots: ['/w'], fs: memFs })
  const response = { status: 0, body: '', writeHead(s) { this.status = s }, end(v) { this.body = v } }
  await route.handler({ method: 'GET', url: '/dsh-promptkit/workspace-files?q=&limit=3' }, response)
  const { files } = JSON.parse(response.body)
  assert.deepEqual(files, ['a.md', 'bb.md', 'src/index.js'], '忽略隐藏/依赖目录且短路径优先')
  // 关键词过滤
  await route.handler({ method: 'GET', url: '/dsh-promptkit/workspace-files?q=index&limit=20' }, response)
  assert.deepEqual(JSON.parse(response.body).files, ['src/index.js'])
  // 非 GET 拒绝
  await route.handler({ method: 'POST', url: '/dsh-promptkit/workspace-files' }, response)
  assert.equal(response.status, 405)
})

// ── 构建产物契约：新工具函数必须暴露到 PromptKit.utils ──
test('Embed 产物：模板变量/skill 修复/分段/拦截判定均已暴露', () => {
  const embedSrc = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  const utilsBlock = embedSrc.slice(embedSrc.indexOf('utils: {'), embedSrc.indexOf('builtinMethods'))
  assert.ok(utilsBlock.length > 0 && utilsBlock.length < 2000, '应能定位 utils 导出块')
  for (const name of ['templateVariables', 'fillTemplateVariables', 'restoreLostSkillMentions', 'splitOutputSegments', 'shouldInterceptSend', 'skillMentions']) {
    assert.match(utilsBlock, new RegExp(`\\b${name}\\b`), `utils 导出应包含 ${name}`)
  }
})
