import React from 'react'

// 仅保存 0~3 的首次体验进度，与可选的详细使用统计分离。
export function useOnboardingProgress(storageKey) {
  const key = storageKey('onboarding-successes.v1')
  const [count, setCount] = React.useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      const prior = saved === null ? JSON.parse(window.localStorage.getItem(storageKey('metrics.v1')) || '{}').total : Number(saved)
      return Math.max(0, Math.min(3, Number(prior) || 0))
    } catch { return 0 }
  })
  React.useEffect(() => { try { window.localStorage.setItem(key, String(count)) } catch {} }, [key, count])
  const recordSuccess = () => setCount(value => Math.min(3, value + 1))
  return { completed: count >= 3, recordSuccess }
}
