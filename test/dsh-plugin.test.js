import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../ui/plugin.js'

test('DSH node half：会话模型路由可驱动语义增强桥接', async () => {
  const listeners = new Map()
  let route
  const ctx = {
    effect: callback => callback(),
    on: (name, callback) => { listeners.set(name, callback); return () => {} },
    webServer: { register: value => { route = value; return () => {} } },
    llm: { async *stream() { yield { type: 'text-delta', text: '改写结果' }; yield { type: 'finish', reason: { kind: 'stop' } } } },
  }
  apply(ctx)
  listeners.get('agent/created')({ agent: { session: { id: 's1' }, options: { provider: 'test', model: 'test-model' } } })
  const response = { status: 0, body: '', writeHead(status) { this.status = status }, end(value) { this.body = value } }
  const request = {
    method: 'POST', url: '/dsh-promptkit/semantic-enhance?session_id=s1', on() {}, off() {},
    async *[Symbol.asyncIterator]() { yield JSON.stringify({ draft: '请改写这段草稿', lang: 'zh' }) },
  }
  await route.handler(request, response)
  assert.equal(response.status, 200)
  assert.equal(JSON.parse(response.body).prompt, '改写结果')
})
