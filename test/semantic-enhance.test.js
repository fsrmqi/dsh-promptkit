import { test } from 'node:test'
import assert from 'node:assert/strict'
import { enhanceWithCurrentSessionModel } from '../dsh/semantic-enhance.js'

test('语义增强：复用当前会话模型路由并返回文本', async () => {
  let request
  const llm = {
    async *stream(value) {
      request = value
      yield { type: 'text-delta', index: 0, text: '整理后的提示词' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  const result = await enhanceWithCurrentSessionModel({
    llm,
    route: { provider: 'deepseek', model: 'deepseek-v4' },
    sessionId: 'session-1',
    draft: '帮我优化这个需求',
    extra: '先给结论',
    lang: 'zh',
  })

  assert.deepEqual(result, { prompt: '整理后的提示词', model: 'deepseek-v4' })
  assert.equal(request.provider, 'deepseek')
  assert.equal(request.model, 'deepseek-v4')
  assert.equal(request.sessionId, 'session-1')
  assert.equal(request.purpose, 'dsh-promptkit-semantic-enhance')
  assert.match(request.messages[0].content[0].text, /先给结论/)
})

test('语义增强：没有当前会话模型路由时给出可操作提示', async () => {
  await assert.rejects(
    enhanceWithCurrentSessionModel({ llm: { stream() {} }, route: undefined, sessionId: 'session-1', draft: '优化', lang: 'zh' }),
    /请先正常发送一次消息/,
  )
})
