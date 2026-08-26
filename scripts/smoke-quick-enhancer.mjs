import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const store = new Map()
const React = {
  createElement: () => ({}),
  useState: v => [typeof v === 'function' ? v() : v, () => {}],
  useEffect: () => {},
  useRef: v => ({ current: v }),
  useCallback: fn => fn,
  useMemo: fn => fn(),
}
const sandbox = {
  React,
  window: {
    innerWidth: 1024,
    innerHeight: 800,
    localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) },
  },
  document: { querySelector: () => null, addEventListener: () => {}, removeEventListener: () => {} },
  fetch: () => Promise.reject(new Error('no fetch')),
  AbortController,
  console,
}

const code = readFileSync('ui/embed.js', 'utf8')
const PromptKit = vm.runInNewContext(`${code}\n;PromptKit`, sandbox)

const provider = new PromptKit.StaticMethodProvider()
const composer = {
  getDraft: () => '为周报写一段开场，语气正式但不生硬',
  write: () => {},
  onChange: () => () => {},
  getSelection: () => null,
  replaceSelection: () => {},
}
const props = { methodProvider: provider, composer, enhancer: null, messages: [], searchMemory: null }

// 直接执行组件函数体（触发所有 const 求值，含 enhanceBody 引用 wide、diffPreview 引用 enhancementPlan）
const el = PromptKit.QuickEnhancer(props)
console.log('RENDER OK — 组件函数体完整执行，无 TDZ/ReferenceError')
console.log('返回元素类型:', typeof el === 'object' ? 'object' : typeof el)
