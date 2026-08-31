import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../ui/plugin.js'

test('DSH 文件路由：@ 文件检索路由已移除，只注册语义增强路由', async () => {
  const registered = []
  apply({ effect: fn => fn(), on: () => () => {}, llm: {},
    sessions: { get() { return undefined } },
    webServer: { register(route) { registered.push(route); return () => {} } },
  })
  assert.deepEqual(registered.map(r => r.path), ['/dsh-promptkit/semantic-enhance', '/dsh-promptkit/semantic-enhance/stream'])
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
  // apply 注册两条路由（非流式/流式），按路径找到被测路由
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
