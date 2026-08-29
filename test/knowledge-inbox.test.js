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
 * 诊断闭环（知识区）端到端测试：真 React 19 createRoot + jsdom 驱动真实构建产物。
 *
 * 闭环语义（用户主动决定，插件不代劳）：
 *   语义增强诊断出认识缺口 → 自动入「知识区」暂存（localStorage 持久化，非 Vault 资产）
 *   → 用户逐条审阅：存为假设卡（写 Vault，assumption + to_verify，进收件箱待验证队列）
 *                或 忽略（仅从知识区移除，Vault 无痕迹）
 *   同一草稿同一维度不重复入区；「已存过卡」的指纹不重复建卡。
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
    _listeners: new Set(),
    getDraft() { return composer._draft },
    write(v) {
      composer._draft = String(v ?? '')
      for (const cb of composer._listeners) cb(composer._draft)
    },
    onChange(cb) { composer._listeners.add(cb); return () => composer._listeners.delete(cb) },
    getSelection: () => null,
  }
  const methodProvider = new PromptKit.StaticMethodProvider({ storagePrefix: 'knowledge-test.' })
  const assetProvider = {
    _items: [],
    list: async () => assetProvider._items,
    async save(obj) { const item = { id: 'asset-' + (assetProvider._items.length + 1), ...obj }; assetProvider._items.push(item); return item },
    onChange: () => () => {},
  }
  return { composer, methodProvider, assetProvider }
}

/** 语义增强桩：返回固定的五维诊断 + 改写稿，记录调用。 */
function stubEnhancer() {
  const enhancer = {
    calls: [],
    get loading() { return false },
    async enhance({ draft }) {
      enhancer.calls.push(draft)
      return {
        prompt: `【改写】${draft}`,
        model: 'test-model',
        diagnosis: {
          concept_clarity: '「优化」未定义',
          hidden_premise: '默认了日活十万',
          falsifiability: '「体验更好」不可判定',
          actionability: '产出一份改造方案',
          context_fit: '与上下文无冲突',
        },
      }
    },
    cancel() {},
  }
  return enhancer
}

const tick = (ms = 60) => new Promise(r => setTimeout(r, ms))

async function mountKit(W, PromptKit, providers, enhancer) {
  const container = W.document.createElement('div')
  container.className = 'test-root'
  W.document.body.appendChild(container)
  const root = createRoot(container)
  root.render(React.createElement(PromptKit.QuickEnhancer, {
    methodProvider: providers.methodProvider,
    assetProvider: providers.assetProvider,
    composer: providers.composer,
    enhancer,
    storagePrefix: 'knowledge-test.',
  }))
  await tick()
  return { root, container }
}

const vaultVisible = container => !!container.querySelector('aside[aria-label="灵感库"]')
const findBtn = (container, pattern, scope) => [...(scope || container).querySelectorAll('button')].find(b => pattern.test(b.textContent))

test('知识区：语义增强后认识缺口自动入区，Vault 无写入（暂存≠存卡）', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  const enhancer = stubEnhancer()
  const { root, container } = await mountKit(W, PromptKit, providers, enhancer)
  providers.composer.write('帮我优化登录，用户总忘记密码')
  await tick()
  // FAB 打开主面板 → 点「应用增强到消息框」
  container.querySelector('.pk-fab').dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 默认轻量档（零 Token）；语义增强需切到「语义 · 模型」
  const semanticBtn = findBtn(container, /语义 · 模型/)
  assert.ok(semanticBtn, '注入 enhancer 后应有语义档切换')
  semanticBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  const applyBtn = findBtn(container, /应用增强到消息框/)
  assert.ok(applyBtn, '应出现增强主按钮')
  applyBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 入区：诊断卡显示知识区入口；Vault 未被写入
  assert.equal(providers.assetProvider._items.length, 0, '暂存阶段不得写入 Vault')
  assert.ok(findBtn(container, /查看知识区/), '诊断卡下应有「查看知识区」入口')
  // 诊断卡区显示待审阅提示（1 条 hidden_premise + 1 条 falsifiability = 2 条）
  assert.match(container.textContent, /知识区有 2 条诊断发现待审阅/, '应显示待审阅计数')
  root.unmount()
  dom.window.close()
})

