import React from 'react'

// 所有异步写回共享同一失效代际；切换会话、关闭或取消后，旧快照不能提交。
export function useDraftGuard(composer) {
  const owner = React.useRef({ composer, generation: 0 })
  if (owner.current.composer !== composer) owner.current = { composer, generation: owner.current.generation + 1 }
  const invalidate = React.useCallback(() => { owner.current.generation += 1 }, [])
  React.useEffect(() => invalidate, [composer, invalidate])
  const capture = ({ selection = false } = {}) => {
    const before = String(composer?.getDraft?.() || '')
    const selected = selection ? composer?.getSelection?.() : null
    if (selected && (selected.draft !== before || selected.text !== before.slice(selected.start, selected.end))) throw new Error('选区已变化，请重新选择。')
    return { before, selection: selected, composer, generation: ++owner.current.generation }
  }
  const assertCurrent = snapshot => {
    if (owner.current.composer !== snapshot.composer || owner.current.generation !== snapshot.generation) throw Object.assign(new Error('操作已取消，草稿未改动。'), { name: 'AbortError' })
    if (String(snapshot.composer?.getDraft?.() || '') !== snapshot.before) throw new Error('操作期间草稿已变化，未覆盖新内容；请重新操作。')
  }
  const commit = (snapshot, text, { allowEmpty = false } = {}) => {
    assertCurrent(snapshot)
    if (typeof text !== 'string' || (!allowEmpty && !text.trim())) throw new Error('未返回有效正文，草稿未改动。')
    const selected = snapshot.selection
    const after = selected ? `${snapshot.before.slice(0, selected.start)}${text}${snapshot.before.slice(selected.end)}` : text
    if (selected && snapshot.composer.replaceSelection) snapshot.composer.replaceSelection(text, selected)
    else snapshot.composer.write(after)
    return after
  }
  return { capture, assertCurrent, commit, invalidate }
}
