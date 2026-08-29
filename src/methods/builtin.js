// 完整方法库：从 methods/ 目录解析的 21 个 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
// 在 DSH 插件形态中，build-client.mjs 会把 builtin.json 内联为常量注入（stripBuiltinJs），
// 此时本文件的运行时加载分支不会执行。

let _builtin

export async function loadBuiltinMethods() {
  if (_builtin) return _builtin
  // 浏览器：fetch 相对构建产物，规避各浏览器 JSON import assertions 的兼容差异。
  if (typeof window !== 'undefined') {
    const res = await fetch(new URL('../../methods/builtin.json', import.meta.url))
    if (!res.ok) throw new Error(`无法读取内置方法库（${res.status}）`)
    _builtin = await res.json()
    return _builtin
  }
  // Node：import attributes 语法在 Node 22-25 用 assert、Node ≥25 用 with；
  // 两种都试，都失败（更老/更受限的 loader）再退回 file URL 同步读。
  try {
    const mod = await import('../../methods/builtin.json', { with: { type: 'json' } })
    _builtin = mod.default || mod
    return _builtin
  } catch {}
  try {
    const mod = await import('../../methods/builtin.json', { assert: { type: 'json' } })
    _builtin = mod.default || mod
    return _builtin
  } catch {}
  // 终极 fallback：走 node:fs，保证任何 loader 环境都能拿到数据而非抛「Failed to parse URL」。
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const path = fileURLToPath(new URL('../../methods/builtin.json', import.meta.url))
  _builtin = JSON.parse(readFileSync(path, 'utf8'))
  return _builtin
}

export const BUILTIN_METHODS = await loadBuiltinMethods()
