import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSDOM } from 'jsdom'
import React from 'react'
import { createRoot } from 'react-dom/client'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * 灵感库抽屉关闭路径的回归测试：真 React 19 createRoot + jsdom，驱动真实构建产物 ui/embed.js。
 * 覆盖「关闭 ×」按钮的原生捕获兜底（宿主在 body 层截胡 pointerdown/click 的场景）、
 * 新增的「点插件外部关抽屉」「Escape 层级化关闭」，以及草稿桥 sessionStorage 的
 * 「取一次、用掉、删掉」语义。
 */

function setupDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="mount"></div></body></html>',
    { pretendToBeVisual: true, url: 'http://localhost/' })
  const { window: W } = dom
  global.window = W
  global.document = W.document
  try { Object.defineProperty(global, 'navigator', { value: W.navigator, configurable: true }) } catch {}
  global.requestAnimationFrame = cb => setTimeout(() => cb(), 0)
  global.cancelAnimationFrame = id => clearTimeout(id)
  if (!W.requestAnimationFrame) W.requestAnimationFrame = cb => setTimeout(() => cb(), 0)
  if (!W.cancelAnimationFrame) W.cancelAnimationFrame = id => clearTimeout(id)
  return dom
}

function loadEmbed(W) {
  const embedSrc = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  return (new Function('React', 'document', 'window', 'console', `${embedSrc}\nreturn PromptKit`))(React, W.document, W, console)
}

function makeProviders(PromptKit) {
  const composer = {
    _draft: '',
    getDraft() { return composer._draft },
    write: v => { composer._draft = String(v ?? '') },
    onChange: () => () => {},
    getSelection: () => null,
  }
  const methodProvider = new PromptKit.StaticMethodProvider({ storagePrefix: 'vault-close-test.' })
  const assetProvider = {
    _items: [],
    list: async () => assetProvider._items,
    async save(obj) { const item = { id: 'asset-' + (assetProvider._items.length + 1), ...obj }; assetProvider._items.push(item); return item },
    onChange: () => () => {},
  }
  return { composer, methodProvider, assetProvider }
}

function interceptAtBody(W, on) {
  const stop = event => { event.preventDefault(); event.stopPropagation() }
  if (on) {
    W.document.body.addEventListener('pointerdown', stop)
    W.document.body.addEventListener('click', stop)
  }
  return () => {
    W.document.body.removeEventListener('pointerdown', stop)
    W.document.body.removeEventListener('click', stop)
  }
}

const tick = (ms = 60) => new Promise(r => setTimeout(r, ms))

async function mountKit(W, PromptKit, providers) {
  const container = W.document.createElement('div')
  container.className = 'test-root'
  W.document.body.appendChild(container)
  const root = createRoot(container)
  root.render(React.createElement(PromptKit.QuickEnhancer, {
    methodProvider: providers.methodProvider,
    assetProvider: providers.assetProvider,
    composer: providers.composer,
    storagePrefix: 'vault-close-test.',
  }))
  await tick()
  return { root, container }
}

async function openVault(W, container) {
  const launcher = container.querySelector('.pk-fab')
  launcher.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  const openBtn = [...container.querySelectorAll('button')].find(b => /打开灵感库/.test(b.textContent))
  openBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
}

const vaultVisible = container => !!container.querySelector('aside[aria-label="灵感库"]')
const mainPanelVisible = container => !!container.querySelector('section[aria-label="对话增强器"]')
const findCloseBtn = container =>
  container.querySelector('aside[aria-label="灵感库"] button[aria-label="关闭灵感库"]')

test('灵感库关闭：宿主在 body 层截胡时，window 捕获兜底仍能关抽屉', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const cleanup = interceptAtBody(W, true)
  const { root, container } = await mountKit(W, PromptKit, makeProviders(PromptKit))
  await openVault(W, container)
  assert.ok(vaultVisible(container), '抽屉应已打开')
  const btn = findCloseBtn(container)
  btn.dispatchEvent(new W.MouseEvent('pointerdown', { bubbles: true }))
  await tick()
  btn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  assert.ok(!vaultVisible(container), '宿主截胡下关闭按钮仍应生效')
  assert.ok(mainPanelVisible(container), '关闭抽屉不能继续触发主面板关闭')
  root.unmount()
  cleanup()
  dom.window.close()
})

