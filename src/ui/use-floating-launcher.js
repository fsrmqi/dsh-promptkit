import React from 'react'

/** 计算面板左边界：面板尺寸而非按钮尺寸才是可见性约束。 */
export function floatingPanelLeft(buttonX, viewportWidth, panelWidth, gutter = 16) {
  const maxLeft = Math.max(gutter, viewportWidth - panelWidth - gutter)
  return Math.max(gutter, Math.min(maxLeft, buttonX - panelWidth / 2))
}

/** 高频拖动状态保存在 ref，仅按动画帧提交 React 更新，并在抬手时持久化。 */
export function useFloatingLauncher(storageKey) {
  const [position, setPosition] = React.useState(() => {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
      if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value
    } catch {}
    return { x: Math.max(24, window.innerWidth - 86), y: Math.max(96, window.innerHeight - 158) }
  })
  const positionRef = React.useRef(position)
  const [viewport, setViewport] = React.useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const drag = React.useRef(null)
  const suppressClick = React.useRef(false)
  const frame = React.useRef(0)

  React.useEffect(() => { positionRef.current = position }, [position])
  React.useEffect(() => {
    const commit = () => {
      frame.current = 0
      setPosition({ ...positionRef.current })
    }
    const move = event => {
      if (!drag.current) return
      positionRef.current = {
        x: Math.max(16, Math.min(window.innerWidth - 62, event.clientX - drag.current.dx)),
        y: Math.max(58, Math.min(window.innerHeight - 62, event.clientY - drag.current.dy)),
      }
      drag.current.moved = true
      if (!frame.current) frame.current = window.requestAnimationFrame(commit)
    }
    const up = () => {
      if (!drag.current) return
      suppressClick.current = drag.current.moved
      if (frame.current) { window.cancelAnimationFrame(frame.current); frame.current = 0 }
      setPosition({ ...positionRef.current })
      try { window.localStorage.setItem(storageKey, JSON.stringify(positionRef.current)) } catch {}
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [storageKey])
  React.useEffect(() => {
    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setViewport({ width, height })
      const next = {
        x: Math.max(16, Math.min(width - 62, positionRef.current.x)),
        y: Math.max(58, Math.min(height - 62, positionRef.current.y)),
      }
      if (next.x !== positionRef.current.x || next.y !== positionRef.current.y) {
        positionRef.current = next
        setPosition(next)
        try { window.localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
      }
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [storageKey])

  const onPointerDown = React.useCallback(event => {
    suppressClick.current = false
    drag.current = { dx: event.clientX - positionRef.current.x, dy: event.clientY - positionRef.current.y, moved: false }
  }, [])
  const consumeSuppressedClick = React.useCallback(() => {
    if (!suppressClick.current) return false
    suppressClick.current = false
    return true
  }, [])
  return { position, viewport, onPointerDown, consumeSuppressedClick }
}
