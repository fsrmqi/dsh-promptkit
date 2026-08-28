// 组件间浏览器事件与暂存 key 的唯一真源。
// storagePrefix 是 Embed 的隔离边界：同页挂载多个 PromptKit 时，事件和 sessionStorage
// 也必须隔离，不能只隔离 localStorage。
function eventPrefix(prefix = 'promptkit.') {
  const value = String(prefix || 'promptkit.')
  return value.endsWith('.') ? value : `${value}.`
}

function nudgeEventName(prefix) { return `${eventPrefix(prefix)}nudge` }
function studioBridgeEventName(prefix) { return `${eventPrefix(prefix)}studio.open-with-draft.v1` }
function studioBridgeStorageKey(prefix) { return `${eventPrefix(prefix)}studio.pending-draft.v1` }
function nudgeEnabledStorageKey(prefix) { return `${eventPrefix(prefix)}quick-action.nudge.enabled.v1` }

export { eventPrefix, nudgeEventName, studioBridgeEventName, studioBridgeStorageKey, nudgeEnabledStorageKey }
