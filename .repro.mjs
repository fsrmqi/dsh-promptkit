// 最小合成 DOM 复现：真 React + jsdom，跑「打开灵感库 → 点关闭」的完整交互。
// 目的：确认「关闭」到底有没有落地，找到真因。
import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { createRoot } from 'react-dom/client'

const ROOT = dirname(fileURLToPath(import.meta.url))
const embedSrc = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="mount"></div></body></html>',
  { pretendToBeVisual: true, url: 'http://localhost/' })
const { window: W } = dom
global.window = W
global.document = W.document
try { Object.defineProperty(global, 'navigator', { value: W.navigator, configurable: true }) } catch {}
global.requestAnimationFrame = cb => setTimeout(() => cb(), 0)
global.cancelAnimationFrame = id => clearTimeout(id)
try { Object.defineProperty(global, 'navigator', { value: W.navigator, configurable: true }) } catch {}
if (!W.requestAnimationFrame) W.requestAnimationFrame = cb => setTimeout(() => cb(), 0)
if (!W.cancelAnimationFrame) W.cancelAnimationFrame = id => clearTimeout(id)

// 模拟宿主拦截（场景 B）：在 body 处挂 pointerdown/click 监听并 stopPropagation。
// 与 DSH 外壳「在冒泡阶段截胡」的实际表现一致。
function createInterceptors(attach) {
  const stop = event => { event.preventDefault(); event.stopPropagation() }
  if (attach) {
    W.document.body.addEventListener('pointerdown', stop)
    W.document.body.addEventListener('click', stop)
  }
  return () => {
    W.document.body.removeEventListener('pointerdown', stop)
    W.document.body.removeEventListener('click', stop)
  }
}

// 加载 embed 闭包：它就是 const PromptKit = (React => {...})(React)
const PromptKit = (new Function('React', 'document', 'window', 'console',
  `${embedSrc}\nreturn PromptKit`))(React, W.document, W, console)

const composer = {
  _draft: '',
  getDraft: () => composer._draft,
  setDraft: v => { composer._draft = String(v ?? '') },
  onChange: cb => { composer._cb = cb; return () => { composer._cb = null } },
}
const methodProvider = new PromptKit.StaticMethodProvider({ storagePrefix: 'repro.' })
const assetProvider = {
  _items: [],
  list: async () => assetProvider._items,
  async save(obj) { const item = { id: 'asset-' + (assetProvider._items.length + 1), ...obj }; assetProvider._items.push(item); return item },
  onChange: () => () => { },
}

let rootCount = 0
const mountState = () => {
  rootCount += 1
  const container = W.document.createElement('div')
  container.className = 'repro-root'
  container.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:800px'
  W.document.body.appendChild(container)
  const root = createRoot(container)
  root.render(React.createElement(PromptKit.QuickEnhancer, { methodProvider, assetProvider, composer }))
  // 记下清场/唤出关闭时机：同一容器上重新渲染会提示 React 同步。
  return { root, container }
}

// 等一拍让面板 mount + 异步灌方法（methodProvider.list）。
const tick = () => new Promise(r => setTimeout(r, 60))

async function openDrawer(container) {
  // 点 launcher fah 打开主面板
  const launcher = container.querySelector('.pk-fab')
  if (!launcher) throw new Error('launcher not mounted')
  launcher.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 点「打开灵感库 →」
  const openVault = [...container.querySelectorAll('button')].find(b => /打开灵感库/.test(b.textContent))
  if (!openVault) throw new Error('open-vault button not found; buttons=' + [...container.querySelectorAll('button')].map(b => b.textContent).slice(0,8).join('|'))
  openVault.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  return openVault
}

function drawerVisible(container) {
  return !!container.querySelector('aside[aria-label="灵感库"]')
}
function findClose(container) {
  return [...container.querySelectorAll('aside[aria-label="灵感库"] button')].find(b => /^关闭\s?×$/.test(b.textContent.trim()))
}

async function run(label, intercepts) {
  const cleanup = createInterceptors(intercepts)
  const { root, container } = mountState()
  await tick()
  await openDrawer(container)
  const before = drawerVisible(container)
  const btn = findClose(container)
  if (!btn) throw new Error('close button missing in drawer; ' + [...container.querySelectorAll('aside[aria-label="灵感库"] button')].map(b=>b.textContent).join('|'))
  // 模拟宿主 DSL：真实场景里按钮既有 React onClick，也有 window capture 兜底。
  btn.dispatchEvent(new W.MouseEvent('pointerdown', { bubbles: true }))
  await tick()
  btn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  const after = drawerVisible(container)
  console.log(`[${label}] drawer before=${before}, close-btn=${btn.textContent.trim()}, after=${after}, CLOSE=${before && !after ? '✅' : '❌'}`)
  try { root.unmount() } finally { cleanup() }
}

