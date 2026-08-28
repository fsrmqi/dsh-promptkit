// NudgeMetrics：行为助推埋点的本地消费端 + 宿主级总开关（零遥测，纯浏览器本地）。
//
// 上游（quick-enhancer.js 的 trackNudge）把每次引导卡的 展示/接受/关闭 动作派发为
// window CustomEvent 'promptkit.nudge'（detail: { type, action, ts, method_id }）；
// 草稿桥则派发 'promptkit.studio.open-with-draft.v1'。本模块负责消费并聚合：
//
//   mountNudgeMetrics(prefix) —— 幂等挂载（window.__promptkitNudgeMetrics 单例）：
//     totals / byType / byDay  按「助推类型 × 动作」计数，按天分桶（保留最近 30 天）
//     sessions / deepSessions  浏览器会话计数；任一 accept 或草稿桥使用记为深度会话
//     deepRate ≈ DMSR（方法深度会话率）的本地近似口径
//   getSummary() / reset()     —— 读聚合结果 / 清空本地统计
//
//   isNudgeKitEnabled / setNudgeKitEnabled —— 宿主级 feature flag（localStorage，
//     默认开启）。与组件 prop nudgeEnabled 是「与」关系：任一关闭即停发全部引导卡。
//     Embed 宿主经 PromptKit.nudges.* 取用；亦可直接写
//     localStorage['promptkit.quick-action.nudge.enabled.v1'] = 'false'。

function isNudgeKitEnabled(key = 'promptkit.quick-action.nudge.enabled.v1') {
  try { return window.localStorage.getItem(key) !== 'false' } catch { return true }
}

function setNudgeKitEnabled(enabled, key = 'promptkit.quick-action.nudge.enabled.v1') {
  try { window.localStorage.setItem(key, String(!!enabled)) } catch {}
}

function mountNudgeMetrics(prefix = 'promptkit.') {
  if (typeof window === 'undefined') return null
  if (window.__promptkitNudgeMetrics) return window.__promptkitNudgeMetrics
  const storeKey = `${prefix}nudge.metrics.v1`
  const sessionKey = `${prefix}nudge.session-counted.v1`
  const deepKey = `${prefix}nudge.session-deep.v1`
  const read = () => { try { return JSON.parse(window.localStorage.getItem(storeKey) || '{}') || {} } catch { return {} } }
  const write = value => { try { window.localStorage.setItem(storeKey, JSON.stringify(value)) } catch {} }
  const data = read()
  data.totals = data.totals || {}
  data.byType = data.byType || {}
  data.byDay = data.byDay || {}
  data.sessions = Number(data.sessions || 0)
  data.deepSessions = Number(data.deepSessions || 0)
  const dayOf = (ts) => new Date(ts || Date.now()).toISOString().slice(0, 10)
  const ensureSession = () => {
    try {
      if (window.sessionStorage.getItem(sessionKey) === '1') return
      window.sessionStorage.setItem(sessionKey, '1')
    } catch { return }
    data.sessions += 1
  }
  const markDeep = () => {
    ensureSession()
    let first = false
    try {
      if (window.sessionStorage.getItem(deepKey) !== '1') {
        window.sessionStorage.setItem(deepKey, '1')
        first = true
      }
    } catch { first = false }
    if (first) data.deepSessions += 1
  }
  const pruneDays = () => {
    const days = Object.keys(data.byDay).sort()
    while (days.length > 30) delete data.byDay[days.shift()]
  }
  const record = (type, action) => {
    if (!type || !action) return
    ensureSession()
    data.totals[action] = Number(data.totals[action] || 0) + 1
    const typeBucket = data.byType[type] || (data.byType[type] = {})
    typeBucket[action] = Number(typeBucket[action] || 0) + 1
    const day = dayOf()
    const dayBucket = data.byDay[day] || (data.byDay[day] = {})
    dayBucket[action] = Number(dayBucket[action] || 0) + 1
    if (action === 'accept') markDeep()
    pruneDays()
    write(data)
  }
  const onNudge = event => {
    const detail = event?.detail || {}
    record(String(detail.type || ''), String(detail.action || ''))
  }
  const onBridge = () => {
    ensureSession()
    markDeep()
    data.totals.bridge = Number(data.totals.bridge || 0) + 1
    const dayBucket = data.byDay[dayOf()] || (data.byDay[dayOf()] = {})
    dayBucket.bridge = Number(dayBucket.bridge || 0) + 1
    pruneDays()
    write(data)
  }
  try {
    window.addEventListener('promptkit.nudge', onNudge)
    window.addEventListener('promptkit.studio.open-with-draft.v1', onBridge)
  } catch {}
  const api = {
    getSummary: () => {
      pruneDays()
      const days = Object.keys(data.byDay)
      const deepDays = days.filter(day => Number(data.byDay[day]?.accept || 0) > 0 || Number(data.byDay[day]?.bridge || 0) > 0)
      const base = Math.max(data.sessions, data.deepSessions)
      return {
        sessions: data.sessions,
        deepSessions: data.deepSessions,
        deepRate: base ? Math.round((data.deepSessions / base) * 100) / 100 : 0,
        activeDays: days.length,
        deepDays: deepDays.length,
        totals: { ...data.totals },
        byType: JSON.parse(JSON.stringify(data.byType)),
        byDay: JSON.parse(JSON.stringify(data.byDay)),
      }
    },
    reset: () => {
      data.totals = {}
      data.byType = {}
      data.byDay = {}
      data.sessions = 0
      data.deepSessions = 0
      write(data)
    },
  }
  window.__promptkitNudgeMetrics = api
  return api
}

export { isNudgeKitEnabled, setNudgeKitEnabled, mountNudgeMetrics }
