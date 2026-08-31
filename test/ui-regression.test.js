import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import * as SourceKit from '../src/index.js'

const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
async function mount(t, { enhancer, bundle = false, searchFiles, initialDraft = '帮我优化登录流程并明确验收标准', displayMode = 'full', auto = false, onSubmitDraft, selection, methodProvider: providedMethods } = {}) {
  const dom = new JSDOM('<!doctype html><html><body><textarea id="target"></textarea><input id="other"><div id="root"></div></body></html>', { url: 'http://localhost', pretendToBeVisual: true })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const errors = []
  t.mock.method(console, 'error', (...args) => errors.push(args.join(' ')))
  const Kit = bundle ? new Function('React', `${readFileSync(new URL('../ui/embed.js', import.meta.url), 'utf8')}\nreturn PromptKit`)(React) : SourceKit
  let draft = initialDraft
  let range = selection
  const listeners = new Set()
  const selectionListeners = new Set()
  const composer = { getDraft: () => draft, write(value) { draft = value; for (const cb of listeners) cb(value) }, onChange(cb) { listeners.add(cb); return () => listeners.delete(cb) },
    isInputTarget: target => target === document.getElementById('target'),
    getSelection: () => range ? { ...range, text: draft.slice(range.start, range.end), draft } : null,
    onSelectionChange(cb) { selectionListeners.add(cb); return () => selectionListeners.delete(cb) },
  }
  const methodProvider = providedMethods || new Kit.StaticMethodProvider()
  window.localStorage.setItem('regression.quick-action.display-mode.v1', displayMode)
  if (auto) window.localStorage.setItem('regression.quick-action.auto-enhance.enabled.v1', 'true')
  const root = createRoot(document.getElementById('root'))
  await act(async () => root.render(React.createElement(Kit.QuickEnhancer, {
    methodProvider, assetProvider: new Kit.StaticAssetProvider(),
    composer, enhancer, searchFiles, onSubmitDraft, storagePrefix: 'regression.', nudgeEnabled: false,
    messages: [{ id: 'u1', role: 'user', text: '已确认仅调整登录交互。' }],
  })))
  t.after(async () => {
    await act(async () => root.unmount())
    dom.window.close()
    assert.deepEqual(errors, [], '源码和构建产物的实际交互不得产生 React 警告')
  })
  const click = async label => {
    const node = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === label || b.getAttribute('aria-label') === label)
    assert.ok(node, `应显示按钮：${label}`)
    await act(async () => node.click())
  }
  await click('打开智能增强')
  return { click, composer, methodProvider, changeSelection: value => { range = value; selectionListeners.forEach(cb => cb()) } }
}

