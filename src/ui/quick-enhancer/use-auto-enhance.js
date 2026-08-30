import React from 'react'
import { detectLanguage, restoreLostSkillMentions, shouldInterceptSend } from '../../lib/utils.js'

/** 增强与发送分别处理失败；一轮输入最多调用一次发送函数。 */
export function useAutoEnhance({ enabled, composer, enhancer, onSubmitDraft, strength, draftGuard, loading, setLoading, setStreamState, setNotice, setWarn, setError }) {
  const latest = React.useRef(null)
  latest.current = { enabled, composer, enhancer, onSubmitDraft, strength, draftGuard, loading, setLoading, setStreamState, setNotice, setWarn, setError }
  const inFlight = React.useRef(false)
  React.useEffect(() => {
    const onKeydown = event => {
      const state = latest.current
      const draft = String(state.composer?.getDraft?.() || '')
      if (!state.onSubmitDraft || !state.enhancer || !state.composer?.isInputTarget?.(event.target)) return
      if (!shouldInterceptSend({ event, draft, enabled: state.enabled })) return
      // 忙碌时仍吞掉同一输入框的发送键，避免宿主先发送、异步增强随后再发送。
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.()
      if (inFlight.current || state.loading) return
      inFlight.current = true
      state.setLoading(true)
      const snapshot = state.draftGuard.capture()
      state.setStreamState({ phase: 'waiting', segments: [], elapsedMs: 0 })
      void (async () => {
        let text = draft
        let enhancementError = null
        try {
          try {
            const body = await state.enhancer.enhance({ draft, lang: detectLanguage(draft), kind: 'semantic', strength: state.strength, hasContext: false })
            if (typeof body?.prompt !== 'string' || !body.prompt.trim()) throw new Error('模型未返回有效正文')
            text = restoreLostSkillMentions(draft, body.prompt) || body.prompt
          } catch (error) {
            if (error?.name === 'AbortError') throw error
            enhancementError = error
          }
          state.draftGuard.assertCurrent(snapshot)
          try {
            await state.onSubmitDraft(text)
          } catch (error) {
            state.setError(`发送结果未确认（${String(error?.message || error)}），未自动重发；请先检查会话。`)
            return
          }
          if (enhancementError) state.setWarn(`自动增强失败（${String(enhancementError?.message || enhancementError)}），已发送原文。`)
          else state.setNotice('发送前已自动增强。')
        } catch (error) {
          if (error?.name === 'AbortError') state.setNotice('自动增强已取消，原文未发送。')
          else state.setError(String(error?.message || error))
        } finally {
          inFlight.current = false
          state.setLoading(false)
          state.setStreamState(null)
        }
      })()
    }
    window.addEventListener('keydown', onKeydown, true)
    return () => window.removeEventListener('keydown', onKeydown, true)
  }, [])
}
