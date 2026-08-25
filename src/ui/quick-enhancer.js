import React from 'react'
import { h, C, S, workbenchStyle, Spinner, Icon } from './foundation.js'
import { planPromptEnhancement, detectLanguage, methodChoice, recommendMethods, selectedConversationDraft, cleanSummary, cleanConversationText, conversationMessages, list, safeText, obj } from '../lib/utils.js'

// TODO(开源解耦): useSession/fetchView/inputActions/input 为 Memory Center 私有运行时，
// 下一阶段改为从注入的 deps（methodProvider / composer / enhancer / messages）获取。
    function ConversationQuickAction({ sessionId, useSession, inputActions, input }) {
      const snapshot = useSession(value => value)
      const messages = React.useMemo(() => conversationMessages(snapshot), [snapshot?.nodes])
      const [open, setOpen] = React.useState(false)
      const [mode, setMode] = React.useState('method')
      const [enhancementKind, setEnhancementKind] = React.useState('light')
      const [selected, setSelected] = React.useState([])
      const [methods, setMethods] = React.useState([])
      const [selectedMethodId, setSelectedMethodId] = React.useState('')
      const [loading, setLoading] = React.useState(false)
      const [showAllMethods, setShowAllMethods] = React.useState(false)
      const [notice, setNotice] = React.useState('')
      const [requirement, setRequirement] = React.useState('')
      const [contextLevel, setContextLevel] = React.useState('question')
      const [undoDraft, setUndoDraft] = React.useState(null)
      const abortRef = React.useRef(null)
      const [libraryOpen, setLibraryOpen] = React.useState(false)
      const [librarySearch, setLibrarySearch] = React.useState('')
      const [libraryFavorites] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem('promptkit.prompt-library.favorites.v1') || '[]') } catch { return [] } })
      const [libraryHistory] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem('promptkit.prompt-library.history.v1') || '[]') } catch { return [] } })
      const [recentMethodIds, setRecentMethodIds] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem('promptkit.quick-action.recent-methods.v1') || '[]') } catch { return [] } })
      const [methodUsage, setMethodUsage] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem('promptkit.quick-action.method-usage.v1') || '{}') } catch { return {} } })
      const [position, setPosition] = React.useState(() => {
        try {
          const value = JSON.parse(window.localStorage.getItem('promptkit.quick-action.position.v1') || 'null')
          if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value
        } catch {}
        return { x: Math.max(24, window.innerWidth - 86), y: Math.max(96, window.innerHeight - 158) }
      })
      const drag = React.useRef(null)
      const suppressClick = React.useRef(false)
      const rootRef = React.useRef(null)
      const openPanel = () => setOpen(value => !value)
      React.useEffect(() => { if (!open) abortRef.current?.abort() }, [open])
      React.useEffect(() => { if (mode === 'library' && !libraryOpen) setLibraryOpen(true) }, [mode, libraryOpen])
      React.useEffect(() => {
        if (!open || methods.length) return
        setLoading(true)
        fetchView(sessionId, 'prompt-catalog').then(value => setMethods(list(value.methods))).catch(error => setNotice(String(error.message || error))).finally(() => setLoading(false))
      }, [open, sessionId, methods.length])
      React.useEffect(() => {
        const onKeydown = event => {
          if (event.key === 'Escape' && open) { setOpen(false); return }
          if (!(event.metaKey || event.ctrlKey)) return
          // 普通 Enter 在 textarea 内天然换行：Enter 提交分支位于 meta/ctrl 守卫之后，
          // 只有 ⌘/Ctrl+Enter 才会走到这里；再限定焦点在面板内，避免与 DSH 主输入框
          // 的 ⌘Enter 发送快捷键冲突。
          const insidePanel = rootRef.current?.contains(event.target)
          const index = Number(event.key) - 1
          const title = ['苏格拉底式提问', '第一性原理', '双向钢人论证'][index]
          if (title) { event.preventDefault(); const choice = methodChoice(methods, title); if (choice) { setSelectedMethodId(choice.id); setMode('method'); setOpen(true) }; return }
          if (event.key === 'Enter' && open && insidePanel) { event.preventDefault(); if (mode === 'enhance') enhanceIntoInput(); else { const choice = methods.find(method => method.id === selectedMethodId); if (choice) void composeIntoInput(choice) }; return }
          if (event.key.toLowerCase() !== 'k') return
          event.preventDefault()
          openPanel()
        }
        window.addEventListener('keydown', onKeydown)
        return () => window.removeEventListener('keydown', onKeydown)
      }, [messages.length, selected.length, open, methods, selectedMethodId, requirement, contextLevel, mode])
      React.useEffect(() => {
        if (!open) return
        const onPointerDown = event => {
          if (!rootRef.current?.contains(event.target)) setOpen(false)
        }
        window.addEventListener('pointerdown', onPointerDown)
        return () => window.removeEventListener('pointerdown', onPointerDown)
      }, [open])
      React.useEffect(() => {
        const move = event => {
          if (!drag.current) return
          const next = {
            x: Math.max(16, Math.min(window.innerWidth - 62, event.clientX - drag.current.dx)),
            y: Math.max(58, Math.min(window.innerHeight - 62, event.clientY - drag.current.dy)),
          }
          drag.current.moved = true
          setPosition(next)
        }
        const up = () => {
          if (!drag.current) return
          suppressClick.current = drag.current.moved
          try { window.localStorage.setItem('promptkit.quick-action.position.v1', JSON.stringify(position)) } catch {}
          drag.current = null
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
        return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
      }, [position])
      const toggle = id => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id])
      const activeMessages = messages.filter(item => selected.includes(item.id)).reverse()
      const selectedChars = activeMessages.reduce((total, item) => total + item.text.length, 0)
      const selectedDraft = selectedConversationDraft(activeMessages)
      const canCompose = Boolean(requirement.trim() || selectedDraft.question)
      const selectedMethod = methods.find(method => method.id === selectedMethodId)
      const libraryMethod = libraryOpen ? selectedMethod : null
      const composeIntoInput = async choice => {
        if (!choice || !inputActions) return
        const source = contextLevel === 'question' ? [] : activeMessages
        if (!canCompose) { setNotice('请输入本次要求或问题；也可以选择一条用户消息作为问题。'); return }
        setLoading(true)
        try {
          const draft = selectedConversationDraft(source)
          const explicitRequirement = requirement.trim()
          const question = explicitRequirement || draft.question
          let facts = [explicitRequirement && draft.question ? `对话中的原始问题：${draft.question}` : '', draft.facts].filter(Boolean).join('\n')
          if (contextLevel === 'memory') {
            const memory = await fetchView(sessionId, 'context-search', { query: question })
            const remembered = cleanContext(memory.suggested_context || '')
            if (remembered) facts = [facts, `项目记忆：${remembered}`].filter(Boolean).join('\n')
          }
          const composed = await fetchView(sessionId, 'prompt-compose', { method_id: choice.id, question, facts, constraints: draft.constraints, options: draft.options })
          const prefix = input?.draft?.trim() ? `${input.draft.trim()}\n\n` : ''
          setUndoDraft({ before: input?.draft ?? '', after: `${prefix}${composed.prompt}` })
          inputActions.setDraft(`${prefix}${composed.prompt}`)
          setMethodUsage(value => { const next = { ...value, [choice.id]: Number(value[choice.id] || 0) + 1 }; try { window.localStorage.setItem('promptkit.quick-action.method-usage.v1', JSON.stringify(next)) } catch {}; return next })
          setRecentMethodIds(value => { const next = [choice.id, ...value.filter(id => id !== choice.id)].slice(0, 3); try { window.localStorage.setItem('promptkit.quick-action.recent-methods.v1', JSON.stringify(next)) } catch {}; return next })
          setNotice(`已按“${choice.title}”${source.length ? `整理 ${source.length} 条消息并` : ''}填入输入框，可编辑后发送。`)
          setOpen(false)
        } catch (error) { setNotice(String(error.message || error)) }
        finally { setLoading(false) }
      }
      const fillLibraryTemplate = async () => {
        if (!libraryMethod) return
        setLoading(true)
        try {
          const template = await fetchView(sessionId, 'prompt-template', { method_id: libraryMethod.id })
          setUndoDraft({ before: input?.draft ?? '', after: template.prompt })
          inputActions?.setDraft(template.prompt)
          setNotice(`已将「${libraryMethod.title}」模板填入消息框。`)
          setOpen(false)
        } catch (error) { setNotice(String(error.message || error)) }
        finally { setLoading(false) }
      }
      const adaptLibraryDraft = async () => {
        const draft = input?.draft?.trim()
        if (!libraryMethod || !draft) { setNotice('请先在 DSH 消息框写下需要改造的原始请求。'); return }
        if (draft.length > 3000) { setNotice(`草稿过长（${draft.length} 字符），建议精简到 3000 字符以内再改造。`); return }
        setLoading(true)
        const controller = new AbortController()
        abortRef.current = controller
        try {
          const template = await fetchView(sessionId, 'prompt-template', { method_id: libraryMethod.id })
          const response = await fetch(`/memory-center/semantic-enhance?session_id=${encodeURIComponent(sessionId)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ draft: input.draft, extra: requirement, lang: detectLanguage(input.draft), method: { title: libraryMethod.title, template: template.prompt } }), signal: controller.signal })
          const body = await response.json().catch(() => ({}))
          if (!response.ok) {
            if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
            throw new Error(body.next_action || body.error || '基于草稿改造失败')
          }
          setUndoDraft({ before: input.draft, after: body.prompt })
          inputActions?.setDraft(body.prompt)
          setNotice(`已使用当前会话模型按「${libraryMethod.title}」改造草稿，可在此撤销或对比原稿。`)
        } catch (error) {
          if (error?.name === 'AbortError') setNotice('已取消草稿改造，消息框未改动。')
          else if (error?.timeout) setNotice(`${error.message}（可稍后重试）`)
          else setNotice(String(error.message || error))
        }
        finally { setLoading(false); abortRef.current = null }
      }
      const cancelEnhance = () => { setNotice('正在取消语义增强…'); abortRef.current?.abort() }
      const enhanceIntoInput = async () => {
        const source = input?.draft?.trim()
        if (!source) { setNotice('请先在 DSH 消息输入框中写入原始请求。'); return }
        if (source.length > 3000) { setNotice(`草稿过长（${source.length} 字符），建议精简到 3000 字符以内再增强。`); return }
        const original = input.draft
        if (enhancementKind === 'semantic') {
          setLoading(true)
          const controller = new AbortController()
          abortRef.current = controller
          try {
            const response = await fetch(`/memory-center/semantic-enhance?session_id=${encodeURIComponent(sessionId)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ draft: original, extra: requirement, lang: detectLanguage(original) }), signal: controller.signal })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) {
              if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(body.next_action || body.error || '语义增强失败')
            }
            setUndoDraft({ before: original, after: body.prompt })
            inputActions?.setDraft(body.prompt)
            setNotice(`已使用当前会话模型 ${body.model || ''} 完成语义增强；草稿已替换，可在此撤销或对比原稿。`)
          } catch (error) {
            if (error?.name === 'AbortError') setNotice('已取消语义增强，草稿未改动。')
            else if (error?.timeout) setNotice(`${error.message}（可稍后重试）`)
            else setNotice(String(error.message || error))
          }
          finally { setLoading(false); abortRef.current = null }
          return
        }
        const plan = planPromptEnhancement(original, requirement, methods)
        if (plan.tooShort) { setNotice('输入过短，未做增强，可直接发送。'); return }
        setUndoDraft({ before: original, after: plan.prompt })
        inputActions?.setDraft(plan.prompt)
        setNotice(plan.method ? `已采用「${plan.label || plan.method}」做保守增强，可检查后直接发送。` : '已做最小化提示词整理，可检查后直接发送。')
        setOpen(false)
      }
      const common = ['苏格拉底式提问', '第一性原理', '双向钢人论证'].map(title => methodChoice(methods, title)).filter(Boolean)
      const recommended = recommendMethods(methods, requirement)
      const recentMethods = recentMethodIds.map(id => methods.find(method => method.id === id)).filter(Boolean)
      const libraryMatches = methods.filter(method => !librarySearch.trim() || `${method.title} ${method.purpose} ${method.tags}`.toLowerCase().includes(librarySearch.trim().toLowerCase()))
      const rankedCommon = [...common].sort((a, b) => Number(methodUsage[b.id] || 0) - Number(methodUsage[a.id] || 0))
      const panelAbove = position.y > 370
      const panelMaxHeight = Math.max(250, Math.min(640, panelAbove ? position.y - 82 : window.innerHeight - position.y - 82))
      const buttonStyle = { width: '52px', height: '52px', padding: 0, border: `1px solid ${C.tealLineStrong}`, borderRadius: '50%', background: C.teal, boxShadow: '0 10px 24px rgba(15,118,110,.26)', color: C.surface, cursor: 'grab', fontSize: '20px', fontWeight: 800 }
      const fan = common.map((method, index) => h('button', { key: method.id, title: `选择：${method.title}`, disabled: loading, onClick: () => { setSelectedMethodId(method.id); setMode('method'); setOpen(true) }, style: { position: 'absolute', right: `${-8 + index * 48}px`, bottom: panelAbove ? `${62 + Math.abs(index - 1) * 25}px` : 'auto', top: panelAbove ? 'auto' : `${62 + Math.abs(index - 1) * 25}px`, width: '42px', height: '42px', overflow: 'hidden', border: `1px solid ${selectedMethodId === method.id ? C.teal : C.tealLine}`, borderRadius: '50%', background: selectedMethodId === method.id ? C.tealTint : C.surface, boxShadow: '0 6px 16px rgba(17,38,60,.14)', color: C.teal, cursor: 'pointer', fontSize: '10px', fontWeight: 800, lineHeight: 1.15, animation: 'mc-fan-in .22s ease both', animationDelay: `${index * 35}ms` } }, method.title.slice(0, 4)))
      const methodItems = showAllMethods ? methods : rankedCommon
      const methodCards = h('div', { style: { display: 'grid', gap: '7px' } }, methodItems.map(method => h('button', { key: method.id, className: 'mc-btn', disabled: loading, onClick: () => setSelectedMethodId(method.id), style: { width: '100%', padding: '10px 11px', border: `1px solid ${selectedMethodId === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: selectedMethodId === method.id ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer' } }, [h('div', { key: 'title', style: { display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px', fontWeight: 800 } }, [h('span', { key: 'name' }, method.title), selectedMethodId === method.id ? h('span', { key: 'picked', style: { color: C.teal } }, '已选择') : recommended.includes(method) ? h('span', { key: 'recommended', style: { color: C.teal } }, '推荐') : null]), h('div', { key: 'purpose', style: { marginTop: '3px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, method.purpose || '按该方法组织分析。')])) )
      const structurePreview = selectedMethod ? h('div', { style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `组装预览：问题 · ${contextLevel === 'question' ? '仅问题' : contextLevel === 'conversation' ? `已选对话 ${activeMessages.length} 条` : `已选对话 ${activeMessages.length} 条 + 项目记忆`} · ${selectedMethod.title} 的分析结构`) : null
      const methodFooter = h('div', { style: { position: 'sticky', bottom: '-14px', margin: '10px -14px -14px', padding: '11px 14px 14px', borderTop: `1px solid ${C.tealLine}`, background: C.surface } }, [selectedMethod ? h('div', { key: 'outcome', style: { marginBottom: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint, fontSize: '12px', lineHeight: 1.5 } }, [h('strong', { key: 'title', style: { color: C.teal } }, `将使用「${selectedMethod.title}」`), h('div', { key: 'body', style: { marginTop: '3px', color: C.slate } }, selectedMethod.outcome || (selectedMethod.mode === 'guided' ? '先通过追问澄清问题，再推进下一步。' : '生成结构化分析、风险与下一步行动。'))]) : null, h('button', { key: 'generate', className: 'mc-btn', disabled: loading || !canCompose || !selectedMethod, onClick: () => composeIntoInput(selectedMethod), style: { width: '100%', padding: '11px 14px', border: 0, borderRadius: '9px', background: loading || !canCompose || !selectedMethod ? C.tealLine : C.teal, color: loading || !canCompose || !selectedMethod ? C.muted : C.surface, cursor: loading || !canCompose || !selectedMethod ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading ? h(Spinner, { key: 'spin', text: '正在组装…' }) : selectedMethod ? '生成并填入消息框' : '请选择一种方法')])
      const enhancementPlan = planPromptEnhancement(input?.draft, requirement, methods)
      const enhancementLang = detectLanguage(input?.draft || '')
      const strategyNode = input?.draft?.trim() ? enhancementKind === 'semantic'
        ? [h('div', { key: 'meta', style: { marginBottom: '3px' } }, `将把当前 ${input.draft.trim().length} 个字符交给当前会话模型改写。`), h('div', { key: 'lang', style: { color: C.muted } }, `检测语言：${enhancementLang === 'en' ? '英文（输出与输入一致）' : enhancementLang === 'mixed' ? '中英混合（输出与输入一致）' : '中文'}。`), input.draft.trim().length > 3000 ? h('div', { key: 'warn', style: { marginTop: '3px', color: C.amber } }, '草稿超过 3000 字符，建议精简后再增强。') : null]
        : [h('strong', { key: 'method', style: { color: C.teal } }, enhancementPlan.tooShort ? '输入过短，直接使用原文' : enhancementPlan.label ? `拟采用：${enhancementPlan.label}` : '拟采用：轻量整理'), h('div', { key: 'reason', style: { marginTop: '3px' } }, enhancementPlan.reason), enhancementPlan.signals?.length ? h('div', { key: 'signals', style: { marginTop: '3px' } }, `识别信号：${enhancementPlan.signals.join('、')}`) : null, enhancementPlan.conflicts?.length ? h('div', { key: 'conflicts', style: { marginTop: '3px', color: C.amber } }, `方法冲突：${enhancementPlan.conflicts.map(item => `${item.label || item.title}（命中“${item.signals.join('、')}”）`).join('；')}，采用「${enhancementPlan.label || enhancementPlan.method}」。`) : null, h('div', { key: 'size', style: { marginTop: '3px', color: C.muted } }, `预计 ${enhancementPlan.prompt.length} 字符。`)]
        : '当前输入框为空，请先在 DSH 消息框写下原始请求。'
      const enhancerPanel = h('div', { key: 'enhancer', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '11px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '增强当前输入框提示词'), h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '9px' } }, [['light', '轻量 · 零 Token'], ['semantic', '语义 · 当前模型']].map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? '复用当前会话模型独立改写；只发送当前草稿与补充要求，不读取对话参考。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。'), h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode), h('button', { key: 'enhance', className: 'mc-btn', disabled: !input?.draft?.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { width: '100%', marginTop: '10px', padding: '11px 14px', border: 0, borderRadius: '9px', background: input?.draft?.trim() && !loading ? C.teal : loading && enhancementKind === 'semantic' ? C.amberLine : C.tealLine, color: input?.draft?.trim() && !loading ? C.surface : loading && enhancementKind === 'semantic' ? C.amber : C.muted, cursor: (input?.draft?.trim() && !loading) || (loading && enhancementKind === 'semantic') ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消增强' }) : loading ? h(Spinner, { key: 'spin', text: '正在增强…' }) : '应用增强到消息框')])
      const panel = open ? h('section', { className: 'mc-scroll', style: { position: 'absolute', right: 0, ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: 'min(440px,calc(100vw - 32px))', maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px rgba(17,38,60,.20)', color: C.ink, zIndex: 30, animation: 'mc-pop .2s ease' } }, [
        h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, libraryOpen ? '从提示词库选择模板：可直接填入消息框，或基于当前草稿调用当前会话模型按该方法改造。' : mode === 'enhance' ? '把当前输入框提示词做增强或改写，只填入消息框，不会自动发送。' : '写问题即可直接处理；也可选择对话消息作为额外参考。生成内容只填入消息框，不会自动发送。')]), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))]),
        libraryOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '9px 10px', borderRadius: '9px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, [h('span', { key: 'count' }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '未选择对话 · 可直接写问题'), h('button', { key: 'recent', onClick: () => setSelected(messages.slice(0, 4).map(item => item.id)), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '选择最近 4 条')]),
        undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (input?.draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } inputActions?.setDraft(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
        h('div', { key: 'mode', style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '10px' } }, [['method', '选择方法'], ['enhance', '增强提示词']].map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => { setMode(id); setLibraryOpen(false) }, style: { padding: '8px', border: `1px solid ${mode === id && !libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: mode === id && !libraryOpen ? C.tealTintDeep : C.surface, color: mode === id && !libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label)).concat(h('button', { key: 'library', className: 'mc-btn', onClick: () => { const next = !libraryOpen; setMode(next ? 'library' : 'method'); setLibraryOpen(next) }, style: { padding: '8px', border: `1px solid ${libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: libraryOpen ? C.tealTintDeep : C.surface, color: libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '提示词库'))),
        libraryOpen ? h('div', { key: 'library-panel', style: { marginTop: '10px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('input', { key: 'search', value: librarySearch, onChange: event => setLibrarySearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }), libraryFavorites.length ? h('div', { key: 'favorites', style: { marginTop: '8px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '我的收藏：'), ' ', libraryFavorites.map(id => methods.find(method => method.id === id)).filter(Boolean).map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, method.title))]) : null, libraryHistory.length ? h('div', { key: 'history', style: { marginTop: '7px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '最近生成：'), ' ', libraryHistory.slice(0, 3).map(item => h('button', { key: `${item.id}:${item.at}`, className: 'mc-btn', onClick: () => { setSelectedMethodId(item.id); setMode('method'); if (item.question) setRequirement(item.question); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, item.title || '未命名方法'))]) : null, h('div', { key: 'matches', style: { display: 'grid', gap: '5px', maxHeight: '180px', overflowY: 'auto', marginTop: '8px' } }, libraryMatches.map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '8px 9px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '11px' } }, [h('strong', { key: 'title' }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted } }, method.purpose || method.category)])))] ) : null,
        libraryOpen ? h('div', { key: 'library-actions', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [h('select', { key: 'select', value: selectedMethodId, onChange: event => setSelectedMethodId(event.target.value), style: { width: '100%', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, fontSize: '12px' } }, [h('option', { key: 'empty', value: '' }, '选择一个提示词…'), ...libraryMatches.map(method => h('option', { key: method.id, value: method.id }, method.title))]), libraryMethod ? h('div', { key: 'selected', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, `已选择「${libraryMethod.title}」：可直接填充模板，或基于当前草稿改造。`) : null, h('div', { key: 'buttons', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '9px' } }, [h('button', { key: 'fill', className: 'mc-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.action, opacity: libraryMethod ? 1 : .55 } }, '填充模板'), h('button', { key: 'adapt', className: 'mc-btn', disabled: !libraryMethod || !input?.draft?.trim() || loading, onClick: adaptLibraryDraft, style: { ...workbenchStyle.action, opacity: libraryMethod && input?.draft?.trim() ? 1 : .55 } }, loading ? h(Spinner, { key: 'spin', text: '改造中…' }) : '基于草稿改造')])]) : null,
        h('label', { key: 'requirement', style: { display: libraryOpen ? 'none' : 'block', marginTop: '10px', marginBottom: '9px' } }, [h('span', { key: 'label', style: { display: 'block', marginBottom: '5px', color: C.muted, fontSize: '11px', fontWeight: 800 } }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), h('textarea', { key: 'input', value: requirement, onChange: event => setRequirement(event.target.value), placeholder: mode === 'enhance' ? '例如：使用简洁中文，先给结论，再列出实施步骤。' : '例如：请重点评估风险，并给出可执行的下一步。', style: { ...workbenchStyle.input, minHeight: '58px', resize: 'vertical', fontSize: '12px', lineHeight: 1.45 } })]),
        h('div', { key: 'context-level', style: { display: libraryOpen || mode === 'enhance' ? 'none' : 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginBottom: '9px' } }, [['question', '仅问题'], ['conversation', '加对话'], ['memory', '加项目记忆']].map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => setContextLevel(id), style: { padding: '7px 5px', border: `1px solid ${contextLevel === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: contextLevel === id ? C.tealTintDeep : C.surface, color: contextLevel === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))),
        h('details', { key: 'context', style: { display: libraryOpen || mode === 'enhance' ? 'none' : 'block', marginTop: '8px', paddingTop: '9px', borderTop: `1px solid ${C.divide}` } }, [h('summary', { key: 'summary', style: { color: C.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer' } }, activeMessages.length ? `可选：调整已选的 ${activeMessages.length} 条对话参考` : '可选：选择对话作为参考'), activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, `自动归类：${selectedDraft.question ? '问题' : '—'} · ${selectedDraft.facts ? '事实' : '—'} · ${selectedDraft.constraints ? '约束' : '—'} · ${selectedDraft.options ? '方案' : '—'}`) : null, h('div', { key: 'privacy', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, '仅展示用户与助手文本；工具调用、工具结果和代码块不会进入此面板。'), h('div', { key: 'messages', style: { display: 'grid', gap: '6px', maxHeight: '210px', overflow: 'auto', paddingRight: '2px' } }, messages.map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: '8px', padding: '8px', border: `1px solid ${selected.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '9px', background: selected.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { key: 'check', type: 'checkbox', checked: selected.includes(item.id), onChange: () => toggle(item.id), style: { marginTop: '2px', accentColor: C.teal } }), h('div', { key: 'text' }, [h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '11px', fontWeight: 800 } }, item.role === 'user' ? '你的消息' : '助手消息'), h('div', { key: 'body', style: { marginTop: '2px', color: C.slate, fontSize: '12px', lineHeight: 1.45 } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`)])])))]),
        mode === 'enhance' ? enhancerPanel : null,
        h('div', { key: 'methods', style: { display: mode === 'method' ? 'block' : 'none', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]), h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'), recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null, methodCards, structurePreview, methodFooter]),
        notice ? h('div', { key: 'notice', style: { marginTop: '10px', color: C.teal, fontSize: '12px', lineHeight: 1.45 } }, notice) : null,
      ]) : null
      return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 30 } }, [h(GlobalStyle, { key: 'gcss' }), h('div', { key: 'fans', style: { position: 'relative' } }, open ? fan : null), h('button', { key: 'enhance-shortcut', type: 'button', className: 'mc-btn', onClick: () => { setMode('enhance'); setOpen(true) }, title: '增强提示词', style: { position: 'absolute', right: '58px', top: '5px', width: '36px', height: '36px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.tealLine}`, borderRadius: '50%', background: C.surface, color: C.teal, boxShadow: '0 4px 12px rgba(17,38,60,.12)', cursor: 'pointer', fontSize: '16px', fontWeight: 800 } }, h(Icon, { key: 'ic', name: 'wand', size: 16 })), h('button', { key: 'launcher', type: 'button', className: 'mc-fab', onPointerDown: event => { suppressClick.current = false; drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y, moved: false } }, onClick: () => { if (suppressClick.current) { suppressClick.current = false; return } openPanel() }, style: buttonStyle, title: '对话增强器（⌘K）', 'aria-label': '打开对话增强器' }, h(Icon, { key: 'ic', name: 'sparkles', size: 22 })), panel])
    }

export { ConversationQuickAction as QuickEnhancer }
