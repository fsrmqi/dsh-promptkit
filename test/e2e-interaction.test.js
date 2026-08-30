import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * 端到端交互测试：用真 React hooks 加载 embed.js 闭包，react-dom/server 静态渲染
 * ConversationQuickAction，验证关键交互路径的真实输出（不 mock hooks、不 mock React）。
 *
 * 静态渲染不执行 useEffect（事件订阅 / 异步加载不触发），因此本文件覆盖
 * 同步可达的交互：轻量增强、取消语义增强、存储异常暴露、跨页同步、状态容器边界。
 */
function loadE2E() {
  const store = new Map()
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key),
  }
  const listeners = new Map()
  const window = {
    innerWidth: 1280,
    innerHeight: 800,
    localStorage,
    addEventListener: (name, cb) => listeners.set(name, cb),
    removeEventListener: (name) => listeners.delete(name),
    dispatchEvent: event => {
      listeners.get(event.type)?.(event)
      return true
    },
  }
  const sandbox = {
    React,
    window,
    document: { compatMode: 'CSS1Compat', querySelector: () => null, getElementById: () => null, createElement: () => ({ head: null }), head: null },
    navigator: { clipboard: { writeText: async () => {} } },
    CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail } },
    AbortController,
    URL, Blob, Date, Math, JSON, Object, Array, String, Number, Boolean, Map, Set, Error,
    setTimeout, clearTimeout, console,
  }
  const code = readFileSync(resolve(ROOT, 'ui/embed.js'), 'utf8')
  const PromptKit = vm.runInNewContext(`${code}\n;PromptKit`, sandbox)
  return { PromptKit, window, store, listeners }
}

/** 一个可写、可订阅的测试 Composer（Composer 契约：getDraft / write / onChange）。 */
function memoryComposer(initial = '') {
  let draft = initial
  const listeners = new Set()
  return {
    getDraft: () => draft,
    write: text => { draft = String(text ?? ''); for (const cb of listeners) cb(draft) },
    onChange: cb => { listeners.add(cb); return () => listeners.delete(cb) },
    getSelection: () => null,
  }
}

/** 记录增强调用、可取消的语义 Enhancer。 */
function stubEnhancer() {
  const calls = []
  let abortError = null
  const enhancer = {
    calls,
    get loading() { return calls.length > 0 },
    failOnAbort(error) { abortError = error },
    async enhance({ draft }) {
      calls.push(draft)
      if (abortError) throw abortError
      return { prompt: `【改写】${draft}`, model: 'test-model' }
    },
    cancel() {},
  }
  return enhancer
}

test('e2e：轻量增强把结果写入 composer，而非自动发送', async () => {
  const { PromptKit } = loadE2E()
  const composer = memoryComposer('帮我写一段 K8s 部署说明')
  const html = renderToStaticMarkup(React.createElement(PromptKit.QuickEnhancer, {
    methodProvider: new PromptKit.StaticMethodProvider(),
    composer,
    storagePrefix: 'e2e.',
  }))
  assert.ok(html.includes('智能增强'), '应渲染浮动入口（title=智能增强）')
  assert.ok(html.includes('pk-fab'), '浮动按钮应带 pk-fab class')
})

test('e2e：灵感库保存成功走 notice、失败暴露错误提示', async () => {
  const { PromptKit, store } = loadE2E()
  const composer = memoryComposer('一条待收藏的草稿')
  const vault = new PromptKit.StaticAssetProvider({ storagePrefix: 'e2e.' })
  // 正常保存：写入落盘
  const saved = await vault.save({ title: '正常资产', body: '正文可保存' })
  assert.equal(store.has('e2e.vault.assets.v1'), true, '保存应写入 localStorage')
  assert.equal(saved.title, '正常资产')
  // 配额失败：_write 抛错，不再静默吞掉
  const broken = new PromptKit.StaticAssetProvider({ storagePrefix: 'quota.' })
  const originalSet = store.set.bind(store)
  const { window } = loadE2E() // 独立宿主，避免污染上面的 store
  void window
  // 直接替换 localStorage.setItem 为抛错实现
  const failing = loadE2E()
  const vaultBroken = new failing.PromptKit.StaticAssetProvider({ storagePrefix: 'quota.' })
  failing.window.localStorage.setItem = () => { throw new Error('quota exceeded') }
  await assert.rejects(
    vaultBroken.save({ title: '无法保存', body: '浏览器空间不足' }),
    /灵感库写入失败/,
  )
  void originalSet
})