test('知识区：用户主动「存为假设卡」写 Vault（assumption+to_verify）并从暂存移除', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  const enhancer = stubEnhancer()
  const { root, container } = await mountKit(W, PromptKit, providers, enhancer)
  providers.composer.write('帮我优化登录，用户总忘记密码')
  container.querySelector('.pk-fab').dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 默认轻量档（零 Token）；语义增强需切到「语义 · 模型」
  const semanticBtn = findBtn(container, /语义 · 模型/)
  assert.ok(semanticBtn, '注入 enhancer 后应有语义档切换')
  semanticBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  findBtn(container, /应用增强到消息框/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 打开知识区 tab
  findBtn(container, /查看知识区/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  assert.ok(vaultVisible(container), '应打开灵感库抽屉')
  const promoteBtn = findBtn(container, /存为假设卡/)
  assert.ok(promoteBtn, '知识区条目应有「存为假设卡」按钮')
  promoteBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // Vault 写入：assumption 类型 + to_verify 状态 + provenance.fingerprint
  assert.equal(providers.assetProvider._items.length, 1, '主动存卡后才写 Vault')
  const card = providers.assetProvider._items[0]
  assert.equal(card.thinkingKind, 'assumption')
  assert.equal(card.epistemicStatus, 'to_verify')
  assert.match(card.provenance?.kind, /diagnosis/)
  assert.ok(card.provenance?.fingerprint, '应带查重指纹')
  assert.match(card.provenance?.fingerprint, /^hidden_premise:|falsifiability:/, '指纹应为 维度:草稿 格式')
  // 该条从知识区移除：剩余待审阅计数减 1（localStorage 中为 1 条）
  const stored = JSON.parse(W.localStorage.getItem('knowledge-test.quick-action.knowledge-inbox.v1') || '[]')
  assert.equal(stored.length, 1, '存卡后该条应从知识区移除')
  root.unmount()
  dom.window.close()
})

test('知识区：「忽略」仅从暂存移除，Vault 无痕迹', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  const enhancer = stubEnhancer()
  const { root, container } = await mountKit(W, PromptKit, providers, enhancer)
  providers.composer.write('帮我优化登录，用户总忘记密码')
  container.querySelector('.pk-fab').dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 默认轻量档（零 Token）；语义增强需切到「语义 · 模型」
  const semanticBtn = findBtn(container, /语义 · 模型/)
  assert.ok(semanticBtn, '注入 enhancer 后应有语义档切换')
  semanticBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  findBtn(container, /应用增强到消息框/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  findBtn(container, /查看知识区/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  const dismissBtn = findBtn(container, /^忽略$/)
  assert.ok(dismissBtn, '知识区条目应有「忽略」按钮')
  dismissBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  assert.equal(providers.assetProvider._items.length, 0, '忽略不写 Vault')
  const stored = JSON.parse(W.localStorage.getItem('knowledge-test.quick-action.knowledge-inbox.v1') || '[]')
  assert.equal(stored.length, 1, '仅被忽略的那条移除')
  root.unmount()
  dom.window.close()
})

test('知识区：同一草稿重复增强不重复入区（指纹查重）', async () => {
  const dom = setupDom()
  const W = dom.window
  const PromptKit = loadEmbed(W)
  const providers = makeProviders(PromptKit)
  const enhancer = stubEnhancer()
  const { root, container } = await mountKit(W, PromptKit, providers, enhancer)
  providers.composer.write('帮我优化登录，用户总忘记密码')
  container.querySelector('.pk-fab').dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 默认轻量档（零 Token）；语义增强需切到「语义 · 模型」
  const semanticBtn = findBtn(container, /语义 · 模型/)
  assert.ok(semanticBtn, '注入 enhancer 后应有语义档切换')
  semanticBtn.dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  findBtn(container, /应用增强到消息框/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  // 第一次增强后草稿已被改写稿替换；写回同一原稿再增强，才是「同一草稿重复增强」
  providers.composer.write('帮我优化登录，用户总忘记密码')
  await tick()
  findBtn(container, /应用增强到消息框/).dispatchEvent(new W.MouseEvent('click', { bubbles: true }))
  await tick()
  const stored = JSON.parse(W.localStorage.getItem('knowledge-test.quick-action.knowledge-inbox.v1') || '[]')
  assert.equal(stored.length, 2, '同一草稿第二次增强不得再入区（仍是 2 条）')
  root.unmount()
  dom.window.close()
})
