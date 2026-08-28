#!/usr/bin/env node
/**
 * dsh-promptkit 浏览器端构建器（零依赖）。
 *
 * 共用策略：把 src/ 下的 ESM 文件剥掉 import/export 语法后按依赖顺序拼接。
 * 产物两种：
 *
 *   ui/client.js   独立 DSH 插件的浏览器视图（lazy-CJS 工厂闭包 + glue 装配）
 *   ui/embed.js    标准嵌入产物（Embed Protocol v1，见 docs/EMBED.md）
 *
 * Embed Protocol v1 要点：
 *   - 形态：const PromptKit = (React => { ...; return { ... } })(React)
 *   - 全部内部符号私有化于 IIFE，宿主闭包零污染、零同名冲突
 *   - 唯一前提：宿主闭包提供 React（DSH 插件工厂的标准符号）
 *   - 宿主消费方式：把 embed.js 拼进自己的 client.js，经 PromptKit.* 命名空间取用
 *   - dsh-promptkit 不感知任何宿主——宿主侧自持集成脚本与 adapter
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function katexRuntime(includeKatex) {
  if (!includeKatex) return ''
  const js = readFileSync(resolve(ROOT, 'node_modules/katex/dist/katex.min.js'), 'utf8')
  // CSS 的字体 URL 在宿主中可能不可解析，但 MathML 与系统数学字体仍可正确回退显示。
  const css = readFileSync(resolve(ROOT, 'node_modules/katex/dist/katex.min.css'), 'utf8')
  return `${js}\n;if (typeof document !== 'undefined' && document.getElementById && document.createElement && document.head && !document.getElementById('pk-katex-css')) { const style = document.createElement('style'); style.id = 'pk-katex-css'; style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style) }\n`
}

/** 剥离 ESM 模块语法：删 import 行、去 export 前缀、删 re-export 行。 */
function strip(code) {
  return code
    .split('\n')
    .filter(line => !/^\s*import\s.+from\s|^import\s+['"]/.test(line))
    .map(line => {
      if (/^\s*export\s*\{.*\}\s*$/.test(line)) return ''
      return line
        .replace(/^(\s*)export\s+const\s/, '$1const ')
        .replace(/^(\s*)export\s+function\s/, '$1function ')
        .replace(/^(\s*)export\s+class\s/, '$1class ')
        .replace(/^(\s*)export\s+let\s/, '$1let ')
        .replace(/^(\s*)export\s+default\s/, '$1')
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function stripBuiltinJs(code, jsonData) {
  // 先走标准 strip（去掉 import，export → const/function），再把 JSON 加载逻辑替换为内联常量
  const stripped = strip(code)
  const jsonStr = JSON.stringify(jsonData)
  return stripped.replace(
    /let _builtin[\s\S]*?const BUILTIN_METHODS = await loadBuiltinMethods\(\)/,
    `const _builtin = ${jsonStr};\nasync function loadBuiltinMethods() { return _builtin }\nconst BUILTIN_METHODS = _builtin`
  )
}

const SEP = comment => `\n/* ================= ${comment} ================= */\n`

/** 按序读取并 strip 一组源文件，返回拼接后的代码（不缩进）。 */
function concat(files, { customStrip = {} = {} } = {}) {
  let out = ''
  for (const [file, comment] of files) {
    const raw = readFileSync(resolve(ROOT, file), 'utf8')
    const stripFn = customStrip[file] || strip
    out += SEP(comment) + stripFn(raw).trim() + '\n'
  }
  return out
}

/** embed 与 standalone 共用的模块清单（不含 glue / 不含缩进）。 */
const MODULES = [
  ['src/ui/foundation.js', 'dsh-promptkit foundation（C / GlobalStyle / Icon / S / workbenchStyle，pk-* 视觉命名空间）'],
  ['src/lib/utils.js', 'dsh-promptkit utils（纯函数 + 分类链 + DSH 快照转换）'],
  ['src/core/method-provider.js', 'dsh-promptkit core: MethodProvider'],
  ['src/core/asset-provider.js', 'dsh-promptkit core: AssetProvider'],
  ['src/core/composer.js', 'dsh-promptkit core: Composer / withPrefix'],
  ['src/core/enhancer.js', 'dsh-promptkit core: Enhancer'],
  ['src/methods/builtin.js', 'dsh-promptkit 内置方法库（12 个完整 Markdown 方法，构建时内联 JSON）'],
  ['src/adapters/static-method-provider.js', 'dsh-promptkit adapter: StaticMethodProvider'],
  ['src/adapters/static-asset-provider.js', 'dsh-promptkit adapter: StaticAssetProvider'],
  ['src/adapters/textarea-composer.js', 'dsh-promptkit adapter: TextareaComposer'],
  ['src/adapters/openai-enhancer.js', 'dsh-promptkit adapter: OpenAIEnhancer'],
  ['src/ui/studio.js', 'dsh-promptkit 组件: PromptStudio（方法工坊）'],
  ['src/ui/quick-enhancer-vault-state.js', 'dsh-promptkit QuickEnhancer: Vault 状态容器'],
  ['src/ui/use-floating-launcher.js', 'dsh-promptkit QuickEnhancer: 浮动入口拖动'],
  ['src/ui/nudge-metrics.js', 'dsh-promptkit NudgeMetrics：行为助推埋点本地消费端 + 宿主级开关'],
  ['src/ui/quick-enhancer.js', 'dsh-promptkit 组件: ConversationQuickAction（快捷助手）'],
]

// ---------- 产物一：独立 DSH 浏览器视图 ui/client.js ----------
function buildStandalone({ includeKatex = true, output = 'ui/client.js' } = {}) {
  const builtinJson = JSON.parse(readFileSync(resolve(ROOT, 'methods/builtin.json'), 'utf8'))
  const katex = katexRuntime(includeKatex)
  const body = ((katex ? SEP('KaTeX runtime（内联，离线公式渲染）') + katex : '') + concat(MODULES, {
    customStrip: {
      'src/methods/builtin.js': (code) => stripBuiltinJs(code, builtinJson),
    }
  }))
    .split('\n').map(l => (l ? '      ' + l : l)).join('\n')
  const glue = strip(readFileSync(resolve(ROOT, 'dsh/standalone-glue.js'), 'utf8')).trim()
    .split('\n').map(l => (l ? '      ' + l : l)).join('\n')
  const out = `/* eslint-disable */
/* dsh-promptkit 独立 DSH 浏览器视图 — 本文件由 scripts/build-client.mjs 生成，勿手改。 */
window.__ModuleLoader__.load({
  // DSH 0.1.2+ 仅扫描包根 Loader 行，模块图 ID 使用根包名。
  id: 'dsh-promptkit',
  factory: require => {
    const React = require('react')
${body}
${SEP('独立插件 glue：DSH 插槽注册 + 默认 adapter 装配')}${glue}
    return { inject: ['slots', 'sessions'], apply: promptkitApply }
  },
})
`
  writeFileSync(resolve(ROOT, output), out)
  console.log(`[standalone] ${output} 生成完毕（${out.split('\n').length} 行）`)
}

// ---------- 产物二：标准嵌入产物 ui/embed.js（Embed Protocol v1） ----------
function buildEmbed() {
  const builtinJson = JSON.parse(readFileSync(resolve(ROOT, 'methods/builtin.json'), 'utf8'))
  const body = SEP('KaTeX runtime（内联，离线公式渲染）') + katexRuntime(true) + concat(MODULES, {
    customStrip: {
      'src/methods/builtin.js': (code) => stripBuiltinJs(code, builtinJson),
    }
  })
  const out = `/* eslint-disable */
/* dsh-promptkit 标准嵌入产物（Embed Protocol v1）— 由 scripts/build-client.mjs 生成，勿手改。 */
/* 契约：宿主闭包提供 React；全部符号私有化，仅暴露 PromptKit 命名空间。集成指南见 docs/EMBED.md。 */
const PromptKit = (React => {
${body}
  return {
    version: '1',
    // 组件（props 契约见 docs/EMBED.md）
    PromptStudio,            // 方法工坊（conversation.view 视图）
    QuickEnhancer: ConversationQuickAction,  // 对话快捷增强器（conversation.input.right 挂载）
    // 数据源 adapter
    StaticMethodProvider, StaticAssetProvider,
    // 基类与通用 adapter
    MethodProvider, AssetProvider, Composer, Enhancer, TextareaComposer, OpenAIEnhancer,
    // 行为助推：宿主级开关 + 本地埋点消费端（详见 src/ui/nudge-metrics.js）
    nudges: {
      isEnabled: () => isNudgeKitEnabled(),
      setEnabled: on => setNudgeKitEnabled(!!on),
      mount: mountNudgeMetrics,
      summary: () => (typeof window !== 'undefined' && window.__promptkitNudgeMetrics ? window.__promptkitNudgeMetrics.getSummary() : null),
      reset: () => { if (typeof window !== 'undefined' && window.__promptkitNudgeMetrics) window.__promptkitNudgeMetrics.reset() },
    },
    // 宿主 glue 可复用的纯函数与推荐信号表
    utils: {
      safeText, conversationDraft, conversationMessages, list, obj, fileMentions,
      cleanSummary, cleanContext, cleanConversationText, selectedConversationDraft,
      methodChoice, detectLanguage, TEMPLATE_LABELS,
      buildSignatures, lightTemplate, classify, planPromptEnhancement, recommendMethods,
    },
    // 内置方法数据（宿主自建 provider 时可直接消费）
    builtinMethods: BUILTIN_METHODS,
  }
})(React)
`
  writeFileSync(resolve(ROOT, 'ui/embed.js'), out)
  console.log(`[embed] ui/embed.js 生成完毕（${out.split('\n').length} 行）`)
}

const args = process.argv.slice(2)
if (args[0] === '--embed') {
  buildEmbed()
} else if (args[0] === '--lite') {
  buildStandalone({ includeKatex: false, output: 'ui/client-lite.js' })
} else {
  buildStandalone()
  buildEmbed()
}
