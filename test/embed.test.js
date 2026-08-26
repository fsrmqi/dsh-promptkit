import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 最小宿主环境：仅提供 React 符号（DSH 插件工厂标准）+ 浏览器全局。 */
function minimalHost() {
  const store = new Map()
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
  }
  const React = { createElement: () => null }
  const sandbox = {
    React,
    window: { localStorage },
    document: { querySelector: () => null },
    fetch: () => Promise.reject(new Error('not called')),
    AbortController,
    console,
  }
  return { sandbox, store }
}

/** 在最小宿主闭包中执行 embed.js，返回 PromptKit 命名空间（模拟宿主拼接后的求值）。 */
function loadEmbed(host) {
  const code = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  return vm.runInNewContext(`${code}\n;PromptKit`, host.sandbox)
}

test('Embed Protocol v1：命名空间与版本', () => {
  const PromptKit = loadEmbed(minimalHost())
  assert.equal(PromptKit.version, '1')
  assert.equal(typeof PromptKit.PromptStudio, 'function')
  assert.equal(typeof PromptKit.QuickEnhancer, 'function')
  assert.equal(typeof PromptKit.StaticMethodProvider, 'function')
  assert.equal(typeof PromptKit.Composer, 'function')
  assert.equal(typeof PromptKit.Enhancer, 'function')
  assert.equal(typeof PromptKit.TextareaComposer, 'function')
  assert.equal(typeof PromptKit.OpenAIEnhancer, 'function')
})

test('内置方法库：12 个方法完整可查', async () => {
  const PromptKit = loadEmbed(minimalHost())
  assert.equal(PromptKit.builtinMethods.length, 12)
  const provider = new PromptKit.StaticMethodProvider()
  const methods = await provider.list()
  assert.equal(methods.length, 12)
  const steelman = await provider.getById('双向钢人论证')
  assert.ok(steelman, '双向钢人论证应存在')
  assert.equal(steelman.mode, 'guided')
  assert.ok(steelman.prompt.length > 200, 'prompt 模板应为完整正文')
})

test('compose：模板 + 本次任务输入块', async () => {
  const PromptKit = loadEmbed(minimalHost())
  const provider = new PromptKit.StaticMethodProvider()
  const { prompt, method } = await provider.compose({
    methodId: '事实核查',
    question: '开普云 2025 年营收是否增长',
    facts: '年报披露营收 6.8 亿',
    constraints: '只引用可核验来源',
  })
  assert.equal(method.id, '事实核查')
  assert.ok(prompt.includes('开普云 2025 年营收是否增长'), '应包含用户问题')
  assert.ok(prompt.includes('年报披露营收 6.8 亿'), '应包含用户事实')
  // 模板在前、输入块在后（Embed Protocol 的 compose 契约）
  assert.ok(prompt.indexOf(method.prompt) < prompt.indexOf('开普云 2025 年营收是否增长'))
})

test('search：标题/用途全字段匹配', async () => {
  const PromptKit = loadEmbed(minimalHost())
  const provider = new PromptKit.StaticMethodProvider()
  const byTitle = await provider.search('钢人')
  assert.equal(byTitle.length, 1)
  const byPurpose = await provider.search('核查')
  assert.ok(byPurpose.some(method => method.id === '事实核查'))
})

test('storagePrefix：宿主数据隔离', async () => {
  const host = minimalHost()
  const PromptKit = loadEmbed(host)
  const provider = new PromptKit.StaticMethodProvider({ storagePrefix: 'my-host.' })
  await provider.setFavorites(['事实核查'])
  const favorites = [...(await provider.getFavorites())]
  assert.deepEqual(favorites, ['事实核查'])
  assert.ok([...host.store.keys()].every(key => key.startsWith('my-host.')), 'localStorage key 必须带宿主前缀')
})

test('私有方法：可从 Obsidian 风格 Markdown 导入且不污染开源方法库', async () => {
  const host = minimalHost()
  const PromptKit = loadEmbed(host)
  const provider = new PromptKit.StaticMethodProvider({ storagePrefix: 'my-notes.' })
  const method = await provider.importPrivateMarkdown([
    '---', '场景: 写作', '用途: 把零散笔记整理成提纲', '标签: [Obsidian, 写作]', '---', '',
    '# 我的提纲法', '', '## Prompt', '', '```', '请把以下笔记整理成层级提纲。', '```',
  ].join('\n'))
  const methods = await provider.list()
  assert.equal(method.source, 'private')
  assert.ok(methods.some(item => item.id === method.id))
  assert.ok([...host.store.keys()].some(key => key === 'my-notes.prompt-library.private-methods.v1'))
})

test('视觉命名空间：pk-* 前缀，不占用 mc-*（避免与宿主主题冲突）', () => {
  const code = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  assert.ok(code.includes('--pk-'), 'CSS 变量应为 --pk-* 前缀')
  assert.ok(!code.includes('--mc-'), '不得残留宿主命名空间 --mc-*')
  assert.ok(!code.includes('className: \'mc-'), '不得残留 mc-* class')
})

test('IIFE 私有化：不向宿主闭包泄漏内部符号', () => {
  const host = minimalHost()
  const code = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  const names = Object.keys(host.sandbox)
  vm.runInNewContext(`${code}\n;globalThis.__leaked = { C: typeof C, utils: typeof utils, PromptStudio: typeof PromptStudio }`, host.sandbox)
  // IIFE 内部符号在全局不可见（C/utils 等只在 IIFE 作用域内）
  const leaked = host.sandbox.__leaked
  assert.equal(leaked.C, 'undefined')
  assert.equal(leaked.utils, 'undefined')
  assert.equal(leaked.PromptStudio, 'undefined')
  assert.equal(names.filter(n => n.startsWith('__')).length, 0)
})
