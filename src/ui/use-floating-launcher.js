import React from 'react'

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

  const onPointerDown = React.useCallback(event => {
    suppressClick.current = false
    drag.current = { dx: event.clientX - positionRef.current.x, dy: event.clientY - positionRef.current.y, moved: false }
  }, [])
  const consumeSuppressedClick = React.useCallback(() => {
    if (!suppressClick.current) return false
    suppressClick.current = false
    return true
  }, [])
  return { position, onPointerDown, consumeSuppressedClick }
}
