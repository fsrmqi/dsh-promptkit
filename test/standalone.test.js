import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadStandalone() {
  let registration
  const React = {
    createElement: (type, props) => ({ type, props }),
    useMemo: callback => callback(),
    useCallback: callback => callback,
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useEffect: () => {},
  }
  const sandbox = {
    window: {
      innerWidth: 1280,
      innerHeight: 800,
      localStorage: { getItem: () => null, setItem: () => {} },
      __ModuleLoader__: { load: entry => { registration = entry } },
    },
    console,
  }
  const code = readFileSync(resolve(ROOT, 'ui/client.js'), 'utf8')
  vm.runInNewContext(code, sandbox)
  return { id: registration.id, plugin: registration.factory(specifier => {
    assert.equal(specifier, 'react')
    return React
  }) }
}

test('独立 DSH 插件：新版方法工坊与快捷助手并列注入各自插槽', () => {
  const { id, plugin } = loadStandalone()
  assert.equal(id, 'dsh-promptkit')
  const injectedSlots = []
  let quickActionHost
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        injectedSlots.push(name)
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })

  assert.deepEqual(injectedSlots, ['conversation.view', 'conversation.input.right'])
  let element
  assert.doesNotThrow(() => { element = quickActionHost.Component({
    sessionId: 'session-1',
    useInput: selector => selector({ draft: '' }),
    useChat: selector => selector({ order: [], nodes: new Map() }),
    inputActions: { setDraft: () => {} },
  }) })
  assert.equal(typeof element.props.enhancer.enhance, 'function')
  assert.equal(typeof element.props.searchMemory, 'function')
})

test('独立 DSH 插件：0.1.2+ 从 useInput 与键控 useChat 快照读取草稿和对话', () => {
  const { plugin } = loadStandalone()
  let quickActionHost
  let studioHost
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        if (name === 'conversation.view') studioHost = callback()
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })
  const chat = {
    order: ['u1', 'a1'],
    nodes: new Map([
      ['u1', { kind: 'user', content: [{ type: 'text', text: '请检查新版兼容性' }] }],
      ['a1', { kind: 'assistant', turn: 1, step: 1, blocks: [{ kind: 'text', text: '先更新适配层。' }] }],
    ]),
  }
  const element = quickActionHost.Component({
    sessionId: 'session-2',
    useInput: selector => selector({ draft: '当前草稿' }),
    useChat: selector => selector(chat),
    inputActions: { setDraft: () => {} },
  })
  assert.equal(element.props.composer.getDraft(), '当前草稿')
  assert.deepEqual(JSON.parse(JSON.stringify(element.props.messages)), [
    { id: 'assistant:1:1:1', role: 'assistant', text: '先更新适配层。', truncated: false },
    { id: 'user:::0', role: 'user', text: '请检查新版兼容性', truncated: false },
  ])
  const submitted = []
  const studio = studioHost.Component({
    sessionId: 'session-2',
    inputActions: { setDraft: text => submitted.push(text), submit: () => submitted.push('submitted') },
  })
  return studio.props.onSend('由方法工坊生成').then(() => {
    assert.deepEqual(submitted, ['由方法工坊生成', 'submitted'])
  })
})
