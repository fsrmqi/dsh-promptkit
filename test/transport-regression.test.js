import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { DshSessionEnhancer } from '../src/adapters/dsh-session-enhancer.js'
import { apply } from '../ui/plugin.js'

test('真实 HTTP：请求体读完不误取消，JSON/SSE 贯通，客户端取消传播到模型', { timeout: 5000 }, async t => {
  const listeners = new Map()
  const registered = []
  let cancellationStarted
  let cancellationObserved
  const started = new Promise(resolve => { cancellationStarted = resolve })
  const aborted = new Promise(resolve => { cancellationObserved = resolve })
  apply({
    effect: callback => callback(),
    on: (event, callback) => { listeners.set(event, callback) },
    webServer: { register: route => { registered.push(route); return () => {} } },
    llm: { async *stream({ signal, messages }) {
      assert.equal(signal.aborted, false, 'Node POST body 完成不应被当成连接断开')
      if (messages[0].content[0].text.includes('取消测试')) {
        cancellationStarted()
        await new Promise((resolve, reject) => signal.addEventListener('abort', () => {
          cancellationObserved()
          reject(Object.assign(new Error('取消'), { name: 'AbortError' }))
        }, { once: true }))
      }
      yield { type: 'text-delta', text: '[DIAG] hidden_premise: 缺少运行环境\n' }
      yield { type: 'text-delta', text: '===PROMPT===\n请补充运行环境，再评审接口方案。' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    } },
  })
  listeners.get('agent/created')({ agent: { session: { id: 'test-session' }, options: { provider: 'fixture', model: 'fixture-model' } } })
  const server = createServer((req, res) => {
    const route = registered.find(value => req.url.split('?')[0] === value.path)
    if (route) void route.handler(req, res)
    else { res.writeHead(404); res.end() }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const origin = `http://127.0.0.1:${server.address().port}`
  const nativeFetch = globalThis.fetch
  t.mock.method(globalThis, 'fetch', (url, options) => nativeFetch(new URL(url, origin), options))
  const enhancer = new DshSessionEnhancer(() => 'test-session')
  const json = await enhancer.enhance({ draft: '请评审接口方案' })
  assert.equal(json.prompt, '请补充运行环境，再评审接口方案。')
  assert.equal(json.diagnosisMeta.status, 'partial')
  let delta = ''
  const stream = await enhancer.enhanceStream({ draft: '请评审接口方案', onDelta: text => { delta += text } })
  assert.equal(stream.prompt, json.prompt)
  assert.match(delta, /缺少运行环境/)
  const pending = enhancer.enhanceStream({ draft: '取消测试' })
  const rejected = assert.rejects(pending, { name: 'AbortError' })
  await started
  enhancer.cancel()
  await Promise.all([rejected, aborted])
  assert.equal(enhancer.loading, false)
})

test('SSE：CRLF、UTF-8 分块和末尾无空行可解析；错误帧保留超时标志', async t => {
  const encoder = new TextEncoder()
  const data = encoder.encode('event: delta\r\ndata: {"text":"中文"}\r\n\r\nevent: done\r\ndata: {"prompt":"中文结果"}')
  t.mock.method(globalThis, 'fetch', async () => new Response(new ReadableStream({ start(controller) {
    for (const byte of data) controller.enqueue(new Uint8Array([byte]))
    controller.close()
  } })))
  const enhancer = new DshSessionEnhancer(() => 's')
  let text = ''
  assert.equal((await enhancer.enhanceStream({ draft: '测试', onDelta: delta => { text += delta } })).prompt, '中文结果')
  assert.equal(text, '中文')
  globalThis.fetch.mock.mockImplementation(async () => new Response('event: error\ndata: {"message":"模型超时","timeout":true}\n\n'))
  await assert.rejects(enhancer.enhanceStream({ draft: '测试' }), error => error.timeout && /模型超时/.test(error.message))
})

test('请求交替取消：旧请求 finally 不得清除新请求的取消句柄', async t => {
  let count = 0
  t.mock.method(globalThis, 'fetch', (url, { signal }) => new Promise((resolve, reject) => {
    count += 1
    signal.addEventListener('abort', () => reject(Object.assign(new Error('取消'), { name: 'AbortError' })))
  }))
  const enhancer = new DshSessionEnhancer(() => 's')
  const first = assert.rejects(enhancer.enhance({ draft: '第一次' }), { name: 'AbortError' })
  const second = assert.rejects(enhancer.enhance({ draft: '第二次' }), { name: 'AbortError' })
  await first
  assert.equal(enhancer.loading, true)
  enhancer.cancel()
  await second
  assert.equal(count, 2)
})
