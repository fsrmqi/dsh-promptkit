#!/usr/bin/env node
/**
 * dsh-promptkit 浏览器端构建器（零依赖）。
 *
 * 两种产物共用同一策略：把 src/ 下的 ESM 文件剥掉 import/export 语法后，
 * 按依赖顺序拼接进 DSH 的 lazy-CJS 工厂闭包（window.__ModuleLoader__.load）。
 * React 由宿主 require 提供，保持唯一外部依赖。
 *
 * 用法：
 *   node scripts/build-client.mjs                          生成 ui/client.js（独立 DSH 浏览器视图）
 *   node scripts/build-client.mjs --mc <mc-repo-path>       更新 MC 仓库 client.js 的标记块并同步部署
 *
 * 标记块语法（--mc 模式替换两者之间的内容）：
 *   /* ==== dsh-promptkit:begin (GENERATED) ==== *​/
 *   ...
 *   /* ==== dsh-promptkit:end ==== *​/
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

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

const SEP = comment => `\n      /* ================= ${comment} ================= */\n`

function concat(files, { indent = '      ', banner = '' } = {}) {
  let out = banner
  for (const [file, comment] of files) {
    const code = strip(readFileSync(resolve(ROOT, file), 'utf8')).trim()
    const body = code.split('\n').map(l => (l ? indent + l : l)).join('\n')
    out += SEP(comment) + body + '\n'
  }
  return out
}

// ---------- 模式一：独立 DSH 浏览器视图 ui/client.js ----------
function buildStandalone() {
  const body = concat([
    ['src/ui/foundation.js', 'dsh-promptkit foundation（C / GlobalStyle / Icon / S / workbenchStyle）'],
    ['src/lib/utils.js', 'dsh-promptkit utils（纯函数 + 分类链 + DSH 快照转换）'],
    ['src/core/method-provider.js', 'dsh-promptkit core: MethodProvider'],
    ['src/core/composer.js', 'dsh-promptkit core: Composer / withPrefix'],
    ['src/core/enhancer.js', 'dsh-promptkit core: Enhancer'],
    ['src/methods/builtin.js', 'dsh-promptkit 内置方法库（10 个通用思考方法）'],
    ['src/adapters/static-method-provider.js', 'adapter: StaticMethodProvider'],
    ['src/adapters/textarea-composer.js', 'adapter: TextareaComposer'],
    ['src/adapters/openai-enhancer.js', 'adapter: OpenAIEnhancer'],
    ['src/ui/studio.js', '组件: PromptStudio（方法工坊）'],
    ['src/ui/quick-enhancer.js', '组件: QuickEnhancer（快捷助手）'],
    ['dsh/standalone-glue.js', '独立插件 glue：DSH 插槽注册 + 默认 adapter 装配'],
  ])
  const out = `/* eslint-disable */
/* dsh-promptkit 独立 DSH 浏览器视图 — 本文件由 scripts/build-client.mjs 生成，勿手改。 */
/* 源码：https://github.com/<you>/dsh-promptkit（MIT License） */
window.__ModuleLoader__.load({
  id: 'dsh-promptkit/ui',
  factory: require => {
    const React = require('react')
${body}
    return { inject: ['slots', 'sessions'], apply: promptkitApply }
  },
})
`
  writeFileSync(resolve(ROOT, 'ui/client.js'), out)
  console.log(`[standalone] ui/client.js 生成完毕（${out.split('\n').length} 行）`)
}

// ---------- 模式二：更新 MC 仓库 client.js 的标记块 ----------
const BEGIN = '/* ==== dsh-promptkit:begin (GENERATED — 由 dsh-promptkit/scripts/build-client.mjs 生成，勿手改) ==== */'
const END = '/* ==== dsh-promptkit:end ==== */'

function buildMc(mcRepo) {
  const mcClient = resolve(mcRepo, 'ui/client.js')
  const source = readFileSync(mcClient, 'utf8')
  const adapters = readFileSync(resolve(mcRepo, 'ui/promptkit-adapters.js'), 'utf8')

  const block =
    `      ${BEGIN}\n` +
    concat([
      ['src/core/composer.js', 'dsh-promptkit core: Composer / withPrefix（组件依赖）'],
      ['src/ui/studio.js', 'dsh-promptkit 组件: PromptStudio（方法工坊，唯一代码源）'],
      ['src/ui/quick-enhancer.js', 'dsh-promptkit 组件: QuickEnhancer（快捷助手，唯一代码源）'],
    ]) +
    SEP('Memory Center 私有运行时 → dsh-promptkit 三接口桥接（唯一允许引用 fetchView 的地方）') +
    strip(adapters).trim().split('\n').map(l => (l ? '      ' + l : l)).join('\n') + '\n' +
    `      ${END}\n`

  let next
  const esc = s => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
  if (source.includes(BEGIN)) {
    const re = new RegExp(esc(BEGIN) + '[\\s\\S]*?' + esc(END))
    next = source.replace(re, block.trim())
  } else {
    // 首次切换：定位原两组件定义区（PromptStudio 起 → viewEntry 前）整段替换
    const start = source.indexOf('    function PromptStudio(')
    const endMark = '    const viewEntry'
    const end = source.indexOf(endMark)
    if (start < 0 || end < 0 || end <= start) throw new Error('MC client.js 结构与预期不符（未找到组件区边界）')
    next = source.slice(0, start) + block.trim() + '\n\n' + source.slice(end)
  }
  writeFileSync(mcClient, next)
  // 同步部署到 DSH 实际加载的浏览器视图包
  copyFileSync(mcClient, resolve(mcRepo, 'node_modules/memory-center-dsh-plugin-ui/client.js'))
  console.log(`[mc] ${mcClient} 标记块已更新并同步部署（${next.split('\n').length} 行）`)
}

const args = process.argv.slice(2)
if (args[0] === '--mc') {
  buildMc(resolve(args[1] || '.'))
} else {
  buildStandalone()
}
