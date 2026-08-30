import React from 'react'
import { list } from '../../lib/utils.js'

// 查询防抖、过期响应隔离、键盘导航与插入由同一 hook 管理。
export function useFileCompletion({ draft, searchFiles, composer, setNotice }) {
  const [fileMenu, setFileMenu] = React.useState(null)
  const fileMenuRequestId = React.useRef(0)
  // ── @ 文件引用补全：光标前的 @word 触发；检索经 searchFiles（宿主注入）──
  const detectFileQuery = text => {
    // 取最后一个非空白字符段：以 @ 开头则视为文件引用输入中（排除粘贴保护标记 \u2060）。
    const tail = String(text || '').match(/(^|\s)@([^\s@]*)$/)
    return tail && !tail[2].includes('\u2060') ? tail[2] : null
  }
  React.useEffect(() => {
    if (!searchFiles) { setFileMenu(null); return undefined }
    const query = detectFileQuery(draft)
    if (query == null) { setFileMenu(null); return undefined }
    const requestId = ++fileMenuRequestId.current
    setFileMenu(prev => ({ query, files: prev?.query === query ? prev.files : [], status: 'loading', activeIndex: 0 }))
    let alive = true
    const timer = setTimeout(() => {
      Promise.resolve().then(() => searchFiles(query)).then(result => {
        const files = Array.isArray(result) ? result : result?.files
        if (!alive || fileMenuRequestId.current !== requestId) return
        if (!Array.isArray(files)) setFileMenu(null) // 宿主未提供文件服务
        else setFileMenu({ query, files: list(files), status: files.length ? 'ready' : 'empty', activeIndex: 0, truncated: Boolean(result?.truncated) })
      }).catch(() => { if (alive && fileMenuRequestId.current === requestId) setFileMenu(null) })
    }, 140) // 防抖：避免逐键打 @ 时高频请求
    return () => { alive = false; clearTimeout(timer) }
  }, [draft, searchFiles])
  const insertFileMention = path => {
    const current = String(draft || '')
    const next = current.replace(/(^|\s)@[^\s@]*$/, ((match, prefix) => `${prefix}@${path} `))
    composer?.write(next)
    setFileMenu(null)
    setNotice(`已插入 @${path}；发送后由 DSH @file 读取该文件。`)
  }
  // @ 菜单键盘导航：window 捕获阶段吞键，防止 DSH 把 Enter 解释为发送。
  React.useEffect(() => {
    if (!fileMenu) return undefined
    const onKeydown = event => {
      if (event.isComposing || event.keyCode === 229) return
      const consume = () => { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.() }
      if (event.key === 'Escape') { consume(); setFileMenu(null); return }
      if (event.key === 'ArrowDown') { consume(); setFileMenu(menu => menu ? { ...menu, activeIndex: Math.max(0, Math.min(menu.files.length - 1, menu.activeIndex + 1)) } : menu); return }
      if (event.key === 'ArrowUp') { consume(); setFileMenu(menu => menu ? { ...menu, activeIndex: Math.max(0, menu.activeIndex - 1) } : menu); return }
      if (event.key === 'Enter' && fileMenu.files[fileMenu.activeIndex]) { consume(); insertFileMention(fileMenu.files[fileMenu.activeIndex]) }
    }
    window.addEventListener('keydown', onKeydown, true)
    return () => window.removeEventListener('keydown', onKeydown, true)
  }, [fileMenu, composer, draft])
  return { fileMenu, setFileMenu, insertFileMention }
}