for (const bundle of [false, true]) test(`${bundle ? '构建产物' : '源码入口'}：增强、撤销、对话选择与抽屉关闭无 React 警告`, async t => {
  const { click, composer } = await mount(t, { bundle })
  const original = composer.getDraft()
  await click('应用增强到消息框')
  assert.notEqual(composer.getDraft(), original)
  await click('撤销上一次填入')
  assert.equal(composer.getDraft(), original)
  await click('选择对话')
  await click('全选 (1)')
  await click('确认选择 (1)')
  await click('打开灵感库 →')
  assert.ok(document.querySelector('aside[aria-label="灵感库"]'))
  await act(async () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert.equal(document.querySelector('aside[aria-label="灵感库"]'), null)
  assert.ok([...document.querySelectorAll('button')].some(b => b.getAttribute('aria-label') === '应用增强到消息框'))
})

test('语义增强：仅明确不支持流式时降级；普通模型错误不重复请求', async t => {
  let fallback = true
  let calls = 0
  const { click, composer } = await mount(t, { enhancer: {
    async enhanceStream() { throw Object.assign(new Error('模型失败'), { fallback }) },
    async enhance() { calls += 1; return { prompt: '已整理的提示词' } }, cancel() {},
  } })
  await click('语义 · 模型')
  await click('应用增强到消息框')
  assert.equal(calls, 1)
  assert.equal(composer.getDraft(), '已整理的提示词')
  fallback = false
  await click('应用增强到消息框')
  assert.equal(calls, 1)
  assert.match(document.body.textContent, /模型失败/)
})

test('语义增强：取消后晚到的结果不得写回草稿', async t => {
  const response = deferred()
  const { click, composer } = await mount(t, { enhancer: { enhance: () => response.promise, cancel() {} } })
  const before = composer.getDraft()
  await click('语义 · 模型')
  await click('应用增强到消息框')
  await click('取消')
  await act(async () => response.resolve({ prompt: '不应应用的迟到结果' }))
  assert.equal(composer.getDraft(), before)
  assert.match(document.body.textContent, /已取消，草稿未改动/)
})

test('语义增强：等待期间继续编辑时保留新草稿', async t => {
  const response = deferred()
  const { click, composer } = await mount(t, { enhancer: { enhance: () => response.promise, cancel() {} } })
  await click('语义 · 模型')
  await click('应用增强到消息框')
  await act(async () => composer.write('用户刚补充的新需求，不能被旧结果覆盖'))
  await act(async () => response.resolve({ prompt: '旧结果' }))
  assert.equal(composer.getDraft(), '用户刚补充的新需求，不能被旧结果覆盖')
  assert.match(document.body.textContent, /草稿已变化/)
})

test('语义增强：部分诊断逐步展示但不进入正文，完成后保留缺项提示', async t => {
  const response = deferred()
  let onDelta
  const { click, composer } = await mount(t, { enhancer: { enhanceStream(options) { onDelta = options.onDelta; return response.promise }, cancel() {} } })
  await click('语义 · 模型')
  await click('应用增强到消息框')
  await act(async () => onDelta('[DIAG] hidden_premise: 默认的部署环境未确认\n===PRO'))
  assert.doesNotMatch(document.body.textContent, /\[DIAG\]|===PRO/)
  await act(async () => response.resolve({ prompt: '请先确认部署环境，再整理登录改造方案。', diagnosis: { hidden_premise: '默认的部署环境未确认' }, diagnosisMeta: { status: 'partial' } }))
  assert.equal(composer.getDraft(), '请先确认部署环境，再整理登录改造方案。')
  assert.match(document.body.textContent, /未返回此项诊断/)
})

test('宿主输入框不再弹 @ 补全菜单：文件引用交给 DSH 原生 @ 提及', async t => {
  const { composer } = await mount(t, { searchFiles: async () => ({ files: ['src/app.js'], truncated: true }) })
  await act(async () => composer.write('请检查 @sr'))
  await act(async () => new Promise(resolve => setTimeout(resolve, 170)))
  assert.ok(!document.querySelector('[aria-label="文件引用补全"]'), '插件不得在宿主输入框上提供 @ 补全（与原生菜单重叠）')
  assert.equal(composer.getDraft(), '请检查 @sr', '草稿必须原样保留')
})

test('快捷键：使用最新草稿、语义档和显式选择的方法', async t => {
  const calls = []
  const { click, composer } = await mount(t, { enhancer: { async enhance(input) { calls.push(input); return { prompt: '模型改写结果' } }, cancel() {} } })
  await click('语义 · 模型')
  await act(async () => composer.write('请优化登录流程，保留现有认证接口，并列出可以验证的验收条件。'))
  const panel = document.querySelector('[aria-label="对话增强器"]')
  const source = composer.getDraft()
  await act(async () => panel.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true, cancelable: true })))
  assert.equal(calls.length, 1)
  assert.equal(calls[0].draft, source)
  await act(async () => composer.write(source))
  await act(async () => panel.dispatchEvent(new window.KeyboardEvent('keydown', { key: '2', metaKey: true, bubbles: true, cancelable: true })))
  assert.equal(calls.length, 2)
  assert.equal(calls[1].method.title, '第一性原理')
})

test('轻量选区：预览只含片段，写回后前后文不重复', async t => {
  const original = '前置上下文；请优化登录交互体验并明确验收标准；保留这个结尾。'
  const { click, composer, changeSelection } = await mount(t, { initialDraft: original })
  await act(async () => changeSelection({ start: original.indexOf('请优化'), end: original.indexOf('；保留') }))
  const preview = [...document.querySelectorAll('span')].find(n => n.textContent === '增强后')?.parentElement.textContent
  assert.ok(preview)
  assert.doesNotMatch(preview, /前置上下文|保留这个结尾/)
  await click('应用增强到消息框')
  assert.equal(composer.getDraft().split('前置上下文').length - 1, 1)
  assert.equal(composer.getDraft().split('保留这个结尾').length - 1, 1)
  assert.ok(composer.getDraft().startsWith('前置上下文；'))
  assert.ok(composer.getDraft().endsWith('；保留这个结尾。'))
})

