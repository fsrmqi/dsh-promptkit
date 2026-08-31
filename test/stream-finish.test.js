import test from 'node:test'
import assert from 'node:assert/strict'
import { streamEnhanceWithCurrentSessionModel, semanticEnhanceStreamRoute } from '../dsh/semantic-enhance.js'

const options = { route: { provider: 'mock', model: 'mock' }, sessionId: 's', draft: '合成测试草稿' }
for (const kind of ['error', 'aborted', 'max-tokens', 'tool-calls', 'missing']) {
  test(`流式 ${kind} 结束不得将残缺文本作为成功结果`, async () => {
    const llm = { async *stream() {
      yield { type: 'text-delta', text: '不完整正文' }
      if (kind !== 'missing') yield { type: 'finish', reason: { kind, failure: { message: '测试失败' } } }
    } }
    await assert.rejects(streamEnhanceWithCurrentSessionModel({ ...options, llm }))
    const frames = []
    const res = { headersSent: false, writeHead() { this.headersSent = true }, write: text => frames.push(text), end() {} }
    await semanticEnhanceStreamRoute({ llm, routes: new Map([['s', options.route]]) }).handler({ method: 'POST', url: '/?session_id=s', async *[Symbol.asyncIterator]() { yield JSON.stringify({ draft: options.draft }) } }, res)
    assert.match(frames.join(''), /event: error/)
    assert.doesNotMatch(frames.join(''), /event: done/)
  })
}
test('正常 stop 返回完整正文，取消信号优先于 stop', async () => {
  const llm = { async *stream() { yield { type: 'text-delta', text: '完整正文' }; yield { type: 'finish', reason: { kind: 'stop' } } } }
  assert.equal((await streamEnhanceWithCurrentSessionModel({ ...options, llm })).prompt, '完整正文')
  const controller = new AbortController(); controller.abort()
  await assert.rejects(streamEnhanceWithCurrentSessionModel({ ...options, llm, signal: controller.signal }), { name: 'AbortError' })
})
