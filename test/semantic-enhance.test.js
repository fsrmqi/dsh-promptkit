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

test('语义增强：规则保留原任务粒度，不强制审计式模板', async () => {
  let request
  const llm = {
    async *stream(value) {
      request = value
      yield { type: 'text-delta', text: '整理后的提示词' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  await enhanceWithCurrentSessionModel({
    llm,
    route: { provider: 'deepseek', model: 'deepseek-v4' },
    sessionId: 'session-1',
    draft: '了解下我这个项目，最近改了好多东西，相应的文档同步更新下',
    lang: 'zh',
    strength: 'high',
  })

  assert.match(request.system, /保留草稿的任务类型、范围、自主程度与对话语气/)
  assert.match(request.system, /不得为了套模板而生成完整结构、项目计划、审计清单或分阶段交付/)
  assert.match(request.system, /不得新增用户未要求的工作流、验收标准或交付阶段/)
  assert.doesNotMatch(request.system, /充分展开背景、步骤与验收标准/)
})