test('自动发送：发送回执失败只调用一次，且不拦截其他输入框', async t => {
  const sent = []
  await mount(t, { auto: true, enhancer: { async enhance() { return { prompt: '模型改写结果' } }, cancel() {} }, onSubmitDraft: async text => { sent.push(text); throw new Error('回执丢失') } })
  const press = element => element.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await act(async () => press(document.getElementById('other')))
  assert.equal(sent.length, 0)
  await act(async () => press(document.getElementById('target')))
  assert.deepEqual(sent, ['模型改写结果'])
  assert.match(document.body.textContent, /未自动重发/)
})

test('自动发送：增强失败回退原文一次，连续 Enter 不重复提交', async t => {
  let reject
  const response = new Promise((resolve, fail) => { reject = fail })
  const sent = []
  const { composer } = await mount(t, { auto: true, enhancer: { enhance: () => response, cancel() {} }, onSubmitDraft: async text => { sent.push(text) } })
  const target = document.getElementById('target')
  await act(async () => {
    target.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    target.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  })
  await act(async () => reject(new Error('模型超时')))
  assert.deepEqual(sent, [composer.getDraft()])
})

test('自动发送：等待期间新编辑阻止旧请求发送', async t => {
  const response = deferred()
  const sent = []
  const { composer } = await mount(t, { auto: true, enhancer: { enhance: () => response.promise, cancel() {} }, onSubmitDraft: async text => sent.push(text) })
  await act(async () => document.getElementById('target').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })))
  await act(async () => composer.write('用户新写的请求不能被发送旧稿覆盖'))
  await act(async () => response.resolve({ prompt: '旧结果' }))
  assert.equal(sent.length, 0)
})

test('首次体验：关闭统计也会在第三次成功后展开，统计数据仍不写入', async t => {
  const { click, composer } = await mount(t, { displayMode: 'auto' })
  const original = composer.getDraft()
  assert.match(document.body.textContent, /展开全部功能/)
  for (let i = 0; i < 3; i += 1) {
    await act(async () => composer.write(original))
    await click('应用增强到消息框')
  }
  assert.doesNotMatch(document.body.textContent, /展开全部功能/)
  assert.equal(window.localStorage.getItem('regression.quick-action.onboarding-successes.v1'), '3')
  assert.equal(window.localStorage.getItem('regression.quick-action.metrics.v1'), null)
})

test('知识区：检查通过不入区，共同长前缀的不同草稿各自留证', async t => {
  const prefix = '同一段任务背景。'.repeat(20)
  const { click, composer } = await mount(t, { initialDraft: prefix + '任务甲', enhancer: {
    async enhance() { return { prompt: '改写完成', diagnosis: { hidden_premise: '[GAP] 部署环境未确认', falsifiability: '[OK] 要求可验证' } } }, cancel() {},
  } })
  await click('语义 · 模型')
  await click('应用增强到消息框')
  await act(async () => composer.write(prefix + '任务乙'))
  await click('应用增强到消息框')
  await act(async () => composer.write(prefix + '任务乙'))
  await click('应用增强到消息框')
  const entries = JSON.parse(window.localStorage.getItem('regression.quick-action.knowledge-inbox.v1'))
  assert.equal(entries.length, 2)
  assert.notEqual(entries[0].fingerprint, entries[1].fingerprint)
  assert.ok(entries.every(entry => entry.dimension === 'hidden_premise' && !entry.finding.includes('[GAP]')))
})

test('技能引用：选区自动补回保留外围文本，关闭提示不再次写回', async t => {
  const original = '保留前言；请用 /tdd 检查登录流程并给出验证步骤；保留结尾。'
  const { click, composer } = await mount(t, { initialDraft: original,
    selection: { start: original.indexOf('请用'), end: original.indexOf('；保留结尾') },
    enhancer: { async enhance() { return { prompt: '请检查登录流程。' } }, cancel() {} },
  })
  await click('语义 · 模型')
  await click('应用增强到消息框')
  assert.ok(composer.getDraft().startsWith('保留前言；'))
  assert.ok(composer.getDraft().endsWith('；保留结尾。'))
  assert.match(composer.getDraft(), /\/tdd/)
  assert.match(document.body.textContent, /已自动补回技能引用/)
  await act(async () => composer.write('我重新编辑了整个请求'))
  await click('知道了')
  assert.equal(composer.getDraft(), '我重新编辑了整个请求')
})