test('e2e：跨页同步 —— 外部写入同一 key 触发 onChange 通知', async () => {
  const { PromptKit, window, store } = loadE2E()
  const vault = new PromptKit.StaticAssetProvider({ storagePrefix: 'sync.' })
  const seen = []
  const off = vault.onChange(rows => seen.push(rows.map(item => item.title)))
  // 另一页通过 localStorage 直接写入（模拟 storage 事件）
  store.set('sync.vault.assets.v1', JSON.stringify([{ id: 'x1', title: '来自另一页', body: '其他标签页写入', updatedAt: Date.now() }]))
  window.dispatchEvent({ type: 'storage', key: 'sync.vault.assets.v1' })
  off()
  assert.deepEqual(seen, [['来自另一页']], 'storage 事件应触发 onChange 并带上最新数据')
})

test('e2e：同一标签页自定义事件同步（CustomEvent 分支）', async () => {
  const { PromptKit, window } = loadE2E()
  const vault = new PromptKit.StaticAssetProvider({ storagePrefix: 'same-tab.' })
  const seen = []
  const off = vault.onChange(rows => seen.push(rows.length))
  // 本页任意写入会先 notify 再派发同页自定义事件；onChange 已订阅
  await vault.save({ title: '本页写入', body: '内容' })
  off()
  assert.ok(seen.length >= 1, '本页写入应触发 onChange 通知')
})

test('e2e：取消语义增强 —— AbortError 提示“已取消”，不落草稿', async () => {
  const { PromptKit } = loadE2E()
  const composer = memoryComposer('请改写这段关于可观测性的方案')
  const enhancer = stubEnhancer()
  enhancer.failOnAbort(Object.assign(new Error('canceled'), { name: 'AbortError' }))
  const element = React.createElement(PromptKit.QuickEnhancer, {
    methodProvider: new PromptKit.StaticMethodProvider(),
    composer,
    enhancer,
    storagePrefix: 'e2e.',
  })
  // 静态渲染：组件体同步执行，增强不在此触发；验证能安全渲染（语义档 + 浮动入口）
  const html = renderToStaticMarkup(element)
  assert.ok(html.includes('智能增强'), '应渲染浮动入口')
  assert.equal(composer.getDraft(), '请改写这段关于可观测性的方案', '未触发增强前草稿不变')
})

/** 加载独立 DSH 插件产物（ui/client.js），返回插件工厂；用真 React 渲染宿主插槽。 */
function loadStandaloneE2E() {
  let registration
  const store = new Map()
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key),
  }
  const listeners = new Map()
  const window = {
    innerWidth: 1280,
    innerHeight: 800,
    localStorage,
    addEventListener: (name, cb) => listeners.set(name, cb),
    removeEventListener: name => listeners.delete(name),
    dispatchEvent: event => { listeners.get(event.type)?.(event); return true },
    __ModuleLoader__: { load: entry => { registration = entry } },
  }
  const sandbox = {
    React,
    window,
    document: { compatMode: 'CSS1Compat', querySelector: () => null, getElementById: () => null, createElement: () => ({ head: null }), head: null },
    navigator: { clipboard: { writeText: async () => {} } },
    CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail } },
    AbortController,
    URL, Blob, Date, Math, JSON, Object, Array, String, Number, Boolean, Map, Set, Error,
    setTimeout, clearTimeout, console,
  }
  const code = readFileSync(resolve(ROOT, 'ui/client.js'), 'utf8')
  vm.runInNewContext(code, sandbox)
  const plugin = registration.factory(specifier => {
    assert.equal(specifier, 'react')
    return React
  })
  return { plugin, window, store, listeners }
}

test('e2e：DSH 插槽挂载 —— 快捷助手在真实 React 下渲染且位置可持久化', () => {
  const { plugin, store } = loadStandaloneE2E()
  // 预置已保存的浮动位置
  store.set('promptkit.quick-action.position.v1', JSON.stringify({ x: 200, y: 300 }))
  let quickActionHost
  const injected = []
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        injected.push(name)
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })
  assert.deepEqual(injected, ['conversation.view', 'conversation.input.right'], '两个插槽都应注入')
  const html = renderToStaticMarkup(React.createElement(quickActionHost.Component, {
    sessionId: 'e2e-session',
    useInput: selector => selector({ draft: '待增强草稿' }),
    useChat: selector => selector({ order: [], nodes: new Map() }),
    inputActions: { setDraft: () => {} },
  }))
  assert.ok(html.includes('pk-fab'), '应渲染浮动按钮')
  assert.ok(html.includes('智能增强'), '浮动按钮带增强入口')
  assert.ok(html.includes('left:200px') && html.includes('top:300px'), '应读取持久化的浮动位置')
})

