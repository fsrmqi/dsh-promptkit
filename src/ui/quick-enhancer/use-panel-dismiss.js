import React from 'react'

// 管理宿主事件隔离与分层关闭；不承担 Vault 数据或增强业务。
export function usePanelDismiss({ open, vaultOpen, setOpen, setVaultOpen, rootRef, panelRef }) {
  // 抽屉与插件根已抬升到宿主浮层之上（zIndex 20001/20002），「关闭 ×」按钮必然露在最上层、始终可点，
  // 不再需要「被遮挡时自动左移」的运行时检测（此前那套 elementFromPoint 轮询既脆弱又拖性能）。
  const closeBtnRef = React.useRef(null)
  // 原生顶层突破宿主输入区的 stacking context，DOM 仍留在插件根内，
  // 不破坏 React 事件或「外部点击只关一层」判定。旧浏览器保留固定定位回退。
  React.useEffect(() => {
    const panel = panelRef.current
    if (!vaultOpen || !panel?.showPopover) return undefined
    panel.showPopover()
    return () => { if (panel.isConnected) panel.hidePopover() }
  }, [vaultOpen, panelRef])
  // DSH 宿主可能在某层 DOM 上 stopPropagation / 拦截 click/pointerdown，导致 React 合成 onClick 收不到。
  // 在 window 捕获阶段挂原生监听：
  //   1) 命中关闭按钮时交给按钮自身的原生手势隔离器处理；
  //   2) 抽屉打开时点在插件根（FAB/主面板/抽屉）之外 -> 关抽屉（按钮被物理遮挡时的第二条出路）。
  React.useEffect(() => {
    const close = (event) => {
      const btn = closeBtnRef.current
      if (btn && (event.target === btn || btn.contains(event.target))) {
        return
      }
      if (event.type === 'pointerdown' && vaultOpen) {
        const root = rootRef.current
        // rootRef 尚未挂载（理论不可能）或点击就在插件自身 UI 内 -> 不处理
        if (root && !root.contains(event.target)) setVaultOpen(false)
      }
    }
    window.addEventListener('click', close, { capture: true })
    window.addEventListener('pointerdown', close, { capture: true })
    return () => {
      window.removeEventListener('click', close, { capture: true })
      window.removeEventListener('pointerdown', close, { capture: true })
    }
  }, [vaultOpen])
  // 关闭按钮的整段手势必须在按钮节点消耗：pointerdown/pointerup/click 都不能冒泡到
  // DSH 的会话层。真正卸载抽屉延到 click 派发完的一帧后，避免 click 落到下层控件。
  React.useEffect(() => {
    if (!vaultOpen) return undefined
    const button = closeBtnRef.current
    if (!button) return undefined
    const consume = event => {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation?.()
    }
    const closeAfterGesture = event => {
      consume(event)
      const schedule = window.requestAnimationFrame || (callback => setTimeout(callback, 0))
      schedule(() => {
        // DSH 的外层捕获监听可能已在本次手势中把主面板标为关闭。
        // 关闭抽屉的语义必须保持主面板打开，因此在手势结束后显式恢复该状态。
        setVaultOpen(false)
        setOpen(true)
      })
    }
    // DSH 不同版本分别使用 pointer 与 mouse 事件做外部点击判定，两个序列都隔离。
    button.addEventListener('pointerdown', consume, true)
    button.addEventListener('pointerup', consume, true)
    button.addEventListener('mousedown', consume, true)
    button.addEventListener('mouseup', consume, true)
    button.addEventListener('click', closeAfterGesture, true)
    return () => {
      button.removeEventListener('pointerdown', consume, true)
      button.removeEventListener('pointerup', consume, true)
      button.removeEventListener('mousedown', consume, true)
      button.removeEventListener('mouseup', consume, true)
      button.removeEventListener('click', closeAfterGesture, true)
    }
  }, [vaultOpen])
  React.useEffect(() => {
    if (!open) return
    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    // 抽屉打开时点外部只关抽屉（由上方捕获 handler 负责），主面板保留，避免一次点击关两层。
    if (vaultOpen) return undefined
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open, vaultOpen])
  return { closeBtnRef }
}
