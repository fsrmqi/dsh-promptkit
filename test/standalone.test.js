import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadStandalone() {
  let factory
  const sandbox = {
    window: {
      innerWidth: 1280,
      innerHeight: 800,
      localStorage: { getItem: () => null, setItem: () => {} },
      __ModuleLoader__: { load: entry => { factory = entry.factory } },
    },
    console,
  }
  const code = readFileSync(resolve(ROOT, 'ui/client.js'), 'utf8')
  vm.runInNewContext(code, sandbox)
  return factory(specifier => {
    assert.equal(specifier, 'react')
    return { createElement: () => null }
  })
}

test('独立 DSH 插件：方法工坊与快捷助手并列注入各自插槽', () => {
  const plugin = loadStandalone()
  const injectedSlots = []
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        injectedSlots.push(name)
        return () => {}
      },
      register: () => () => {},
    },
    sessions: { binding: () => null },
  })

  assert.deepEqual(injectedSlots, ['conversation.view', 'conversation.input.right'])
})
