import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../ui/plugin.js'

test('DSH 文件路由：从宿主会话 header 解析目录，不读取浏览器指定路径', async () => {
  const registered = []
  const lookups = []
  apply({ effect: fn => fn(), on: () => () => {}, llm: {},
    sessions: { get(id) { lookups.push(id); return undefined } },
    webServer: { register(route) { registered.push(route); return () => {} } },
  })
  const route = registered.find(value => value.path.endsWith('workspace-files'))
  const res = { writeHead(status) { this.status = status }, end(text) { this.body = JSON.parse(text) } }
  await route.handler({ method: 'GET', url: '/dsh-promptkit/workspace-files?session_id=missing&root=/etc' }, res)
  assert.deepEqual(lookups, ['missing'])
  assert.equal(res.status, 404)
  assert.deepEqual(res.body.files, [])
})

test('DSH node half：会话模型路由可驱动语义增强桥接', async () => {
  const listeners = new Map()
  const registered = []
  let route
  const ctx = {
    effect: callback => callback(),
    on: (name, callback) => { listeners.set(name, callback); return () => {} },
    webServer: { register: value => { registered.push(value); return () => {} } },
    llm: { async *stream() { yield { type: 'text-delta', text: '改写结果' }; yield { type: 'finish', reason: { kind: 'stop' } } } },
  }
  apply(ctx)
  listeners.get('agent/created')({ agent: { session: { id: 's1' }, options: { provider: 'test', model: 'test-model' } } })
  // apply 注册三条路由（非流式/流式/workspace-files），按路径找到被测路由
  route = registered.find(r => r.path === '/dsh-promptkit/semantic-enhance')
  assert.ok(route, '应注册非流式语义增强路由')
  const response = { status: 0, body: '', writeHead(status) { this.status = status }, end(value) { this.body = value } }
  const request = {
    method: 'POST', url: '/dsh-promptkit/semantic-enhance?session_id=s1', on() {}, off() {},
    async *[Symbol.asyncIterator]() { yield JSON.stringify({ draft: '请改写这段草稿', lang: 'zh' }) },
  }
  await route.handler(request, response)
  assert.equal(response.status, 200)
  assert.equal(JSON.parse(response.body).prompt, '改写结果')
})

test('DSH node half：SSE 流式路由逐段推送并给出最终结果', async () => {
  const listeners = new Map()
  const registered = []
  const ctx = {
    effect: callback => callback(),
    on: (name, callback) => { listeners.set(name, callback); return () => {} },
    webServer: { register: value => { registered.push(value); return () => {} } },
    llm: { async *stream() { yield { type: 'text-delta', text: '[DIAG] concept_clarity: 足够\n[DIAG] hidden_premise: 缺验收\n[DIAG] falsifiability: 无\n[DIAG] actionability: 可行\n[DIAG] context_fit: 契合\n===PROMPT===\n改写后的提示词' }; yield { type: 'finish', reason: { kind: 'stop' } } } },
  }
  apply(ctx)
  listeners.get('agent/created')({ agent: { session: { id: 's1' }, options: { provider: 'test', model: 'test-model' } } })
  const route = registered.find(r => r.path === '/dsh-promptkit/semantic-enhance/stream')
  assert.ok(route, '应注册流式语义增强路由')
  const chunks = []
  const headers = {}
  const response = {
    writeHead(status, h) { this.status = status; Object.assign(headers, h) },
    write(value) { chunks.push(value) },
    end() { this.ended = true },
  }
  const request = {
    method: 'POST', url: '/dsh-promptkit/semantic-enhance/stream?session_id=s1', on() {}, off() {},
    async *[Symbol.asyncIterator]() { yield JSON.stringify({ draft: '请改写这段草稿', lang: 'zh' }) },
  }
  await route.handler(request, response)
  assert.equal(response.status, 200)
  assert.match(headers['content-type'], /text\/event-stream/)
  const text = chunks.join('')
  assert.match(text, /event: open/)
  assert.match(text, /event: delta/)
  const doneFrame = text.split('\n\n').find(frame => frame.startsWith('event: done'))
  assert.ok(doneFrame, '应有 done 结束帧')
  const payload = JSON.parse(doneFrame.split('\ndata: ')[1])
  assert.equal(payload.prompt, '改写后的提示词')
  assert.equal(payload.diagnosis.concept_clarity, '足够')
  assert.equal(payload.model, 'test-model')
})

test('DSH node half：workspace-files 路由按关键词过滤并忽略忽略目录', async () => {
  const registered = []
  const ctx = {
    effect: callback => callback(),
    on: () => () => {},
    webServer: { register: value => { registered.push(value); return () => {} } },
    llm: {},
  }
  apply(ctx)
  const route = registered.find(r => r.path === '/dsh-promptkit/workspace-files')
  assert.ok(route, '应注册文件检索路由')
  // 用内存 fs 验证检索逻辑：直接构造带注入的路由
  const { workspaceFilesRoute } = await import('../dsh/semantic-enhance.js')
  const memFs = {
    readdirSync: (dir) => dir.endsWith('root')
      ? [
          { name: 'src', isDirectory: () => true, isFile: () => false },
          { name: 'node_modules', isDirectory: () => true, isFile: () => false },
          { name: 'README.md', isDirectory: () => false, isFile: () => true },
        ]
      : [{ name: 'app.js', isDirectory: () => false, isFile: () => true }],
    statSync: () => ({}),
  }
  const filesRoute = workspaceFilesRoute({ workspaceRoots: ['/root'], fs: memFs })
  // 直接调内部 handler 模拟 GET /?q=app
  const response = { status: 0, body: '', writeHead(status) { this.status = status }, end(value) { this.body = value } }
  const request = { method: 'GET', url: '/dsh-promptkit/workspace-files?q=app&limit=20' }
  await filesRoute.handler(request, response)
  assert.equal(response.status, 200)
  assert.deepEqual(JSON.parse(response.body).files, ['src/app.js'])
})