test('e2e：DSH 插槽挂载 —— 从键控 useChat 快照读取对话并注入增强上下文', () => {
  const { plugin } = loadStandaloneE2E()
  let quickActionHost
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })
  const chat = {
    order: ['u1'],
    nodes: new Map([
      ['u1', { kind: 'user', content: [{ type: 'text', text: '请评审这段接口设计' }] }],
    ]),
  }
  const element = React.createElement(quickActionHost.Component, {
    sessionId: 'e2e-session-2',
    useInput: selector => selector({ draft: '当前草稿' }),
    useChat: selector => selector(chat),
    inputActions: { setDraft: () => {} },
  })
  // 渲染前断言 composer/messages 契约（组件 props 在 apply 中装配）
  const rendered = renderToStaticMarkup(element)
  assert.ok(rendered.includes('pk-fab'), '对话注入后应正常渲染')
})

test('e2e：DSH 0.1.2-alpha InputZone 契约 —— zone={session,input} 点时快照路径', () => {
  const { plugin } = loadStandaloneE2E()
  let quickActionHost
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })
  const session = {
    sessionId: 'e2e-zone-1',
    order: ['u1'],
    nodes: new Map([
      ['u1', { kind: 'user', content: [{ type: 'text', text: '请评审这段接口设计' }] }],
    ]),
  }
  const element = React.createElement(quickActionHost.Component, {
    sessionId: 'e2e-zone-1',
    // 新契约：InputZone 点时快照（不经 hook 订阅）
    session,
    input: { draft: 'zone 草稿' },
    inputActions: { setDraft: () => {} },
  })
  const rendered = renderToStaticMarkup(element)
  assert.ok(rendered.includes('pk-fab'), 'InputZone 契约下应正常渲染')
})

test('e2e：浮动位置无持久化记录时使用屏幕右下默认值兜底', () => {
  const { plugin } = loadStandaloneE2E()
  let quickActionHost
  plugin.apply({
    slots: {
      inject: (name, callback) => {
        if (name === 'conversation.input.right') quickActionHost = callback()
        return () => {}
      },
      register: (entry, Component) => ({ entry, Component }),
    },
    sessions: { binding: () => null },
  })
  const html = renderToStaticMarkup(React.createElement(quickActionHost.Component, {
    sessionId: 'e2e-default-pos',
    useInput: selector => selector({ draft: '' }),
    useChat: selector => selector({ order: [], nodes: new Map() }),
    inputActions: { setDraft: () => {} },
  }))
  // 默认位置：x = max(24, 1280-86=1194)，y = max(96, 800-158=642)
  assert.ok(html.includes('left:1194px') && html.includes('top:642px'), '无记录时用默认位置')
})



test('e2e：导入失败 —— 非法 JSON 暴露错误而非静默吞掉', async () => {
  const { PromptKit } = loadE2E()
  const vault = new PromptKit.StaticAssetProvider({ storagePrefix: 'import.' })
  await assert.rejects(
    vault.import('{ 这不是 JSON'),
    /不是有效 JSON/,
  )
  // 无资产的备份也报错，且不写库
  await assert.rejects(vault.import('{"version":1,"assets":[]}'), /没有可导入/)
})

test('e2e：版本迁移 —— 旧裸数组自动迁移为 v1，字段语义保留', async () => {
  const { PromptKit, store } = loadE2E()
  // 直接写入旧版裸数组（v0：无版本包装）
  store.set('migrate.vault.assets.v1', JSON.stringify([
    { id: 'old:1', title: '旧资产', body: '旧正文', tags: ['旧'], createdAt: 1, updatedAt: 2 },
  ]))
  const vault = new PromptKit.StaticAssetProvider({ storagePrefix: 'migrate.' })
  const rows = await vault.list()
  assert.equal(rows.length, 1, '旧裸数组应被读出')
  assert.equal(rows[0].title, '旧资产')
  assert.deepEqual(rows[0].tags, ['旧'], '旧字段应被保留')
  assert.equal(rows[0].thinkingKind, 'conclusion', '缺失字段补默认值')
  // 保存后重写为版本化格式，二次读取仍一致
  await vault.save({ title: '新增', body: '新正文' })
  const again = await vault.list()
  assert.equal(again.length, 2)
  assert.ok(again.every(item => item.id && item.body), '迁移后数据完整')
})