;(async () => {
  try { await run('A-clean', false) } catch (e) { console.log('A failed:', e.message) }
  try { await run('B-host-intercepts-body', true) } catch (e) { console.log('B failed:', e.message) }
  try {
    const { root, container } = mountState()
    const cleanup = createInterceptors(false)
    await tick(); await openDrawer(container)
    const btn = findClose(container)
    btn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
    await tick()
    console.log(`[C-click-only] drawer after=${drawerVisible(container)}, CLOSE=${!drawerVisible(container) ? '✅' : '❌'}`)
    try { root.unmount() } finally { cleanup() }
  } catch (e) { console.log('C failed:', e.message) }
  // D. 右上按钮被外部浮 pill 压住 → 代码自动左移后，再点左下角按钮。
  //    （jsdom 无布局时 getBoundingClientRect 恒为 0，需手动打补丁让 elementFromPoint 有判别力）
  try {
    const { root, container } = mountState()
    const cleanup = createInterceptors(true) // 宿主截胡
    await tick(); await openDrawer(container)
    const blocker = W.document.createElement('div')
    blocker.className = 'host-pill'
    blocker.style.cssText = 'position:fixed;right:0;top:0;width:60px;height:30px;z-index:1000;background:#eee'
    W.document.body.appendChild(blocker)
    const btn0 = findClose(container)
    const real0 = btn0.getBoundingClientRect.bind(btn0)
    btn0.getBoundingClientRect = () => { const r = real0(); return { ...r, x: 1220, y: 0, width: 60, height: 24, left: 1220, top: 0, right: 1280, bottom: 24 } }
    W.document.elementFromPoint = () => blocker
    await new Promise(r => setTimeout(r, 2000)) // 等左移检测与轮询的 interval(1500) + timers
    const btn = findClose(container) || btn0
    const realRect = btn.getBoundingClientRect.bind(btn)
    btn.getBoundingClientRect = () => ({ x: 10, y: 0, width: 60, height: 24, left: 10, top: 0, right: 70, bottom: 24 })
    W.document.elementFromPoint = (x, y) => { if (x < 70 && y < 24) return blocker; return null } // 左侧不再被压
    btn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
    await tick()
    const seen = !!container.querySelector('aside[aria-label="灵感库"]')
    console.log(`[D pill-left-swaps-button] drawer after swap-tap=${!seen}, CLOSE=${!seen ? '✅' : '❌'}`)
    try { root.unmount() } finally { cleanup(); try { W.document.body.removeChild(blocker) } catch {} try { W.document.elementFromPoint = null } catch {} }
  } catch (e) { console.log('D failed:', e.message) }

  // E. 点屏幕任意非抽屉区域（宿主截胡在 body 冒泡层）——新契约下应保持打开（只有按钮能关）。
  try {
    const { root, container } = mountState()
    const cleanup = createInterceptors(true)
    await tick(); await openDrawer(container)
    const outside = W.document.createElement('button')
    outside.className = 'outside-tap'
    outside.textContent = '宿主其他内容（不在抽屉里）'
    W.document.body.appendChild(outside)
    await tick()
    outside.dispatchEvent(new W.MouseEvent('pointerdown', { bubbles: true }))
    await tick()
    const seen = !!container.querySelector('aside[aria-label="灵感库"]')
    console.log(`[E outside-tap w/ host-intercept] drawer after=${seen}（应保持打开）, ONLY-BUTTON=${seen ? '✅' : '❌'}`)
    try { root.unmount() } finally { cleanup(); try { W.document.body.removeChild(outside) } catch {} }
  } catch (e) { console.log('E failed:', e.message) }

  // F. Esc 键——新契约下应保持打开（只有按钮能关）。
  try {
    const { root, container } = mountState()
    await tick(); await openDrawer(container)
    const before = !!container.querySelector('aside[aria-label="灵感库"]')
    W.document.dispatchEvent(new W.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await tick()
    const after = !!container.querySelector('aside[aria-label="灵感库"]')
    console.log(`[F Esc] before=${before}, after=${after}（应保持打开）, ONLY-BUTTON=${before && after ? '✅' : '❌'}`)
    root.unmount()
  } catch (e) { console.log('F failed:', e.message) }
  W.close()
  process.exit(0)
})()