import React from 'react'
import { h, C, S, workbenchStyle, GlobalStyle, Spinner, Icon } from './foundation.js'
import { planPromptEnhancement, detectLanguage, methodChoice, recommendMethods, selectedConversationDraft, cleanSummary, cleanContext, list, lightTemplate, fileMentions } from '../lib/utils.js'
import { withPrefix } from '../core/composer.js'

// ConversationQuickAction（对话快捷增强器 / QuickEnhancer）：开源核心组件，零宿主依赖。
// 所有外部能力经 props 注入；未注入的可选能力对应 UI 自动隐藏或降级：
//   methodProvider (必填) MethodProvider：方法源 + compose + getTemplate + 收藏/历史
//   composer       (必填) Composer：写入目标输入框（读写草稿均经此接口）
//   enhancer       (可选) Enhancer：语义增强模型；未注入时仅保留「轻量 · 零 Token」档位
//   messages       (可选) [{ id, role:'user'|'assistant', text }]：当前对话，供「加对话」参考
//   searchMemory   (可选) (query) => Promise<string>：项目记忆检索，供「加项目记忆」档位
function ConversationQuickAction({ methodProvider, composer, enhancer, messages, searchMemory, storagePrefix = 'promptkit.' }) {
  const storageKey = name => `${storagePrefix}quick-action.${name}`
  const msgs = list(messages)
  const [draft, setDraft] = React.useState(() => composer?.getDraft?.() || '')
  React.useEffect(() => {
    setDraft(composer?.getDraft?.() || '')
    if (!composer?.onChange) return undefined
    const off = composer.onChange(setDraft)
    return typeof off === 'function' ? off : undefined
  }, [composer])
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState('enhance')
  const [enhancementKind, setEnhancementKind] = React.useState('light')
  const [selected, setSelected] = React.useState([])
  const [methods, setMethods] = React.useState([])
  const [selectedMethodId, setSelectedMethodId] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [showAllMethods, setShowAllMethods] = React.useState(false)
  const [noticeState, setNoticeState] = React.useState(null)
  const setNotice = (text) => setNoticeState(text == null ? null : { text: String(text), kind: 'info' })
  const setError = (text) => setNoticeState({ text: String(text), kind: 'error' })
  const setWarn = (text) => setNoticeState({ text: String(text), kind: 'warn' })
  const [requirement, setRequirement] = React.useState('')
  const [useConversationContext, setUseConversationContext] = React.useState(false)
  const [useMemoryContext, setUseMemoryContext] = React.useState(false)
  const [memoryPreview, setMemoryPreview] = React.useState({ status: 'idle', query: '', text: '', sources: [] })
  const [memoryReceipt, setMemoryReceipt] = React.useState(null)
  const [undoDraft, setUndoDraft] = React.useState(null)
  const [libraryOpen, setLibraryOpen] = React.useState(false)
  const [librarySearch, setLibrarySearch] = React.useState('')
  const [libraryFavorites, setLibraryFavorites] = React.useState([])
  const [libraryHistory, setLibraryHistory] = React.useState([])
  const [enhancementMethodId, setEnhancementMethodId] = React.useState('')
  const [privateMarkdown, setPrivateMarkdown] = React.useState('')
  const [privateNotice, setPrivateNotice] = React.useState('')
  const [privateBackup, setPrivateBackup] = React.useState('')
  const [privateEditingId, setPrivateEditingId] = React.useState('')
  const [confirmDeletePrivateId, setConfirmDeletePrivateId] = React.useState('')
  const [metricsEnabled, setMetricsEnabled] = React.useState(() => { try { return window.localStorage.getItem(storageKey('metrics.enabled.v1')) === 'true' } catch { return false } })
  const [metrics, setMetrics] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('metrics.v1')) || '{}') } catch { return {} } })
  const [feedback, setFeedback] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('feedback.v1')) || '[]') } catch { return [] } })
  const [lastEnhancement, setLastEnhancement] = React.useState(null)
  const [confirmClearMetrics, setConfirmClearMetrics] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [activeSettingsPanel, setActiveSettingsPanel] = React.useState(null) // null | 'import' | 'backup' | 'manage'
  React.useEffect(() => {
    if (!settingsOpen) return undefined
    const handleMouseDown = event => {
      const target = event.target
      if (target && typeof target.closest === 'function' && (target.closest('[data-settings-dropdown]') || target.closest('[data-gear-button]'))) return
      setSettingsOpen(false)
      setActiveSettingsPanel(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [settingsOpen])

  const [recentMethodIds, setRecentMethodIds] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('recent-methods.v1')) || '[]') } catch { return [] } })
  const [methodUsage, setMethodUsage] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('method-usage.v1')) || '{}') } catch { return {} } })
  const [position, setPosition] = React.useState(() => {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey('position.v1')) || 'null')
      if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value
    } catch {}
    return { x: Math.max(24, window.innerWidth - 86), y: Math.max(96, window.innerHeight - 158) }
  })
  const drag = React.useRef(null)
  const suppressClick = React.useRef(false)
  const rootRef = React.useRef(null)
  const openPanel = () => setOpen(value => !value)
  React.useEffect(() => { if (!open) enhancer?.cancel() }, [open, enhancer])
  React.useEffect(() => { if (!enhancer && enhancementKind === 'semantic') setEnhancementKind('light') }, [enhancer, enhancementKind])
  React.useEffect(() => { if (mode === 'library' && !libraryOpen) setLibraryOpen(true) }, [mode, libraryOpen])
  React.useEffect(() => {
    let alive = true
    methodProvider.getFavorites?.().then(value => { if (alive) setLibraryFavorites(list(value)) }).catch(() => {})
    methodProvider.getHistory?.().then(value => { if (alive) setLibraryHistory(list(value)) }).catch(() => {})
    const offHistory = methodProvider.onHistoryChange?.(value => { if (alive) setLibraryHistory(list(value)) })
    return () => { alive = false; offHistory?.() }
  }, [methodProvider])
  React.useEffect(() => {
    if (!open || methods.length) return
    setLoading(true)
    methodProvider.list().then(value => setMethods(list(value))).catch(error => setError(String(error?.message || error))).finally(() => setLoading(false))
  }, [open, methods.length, methodProvider])
  React.useEffect(() => {
    const onKeydown = event => {
      if (event.key === 'Escape' && open) { setOpen(false); return }
      if (!(event.metaKey || event.ctrlKey)) return
      // 普通 Enter 在 textarea 内天然换行：Enter 提交分支位于 meta/ctrl 守卫之后，
      // 只有 ⌘/Ctrl+Enter 才会走到这里；再限定焦点在面板内，避免与宿主主输入框
      // 的 ⌘Enter 发送快捷键冲突。
      const insidePanel = rootRef.current?.contains(event.target)
      const index = Number(event.key) - 1
      if (Number.isInteger(index) && index >= 0 && index < autoMethods.length) {
        event.preventDefault()
        setEnhancementMethodId(autoMethods[index].id)
        if (open && mode === 'enhance') void enhanceIntoInput()
        else { setMode('enhance'); setOpen(true) }
        return
      }
      if (event.key === 'Enter' && open && insidePanel) { event.preventDefault(); if (mode === 'enhance') enhanceIntoInput(); else { const choice = methods.find(method => method.id === selectedMethodId); if (choice) void composeIntoInput(choice) }; return }
      if (event.key.toLowerCase() !== 'k') return
      event.preventDefault()
      openPanel()
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [msgs.length, selected.length, open, methods, selectedMethodId, requirement, useConversationContext, useMemoryContext, mode])
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
      try { window.localStorage.setItem(storageKey('position.v1'), JSON.stringify(position)) } catch {}
      drag.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [position])
  const toggle = id => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id])
  const activeMessages = msgs.filter(item => selected.includes(item.id)).reverse()
  const selectedChars = activeMessages.reduce((total, item) => total + item.text.length, 0)
  const selectedDraft = selectedConversationDraft(activeMessages)
  const canCompose = Boolean(requirement.trim() || selectedDraft.question)
  const selectedMethod = methods.find(method => method.id === selectedMethodId)
  const libraryMethod = libraryOpen ? selectedMethod : null
  const contextText = () => activeMessages.map(item => `${item.role === 'user' ? '用户' : '助手'}：${cleanContext(item.text)}`).join('\n').slice(0, 2400)
  const selectedContextText = useConversationContext ? contextText() : ''
  const referencedFiles = fileMentions(draft)
  const autoMethods = recommendMethods(methods, [draft, requirement, selectedContextText].filter(Boolean).join('\n'))
  const matchedMethod = methods.find(method => method.id === enhancementMethodId) || autoMethods[0]
  const loadMemory = async query => {
    const text = String(query || '').trim()
    if (!searchMemory) throw new Error('项目记忆服务未连接。')
    if (text.length < 8) throw new Error('草稿至少 8 个字符后再检索项目记忆。')
    setMemoryPreview({ status: 'loading', query: text, text: '', sources: [] })
    try {
      const raw = await searchMemory(text)
      const result = cleanContext(typeof raw === 'string' ? raw : raw?.text || '')
      const sources = Array.isArray(raw?.sources) ? raw.sources.filter(item => item?.label).slice(0, 6) : result ? [{ kind: 'memory-center', label: 'Memory Center 项目记忆' }] : []
      const next = { status: result || sources.length ? 'ready' : 'empty', query: text, text: result, sources }
      setMemoryPreview(next)
      return result
    } catch (error) {
      setMemoryPreview({ status: 'error', query: text, text: String(error?.message || error), sources: [] })
      throw error
    }
  }
  const importCard = async raw => {
    if (!methodProvider.importPrivateMarkdown) { setError('当前方法源不支持私有方法导入。'); return false }
    try {
      const method = await methodProvider.importPrivateMarkdown(raw)
      setMethods(await methodProvider.list())
      setSelectedMethodId(method.id)
      setEnhancementMethodId(method.id)
      setNotice(`已导入「${method.title}」到我的私有方法，可立即用于增强。`)
      return true
    } catch (error) { setError(String(error?.message || error)); return false }
  }
  const importPrivateMethod = async () => {
    try {
      const method = privateEditingId && methodProvider.updatePrivateMarkdown
        ? await methodProvider.updatePrivateMarkdown(privateEditingId, privateMarkdown)
        : await methodProvider.importPrivateMarkdown(privateMarkdown)
      setMethods(await methodProvider.list())
      setPrivateMarkdown('')
      setPrivateEditingId('')
      setPrivateNotice(privateEditingId ? '已保存私有方法。' : `已导入「${method.title}」。`)
    } catch (error) { setPrivateNotice(String(error?.message || error)) }
  }
  const privateMethodMarkdown = method => `# ${method.title}\n\n## Prompt\n\n\`\`\`\n${method.prompt}\n\`\`\``
  const editPrivateMethod = method => { setPrivateEditingId(method.id); setPrivateMarkdown(privateMethodMarkdown(method)); setPrivateNotice(`正在编辑「${method.title}」。`) }
  const deletePrivateMethod = async id => {
    if (confirmDeletePrivateId !== id) { setConfirmDeletePrivateId(id); return }
    await methodProvider.removePrivateMethod?.(id)
    setMethods(await methodProvider.list())
    setConfirmDeletePrivateId('')
    setPrivateNotice('已删除私有方法。')
  }
  const exportPrivateMethods = async () => {
    if (!methodProvider.exportPrivateMethods) { setPrivateNotice('当前方法源不支持私有方法备份。'); return }
    try {
      const contents = await methodProvider.exportPrivateMethods()
      const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'dsh-promptkit-private-methods.json'
      link.click()
      URL.revokeObjectURL(url)
      setPrivateNotice('已导出私有方法备份。')
    } catch (error) { setPrivateNotice(String(error?.message || error)) }
  }
  const importPrivateBackup = async () => {
    if (!methodProvider.importPrivateBackup) { setPrivateNotice('当前方法源不支持私有方法恢复。'); return }
    try {
      const methods = await methodProvider.importPrivateBackup(privateBackup)
      setMethods(await methodProvider.list())
      setPrivateBackup('')
      setPrivateNotice(`已恢复 ${methods.length} 个私有方法。`)
    } catch (error) { setPrivateNotice(String(error?.message || error)) }
  }
  const recordUsage = ({ kind, method }) => {
    if (!metricsEnabled) return
    setMetrics(value => {
      const next = { ...value, total: Number(value.total || 0) + 1, [kind]: Number(value[kind] || 0) + 1 }
      if (method) next[`method:${method}`] = Number(next[`method:${method}`] || 0) + 1
      try { window.localStorage.setItem(storageKey('metrics.v1'), JSON.stringify(next)) } catch {}
      return next
    })
  }
  // 增强结果三态信号（P2-2，2026-08）：记录一次增强最终是被 撤销 / 编辑后保留 / 原样保留。
  // 与用法计数同开关（metricsEnabled），零遥测、纯本地聚合。宿主无"发送"事件，故不区分发送。
  const outcomePendingRef = React.useRef(null)
  const setOutcomePending = value => { outcomePendingRef.current = value ? { ...value } : null }
  const clearOutcomeAt = value => {
    if (!outcomePendingRef.current) return
    if (metricsEnabled) {
      setMetrics(prev => {
        const next = { ...prev, outcome: { undo: Number(prev.outcome?.undo || 0), edited: Number(prev.outcome?.edited || 0), kept: Number(prev.outcome?.kept || 0), [value]: Number(prev.outcome?.[value] || 0) + 1 } }
        try { window.localStorage.setItem(storageKey('metrics.v1'), JSON.stringify(next)) } catch {}
        return next
      })
    }
    setOutcomePending(null)
  }
  React.useEffect(() => {
    if (!outcomePendingRef.current) return
    // 面板关闭且未被撤销/未被编辑命中的增强，记为"保留原样"（用户不再打开即已接受）。
    if (!open) clearOutcomeAt('kept')
    // 增强后用户实际编辑了结果（与增强输出、原稿都不同）→ 记为"编辑后再用"。
    else if (undoDraft && draft && draft !== undoDraft.after && draft !== undoDraft.before) clearOutcomeAt('edited')
  }, [open, draft, undoDraft])
  const saveFeedback = value => {
    if (!lastEnhancement) return
    const entry = { at: Date.now(), value, kind: lastEnhancement.kind, method: lastEnhancement.method || '' }
    setFeedback(rows => { const next = [entry, ...rows].slice(0, 100); try { window.localStorage.setItem(storageKey('feedback.v1'), JSON.stringify(next)) } catch {}; return next })
    setLastEnhancement(null)
  }
  const toggleMetrics = () => {
    const next = !metricsEnabled
    setMetricsEnabled(next)
    try { window.localStorage.setItem(storageKey('metrics.enabled.v1'), String(next)) } catch {}
  }
  const clearLocalSignals = () => {
    if (!confirmClearMetrics) { setConfirmClearMetrics(true); return }
    setMetrics({}); setFeedback([]); setConfirmClearMetrics(false)
    try { window.localStorage.removeItem(storageKey('metrics.v1')); window.localStorage.removeItem(storageKey('feedback.v1')) } catch {}
  }
  const rememberMethod = (method, question = draft) => {
    if (!method?.id) return
    methodProvider.pushHistory?.({ id: method.id, title: method.title || '', question: cleanSummary(question), at: Date.now() }).catch(() => {})
  }
  const composeIntoInput = async choice => {
    if (!choice || !composer) return
    const source = useConversationContext ? activeMessages : []
    if (!canCompose) { setWarn('请输入本次要求或问题；也可以选择一条用户消息作为问题。'); return }
    setLoading(true)
    try {
      const conversationDraft = selectedConversationDraft(source)
      const explicitRequirement = requirement.trim()
      const question = explicitRequirement || conversationDraft.question
      let facts = [explicitRequirement && conversationDraft.question ? `对话中的原始问题：${conversationDraft.question}` : '', conversationDraft.facts].filter(Boolean).join('\n')
      if (useMemoryContext && searchMemory) {
        const remembered = memoryPreview.status === 'ready' && memoryPreview.query === question ? memoryPreview.text : await loadMemory(question)
        if (remembered) facts = [facts, `项目记忆：${remembered}`].filter(Boolean).join('\n')
      }
      const composed = await methodProvider.compose({ methodId: choice.id, question, facts, constraints: conversationDraft.constraints, options: conversationDraft.options })
      const next = withPrefix(draft, composed.prompt)
      setUndoDraft({ before: draft, after: next })
      composer.write(next)
      rememberMethod(choice, question)
      setMethodUsage(value => { const nextUsage = { ...value, [choice.id]: Number(value[choice.id] || 0) + 1 }; try { window.localStorage.setItem(storageKey('method-usage.v1'), JSON.stringify(nextUsage)) } catch {}; return nextUsage })
      setRecentMethodIds(value => { const nextRecent = [choice.id, ...value.filter(id => id !== choice.id)].slice(0, 3); try { window.localStorage.setItem(storageKey('recent-methods.v1'), JSON.stringify(nextRecent)) } catch {}; return nextRecent })
      setNotice(`已按“${choice.title}”${source.length ? `整理 ${source.length} 条消息并` : ''}填入输入框，可编辑后发送。`)
      setOpen(false)
    } catch (error) { setError(String(error?.message || error)) }
    finally { setLoading(false) }
  }
  const fillLibraryTemplate = async () => {
    if (!libraryMethod) return
    setLoading(true)
    try {
      const template = await methodProvider.getTemplate(libraryMethod.id)
      setUndoDraft({ before: draft, after: template.prompt })
      composer?.write(template.prompt)
      rememberMethod(libraryMethod, draft)
      setNotice(`已将「${libraryMethod.title}」模板填入消息框。`)
      setOpen(false)
    } catch (error) { setError(String(error?.message || error)) }
    finally { setLoading(false) }
  }
  const adaptLibraryDraft = async () => {
    const source = draft.trim()
    if (!libraryMethod || !source) { setWarn('请先在输入框写下需要改造的原始请求。'); return }
    if (source.length > 3000) { setWarn(`草稿过长（${source.length} 字符），建议精简到 3000 字符以内再改造。`); return }
    if (!enhancer) { setError('未注入语义增强模型（enhancer），无法基于草稿改造。'); return }
    setLoading(true)
    try {
      const template = await methodProvider.getTemplate(libraryMethod.id)
      const body = await enhancer.enhance({ draft, extra: requirement, lang: detectLanguage(draft), kind: 'semantic', method: { title: libraryMethod.title, template: template.prompt } })
      setUndoDraft({ before: draft, after: body.prompt })
      composer?.write(body.prompt)
      rememberMethod(libraryMethod, draft)
      setNotice(`已按「${libraryMethod.title}」用模型改造草稿，可在此撤销或对比原稿。`)
      setOpen(false)
    } catch (error) {
      if (error?.name === 'AbortError') setNotice('已取消草稿改造，输入框未改动。')
      else if (error?.timeout) setError(`${error.message}（可稍后重试）`)
      else setError(String(error?.message || error))
    }
    finally { setLoading(false) }
  }
  const cancelEnhance = () => { setNotice('正在取消语义增强…'); enhancer?.cancel() }
  const enhanceIntoInput = async () => {
    setMemoryReceipt(null)
    const source = draft.trim()
    if (!source) { setWarn('请先在输入框中写入原始请求。'); return }
    const importSource = source.replace(/^\/import\b\s*/i, '')
    if (/^\/import\b/i.test(source) || /^(?:---\n[\s\S]*?\n---\n)?#\s+[^\n]+[\s\S]*?## Prompt\s*\n/.test(source)) {
      if (await importCard(importSource)) composer?.write('')
      return
    }
    const selection = composer.getSelection?.()
    const original = selection?.text || draft
    if (original.trim().length > 3000) { setWarn(`草稿过长（${original.trim().length} 字符），建议精简到 3000 字符以内再增强。`); return }
    const applyEnhanced = text => {
      if (selection?.text && composer.replaceSelection) {
        composer.replaceSelection(text, selection)
        return `${selection.draft.slice(0, selection.start)}${text}${selection.draft.slice(selection.end)}`
      }
      composer?.write(text)
      return text
    }
    if (enhancementKind === 'semantic') {
      if (!enhancer) { setNotice('未注入语义增强模型（enhancer），仅支持轻量增强。'); return }
      setLoading(true)
      try {
        let extra = [requirement.trim(), selectedContextText ? `对话参考：\n${selectedContextText}` : '', referencedFiles.length ? `已引用工作区文件：${referencedFiles.map(path => `@${path}`).join('、')}。请完整保留这些引用；文件内容会在用户发送后由 DSH @file 处理，当前改写不得假设或编造其内容。` : ''].filter(Boolean).join('\n\n')
        let remembered = ''
        if (useMemoryContext && searchMemory) {
          remembered = memoryPreview.status === 'ready' && memoryPreview.query === original ? memoryPreview.text : await loadMemory(original)
          if (remembered) extra = [extra, `项目记忆：${remembered}`].filter(Boolean).join('\n\n')
        }
        const template = matchedMethod ? await methodProvider.getTemplate(matchedMethod.id) : null
        const body = await enhancer.enhance({ draft: original, extra, lang: detectLanguage(original), kind: 'semantic', method: matchedMethod ? { title: matchedMethod.title, template: template.prompt } : undefined })
        const after = applyEnhanced(body.prompt)
        setUndoDraft({ before: selection?.draft || original, after })
        rememberMethod(matchedMethod, original)
        recordUsage({ kind: 'semantic', method: matchedMethod?.title })
        setLastEnhancement({ kind: 'semantic', method: matchedMethod?.title })
        setMemoryReceipt(useMemoryContext ? { used: Boolean(remembered), text: remembered, sources: memoryPreview.query === original ? memoryPreview.sources : [] } : null)
        setOutcomePending({ kind: 'semantic', method: matchedMethod?.title })
        setNotice(`语义增强完成${body.model ? `（${body.model}）` : ''}；${selection?.text ? '选中片段' : '草稿'}已替换，可在此撤销或对比原稿。`)
      } catch (error) {
        if (error?.name === 'AbortError') setNotice('已取消语义增强，草稿未改动。')
        else if (error?.timeout) setError(`${error.message}（可稍后重试）`)
        else setError(String(error?.message || error))
      }
      finally { setLoading(false) }
      return
    }
    const plan = enhancementPlan
    if (plan.tooShort) { setNotice('输入过短，未做增强，可直接发送。'); return }
    const after = applyEnhanced(plan.prompt)
    setUndoDraft({ before: selection?.draft || original, after })
    rememberMethod(matchedMethod, original)
    recordUsage({ kind: plan.method ? 'lightMethod' : 'lightGeneric', method: plan.method })
    setLastEnhancement({ kind: plan.method ? 'lightMethod' : 'lightGeneric', method: plan.method })
    setOutcomePending({ kind: plan.method ? 'lightMethod' : 'lightGeneric', method: plan.method })
    setNotice(plan.method ? `已采用「${plan.label || plan.method}」做保守增强${selection?.text ? '并替换选中片段' : ''}，可检查后直接发送。` : '已做最小化提示词整理，可检查后直接发送。')
  }
  const common = ['苏格拉底式提问', '第一性原理', '双向钢人论证'].map(title => methodChoice(methods, title)).filter(Boolean)
  const recommended = autoMethods
  const recentMethods = recentMethodIds.map(id => methods.find(method => method.id === id)).filter(Boolean)
  const libraryMatches = methods.filter(method => !librarySearch.trim() || `${method.title} ${method.purpose} ${method.tags}`.toLowerCase().includes(librarySearch.trim().toLowerCase()))
  const rankedCommon = [...common].sort((a, b) => Number(methodUsage[b.id] || 0) - Number(methodUsage[a.id] || 0))
  const panelAbove = position.y > 370
  const panelMaxHeight = Math.max(250, Math.min(640, panelAbove ? position.y - 82 : window.innerHeight - position.y - 82))
  const buttonStyle = { width: '44px', height: '44px', padding: 0, border: 0, borderRadius: '50%', background: C.actionBg, color: C.actionFg, cursor: 'grab', fontSize: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .16s ease, box-shadow .16s ease' }
  const fan = common.map((method, index) => h('button', { key: method.id, title: `选择：${method.title}`, disabled: loading, onClick: () => { setSelectedMethodId(method.id); setMode('method'); setOpen(true) }, style: { position: 'absolute', right: `${-8 + index * 48}px`, bottom: panelAbove ? `${62 + Math.abs(index - 1) * 25}px` : 'auto', top: panelAbove ? 'auto' : `${62 + Math.abs(index - 1) * 25}px`, width: '42px', height: '42px', overflow: 'hidden', border: `1px solid ${selectedMethodId === method.id ? C.teal : C.tealLine}`, borderRadius: '50%', background: selectedMethodId === method.id ? C.tealTint : C.surface, boxShadow: '0 6px 16px var(--pk-shadow-faint)', color: C.teal, cursor: 'pointer', fontSize: '10px', fontWeight: 800, lineHeight: 1.15, animation: 'pk-fan-in .22s ease both', animationDelay: `${index * 35}ms` } }, method.title.slice(0, 4)))
  const methodItems = showAllMethods ? methods : rankedCommon
  const methodCards = h('div', { style: { display: 'grid', gap: '7px' } }, methodItems.map(method => h('button', { key: method.id, className: 'pk-btn', disabled: loading, onClick: () => setSelectedMethodId(method.id), style: { width: '100%', padding: '10px 11px', border: `1px solid ${selectedMethodId === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: selectedMethodId === method.id ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer' } }, [h('div', { key: 'title', style: { display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px', fontWeight: 800 } }, [h('span', { key: 'name' }, method.title), selectedMethodId === method.id ? h('span', { key: 'picked', style: { color: C.teal } }, '已选择') : recommended.includes(method) ? h('span', { key: 'recommended', style: { color: C.teal } }, '推荐') : null]), h('div', { key: 'purpose', style: { marginTop: '3px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, method.purpose || '按该方法组织分析。')])) )
  const structurePreview = selectedMethod ? h('div', { style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `组装预览：草稿${useConversationContext ? ` + 已选对话 ${activeMessages.length} 条` : ''}${useMemoryContext ? ' + 项目记忆' : ''} · ${selectedMethod.title} 的分析结构`) : null
  const methodFooter = h('div', { style: { position: 'sticky', bottom: '-14px', margin: '10px -14px -14px', padding: '11px 14px 14px', borderTop: `1px solid ${C.tealLine}`, background: C.surface } }, [selectedMethod ? h('div', { key: 'outcome', style: { marginBottom: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint, fontSize: '12px', lineHeight: 1.5 } }, [h('strong', { key: 'title', style: { color: C.teal } }, `将使用「${selectedMethod.title}」`), h('div', { key: 'body', style: { marginTop: '3px', color: C.slate } }, selectedMethod.outcome || (selectedMethod.mode === 'guided' ? '先通过追问澄清问题，再推进下一步。' : '生成结构化分析、风险与下一步行动。'))]) : null, h('button', { key: 'generate', className: 'pk-btn', disabled: loading || !canCompose || !selectedMethod, onClick: () => composeIntoInput(selectedMethod), style: { width: '100%', padding: '11px 14px', border: 0, borderRadius: '9px', background: loading || !canCompose || !selectedMethod ? C.tealLine : C.teal, color: loading || !canCompose || !selectedMethod ? C.muted : C.surface, cursor: loading || !canCompose || !selectedMethod ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading ? h(Spinner, { key: 'spin', text: '正在组装…' }) : selectedMethod ? '生成并填入消息框' : '请选择一种方法')])
  const autoPlan = planPromptEnhancement(draft, requirement, methods, selectedContextText)
  const enhancementPlan = matchedMethod && !autoPlan.tooShort
    ? { ...autoPlan, method: matchedMethod.title, label: matchedMethod.title, ...lightTemplate(matchedMethod.title, draft, requirement ? `\n\n额外要求：${requirement}` : '') }
    : autoPlan
  const enhancementLang = detectLanguage(draft || '')
  const strategyNode = draft.trim() ? enhancementKind === 'semantic'
        ? [h('div', { key: 'meta', style: { marginBottom: '3px' } }, `将把当前 ${draft.trim().length} 个字符交给模型改写。`), autoMethods.length ? h('div', { key: 'method', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', color: C.teal } }, [h('span', { key: 'label' }, '自动匹配：'), ...autoMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setEnhancementMethodId(method.id), style: { border: `1px solid ${matchedMethod?.id === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '999px', background: matchedMethod?.id === method.id ? C.tealTintDeep : C.surface, color: C.teal, cursor: 'pointer', padding: '3px 7px', fontSize: '10px', fontWeight: 800 } }, matchedMethod?.id === method.id ? [h(Icon, { key: 'ck', name: 'check', size: 11, style: { marginRight: '2px' } }), method.title] : `改用 ${method.title}`))]) : h('div', { key: 'method', style: { color: C.muted } }, '未强行套用方法，只做结构化改写。'), h('div', { key: 'lang', style: { color: C.muted } }, `检测语言：${enhancementLang === 'en' ? '英文（输出与输入一致）' : enhancementLang === 'mixed' ? '中英混合（输出与输入一致）' : '中文'}。`), draft.trim().length > 3000 ? h('div', { key: 'warn', style: { marginTop: '3px', color: C.amber } }, '草稿超过 3000 字符，建议精简后再增强。') : null]
        : [h('strong', { key: 'method', style: { color: C.teal } }, enhancementPlan.tooShort ? '输入过短，直接使用原文' : enhancementPlan.label ? `拟采用：${enhancementPlan.label}` : '拟采用：轻量整理'), h('div', { key: 'reason', style: { marginTop: '3px' } }, enhancementPlan.reason), referencedFiles.length ? h('div', { key: 'files', style: { marginTop: '3px', color: C.teal } }, `保留 @ 文件引用：${referencedFiles.map(path => `@${path}`).join('、')}`) : null, enhancementPlan.signals?.length ? h('div', { key: 'signals', style: { marginTop: '3px' } }, `识别信号：${enhancementPlan.signals.join('、')}`) : null, enhancementPlan.conflicts?.length ? h('div', { key: 'conflicts', style: { marginTop: '3px', color: C.amber } }, `方法冲突：${enhancementPlan.conflicts.map(item => `${item.label || item.title}（命中“${item.signals.join('、')}”）`).join('；')}，采用「${enhancementPlan.label || enhancementPlan.method}」。`) : null, h('div', { key: 'size', style: { marginTop: '3px', color: C.muted } }, `预计 ${enhancementPlan.prompt.length} 字符。`)]
        : '当前输入框为空，请先写下原始请求。'
  const stepperSteps = [['选方式', '轻量或语义档'], ['加要求', '补充要求、对话或记忆'], ['看预览', '对比改前与改后']]
  const stepperStep = !draft.trim() ? 1 : (!requirement.trim() && !useConversationContext && !useMemoryContext) ? 2 : 3
  const stepperNode = h('div', { key: 'stepper', style: { display: 'flex', gap: '8px', marginTop: '12px' } }, stepperSteps.map((label, i) => { const n = i + 1; const done = n < stepperStep; const active = n === stepperStep; return h('div', { key: label, style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 1 } }, [h('span', { key: 'num', style: { width: '18px', height: '18px', flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: done || active ? C.teal : 'transparent', border: `1px solid ${done || active ? C.teal : C.tealLine}`, color: done || active ? C.surface : C.muted } }, n), h('span', { key: 'lbl', style: { fontSize: '11px', fontWeight: active ? 800 : 600, color: active ? C.teal : done ? C.slate : C.muted, whiteSpace: 'nowrap' } }, label), i < 2 ? h('span', { key: 'ln', style: { flex: 1, height: '1px', minWidth: '8px', background: done ? C.teal : C.divide } }, null) : null]) }))
  const methodSummaryNode = enhancementKind === 'light' && !enhancementPlan.tooShort ? h('div', { key: 'method-summary', style: { marginTop: '6px' } }, [h('div', { key: 'name', style: { fontSize: '12px', color: C.ink, fontWeight: 800 } }, enhancementPlan.label || '轻量整理'), enhancementPlan.reason ? h('div', { key: 'reason', style: { marginTop: '2px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, enhancementPlan.reason) : null]) : null
  const diffPreview = (() => { if (!draft.trim()) return null; if (enhancementKind === 'semantic') return h('div', { key: 'diff', style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, '语义档由模型改写，点击「应用」后生成结果，此处不提供实时预览。'); if (enhancementPlan.tooShort) return null; const after = (enhancementPlan.prompt || '').trim(); const before = draft.trim(); if (!after || before === after) return null; return h('div', { key: 'diff', style: { marginTop: '9px', overflow: 'hidden', border: `1px solid ${C.tealLine}`, borderRadius: '8px' } }, [h('div', { key: 'before', style: { padding: '8px 10px', background: C.redTint, color: C.slate, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word' } }, [h('span', { key: 'tag', style: { display: 'block', color: C.red, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '原文'), before]), h('div', { key: 'after', style: { padding: '8px 10px', background: C.tealTintDeep, color: C.ink, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word', borderTop: `1px solid ${C.tealLine}` } }, [h('span', { key: 'tag', style: { display: 'block', color: C.teal, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '增强后'), after])]) })()
  const costNode = enhancementKind === 'light' && draft.trim() && !enhancementPlan.tooShort ? h('div', { key: 'cost', style: { marginTop: '6px', display: 'flex', gap: '10px', color: C.muted, fontSize: '11px' } }, [h('span', { key: 'chars' }, `字符 ${draft.trim().length} → ${(enhancementPlan.prompt || '').trim().length}`), h('span', { key: 'token' }, 'Token 0'), h('span', { key: 'time' }, '本地 <1s')]) : null
  const signalsNode = enhancementKind === 'light' && enhancementPlan.signals?.length ? h('details', { key: 'signals', style: { marginTop: '6px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, `识别信号（${enhancementPlan.signals.length} 条）`), h('div', { style: { marginTop: '4px', color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, enhancementPlan.signals.join('、'))]) : null
  const draftStatusNode = h('div', { key: 'draft-status', style: { marginTop: '10px', fontSize: '11px', color: draft.trim() ? C.teal : C.muted, fontWeight: 700 } }, draft.trim() ? `草稿 · ${draft.trim().length} 字符` : '尚未输入草稿')
  const requirementNode = h('div', { key: 'requirement', className: 'pk-field', style: { marginTop: '5px', marginBottom: '9px' } }, [h('span', { key: 'label', className: 'pk-label pk-label--muted' }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), h('textarea', { key: 'input', value: requirement, onChange: event => setRequirement(event.target.value), placeholder: mode === 'enhance' ? '例如：使用简洁中文，先给结论，再列出实施步骤。' : '例如：请重点评估风险，并给出可执行的下一步。', style: { ...workbenchStyle.input, minHeight: '58px', resize: 'vertical', fontSize: '12px', lineHeight: 1.45 } })])
  const contextLevelNode = h('div', { key: 'context-level', style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '9px' } }, [msgs.length ? h('button', { key: 'conversation', className: 'pk-btn', onClick: () => setUseConversationContext(value => !value), style: { padding: '7px 9px', border: `1px solid ${useConversationContext ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: useConversationContext ? C.tealTintDeep : C.surface, color: useConversationContext ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, useConversationContext ? '✓ 对话参考' : '加对话') : null, searchMemory ? h('button', { key: 'memory', className: 'pk-btn', onClick: () => setUseMemoryContext(value => !value), style: { padding: '7px 9px', border: `1px solid ${useMemoryContext ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: useMemoryContext ? C.tealTintDeep : C.surface, color: useMemoryContext ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, useMemoryContext ? (enhancementKind === 'semantic' ? '✓ 项目记忆' : '✓ 项目记忆（语义档）') : '加项目记忆') : null])
  const contextNode = msgs.length ? h('details', { key: 'context', style: { marginTop: '8px', paddingTop: '9px', borderTop: `1px solid ${C.divide}` } }, [h('summary', { key: 'summary', style: { color: C.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer' } }, activeMessages.length ? `可选：调整已选的 ${activeMessages.length} 条对话参考` : '可选：选择对话作为参考'), activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, `自动归类：${selectedDraft.question ? '问题' : '—'} · ${selectedDraft.facts ? '事实' : '—'} · ${selectedDraft.constraints ? '约束' : '—'} · ${selectedDraft.options ? '方案' : '—'}`) : null, h('div', { key: 'privacy', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, '仅展示用户与助手文本；工具调用、工具结果和代码块不会进入此面板。'), h('div', { key: 'messages', style: { display: 'grid', gap: '6px', maxHeight: '210px', overflow: 'auto', paddingRight: '2px' } }, msgs.map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: '8px', padding: '8px', border: `1px solid ${selected.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '9px', background: selected.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { key: 'check', type: 'checkbox', checked: selected.includes(item.id), onChange: () => toggle(item.id), style: { marginTop: '2px', accentColor: C.teal } }), h('div', { key: 'text' }, [h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '11px', fontWeight: 800 } }, item.role === 'user' ? '你的消息' : '助手消息'), h('div', { key: 'body', style: { marginTop: '2px', color: C.slate, fontSize: '12px', lineHeight: 1.45 } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`)])])))]) : null
  const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]
  const enhancerKindSection = h('div', { key: 'enhancer-kind-section', style: { marginTop: '10px' } }, [h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? `模型会改写草稿${useConversationContext ? '，并引用已选对话' : ''}${useMemoryContext ? '，并检索项目记忆' : ''}。` : useMemoryContext ? '项目记忆已准备，但轻量档不会读取；切换到语义档后可预览并注入。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。')])
  const memorySourceLabels = sources => sources?.length ? h('div', { style: { marginTop: '6px', display: 'grid', gap: '3px', color: C.muted } }, sources.map((source, index) => h('div', { key: `${source.kind}:${index}` }, `来源：${source.label}`))) : null
  const enhancerPanel = h('div', { key: 'enhancer', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '决策摘要'), useMemoryContext && enhancementKind === 'semantic' ? h('div', { key: 'memory-preview', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '项目记忆预览'), h('button', { key: 'preview', className: 'pk-btn', disabled: memoryPreview.status === 'loading' || draft.trim().length < 8, onClick: () => loadMemory(draft).catch(() => {}), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, memoryPreview.status === 'loading' ? '检索中…' : '检索')]), memoryPreview.status === 'ready' ? h('div', { key: 'text', style: { marginTop: '6px', whiteSpace: 'pre-wrap' } }, [memoryPreview.text, memorySourceLabels(memoryPreview.sources)]) : memoryPreview.status === 'empty' ? h('div', { key: 'empty', style: { marginTop: '6px', color: C.muted } }, '未命中可用项目记忆。') : memoryPreview.status === 'error' ? h('div', { key: 'error', style: { marginTop: '6px', color: C.red } }, memoryPreview.text) : h('div', { key: 'hint', style: { marginTop: '6px', color: C.muted } }, draft.trim().length < 8 ? '草稿至少 8 个字符后可检索。' : '先预览命中的摘要，再决定是否交给模型。')]) : null, memoryReceipt ? h('div', { key: 'memory-receipt', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${memoryReceipt.used ? C.tealLine : C.amberLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, memoryReceipt.used ? [h('div', { key: 'text' }, `本次已注入项目记忆摘要：${memoryReceipt.text}`), memorySourceLabels(memoryReceipt.sources)] : '本次未注入项目记忆：未命中可用摘要。') : null, enhancementKind === 'light' ? h('div', { key: 'summary', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [methodSummaryNode, diffPreview, costNode, signalsNode]) : h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode), h('button', { key: 'enhance', className: 'pk-btn', disabled: !draft.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { width: '100%', marginTop: '10px', padding: '11px 14px', border: 0, borderRadius: '9px', background: draft.trim() && !loading ? C.actionBg : loading && enhancementKind === 'semantic' ? C.amber : C.tealLine, color: draft.trim() && !loading ? C.actionFg : loading && enhancementKind === 'semantic' ? C.onInk : C.muted, cursor: (draft.trim() && !loading) || (loading && enhancementKind === 'semantic') ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消增强' }) : loading ? h(Spinner, { key: 'spin', text: '正在增强…' }) : '应用增强到消息框')])
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const wide = vw >= 620
  const panelW = Math.min(wide ? 640 : 440, vw - 32)
  const enhanceBody = h('div', { key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,.8fr) minmax(0,1.2fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start', animation: 'pk-fade .2s ease' } }, [h('div', { key: 'config', style: { minWidth: 0 } }, [enhancerKindSection, draftStatusNode, requirementNode, contextLevelNode, contextNode]), h('div', { key: 'preview', style: { minWidth: 0 } }, [enhancerPanel])])
  const targetLeft = Math.max(8, Math.min(position.x + 52 - panelW, vw - 8 - panelW))
  const panelLeft = targetLeft - position.x
  const settingsSection = settingsOpen ? h('div', { key: 'settings-dropdown', 'data-settings-dropdown': 'true', style: { position: 'absolute', top: '52px', right: '14px', zIndex: 10, width: '320px', maxWidth: 'calc(100% - 28px)', padding: '11px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surfaceAlt, boxShadow: C.shadowLg } },
    activeSettingsPanel === null
      ? [
          h('div', { key: 'settings-head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }, [
            h('strong', { key: 't', style: { fontSize: '12px', color: C.ink } }, '设置'),
            h('button', { key: 'x', onClick: () => setSettingsOpen(false), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '12px' } }, '×')
          ]),
          h('div', { key: 'pref' }, [
            h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'PREFERENCE · 偏好'),
            h('label', { key: 'toggle', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '6px', padding: '6px 8px', borderRadius: '7px', cursor: 'pointer' } }, [
              h('span', { key: 'name', style: { fontSize: '11px', color: C.slate } }, '本地使用信号（默认关闭）'),
              h('input', { key: 'cb', type: 'checkbox', checked: metricsEnabled, onChange: toggleMetrics, style: { accentColor: C.teal, cursor: 'pointer' } })
            ]),
            metricsEnabled ? h('div', { key: 'nums', style: { marginTop: '4px', paddingLeft: '8px', color: C.muted, fontSize: '10px' } }, `轻量 ${Number(metrics.light || 0)} · 语义 ${Number(metrics.semantic || 0)} · 反馈 ${feedback.length}`) : null
          ]),
          h('div', { key: 'data', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [
            h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'DATA · 导入 / 备份'),
            h('button', { key: 'import', onClick: () => setActiveSettingsPanel('import'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 导入 Obsidian Prompt 卡片'),
            h('button', { key: 'backup', onClick: () => setActiveSettingsPanel('backup'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 备份或恢复私有方法')
          ]),
          h('div', { key: 'priv', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [
            h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'PRIVATE · 私有方法'),
            h('button', { key: 'manage', onClick: () => setActiveSettingsPanel('manage'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 管理我的私有方法')
          ]),
        ]
      : [
          h('button', { key: 'back', onClick: () => setActiveSettingsPanel(null), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800, marginBottom: '7px' } }, '← 返回'),
          activeSettingsPanel === 'import' ? h('div', { key: 'panel-import', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [
            h('strong', { key: 't', style: { fontSize: '12px' } }, '导入 Obsidian Prompt 卡片'),
            h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '粘贴一张 Markdown 卡片即可，仅保存到当前浏览器；不会读取或上传你的笔记库。'),
            h('textarea', { key: 'md', value: privateMarkdown, onChange: event => setPrivateMarkdown(event.target.value), placeholder: '# 我的方法\n\n## Prompt\n```\n提示词正文\n```', style: { ...workbenchStyle.input, width: '100%', minHeight: '90px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            h('button', { key: 'go', className: 'pk-btn', disabled: !privateMarkdown.trim(), onClick: importPrivateMethod, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateMarkdown.trim() ? 1 : .55 } }, privateEditingId ? '保存修改' : '导入到我的私有方法'),
            privateNotice ? h('div', { key: 'nt', style: { marginTop: '5px', color: C.teal, fontSize: '10px' } }, privateNotice) : null
          ]) : activeSettingsPanel === 'backup' ? h('div', { key: 'panel-backup', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [
            h('strong', { key: 't', style: { fontSize: '12px' } }, '备份或恢复私有方法'),
            h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '导出 JSON 备份；恢复只会追加，不会删除当前私有方法。'),
            h('button', { key: 'exp', className: 'pk-btn', onClick: exportPrivateMethods, style: { ...workbenchStyle.action, marginTop: '6px' } }, '导出私有方法'),
            h('textarea', { key: 'bk', value: privateBackup, onChange: event => setPrivateBackup(event.target.value), placeholder: '粘贴此前导出的 JSON 备份', style: { ...workbenchStyle.input, width: '100%', minHeight: '64px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            h('button', { key: 'imp', className: 'pk-btn', disabled: !privateBackup.trim(), onClick: importPrivateBackup, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateBackup.trim() ? 1 : .55 } }, '恢复私有方法'),
          ]) : h('div', { key: 'panel-manage', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [
            h('strong', { key: 't', style: { fontSize: '12px' } }, '管理我的私有方法'),
            ...(methods.filter(method => method.source === 'private').length ? methods.filter(method => method.source === 'private').map(method => h('div', { key: method.id, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginTop: '7px', fontSize: '11px' } }, [
              h('span', { style: { color: C.slate } }, method.title),
              h('span', null, [
                h('button', { key: 'e', onClick: () => { editPrivateMethod(method); setActiveSettingsPanel('import') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px' } }, '编辑'),
                h('button', { key: 'd', onClick: () => deletePrivateMethod(method.id), style: { marginLeft: '6px', border: 0, background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '11px' } }, confirmDeletePrivateId === method.id ? '再次点击删除' : '删除')
              ])
            ])) : [h('div', { key: 'empty', style: { marginTop: '7px', color: C.muted, fontSize: '11px' } }, '尚无私有方法，可从「DATA → 导入 Obsidian Prompt 卡片」添加。')]),
          ])
        ]
  ) : null
  const panel = open ? h('section', { className: 'pk-scroll', role: 'dialog', 'aria-label': '对话增强器', style: { position: 'absolute', left: panelLeft, ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: `${panelW}px`, maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px var(--pk-shadow-lg)', color: C.ink, zIndex: 30, animation: 'pk-pop .2s ease' } }, [
        h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, libraryOpen ? '从提示词库选择模板：可直接填入消息框，或基于当前草稿调用模型按该方法改造。' : mode === 'enhance' ? '把当前输入框提示词做增强或改写，只填入消息框，不会自动发送。' : '写问题即可直接处理；也可选择对话消息作为额外参考。生成内容只填入消息框，不会自动发送。')]), h('div', { key: 'actions', style: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 } }, [h('button', { key: 'gear', 'data-gear-button': 'true', onClick: () => { setSettingsOpen(value => !value); if (settingsOpen) setActiveSettingsPanel(null) }, style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: settingsOpen ? C.tealTint : 'transparent', color: C.teal, cursor: 'pointer' }, 'aria-label': '设置' }, h(Icon, { key: 'ic', name: 'settings', size: 16 })), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))])]),
        libraryOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '10px 11px', borderRadius: '10px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, [h('span', { key: 'count' }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '未选择对话 · 可直接写问题'), msgs.length ? h('button', { key: 'recent', onClick: () => setSelected(msgs.slice(0, 4).map(item => item.id)), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '选择最近 4 条') : null]),
        undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } clearOutcomeAt('undo'); composer?.write(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
        h('div', { key: 'mode', style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '12px' } }, [['enhance', '智能增强'], ['method', '手动选方法']].map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => { setMode(id); setLibraryOpen(false) }, style: { padding: '8px', border: `1px solid ${mode === id && !libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: mode === id && !libraryOpen ? C.tealTintDeep : C.surface, color: mode === id && !libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label)).concat(h('button', { key: 'library', className: 'pk-btn', onClick: () => { const next = !libraryOpen; setMode(next ? 'library' : 'method'); setLibraryOpen(next) }, style: { padding: '8px', border: `1px solid ${libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: libraryOpen ? C.tealTintDeep : C.surface, color: libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '方法库'))),
        mode === 'enhance' && !libraryOpen ? stepperNode : null,
        settingsOpen ? settingsSection : null,
        libraryOpen ? h('div', { key: 'library-panel', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, animation: 'pk-fade .2s ease' } }, [h('input', { key: 'search', value: librarySearch, onChange: event => setLibrarySearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }), libraryFavorites.length ? h('div', { key: 'favorites', style: { marginTop: '8px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '我的收藏：'), ' ', libraryFavorites.map(id => methods.find(method => method.id === id)).filter(Boolean).map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, method.title))]) : null, libraryHistory.length ? h('div', { key: 'history', style: { marginTop: '7px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '最近生成：'), ' ', libraryHistory.slice(0, 3).map(item => h('button', { key: `${item.id}:${item.at}`, className: 'pk-btn', onClick: () => { setSelectedMethodId(item.id); setMode('method'); if (item.question) setRequirement(item.question); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, item.title || '未命名方法'))]) : null, h('div', { key: 'matches', style: { display: 'grid', gap: '5px', maxHeight: '180px', overflowY: 'auto', marginTop: '8px' } }, libraryMatches.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '10px 11px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: method.id === selectedMethodId ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '12px' } }, [h('strong', { key: 'title', style: { fontSize: '12px', fontWeight: 800 } }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted, fontSize: '11px' } }, method.purpose || method.category)])))] ) : null,
        libraryOpen ? h('div', { key: 'library-actions', style: { marginTop: '8px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface, animation: 'pk-fade .2s ease' } }, [h('select', { key: 'select', value: selectedMethodId, onChange: event => setSelectedMethodId(event.target.value), style: { width: '100%', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, fontSize: '12px' } }, [h('option', { key: 'empty', value: '' }, '选择一个提示词…'), ...libraryMatches.map(method => h('option', { key: method.id, value: method.id }, method.title))]), libraryMethod ? h('div', { key: 'selected', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, `已选择「${libraryMethod.title}」：可直接填充模板，或基于当前草稿改造。`) : null, h('div', { key: 'buttons', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '9px' } }, [h('button', { key: 'fill', className: 'pk-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.actionPrimary, opacity: libraryMethod ? 1 : .5 } }, '填充模板'), h('button', { key: 'adapt', className: 'pk-btn', disabled: !libraryMethod || !draft.trim() || loading || !enhancer, onClick: adaptLibraryDraft, style: { ...workbenchStyle.action, opacity: libraryMethod && draft.trim() && enhancer ? 1 : .55 } }, loading ? h(Spinner, { key: 'spin', text: '改造中…' }) : '基于草稿改造')])]) : null,
        mode === 'enhance' ? enhanceBody : null,
        mode === 'method' ? h('div', { key: 'method-config', style: { animation: 'pk-fade .2s ease' } }, [draftStatusNode, requirementNode, contextLevelNode, contextNode]) : null,
        lastEnhancement ? h('div', { key: 'feedback', style: { marginTop: '12px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, color: C.slate, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ck', name: 'check', size: 14, style: { color: C.teal } }), h('span', { key: 'label', style: { flex: 1 } }, '增强完成，可在此撤销或反馈'), h('button', { key: 'up', onClick: () => saveFeedback('up'), title: '有用', 'aria-label': '有用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-u', name: 'thumbsUp', size: 15 })), h('button', { key: 'down', onClick: () => saveFeedback('down'), title: '没用', 'aria-label': '没用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-d', name: 'thumbsDown', size: 15 }))]) : null,
        h('div', { key: 'methods', style: { display: mode === 'method' ? 'block' : 'none', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]), h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'), recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null, methodCards, structurePreview, methodFooter]),
        noticeState ? h('div', { key: 'notice', role: 'status', 'aria-live': 'polite', style: { marginTop: '10px', padding: '9px 11px', borderRadius: '8px', border: `1px solid ${noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amberLine : C.tealLine}`, background: noticeState.kind === 'error' ? C.redTint : noticeState.kind === 'warn' ? C.amberTint : C.tealTint, color: noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amber : C.teal, fontSize: '12px', lineHeight: 1.45 } }, noticeState.text) : null,
      ]) : null
  return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 30 } }, [h(GlobalStyle, { key: 'gcss' }), h('button', { key: 'launcher', type: 'button', className: 'pk-fab', onPointerDown: event => { suppressClick.current = false; drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y, moved: false } }, onClick: () => { if (suppressClick.current) { suppressClick.current = false; return } setMode('enhance'); setLibraryOpen(false); setOpen(true) }, style: buttonStyle, title: '智能增强（⌘K）', 'aria-label': '打开智能增强', onMouseEnter: event => { event.currentTarget.style.transform = 'scale(1.06)' }, onMouseLeave: event => { event.currentTarget.style.transform = 'scale(1)' } }, h(Icon, { key: 'ic', name: 'sparkles', size: 18 })), panel])
}

export { ConversationQuickAction as QuickEnhancer }
