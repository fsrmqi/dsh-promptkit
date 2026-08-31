import test from 'node:test'
import assert from 'node:assert/strict'
import { conversationMessages } from '../src/lib/utils.js'

test('长会话只读取凑齐最近消息所需的键控节点', () => {
  let reads = 0
  const snapshot = { order: Array.from({ length: 10000 }, (_, i) => i), nodes: { get: key => { reads++; return { kind: 'user', content: [{ type: 'text', text: '消息' + key }] } } } }
  const messages = conversationMessages(snapshot)
  assert.equal(messages.length, 12)
  assert.equal(reads, 12)
  assert.equal(messages[0].text, '消息9999')
})
