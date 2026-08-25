// 完整方法库：从 prompts/ 目录解析的 12 个 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
// 在 DSH 插件形态中，build-client.mjs 会把 builtin.json 内联为常量注入。

// 使用 top-level await 加载 JSON（Node 22 + 现代浏览器支持 import assertions）。
// 若环境不支持断言，fallback 到 fetch。
let _builtin

export async function loadBuiltinMethods() {
  if (_builtin) return _builtin
  try {
    // Node 22 / ESM 环境：import assert
    const mod = await import('../methods/builtin.json', { assert: { type: 'json' } })
    _builtin = mod.default || mod
    return _builtin
  } catch {
    // 浏览器 fallback：fetch 同目录 JSON
    const res = await fetch(new URL('../methods/builtin.json', import.meta.url))
    _builtin = await res.json()
    return _builtin
  }
}

export const BUILTIN_METHODS = await loadBuiltinMethods()