test('灵感库关闭：干净环境下 React onClick 正常关抽屉', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const { root, container } = await mountKit(W, PromptKit, makeProviders(PromptKit))
  await openVault(W, container)
  findCloseBtn(container).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  assert.ok(!vaultVisible(container), '干净环境点击关闭应生效')
  assert.ok(mainPanelVisible(container), '关闭抽屉后主面板应保留')
  root.unmount()
  dom.window.close()
})

test('灵感库关闭：点插件外部区域只关抽屉、不连主面板一起关', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const { root, container } = await mountKit(W, PromptKit, makeProviders(PromptKit))
  await openVault(W, container)
  assert.ok(vaultVisible(container) && mainPanelVisible(container), '抽屉与主面板都应打开')
  // 宿主自己的内容（插件根之外）
  const outside = W.document.createElement('button')
  outside.textContent = '宿主内容'
  W.document.body.appendChild(outside)
  outside.dispatchEvent(new W.MouseEvent('pointerdown', { bubbles: true }))
  await tick()
  assert.ok(!vaultVisible(container), '点外部应关抽屉')
  assert.ok(mainPanelVisible(container), '主面板应保留（一次点击只关最上层）')
  root.unmount()
  try { W.document.body.removeChild(outside) } catch {}
  dom.window.close()
})

test('灵感库关闭：Escape 先关抽屉、再按才关主面板（层级化）', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const { root, container } = await mountKit(W, PromptKit, makeProviders(PromptKit))
  await openVault(W, container)
  assert.ok(vaultVisible(container) && mainPanelVisible(container))
  W.document.dispatchEvent(new W.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await tick()
  assert.ok(!vaultVisible(container), '第一次 Escape 应只关抽屉')
  assert.ok(mainPanelVisible(container), '主面板应保留')
  W.document.dispatchEvent(new W.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await tick()
  assert.ok(!mainPanelVisible(container), '第二次 Escape 才关主面板')
  root.unmount()
  dom.window.close()
})

test('草稿桥：sessionStorage 兑底路径解析 JSON 且取后即删（不再拿 JSON 原文当草稿）', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  // 模拟 quick-enhancer openStudioWithDraft 的写入（Studio 尚未挂载）
  W.sessionStorage.setItem('studio-test.studio.pending-draft.v1', JSON.stringify({ draft: '请评审这段接口设计', methodId: '' }))
  // 挂载 Studio：mount 时应消费 pending 草稿并清除
  const container = W.document.createElement('div')
  W.document.body.appendChild(container)
  const root = createRoot(container)
  root.render(React.createElement(PromptKit.PromptStudio, {
    methodProvider: providers.methodProvider,
    storagePrefix: 'studio-test.',
  }))
  await tick(120)
  const textarea = container.querySelector('textarea')
  assert.ok(textarea, 'Studio question 输入框应存在')
  assert.equal(textarea.value, '请评审这段接口设计', 'question 应是草稿本体，而非 JSON 原文')
  assert.equal(W.sessionStorage.getItem('studio-test.studio.pending-draft.v1'), null, '消费后应清除 pending 草稿')
  // methods 变化导致 effect 重跑时，不应再灌入陈旧草稿
  textarea.value = '用户手动改写的编辑内容'
  textarea.dispatchEvent(new W.Event('input', { bubbles: true }))
  await tick(120)
  root.unmount()
  dom.window.close()
})

test('草稿桥：事件路径消费后同样清除 sessionStorage', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  const container = W.document.createElement('div')
  W.document.body.appendChild(container)
  const root = createRoot(container)
  root.render(React.createElement(PromptKit.PromptStudio, {
    methodProvider: providers.methodProvider,
    storagePrefix: 'studio-test.',
  }))
  await tick(120)
  // openStudioWithDraft 的双通道：先写 sessionStorage 再派发事件
  W.sessionStorage.setItem('studio-test.studio.pending-draft.v1', JSON.stringify({ draft: '事件路径的草稿', methodId: '' }))
  W.dispatchEvent(new W.CustomEvent('studio-test.studio.open-with-draft.v1', { detail: { draft: '事件路径的草稿', methodId: '', ts: Date.now() } }))
  await tick(120)
  const textarea = container.querySelector('textarea')
  assert.equal(textarea.value, '事件路径的草稿', '事件路径应预填草稿')
  assert.equal(W.sessionStorage.getItem('studio-test.studio.pending-draft.v1'), null, '事件路径消费后也应清除 sessionStorage')
  root.unmount()
  dom.window.close()
})
