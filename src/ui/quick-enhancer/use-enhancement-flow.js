import React from 'react'
import { detectLanguage, restoreLostSkillMentions, skillMentions, splitOutputSegments, parseEnhanceOutput } from '../../lib/utils.js'

/** 增强事务：准备上下文、流式预览、取消、校验草稿、提交；成功后的统计由调用方处理。 */
export function useEnhancementFlow({ composer, enhancer, draft, draftGuard, config, context, getPlan, importCard, onApplied, onDiagnosis, notice, setLoading }) {
  const { enhancementKind, enhanceStrength, requirement, matchedMethod: defaultMethod, selectedContextText, referencedFiles, useMemoryContext } = config
  const { vaultItems, assetContextIds, memoryPreview, searchMemory, loadMemory, methodProvider } = context
  const { setNotice, setWarn, setError, setMemoryReceipt } = notice
  const [enhanceDiagnosis, setEnhanceDiagnosis] = React.useState(null)
  const [diagnosisMethod, setDiagnosisMethod] = React.useState(null)
  const [streamState, setStreamState] = React.useState(null)
  const [skillRestore, setSkillRestore] = React.useState(null)
  const streamStartRef = React.useRef(0)
  const active = React.useRef(null)
  React.useEffect(() => () => {
    if (active.current) { active.current.abort(); setLoading(false) }
    active.current = null
    enhancer?.cancel()
  }, [enhancer])
  const cancelEnhance = ({ silent = false } = {}) => {
    draftGuard.invalidate()
    active.current?.abort()
    enhancer?.cancel()
    if (!silent) setNotice('正在取消语义增强…')
  }
  const enhanceIntoInput = async ({ methodOverride } = {}) => {
    if (active.current) return
    setMemoryReceipt(null)
    const matchedMethod = methodOverride || defaultMethod
    let snapshot
    try { snapshot = draftGuard.capture({ selection: true }) }
    catch (error) { setWarn(String(error?.message || error)); return }
    const source = snapshot.before.trim()
    if (!source) { setWarn('请先在输入框中写入原始请求。'); return }
    const importSource = source.replace(/^\/import\b\s*/i, '')
    if (/^\/import\b/i.test(source) || /^(?:---\n[\s\S]*?\n---\n)?#\s+[^\n]+[\s\S]*?## Prompt\s*\n/.test(source)) {
      if (await importCard(importSource)) {
        try { draftGuard.commit({ ...snapshot, selection: null }, '', { allowEmpty: true }) }
        catch (error) { setError(String(error?.message || error)) }
      }
      return
    }
    const selection = snapshot.selection
    const original = selection?.text || snapshot.before
    if (original.trim().length > 3000) { setWarn(`草稿过长（${original.trim().length} 字符），建议精简到 3000 字符以内再增强。`); return }
    const applyEnhanced = text => draftGuard.commit(snapshot, text)
    if (enhancementKind !== 'semantic') {
      const plan = getPlan(original, matchedMethod)
      if (plan.tooShort) { setNotice('输入过短，未做增强，可直接发送。'); return }
      try {
        const after = applyEnhanced(plan.prompt)
        onApplied({ original, after, selection, matchedMethod, kind: plan.method ? 'lightMethod' : 'lightGeneric', method: plan.method })
        setNotice(plan.method ? `已采用「${plan.label || plan.method}」做保守增强${selection?.text ? '并替换选中片段' : ''}，可检查后直接发送。` : '已做最小化提示词整理，可检查后直接发送。')
      } catch (error) { setError(String(error?.message || error)) }
      return
    }
    if (!enhancer) { setNotice('未注入语义增强模型（enhancer），仅支持轻量增强。'); return }
    const request = new AbortController()
    active.current = request
    const assertActive = () => {
      if (request.signal.aborted || active.current !== request) throw Object.assign(new Error('已取消'), { name: 'AbortError' })
    }
    setLoading(true)
    setEnhanceDiagnosis(null)
    setDiagnosisMethod(matchedMethod || null)
    setSkillRestore(null)
    setStreamState({ phase: 'waiting', segments: [], elapsedMs: 0 })
    streamStartRef.current = Date.now()
    // 实时计时：等待阶段逐秒跳数（-webkit 不支持时退回静态文案），让「模型在干活」可感知。
    const tick = window.setInterval(() => setStreamState(prev => prev ? { ...prev, elapsedMs: Date.now() - streamStartRef.current } : prev), 500)
    let phase = 'done'
    try {
      const contextAssets = vaultItems.filter(item => assetContextIds.includes(item.id))
      const assetContextText = contextAssets.length ? [
        '思考卡上下文（请区分事实、推断和待验证假设；不要把待核实或已被推翻的内容表述为事实或结论）：',
        ...contextAssets.map((item, index) => [
          `[${index + 1}] ${item.title}`,
          `类型：${item.thinkingKind || 'conclusion'}；认识状态：${item.epistemicStatus || 'inferred'}${item.verification ? `；验证结果：${item.verification.status}` : ''}`,
          item.verification?.evidence ? `验证证据：${item.verification.evidence}` : '',
          item.rationale ? `为什么重要：${item.rationale}` : '',
          item.nextAction ? `下一步：${item.nextAction}` : '',
          `内容：${item.body}`,
        ].filter(Boolean).join('\n')),
      ].join('\n\n') : ''
      let extra = [requirement.trim(), selectedContextText ? `对话参考：\n${selectedContextText}` : '', assetContextText,
        referencedFiles.length ? `已引用工作区文件：${referencedFiles.map(path => `@${path}`).join('、')}。请完整保留这些引用；文件内容会在用户发送后由 DSH @file 处理，当前改写不得假设或编造其内容。` : '',
      ].filter(Boolean).join('\n\n')
      let remembered = ''
      if (useMemoryContext && searchMemory) {
        remembered = memoryPreview.status === 'ready' && memoryPreview.query === original ? memoryPreview.text : await loadMemory(original)
        if (remembered) extra = [extra, `项目记忆：${remembered}`].filter(Boolean).join('\n\n')
      }
      assertActive()
      const template = matchedMethod ? await methodProvider.getTemplate(matchedMethod.id) : null
      assertActive()
      const options = { draft: original, extra, lang: detectLanguage(original), kind: 'semantic', strength: enhanceStrength,
        hasContext: Boolean(selectedContextText || remembered || assetContextText),
        method: matchedMethod ? { title: matchedMethod.title, template: template.prompt } : undefined }
      let body
      if (typeof enhancer.enhanceStream === 'function') {
        let rawText = ''
        try {
          body = await enhancer.enhanceStream({ ...options, onDelta: delta => {
            if (request.signal.aborted || active.current !== request) return
            rawText += String(delta || '')
            const partial = parseEnhanceOutput(rawText, { streaming: true })
            setEnhanceDiagnosis(partial.diagnosis)
            setStreamState(prev => prev ? { ...prev, phase: 'streaming', segments: splitOutputSegments(partial.prompt) } : prev)
          }, onStage: stage => {
            // 服务端阶段帧：waiting → diagnosing（模型开始输出诊断）→ writing（开始改写正文）。
            if (request.signal.aborted || active.current !== request) return
            setStreamState(prev => prev ? { ...prev, phase: stage === 'writing' ? 'streaming' : 'diagnosing' } : prev)
          } })
        } catch (error) {
          // 仅协议明确不支持流式且尚未输出时降级；超时、模型错误、断流不得重复调用。
          if (!error?.fallback || rawText || error?.name === 'AbortError') throw error
          assertActive()
        }
      }
      if (!body) { assertActive(); body = await enhancer.enhance(options) }
      assertActive()
      const repaired = restoreLostSkillMentions(original, body.prompt)
      // 先验证正文，避免只有诊断时用「补回技能」文字冒充有效改写。
      if (typeof body.prompt !== 'string' || !body.prompt.trim()) throw new Error('模型未返回改写正文，草稿未改动。')
      const after = applyEnhanced(repaired || body.prompt)
      setEnhanceDiagnosis(body.diagnosis || null)
      if (body.diagnosis) onDiagnosis(body.diagnosis, original.trim(), matchedMethod?.title || '')
      if (repaired) setSkillRestore({ lost: skillMentions(original).filter(name => !skillMentions(body.prompt).includes(name)) })
      setStreamState(prev => prev ? { ...prev, segments: splitOutputSegments(body.prompt) } : prev)
      onApplied({ original, after, selection, matchedMethod, kind: 'semantic', method: matchedMethod?.title, body, remembered, contextAssets })
      const diagnosticNotice = body.diagnosisMeta?.status === 'partial' ? ' 部分诊断未返回，已保留有效项。' : ''
      setNotice(`语义增强完成${body.model ? `（${body.model}）` : ''}；${selection?.text ? '选中片段' : '草稿'}已替换，可在此撤销或对比原稿。${diagnosticNotice}`)
    } catch (error) {
      phase = error?.name === 'AbortError' ? 'cancelled' : 'error'
      if (active.current !== request) return
      if (phase === 'cancelled') setNotice('已取消语义增强，草稿未改动。')
      else setError(String(error?.message || error))
    } finally {
      window.clearInterval(tick)
      if (active.current === request) {
        active.current = null
        setLoading(false)
        setStreamState(prev => prev ? { ...prev, phase, elapsedMs: Date.now() - streamStartRef.current } : null)
      }
    }
  }
  return { enhanceIntoInput, cancelEnhance, enhanceDiagnosis, diagnosisMethod, streamState, setStreamState, skillRestore, setSkillRestore }
}
