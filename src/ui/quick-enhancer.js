import React from 'react'
import { h, C, S, workbenchStyle, GlobalStyle, Spinner, Icon, LatexText, Card } from './foundation.js'
import { planPromptEnhancement, detectLanguage, methodChoice, recommendMethods, selectedConversationDraft, cleanSummary, cleanContext, list, lightTemplate, fileMentions } from '../lib/utils.js'
import { withPrefix } from '../core/composer.js'

// ConversationQuickAction（对话快捷增强器 / QuickEnhancer）：开源核心组件，零宿主依赖。
// 所有外部能力经 props 注入；未注入的可选能力对应 UI 自动隐藏或降级：
//   methodProvider (必填) MethodProvider：方法源 + compose + getTemplate + 收藏/历史
//   assetProvider  (可选) AssetProvider：本地灵感库；未注入时隐藏入口
//   composer       (必填) Composer：写入目标输入框（读写草稿均经此接口）
//   enhancer       (可选) Enhancer：语义增强模型；未注入时仅保留「轻量 · 零 Token」档位
//   messages       (可选) [{ id, role:'user'|'assistant', text }]：当前对话，供「加对话」参考
//   searchMemory   (可选) (query) => Promise<string>：项目记忆检索，供「加项目记忆」档位
function ConversationQuickAction({ methodProvider, assetProvider, composer, enhancer, messages, searchMemory, storagePrefix = 'promptkit.' }) {
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
  const [contextOverlayOpen, setContextOverlayOpen] = React.useState(false)
  const [memoryPreview, setMemoryPreview] = React.useState({ status: 'idle', query: '', text: '', sources: [] })
  const [memoryReceipt, setMemoryReceipt] = React.useState(null)
  const [undoDraft, setUndoDraft] = React.useState(null)
  const [libraryOpen, setLibraryOpen] = React.useState(false)
  const [librarySearch, setLibrarySearch] = React.useState('')
  const [libraryFavorites, setLibraryFavorites] = React.useState([])
  const [libraryHistory, setLibraryHistory] = React.useState([])
  const [vaultOpen, setVaultOpen] = React.useState(false)
  const [vaultItems, setVaultItems] = React.useState([])
  const [vaultSearch, setVaultSearch] = React.useState('')
  const [vaultTitle, setVaultTitle] = React.useState('')
  const [vaultTags, setVaultTags] = React.useState('')
  const [vaultNote, setVaultNote] = React.useState('')
  const [vaultBody, setVaultBody] = React.useState('')
  const [vaultProject, setVaultProject] = React.useState('')
  const [vaultProjectFilter, setVaultProjectFilter] = React.useState('')
  const [vaultParentId, setVaultParentId] = React.useState('')
  const [vaultEditingId, setVaultEditingId] = React.useState('')
  const [vaultFormOpen, setVaultFormOpen] = React.useState(false)
  const [vaultCompareId, setVaultCompareId] = React.useState('')
  const [expandedVaultId, setExpandedVaultId] = React.useState('')
  const [vaultThinkingKind, setVaultThinkingKind] = React.useState('conclusion')
  const [vaultEpistemicStatus, setVaultEpistemicStatus] = React.useState('inferred')
  const [vaultRationale, setVaultRationale] = React.useState('')
  const [vaultNextAction, setVaultNextAction] = React.useState('')
  const [vaultRelatedIds, setVaultRelatedIds] = React.useState([])
  const [vaultDialectic, setVaultDialectic] = React.useState({ thesis: '', antithesis: '', synthesis: '' })
  const [vaultVerification, setVaultVerification] = React.useState({ status: 'pending', evidence: '', checkedAt: 0 })
  const [vaultGraphFocusId, setVaultGraphFocusId] = React.useState('')
  const [vaultTab, setVaultTab] = React.useState('vault')
  const [reviewOpen, setReviewOpen] = React.useState(false)
  const [reviewCards, setReviewCards] = React.useState([])
  const [assetContextIds, setAssetContextIds] = React.useState([])
  const [assetContextReceipt, setAssetContextReceipt] = React.useState(null)
  const [slashOpen, setSlashOpen] = React.useState(false)
  const [slashActiveIndex, setSlashActiveIndex] = React.useState(0)
  const [vaultType, setVaultType] = React.useState('prompt')
  const [vaultBackup, setVaultBackup] = React.useState('')
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
  const slashMatches = vaultItems.filter(item => !vaultSearch.trim() || `${item.title} ${(item.tags || []).join(' ')}`.toLowerCase().includes(vaultSearch.trim().toLowerCase())).slice(0, 5)
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
  // 表单默认收起，由用户主动点「+ 新建」展开；仅在「保存草稿到 Vault」时自动打开（line 284）
  // 注意：vaultItems 异步加载初始为 []，若在此 effect 中判断 length===0 会误触展开，故不设自动展开
  React.useEffect(() => {
    let alive = true
    methodProvider.getFavorites?.().then(value => { if (alive) setLibraryFavorites(list(value)) }).catch(() => {})
    methodProvider.getHistory?.().then(value => { if (alive) setLibraryHistory(list(value)) }).catch(() => {})
    const offHistory = methodProvider.onHistoryChange?.(value => { if (alive) setLibraryHistory(list(value)) })
    return () => { alive = false; offHistory?.() }
  }, [methodProvider])
  React.useEffect(() => {
    if (!assetProvider) return undefined
    let alive = true
    const refresh = () => assetProvider.list().then(rows => { if (alive) setVaultItems(list(rows)) }).catch(() => {})
    refresh()
    const off = assetProvider.onChange?.(refresh)
    return () => { alive = false; off?.() }
  }, [assetProvider])
  // 命名空间调用：只处理 /pk 关键词 或 /pk:关键词，绝不抢占 DSH 原生命令。
  React.useEffect(() => {
    const match = String(draft || '').match(/^\/pk(?:\s+(.*)|:(.*))?$/i)
    if (!assetProvider || !match) { setSlashOpen(false); return }
    setVaultSearch(String(match[1] ?? match[2] ?? '').trim()); setSlashActiveIndex(0); setSlashOpen(true)
  }, [draft, assetProvider])
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
    if (!slashOpen) return undefined
    const onKeydown = event => {
      // DSH 会把 Enter 解释为发送。斜杠菜单打开时必须在 window 捕获阶段吞掉按键，
      // 否则“插入”与“发送”会在同一次 keydown 中同时发生。
      const consume = () => { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.() }
      if (event.key === 'Escape') { consume(); setSlashOpen(false); return }
      if (event.key === 'ArrowDown') { consume(); setSlashActiveIndex(index => Math.min(slashMatches.length - 1, index + 1)); return }
      if (event.key === 'ArrowUp') { consume(); setSlashActiveIndex(index => Math.max(0, index - 1)); return }
      if (event.key === 'Enter' && slashMatches[slashActiveIndex]) { consume(); void useVaultItem(slashMatches[slashActiveIndex], 'replace') }
    }
    window.addEventListener('keydown', onKeydown, true)
    return () => window.removeEventListener('keydown', onKeydown, true)
  }, [slashOpen, slashActiveIndex, slashMatches])
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
  const selectAllMessages = () => setSelected(msgs.map(m => m.id))
  const clearAllSelections = () => setSelected([])
  const selectRecentN = (n) => {
    const num = Math.max(1, Math.min(parseInt(String(n)) || 3, msgs.length))
    setSelected(msgs.slice(-num).map(m => m.id))
  }

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
  const saveToVault = async (body, provenance = {}) => {
    if (!assetProvider) { setWarn('当前宿主未连接灵感库。'); return }
    try {
      const item = await assetProvider.save({ id: vaultEditingId || undefined, title: vaultTitle, body, tags: vaultTags, note: vaultNote, type: vaultType, project: vaultProject, parentId: vaultParentId, thinkingKind: vaultThinkingKind, epistemicStatus: vaultEpistemicStatus, rationale: vaultRationale, nextAction: vaultNextAction, relatedIds: vaultRelatedIds, dialectic: vaultThinkingKind === 'dialectic' ? vaultDialectic : undefined, verification: vaultThinkingKind === 'assumption' || vaultEpistemicStatus === 'to_verify' ? vaultVerification : undefined, provenance: { ...provenance, ...(assetContextReceipt ? { contextAssetIds: assetContextReceipt.ids } : {}) } })
      const action = vaultEditingId ? '已更新' : '已保存'
      setVaultTitle(''); setVaultTags(''); setVaultNote(''); setVaultBody(''); setVaultParentId(''); setVaultEditingId(''); setVaultFormOpen(false); setVaultThinkingKind('conclusion'); setVaultEpistemicStatus('inferred'); setVaultRationale(''); setVaultNextAction(''); setVaultRelatedIds([]); setVaultDialectic({ thesis: '', antithesis: '', synthesis: '' }); setVaultVerification({ status: 'pending', evidence: '', checkedAt: 0 })
      setNotice(`${action}「${item.title}」。`)
    } catch (error) { setError(String(error?.message || error)) }
  }
  const useVaultItem = async (item, mode = 'append') => {
    if (!item?.body) return
    const current = composer?.getDraft?.() || ''
    const slashInvocation = current.match(/^\/pk(?:\s+.*|:.*)?$/i)
    const next = slashInvocation ? item.body : mode === 'replace' ? item.body : withPrefix(current, item.body)
    composer?.write(next)
    await assetProvider?.markUsed?.(item.id)
    setUndoDraft({ before: draft, after: next })
    setNotice(`已${slashInvocation || mode === 'replace' ? '插入' : '追加'}「${item.title}」到消息框，可编辑后发送。`)
    setSlashOpen(false); setOpen(false)
  }
  const selectedMessageBody = () => activeMessages.map(item => `${item.role === 'user' ? '用户' : '助手'}：${cleanContext(item.text)}`).join('\n\n')
  const saveSelectedMessages = () => saveToVault(selectedMessageBody(), { kind: 'conversation-selection', messageIds: activeMessages.map(item => item.id) })
  const suggestThinkingCard = source => {
    const text = String(source || '').trim()
    const kind = /假设|可能|也许|推测|猜想/.test(text) ? 'assumption' : /应该|建议|下一步|行动/.test(text) ? 'action' : /决定|选择|方案/.test(text) ? 'decision' : /问题|为什么|如何|是否/.test(text) ? 'question' : /事实|数据|显示|确认/.test(text) ? 'fact' : 'conclusion'
    return { kind, epistemic: kind === 'assumption' ? 'to_verify' : kind === 'fact' ? 'verified' : 'inferred' }
  }
  const createThinkingCardFromConversation = () => {
    const body = selectedMessageBody()
    if (!body) { setWarn('请先选择至少一条对话。'); return }
    const suggested = suggestThinkingCard(body)
    setVaultBody(body); setVaultTitle(cleanSummary(body).slice(0, 40)); setVaultThinkingKind(suggested.kind); setVaultEpistemicStatus(suggested.epistemic); setVaultVerification({ status: suggested.epistemic === 'to_verify' ? 'pending' : 'confirmed', evidence: '', checkedAt: 0 }); setVaultFormOpen(true); setVaultOpen(true)
    setNotice('已从已选对话生成思考卡草稿，请确认分类与认识状态后保存。')
  }
  const prepareConversationReview = () => {
    const source = selectedMessageBody()
    if (!source) { setWarn('请先选择至少一条对话。'); return }
    const derived = selectedConversationDraft(activeMessages)
    const rows = [
      ['fact', 'verified', '已证实的事实', derived.facts],
      ['assumption', 'to_verify', '待验证的假设', derived.constraints],
      ['decision', 'inferred', '已做出的决策', derived.options],
      ['question', 'to_verify', '尚未解决的问题', derived.unresolved || derived.question],
      ['action', 'inferred', '下一步行动', '基于以上结论，验证关键假设并推进下一步。'],
    ].filter(([, , , body]) => String(body || '').trim()).map(([thinkingKind, epistemicStatus, title, body], index) => ({ id: `review:${index}`, thinkingKind, epistemicStatus, title, body: String(body).trim(), checked: true }))
    if (!rows.length) rows.push({ id: 'review:summary', thinkingKind: 'conclusion', epistemicStatus: 'inferred', title: '本次对话结论', body: source, checked: true })
    setReviewCards(rows); setReviewOpen(true)
  }
  const saveConversationReview = async () => {
    const chosen = reviewCards.filter(card => card.checked)
    if (!chosen.length) { setWarn('请至少保留一张复盘卡。'); return }
    try {
      const saved = []
      for (const card of chosen) saved.push(await assetProvider.save({ title: card.title, body: card.body, type: 'insight', thinkingKind: card.thinkingKind, epistemicStatus: card.epistemicStatus, nextAction: card.thinkingKind === 'action' ? card.body : '', provenance: { kind: 'conversation-review', messageIds: activeMessages.map(item => item.id) } }))
      const ids = saved.map(item => item.id)
      await Promise.all(saved.map(item => assetProvider.save({ ...item, relatedIds: ids.filter(id => id !== item.id) })))
      setReviewOpen(false); setNotice(`已从本次对话沉淀 ${saved.length} 张关联思考卡。`)
    } catch (error) { setError(String(error?.message || error)) }
  }
  const quoteSelectedMessages = () => {
    if (!activeMessages.length) return
    const quoted = selectedMessageBody().split('\n').map(line => `> ${line}`).join('\n')
    const next = withPrefix(composer?.getDraft?.() || '', quoted)
    composer?.write(next)
    setUndoDraft({ before: draft, after: next })
    setNotice(`已引用 ${activeMessages.length} 条对话到消息框，可继续追问或改写。`)
    setOpen(false)
  }
  const deriveVaultItem = item => {
    setVaultTitle(`${item.title} · 变体`); setVaultBody(item.body); setVaultTags((item.tags || []).join(', ')); setVaultType(item.type || 'prompt'); setVaultProject(item.project || ''); setVaultParentId(item.id); setVaultEditingId(''); setVaultFormOpen(true); setVaultThinkingKind(item.thinkingKind || 'conclusion'); setVaultEpistemicStatus(item.epistemicStatus || 'inferred'); setVaultRationale(item.rationale || ''); setVaultNextAction(item.nextAction || ''); setVaultRelatedIds(item.relatedIds || []); setVaultDialectic(item.dialectic || { thesis: '', antithesis: '', synthesis: '' }); setVaultVerification(item.verification || { status: 'pending', evidence: '', checkedAt: 0 })
    setNotice(`已载入「${item.title}」作为派生版本；编辑后保存即可保留来源关系。`)
  }
  const editVaultItem = item => {
    setVaultEditingId(item.id); setVaultTitle(item.title); setVaultBody(item.body); setVaultTags((item.tags || []).join(', ')); setVaultNote(item.note || ''); setVaultType(item.type || 'prompt'); setVaultProject(item.project || ''); setVaultParentId(item.parentId || ''); setVaultFormOpen(true); setVaultThinkingKind(item.thinkingKind || 'conclusion'); setVaultEpistemicStatus(item.epistemicStatus || 'inferred'); setVaultRationale(item.rationale || ''); setVaultNextAction(item.nextAction || ''); setVaultRelatedIds(item.relatedIds || []); setVaultDialectic(item.dialectic || { thesis: '', antithesis: '', synthesis: '' }); setVaultVerification(item.verification || { status: 'pending', evidence: '', checkedAt: 0 })
    setNotice(`正在编辑「${item.title}」。`)
  }
  const copyVaultItem = async item => {
    try { await navigator.clipboard?.writeText(item.body); await assetProvider?.markUsed?.(item.id); setNotice(`已复制「${item.title}」。`) }
    catch { setWarn('复制失败，请手动选择内容复制。') }
  }
  const exportVault = async () => {
    try {
      const contents = await assetProvider?.export?.()
      const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url; link.download = 'dsh-promptkit-vault.json'; link.click(); URL.revokeObjectURL(url)
      setNotice('已导出灵感库备份。')
    } catch (error) { setError(String(error?.message || error)) }
  }
  const exportProjectMarkdown = () => {
    const rows = vaultItems.filter(item => !vaultProjectFilter || item.project === vaultProjectFilter)
    const title = vaultProjectFilter || '全部灵感资产'
    const markdown = [`# ${title}`, '', `导出时间：${new Date().toLocaleString()}`, '', ...rows.flatMap(item => [`## ${item.title}`, `- 类型：${item.thinkingKind || 'conclusion'} · ${item.epistemicStatus || 'inferred'}`, item.rationale ? `- 为什么重要：${item.rationale}` : '', item.nextAction ? `- 下一步：${item.nextAction}` : '', '', item.body, ''])].filter(Boolean).join('\n')
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' })); const link = document.createElement('a'); link.href = url; link.download = `${title.replace(/[^\w\u4e00-\u9fff-]+/g, '-') || 'promptkit'}-review.md`; link.click(); URL.revokeObjectURL(url)
    setNotice(`已导出 ${rows.length} 条资产的 Markdown 复盘。`)
  }
  const organizeVault = async () => {
    const updates = vaultItems.filter(item => !item.project || item.thinkingKind === 'conclusion').map(item => {
      const suggestion = suggestThinkingCard(item.body)
      return assetProvider.save({ ...item, thinkingKind: item.thinkingKind === 'conclusion' ? suggestion.kind : item.thinkingKind, epistemicStatus: item.epistemicStatus === 'inferred' ? suggestion.epistemic : item.epistemicStatus, tags: [...(item.tags || []), suggestion.kind].filter((tag, index, tags) => tags.indexOf(tag) === index) })
    })
    await Promise.all(updates); setNotice(`已为 ${updates.length} 条资产补充本地分类建议，可继续手动修订。`)
  }
  const importVault = async () => {
    try {
      const items = await assetProvider?.import?.(vaultBackup)
      setVaultBackup(''); setNotice(`已追加恢复 ${items?.length || 0} 条灵感资产。`)
    } catch (error) { setError(String(error?.message || error)) }
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
        const contextAssets = vaultItems.filter(item => assetContextIds.includes(item.id))
        const assetContextText = contextAssets.length ? ['思考卡上下文（请区分事实、推断和待验证假设；不要把待核实或已被推翻的内容表述为事实或结论）：', ...contextAssets.map((item, index) => [`[${index + 1}] ${item.title}`, `类型：${item.thinkingKind || 'conclusion'}；认识状态：${item.epistemicStatus || 'inferred'}${item.verification ? `；验证结果：${item.verification.status}` : ''}`, item.verification?.evidence ? `验证证据：${item.verification.evidence}` : '', item.rationale ? `为什么重要：${item.rationale}` : '', item.nextAction ? `下一步：${item.nextAction}` : '', `内容：${item.body}`].filter(Boolean).join('\n'))].join('\n\n') : ''
        let extra = [requirement.trim(), selectedContextText ? `对话参考：\n${selectedContextText}` : '', assetContextText, referencedFiles.length ? `已引用工作区文件：${referencedFiles.map(path => `@${path}`).join('、')}。请完整保留这些引用；文件内容会在用户发送后由 DSH @file 处理，当前改写不得假设或编造其内容。` : ''].filter(Boolean).join('\n\n')
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
        setAssetContextReceipt(contextAssets.length ? { ids: contextAssets.map(item => item.id), titles: contextAssets.map(item => item.title) } : null)
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
  const vaultProjects = [...new Set(vaultItems.map(item => item.project).filter(Boolean))].sort()
  const vaultMatches = vaultItems.filter(item => (!vaultProjectFilter || item.project === vaultProjectFilter) && (!vaultSearch.trim() || `${item.title} ${item.body} ${item.note || ''} ${(item.tags || []).join(' ')}`.toLowerCase().includes(vaultSearch.trim().toLowerCase())))
  const vaultCaptureBody = vaultBody.trim() || draft.trim()
  const thinkingLabel = { question: '问题', goal: '目标', fact: '事实', assumption: '假设', decision: '决策', method: '方法', conclusion: '结论', action: '行动', dialectic: '辩证卡' }
  const epistemicLabel = { verified: '已证实', inferred: '推断', to_verify: '待核实', preference: '个人偏好' }
  const epistemicMeta = { verified: { label: '已证实', color: C.statusVerified }, inferred: { label: '推断', color: C.statusInferred }, to_verify: { label: '待核实', color: C.statusToVerify }, preference: { label: '个人偏好', color: C.statusPreference } }
  const verificationColor = { confirmed: C.statusVerified, pending: C.statusToVerify, refuted: C.statusRefuted, inconclusive: C.muted }
  const verificationLabel = { confirmed: '已证实', pending: '待验证', refuted: '已被推翻', inconclusive: '暂无结论' }
  const runNextAction = item => {
    if (!item.nextAction) return
    const next = withPrefix(composer?.getDraft?.() || '', item.nextAction)
    composer?.write(next); setNotice(`已将「${item.title}」的下一步写入草稿。`); setVaultOpen(false)
  }
  const toggleAssetContext = id => setAssetContextIds(ids => ids.includes(id) ? ids.filter(itemId => itemId !== id) : ids.length >= 3 ? ids : [...ids, id])
  const graphPanel = (() => {
    const focus = vaultItems.find(item => item.id === vaultGraphFocusId)
    if (!focus) return null
    const related = vaultItems.filter(item => focus.relatedIds?.includes(item.id) || item.relatedIds?.includes(focus.id) || item.parentId === focus.id || focus.parentId === item.id)
    const graphNodes = related.length ? related.map(item => h('button', { key: item.id, onClick: () => setVaultGraphFocusId(item.id), style: { maxWidth: '150px', padding: '5px 7px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.title)) : [h('span', { key: 'empty', style: { color: C.muted } }, '暂无关联资产；编辑时可建立关系。')]
    return h(Card, { tint: true, fontSize: '11px' }, [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between' } }, [h('strong', { key: 'title' }, '关系图谱'), h('button', { key: 'close', onClick: () => setVaultGraphFocusId(''), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer' } }, '关闭')]),
      h('div', { key: 'graph', style: { display: 'grid', justifyItems: 'center', gap: '5px', marginTop: '7px' } }, [h('button', { key: 'focus', onClick: () => editVaultItem(focus), style: { maxWidth: '95%', padding: '6px 9px', border: `1px solid ${C.teal}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, focus.title), related.length ? h('div', { key: 'edges', style: { color: C.teal, letterSpacing: '8px' } }, '↙ ↓ ↘') : null, h('div', { key: 'nodes', style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' } }, graphNodes)]),
    ])
  })()
  const attentionGroups = {
    pending: vaultItems.filter(item => item.verification?.status === 'pending' || item.epistemicStatus === 'to_verify'),
    action: vaultItems.filter(item => item.nextAction && item.verification?.status !== 'confirmed'),
    review: vaultItems.filter(item => item.verification?.status === 'refuted' || (item.epistemicStatus === 'inferred' && Date.now() - Number(item.updatedAt || 0) > 1000 * 60 * 60 * 24 * 30)),
  }
  const vaultTabLabels = [['vault', '灵感库'], ['inbox', '收件箱'], ['graph', '图谱']]
  const tabBar = h('div', { key: 'vault-tabs', role: 'tablist', 'aria-label': '资产库视图', style: { display: 'flex', gap: '4px', padding: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt } },
    vaultTabLabels.map(([id, label]) => h('button', { key: id, role: 'tab', 'aria-selected': vaultTab === id, onClick: () => setVaultTab(id), style: { flex: 1, padding: '6px 4px', border: 0, borderRadius: '7px', background: vaultTab === id ? C.teal : 'transparent', color: vaultTab === id ? C.surface : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label))
  )
  const inboxTab = h('div', { key: 'inbox-tab', style: { display: 'grid', gap: '4px' } }, [
    h('div', { key: 'hint', style: { color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, '优先推进仍在发生的认识与行动。'),
    ...[['pending','待验证','先补证据或标记结论。'],['action','待行动','把下一步写入草稿后继续推进。'],['review','需要复审','检查被推翻或长期未更新的前提。']].map(([key, title, hint]) => h('div', { key, style: { marginTop: '8px' } }, [
      h('div', { key: 'label', style: { display: 'flex', justifyContent: 'space-between', color: C.teal, fontSize: '12px', fontWeight: 800 } }, [title, String(attentionGroups[key].length)]),
      h('div', { key: 'hint', style: { marginTop: '2px', color: C.muted, fontSize: '10px' } }, hint),
      attentionGroups[key].length ? attentionGroups[key].map(item => h('div', { key: item.id, style: { marginTop: '6px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surfaceAlt } }, [
        h('strong', { key: 'title', style: { fontSize: '11px' } }, item.title),
        h('div', { key: 'meta', style: { marginTop: '3px', color: C.muted, fontSize: '10px' } }, `${thinkingLabel[item.thinkingKind] || '结论'} · ${epistemicLabel[item.epistemicStatus] || '推断'}`),
        h('div', { key: 'actions', style: { display: 'flex', gap: '10px', marginTop: '5px' } }, [
          item.nextAction ? h('button', { key: 'next', onClick: () => runNextAction(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '执行下一步') : null,
          h('button', { key: 'edit', onClick: () => editVaultItem(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '编辑'),
        ]),
      ])) : h('div', { key: 'empty', style: { marginTop: '6px', color: C.muted, fontSize: '10px' } }, '暂无。'),
    ])),
  ])
  const graphOverview = vaultItems.length ? h('div', { key: 'graph-overview', style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, vaultItems.map(item => {
    const refuted = item.verification?.status === 'refuted'
    const pending = item.verification?.status === 'pending' || item.epistemicStatus === 'to_verify'
    const stale = item.epistemicStatus === 'inferred' && Date.now() - Number(item.updatedAt || 0) > 1000 * 60 * 60 * 24 * 30
    const ring = refuted ? C.statusRefuted : pending ? C.statusToVerify : stale ? C.muted : C.tealLine
    const dash = stale && !refuted && !pending
    return h('button', { key: item.id, onClick: () => setVaultGraphFocusId(item.id), title: `${item.title}（${thinkingLabel[item.thinkingKind] || '结论'} · ${epistemicLabel[item.epistemicStatus] || '推断'}）`, style: { maxWidth: '150px', padding: '5px 8px', border: `2px solid ${ring}`, borderRadius: '10px', background: C.surface, color: refuted ? C.statusRefuted : C.slate, cursor: 'pointer', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...(dash ? { borderStyle: 'dashed' } : {}) } }, item.title)
  })) : h('div', { key: 'graph-empty', style: { color: C.muted, fontSize: '11px' } }, '暂无资产，保存后即可在图谱中查看关系。')
  const graphTab = h('div', { key: 'graph-tab', style: { display: 'grid', gap: '10px' } }, [
    h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } }, [
      h('div', null, [h('strong', { style: { fontSize: '13px' } }, '关系图谱 · 全貌'), h('div', { style: { marginTop: '2px', color: C.muted, fontSize: '10px' } }, '点击节点查看关联；异常已高亮（红=被推翻 / 黄=待验证 / 灰虚线=久未更新）。')]),
      vaultGraphFocusId ? h('button', { key: 'back', onClick: () => setVaultGraphFocusId(''), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800, flexShrink: 0 } }, '返回全貌') : null,
    ]),
    vaultGraphFocusId ? graphPanel : graphOverview,
  ])
  const reviewPanel = reviewOpen ? h('section', { role: 'dialog', 'aria-label': '对话复盘', style: { position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)', width: 'min(540px, calc(100vw - 32px))', maxHeight: '76vh', overflowY: 'auto', padding: '16px', boxSizing: 'border-box', border: `1px solid ${C.tealLine}`, borderRadius: '14px', background: C.surface, boxShadow: C.shadowLg, zIndex: 70 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between' } }, [h('div', { key: 'title' }, [h('strong', { style: { fontSize: '16px' } }, '对话收束'), h('div', { style: { marginTop: '3px', color: C.muted, fontSize: '11px' } }, '确认后才会生成并关联思考卡。')]), h('button', { onClick: () => setReviewOpen(false), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer' } }, '关闭 ×')]), ...reviewCards.map(card => h('label', { key: card.id, style: { display: 'grid', gridTemplateColumns: '18px 1fr', gap: '8px', marginTop: '9px', padding: '8px', border: `1px solid ${card.checked ? C.tealLine : C.line}`, borderRadius: '8px', background: card.checked ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { type: 'checkbox', checked: card.checked, onChange: () => setReviewCards(cards => cards.map(item => item.id === card.id ? { ...item, checked: !item.checked } : item)), style: { accentColor: C.teal } }), h('div', null, [h('strong', { style: { fontSize: '12px' } }, card.title), h('div', { style: { marginTop: '3px', color: C.muted, fontSize: '10px' } }, `${thinkingLabel[card.thinkingKind]} · ${epistemicLabel[card.epistemicStatus]}`), h('div', { style: { marginTop: '3px', color: C.slate, fontSize: '11px', whiteSpace: 'pre-wrap' } }, card.body)])])), h('button', { key: 'save', onClick: saveConversationReview, style: { ...workbenchStyle.actionPrimary, width: '100%', marginTop: '12px' } }, '确认并沉淀为思考卡')]) : null
  const versionDiff = item => {
    const parent = item.parentId ? vaultItems.find(candidate => candidate.id === item.parentId) : null
    return h('div', { style: { marginTop: '7px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surfaceAlt, fontSize: '10px', lineHeight: 1.45 } }, parent ? [h('strong', { key: 'title', style: { color: C.teal } }, `与「${parent.title}」对比`), h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '5px' } }, [h('div', { key: 'old', style: { whiteSpace: 'pre-wrap', color: C.muted, maxHeight: '96px', overflow: 'auto' } }, parent.body), h('div', { key: 'new', style: { whiteSpace: 'pre-wrap', color: C.ink, maxHeight: '96px', overflow: 'auto' } }, item.body)])] : '此资产没有可比较的父版本。')
  }
  const vaultPanel = assetProvider ? h('aside', { key: 'vault-panel', role: 'dialog', 'aria-label': '灵感库', style: { position: 'fixed', top: 0, right: 0, width: 'min(390px, calc(100vw - 24px))', height: '100vh', overflowY: 'auto', padding: '18px', boxSizing: 'border-box', borderLeft: `1px solid ${C.tealLine}`, background: C.surface, boxShadow: '-16px 0 38px var(--pk-shadow-lg)', zIndex: 60, display: 'grid', alignContent: 'start', gap: '10px' } }, [
    h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [h('strong', { style: { fontSize: '16px' } }, '灵感库'), h('button', { onClick: () => { setVaultOpen(false); setMode('enhance') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '13px', fontWeight: 800 } }, '关闭 ×')]),
    tabBar,
    vaultTab === 'vault' ? h('div', { key: 'vault-wrap', style: { display: 'grid', gap: '10px' } }, [
    h('details', { key: 'capture-details', open: vaultFormOpen, onToggle: event => setVaultFormOpen(event.currentTarget.open), style: { border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('summary', { style: { padding: '10px 11px', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, vaultEditingId ? '编辑灵感资产' : vaultParentId ? '保存派生版本' : '+ 新建灵感'),
    h('div', { key: 'capture', style: { padding: '0 11px 11px' } }, [
      h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '捕获当前灵感'),
      h('div', { key: 'hint', style: { marginTop: '3px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, `填写正文即可保存；也可留空直接保存 DSH 主输入框草稿（当前 ${draft.trim().length} 字）。数据仅存于本地浏览器。`),
      h('div', { key: 'fields', style: { display: 'grid', gridTemplateColumns: '1fr 86px', gap: '6px', marginTop: '8px' } }, [
        h('input', { key: 'name', value: vaultTitle, onChange: e => setVaultTitle(e.target.value), placeholder: '备注名（可选）', style: { ...workbenchStyle.input, padding: '7px 8px', fontSize: '11px' } }),
        h('select', { key: 'type', value: vaultType, onChange: e => setVaultType(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [h('option', { value: 'prompt' }, '成品 Prompt'), h('option', { value: 'snippet' }, '对话片段'), h('option', { value: 'insight' }, '结论卡')]),
      ]),
      h('input', { key: 'tags', value: vaultTags, onChange: e => setVaultTags(e.target.value), placeholder: '标签，逗号分隔（如：代码, 评审）', style: { ...workbenchStyle.input, marginTop: '6px', padding: '7px 8px', fontSize: '11px' } }),
      h('input', { key: 'project', value: vaultProject, onChange: e => setVaultProject(e.target.value), placeholder: '项目集合（可选，例如：PromptKit 发布）', style: { ...workbenchStyle.input, marginTop: '6px', padding: '7px 8px', fontSize: '11px' } }),
      h('div', { key: 'thinking', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' } }, [
        h('select', { value: vaultThinkingKind, onChange: e => setVaultThinkingKind(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['question','问题'],['goal','目标'],['fact','事实'],['assumption','假设'],['decision','决策'],['method','方法'],['conclusion','结论'],['action','行动'],['dialectic','辩证卡']].map(([value,label]) => h('option', { key: value, value }, label))),
        h('select', { value: vaultEpistemicStatus, onChange: e => setVaultEpistemicStatus(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['verified','已证实'],['inferred','推断'],['to_verify','待核实'],['preference','个人偏好']].map(([value,label]) => h('option', { key: value, value }, label))),
      ]),
      h('button', { key: 'suggest', onClick: () => { const suggestion = suggestThinkingCard(vaultBody || draft); setVaultThinkingKind(suggestion.kind); setVaultEpistemicStatus(suggestion.epistemic); setNotice('已给出本地分类建议，请自行确认后保存。') }, style: { ...workbenchStyle.action, marginTop: '6px', fontSize: '11px' } }, '按内容建议分类（本地）'),
      h('textarea', { value: vaultRationale, onChange: e => setVaultRationale(e.target.value), placeholder: '为什么重要 / 我的解释（可选）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
      h('textarea', { value: vaultNextAction, onChange: e => setVaultNextAction(e.target.value), placeholder: '下一步行动（可选，例如：验证 Controller 映射）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
      (vaultThinkingKind === 'assumption' || vaultEpistemicStatus === 'to_verify') ? h('div', { key: 'verification', style: { display: 'grid', gap: '6px', marginTop: '6px', padding: '7px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px' } }, [h('select', { value: vaultVerification.status, onChange: e => setVaultVerification(value => ({ ...value, status: e.target.value, checkedAt: e.target.value === 'pending' ? 0 : Date.now() })), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['pending','待验证'],['confirmed','已证实'],['refuted','已被推翻'],['inconclusive','暂无结论']].map(([value,label]) => h('option', { key: value, value }, label))), h('textarea', { value: vaultVerification.evidence, onChange: e => setVaultVerification(value => ({ ...value, evidence: e.target.value })), placeholder: '验证证据或结果（可选）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', resize: 'vertical', fontSize: '11px' } })]) : null,
      vaultThinkingKind === 'dialectic' ? h('div', { key: 'dialectic', style: { display: 'grid', gap: '5px', marginTop: '6px' } }, [
        h('textarea', { key: 'thesis', value: vaultDialectic.thesis || '', onChange: e => setVaultDialectic(value => ({ ...value, thesis: e.target.value })), placeholder: '观点', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
        h('textarea', { key: 'antithesis', value: vaultDialectic.antithesis || '', onChange: e => setVaultDialectic(value => ({ ...value, antithesis: e.target.value })), placeholder: '反观点', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
        h('textarea', { key: 'synthesis', value: vaultDialectic.synthesis || '', onChange: e => setVaultDialectic(value => ({ ...value, synthesis: e.target.value })), placeholder: '当前综合', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
      ]) : null,
      vaultItems.length ? h('select', { multiple: true, value: vaultRelatedIds, onChange: e => setVaultRelatedIds([...e.target.selectedOptions].map(option => option.value)), style: { width: '100%', minHeight: '54px', marginTop: '6px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '10px' } }, vaultItems.filter(item => item.id !== vaultEditingId).map(item => h('option', { key: item.id, value: item.id }, `关联：${item.title}`))) : null,
      h('textarea', { key: 'body', value: vaultBody, onChange: e => setVaultBody(e.target.value), placeholder: '灵感正文（支持 $...$ 或 $$...$$ LaTeX；留空时保存 DSH 主输入框草稿）', style: { ...workbenchStyle.input, width: '100%', minHeight: '66px', marginTop: '6px', resize: 'vertical', fontSize: '11px', lineHeight: 1.45 } }),
      h('div', { key: 'actions', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '7px' } }, [
        h('button', { key: 'selection', className: 'pk-btn', disabled: !composer?.getSelection?.()?.text, onClick: () => saveToVault(composer.getSelection().text, { kind: 'composer-selection' }), style: { ...workbenchStyle.action, opacity: composer?.getSelection?.()?.text ? 1 : .5 } }, '保存选中片段'),
        h('button', { key: 'draft', className: 'pk-btn', disabled: !vaultCaptureBody, onClick: () => saveToVault(vaultCaptureBody, { kind: vaultBody.trim() ? 'vault-manual-body' : 'composer-draft' }), style: { ...workbenchStyle.actionPrimary, opacity: vaultCaptureBody ? 1 : .5 } }, vaultEditingId ? '保存修改' : vaultParentId ? '保存派生版本' : vaultBody.trim() ? '保存填写内容' : '保存当前草稿'),
      ]),
      activeMessages.length ? h('div', { key: 'conversation-actions', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' } }, [
        h('button', { key: 'save-conversation', onClick: saveSelectedMessages, style: { ...workbenchStyle.action, fontSize: '11px' } }, `保存已选对话（${activeMessages.length}）`),
        h('button', { key: 'quote-conversation', onClick: quoteSelectedMessages, style: { ...workbenchStyle.action, fontSize: '11px' } }, `引用已选对话（${activeMessages.length}）`),
        h('button', { key: 'thinking-card', onClick: createThinkingCardFromConversation, style: { ...workbenchStyle.actionPrimary, gridColumn: '1 / -1', fontSize: '11px' } }, '从已选对话生成思考卡（需确认）'),
        h('button', { key: 'review', onClick: prepareConversationReview, style: { ...workbenchStyle.action, gridColumn: '1 / -1', fontSize: '11px' } }, '对话收束：生成复盘卡（需确认）'),
      ]) : h('div', { key: 'conversation-hint', style: { marginTop: '6px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '需要保存或引用对话时，先在「智能增强 → 加对话」中勾选消息。'),
      noticeState ? h('div', { key: 'result', role: 'status', style: { marginTop: '7px', color: noticeState.kind === 'error' ? C.red : C.teal, fontSize: '11px', lineHeight: 1.4 } }, noticeState.text) : null,
    ])]),
    h('div', { key: 'filters', style: { display: 'grid', gridTemplateColumns: vaultProjects.length ? '1fr 120px' : '1fr', gap: '6px' } }, [
      h('input', { key: 'search', value: vaultSearch, onChange: e => setVaultSearch(e.target.value), placeholder: '搜索标题、标签、正文或备注', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }),
      vaultProjects.length ? h('select', { key: 'project-filter', value: vaultProjectFilter, onChange: e => setVaultProjectFilter(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [h('option', { value: '' }, '全部项目'), ...vaultProjects.map(project => h('option', { key: project, value: project }, project))]) : null,
    ]),
    h('div', { key: 'project-actions', style: { display: 'flex', gap: '8px' } }, [h('button', { onClick: exportProjectMarkdown, style: { ...workbenchStyle.action, fontSize: '11px' } }, '导出项目复盘 Markdown'), h('button', { onClick: organizeVault, style: { ...workbenchStyle.action, fontSize: '11px' } }, '本地整理建议')]),
    h('details', { key: 'backup', style: { padding: '8px 9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface, fontSize: '11px' } }, [
      h('summary', { style: { color: C.teal, cursor: 'pointer', fontWeight: 800 } }, '备份或恢复灵感库'),
      h('button', { key: 'export', onClick: exportVault, style: { ...workbenchStyle.action, marginTop: '7px', fontSize: '11px' } }, '导出 JSON 备份'),
      h('textarea', { key: 'import-text', value: vaultBackup, onChange: e => setVaultBackup(e.target.value), placeholder: '粘贴此前导出的 JSON；恢复只追加，不会覆盖现有资产。', style: { ...workbenchStyle.input, width: '100%', minHeight: '55px', marginTop: '7px', resize: 'vertical', fontSize: '10px' } }),
      h('button', { key: 'import', disabled: !vaultBackup.trim(), onClick: importVault, style: { ...workbenchStyle.action, marginTop: '5px', fontSize: '11px', opacity: vaultBackup.trim() ? 1 : .5 } }, '恢复备份'),
    ]),
    h('div', { key: 'items', style: { display: 'grid', gap: '6px', maxHeight: '290px', overflowY: 'auto' } }, vaultMatches.length ? vaultMatches.map(item => h(Card, { key: item.id }, [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } }, [
        h('button', { key: 'toggle', onClick: () => setExpandedVaultId(value => value === item.id ? '' : item.id), style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '5px', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' } }, [
          h('strong', { key: 'title', style: { fontSize: '12px', color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${item.favorite ? '★ ' : ''}${item.title}`),
          h(Icon, { key: 'chevron', name: 'chevronDown', size: 13, style: { color: C.muted, flexShrink: 0, transform: expandedVaultId === item.id ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' } }),
        ]),
        h('button', { key: 'fav', onClick: () => assetProvider.toggleFavorite(item.id), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', flexShrink: 0 }, title: '收藏/取消收藏' }, item.favorite ? '取消收藏' : '收藏'),
      ]),
      (() => { const meta = epistemicMeta[item.epistemicStatus] || epistemicMeta.inferred; return h('div', { key: 'status', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '5px' } }, [
        h('span', { key: 'type', style: { display: 'inline-block', padding: '1px 7px', borderRadius: '999px', background: C.tealTint, color: C.teal, fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' } }, thinkingLabel[item.thinkingKind] || '结论'),
        h('span', { key: 'epistemic', style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: meta.color } }, [h('span', { key: 'dot', style: { width: '7px', height: '7px', borderRadius: '50%', background: meta.color, flexShrink: 0 } }), meta.label]),
        item.project ? h('span', { key: 'project', style: { color: C.muted, fontSize: '10px' } }, item.project) : null,
      ]) })(),
      expandedVaultId === item.id && item.rationale ? h('div', { key: 'rationale', style: { marginTop: '5px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `为什么重要：${item.rationale}`) : null,
      expandedVaultId === item.id && item.verification ? h('div', { key: 'verification', style: { marginTop: '4px', color: verificationColor[item.verification.status] || C.slate, fontSize: '10px', lineHeight: 1.4 } }, `验证：${verificationLabel[item.verification.status] || '待验证'}${item.verification.evidence ? ` · ${item.verification.evidence}` : ''}`) : null,
      expandedVaultId === item.id && item.dialectic ? h('div', { key: 'dialectic', style: { marginTop: '4px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `观点：${item.dialectic.thesis || '—'} · 反观点：${item.dialectic.antithesis || '—'} · 综合：${item.dialectic.synthesis || '—'}`) : null,
      h('div', { key: 'body', style: { marginTop: '5px', color: C.slate, fontSize: '11px', lineHeight: 1.45, ...(expandedVaultId === item.id ? { maxHeight: '240px', overflow: 'auto' } : { maxHeight: '34px', overflow: 'hidden' }) } }, h(LatexText, { text: item.body, block: true })),
      expandedVaultId === item.id ? h('div', { key: 'actions', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '7px' } }, [h('button', { key: 'append', onClick: () => useVaultItem(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '追加'), h('button', { key: 'context', disabled: !assetContextIds.includes(item.id) && assetContextIds.length >= 3, onClick: () => toggleAssetContext(item.id), style: { border: 0, background: 'transparent', color: assetContextIds.includes(item.id) ? C.teal : C.slate, cursor: !assetContextIds.includes(item.id) && assetContextIds.length >= 3 ? 'not-allowed' : 'pointer', fontSize: '11px', fontWeight: 800 } }, assetContextIds.includes(item.id) ? '✓ 用于增强' : '用于增强'), item.nextAction ? h('button', { key: 'next', onClick: () => runNextAction(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '执行下一步') : null, h('button', { key: 'replace', onClick: () => useVaultItem(item, 'replace'), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '填充'), h('button', { key: 'edit', onClick: () => editVaultItem(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '编辑'), h('button', { key: 'derive', onClick: () => deriveVaultItem(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '派生'), h('button', { key: 'relations', onClick: () => { setVaultTab('graph'); setVaultGraphFocusId(item.id) }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '关系'), item.parentId ? h('button', { key: 'compare', onClick: () => setVaultCompareId(value => value === item.id ? '' : item.id), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, vaultCompareId === item.id ? '收起对比' : '版本对比') : null, h('button', { key: 'copy', onClick: () => copyVaultItem(item), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '复制'), h('button', { key: 'delete', onClick: () => assetProvider.remove(item.id), style: { marginLeft: 'auto', border: 0, background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '11px' } }, '删除')]) : null,
      vaultCompareId === item.id ? versionDiff(item) : null,
      ])) : h('div', { key: 'empty', style: { ...S.empty, padding: '22px 12px', fontSize: '12px', display: 'grid', gap: '10px', justifyItems: 'start' } }, [
        h('div', { key: 'tip', style: { color: C.muted, lineHeight: 1.5 } }, '还没有灵感资产。保存一条草稿或选中片段开始积累。'),
        h('button', { key: 'save-first', disabled: !draft.trim(), onClick: () => saveToVault(draft, { kind: 'quick-capture' }), style: { padding: '8px 12px', border: 0, borderRadius: '8px', background: draft.trim() ? C.actionBg : C.tealLine, color: draft.trim() ? C.actionFg : C.muted, cursor: draft.trim() ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 800 } }, '保存当前草稿为灵感'),
      ])),
    ]) : null,
    vaultTab === 'inbox' ? inboxTab : null,
    vaultTab === 'graph' ? graphTab : null,
  ]) : null
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
  const recentInputRef = React.useRef(null)
  const contextOverlayNode = () => h('div', { key: 'overlay-backdrop', onClick: (e) => { if (e.target === e.currentTarget) setContextOverlayOpen(false) }, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 80, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', paddingBottom: '4vh', paddingLeft: '16px', paddingRight: '16px', animation: 'pk-fade .15s ease', overflowY: 'auto' } } , [
    h('div', { key: 'overlay-panel', onClick: e => e.stopPropagation(), style: { width: 'min(360px, calc(100vw - 48px))', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', boxSizing: 'border-box', borderRadius: '10px', background: C.surface, border: `1px solid ${C.line}`, boxShadow: '0 24px 68px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' } } , [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        h('strong', { style: { fontSize: '12.5px', fontWeight: 700 } }, '选择对话参考'),
        h('button', { onClick: () => setContextOverlayOpen(false), style: { border: 0, background: 'transparent', color: C.muted, fontSize: '15px', cursor: 'pointer', padding: '1px 5px' } }, '×')
      ]),
      h('div', { key: 'toolbar', style: { display: 'flex', flexWrap: 'nowrap', gap: '5px', alignItems: 'center' } } , [
        h('button', { key: 'sel-all', onClick: () => selectAllMessages(), style: { padding: '2px 7px', border: `1px solid ${C.tealLine}`, borderRadius: '5px', background: C.surfaceAlt, color: C.teal, cursor: 'pointer', fontSize: '10.5px', fontWeight: 700 } }, `全选 (${msgs.length})`),
        h('div', { key: 'recent-group', style: { display: 'inline-flex', alignItems: 'center', gap: '3px', border: `1px solid ${C.line}`, borderRadius: '5px', padding: '1px 5px', background: C.surfaceAlt } }, [
          h('span', { style: { fontSize: '11px', color: C.muted, fontWeight: 600 } }, '最近'),
          h('input', { key: 'recent-n', ref: recentInputRef, type: 'number', min: 1, max: msgs.length, defaultValue: 3, style: { width: '32px', padding: '1px 3px', border: `1px solid ${C.line}`, borderRadius: '3px', fontSize: '11px', textAlign: 'center', background: C.surface, color: C.ink } }),
          h('button', { key: 'sel-recent', onClick: () => selectRecentN(recentInputRef.current ? recentInputRef.current.value : 3), style: { padding: '2px 6px', border: `1px solid ${C.tealLine}`, borderRadius: '4px', background: C.tealTint, color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 700 } }, '选')
        ]),
        h('button', { key: 'clear', onClick: () => clearAllSelections(), disabled: selected.length === 0, style: { padding: '3px 8px', border: `1px solid ${C.line}`, borderRadius: '5px', background: selected.length > 0 ? '#fff0f0' : C.surfaceAlt, color: selected.length > 0 ? '#c44' : C.muted, cursor: selected.length > 0 ? 'pointer' : 'not-allowed', fontSize: '11px', fontWeight: 700 } }, '清空')
      ]),
      activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.25, padding: '1px 0' } }, `已选 ${activeMessages.length} 条：${selectedDraft.question ? ' 问题' : ''}${selectedDraft.facts ? ' 事实' : ''}${selectedDraft.constraints ? ' 约束' : ''}${selectedDraft.options ? ' 方案' : ''}`) : null,
      h('div', { key: 'messages', style: { maxHeight: '180px', minHeight: '60px', overflowY: 'auto', paddingRight: '4px', display: 'grid', gap: '2px' } }, msgs.slice().reverse().map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: '4px', padding: '4px 6px', border: `1px solid ${selected.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '6px', background: selected.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [
        h('input', { key: 'check', type: 'checkbox', checked: selected.includes(item.id), onChange: () => toggle(item.id), style: { marginTop: '0', accentColor: C.teal } }),
        h('div', { key: 'text' }, [
          h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '10.5px', fontWeight: 800 } }, item.role === 'user' ? '你' : '助手'),
          h('div', { key: 'body', style: { marginTop: '0', color: C.slate, fontSize: '11px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`)
        ])
      ]))),
      h('div', { key: 'footer', style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '5px', borderTop: `1px solid ${C.divide}` } } , [
        h('button', { key: 'cancel', onClick: () => setContextOverlayOpen(false), style: { padding: '5px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.surfaceAlt, color: C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '取消'),
        h('button', { key: 'confirm', onClick: () => { setContextOverlayOpen(false); if (!useConversationContext) setUseConversationContext(true) }, style: { padding: '5px 16px', border: 0, borderRadius: '6px', background: C.actionBg, color: C.actionFg, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, `确认选择 (${selected.length})`)
      ])
    ])
  ])

  const contextNode = msgs.length ? h(React.Fragment, null, [
    h('button', { key: 'trigger', className: 'pk-btn', onClick: () => setContextOverlayOpen(true), style: { width: '100%', padding: '9px', border: `1px solid ${selected.length > 0 ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: selected.length > 0 ? C.tealTint : C.surface, color: selected.length > 0 ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } }, [selected.length > 0 ? h('span', null, [`已选 ${selected.length} 条对话参考`]) : h('span', null, '可选：选择对话作为参考'), h('span', { style: { fontSize: '11px', opacity: 0.7 } }, '▸')]),
    contextOverlayOpen ? contextOverlayNode() : null
  ]) : null
  const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]
  const enhancerKindSection = h('div', { key: 'enhancer-kind-section', style: { marginTop: '10px' } }, [h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? `模型会改写草稿${useConversationContext ? '，并引用已选对话' : ''}${useMemoryContext ? '，并检索项目记忆' : ''}。` : useMemoryContext ? '项目记忆已准备，但轻量档不会读取；切换到语义档后可预览并注入。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。')])
  const memorySourceLabels = sources => sources?.length ? h('div', { style: { marginTop: '6px', display: 'grid', gap: '3px', color: C.muted } }, sources.map((source, index) => h('div', { key: `${source.kind}:${index}` }, `来源：${source.label}`))) : null
  const assetContextNode = assetContextIds.length ? h('div', { style: { marginTop: '9px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '11px', lineHeight: 1.45 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [h('strong', { key: 'title', style: { color: C.teal } }, `思考卡上下文（${assetContextIds.length}/3）`), h('button', { key: 'clear', onClick: () => setAssetContextIds([]), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '10px' } }, '清除')]), h('div', { key: 'items', style: { marginTop: '4px', color: C.slate } }, vaultItems.filter(item => assetContextIds.includes(item.id)).map(item => `• ${item.title}（${epistemicLabel[item.epistemicStatus] || '推断'}）`).join('\n')), h('div', { key: 'hint', style: { marginTop: '4px', color: C.muted } }, '仅在“语义 · 模型”增强时注入；发送前可随时移除。')]) : null
  const enhancerPanel = h('details', { key: 'enhancer', open: true, style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('summary', { key: 'title', style: { fontSize: '13px', color: C.ink, cursor: 'pointer', fontWeight: 800, display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' } }, [h('span', { key: 't' }, '决策摘要'), h('span', { key: 'hint', style: { fontSize: '11px', color: C.muted, fontWeight: 600 } }, mode === 'enhance' && draft.trim() ? (enhancementKind === 'light' ? (enhancementPlan.tooShort ? '直接采用原文' : `拟采用：${enhancementPlan.label || '轻量整理'}`) : '语义档 · 待模型改写') : '')]), useMemoryContext && enhancementKind === 'semantic' ? h('div', { key: 'memory-preview', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '项目记忆预览'), h('button', { key: 'preview', className: 'pk-btn', disabled: memoryPreview.status === 'loading' || draft.trim().length < 8, onClick: () => loadMemory(draft).catch(() => {}), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, memoryPreview.status === 'loading' ? '检索中…' : '检索')]), memoryPreview.status === 'ready' ? h('div', { key: 'text', style: { marginTop: '6px', whiteSpace: 'pre-wrap' } }, [memoryPreview.text, memorySourceLabels(memoryPreview.sources)]) : memoryPreview.status === 'empty' ? h('div', { key: 'empty', style: { marginTop: '6px', color: C.muted } }, '未命中可用项目记忆。') : memoryPreview.status === 'error' ? h('div', { key: 'error', style: { marginTop: '6px', color: C.red } }, memoryPreview.text) : h('div', { key: 'hint', style: { marginTop: '6px', color: C.muted } }, draft.trim().length < 8 ? '草稿至少 8 个字符后可检索。' : '先预览命中的摘要，再决定是否交给模型。')]) : null, memoryReceipt ? h('div', { key: 'memory-receipt', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${memoryReceipt.used ? C.tealLine : C.amberLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, memoryReceipt.used ? [h('div', { key: 'text' }, `本次已注入项目记忆摘要：${memoryReceipt.text}`), memorySourceLabels(memoryReceipt.sources)] : '本次未注入项目记忆：未命中可用摘要。') : null, enhancementKind === 'light' ? h('div', { key: 'summary', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [methodSummaryNode, diffPreview, costNode, signalsNode]) : h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode)])
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const wide = vw >= 620
  const panelW = Math.min(wide ? 640 : 440, vw - 32)
  const enhanceBody = h('div', { key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start', animation: 'pk-fade .2s ease' } }, [h('div', { key: 'config', style: { minWidth: 0 } }, [enhancerKindSection, draftStatusNode, requirementNode, contextLevelNode, contextNode, assetContextNode]), h('div', { key: 'preview', style: { minWidth: 0 } }, [enhancerPanel])])
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
          h('details', { key: 'more', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [
            h('summary', { style: { color: C.muted, cursor: 'pointer', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' } }, '更多操作 · 导入 / 备份 / 私有方法'),
            h('div', { key: 'data', style: { marginTop: '8px', display: 'grid', gap: '6px' } }, [
              h('button', { key: 'import', onClick: () => setActiveSettingsPanel('import'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 导入 Obsidian Prompt 卡片'),
              h('button', { key: 'backup', onClick: () => setActiveSettingsPanel('backup'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 备份或恢复私有方法')
            ]),
            h('div', { key: 'priv', style: { marginTop: '6px' } }, [
              h('button', { key: 'manage', onClick: () => setActiveSettingsPanel('manage'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 管理我的私有方法')
            ]),
          ]),
        ]
      : [
          h('button', { key: 'back', onClick: () => setActiveSettingsPanel(null), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800, marginBottom: '7px' } }, '← 返回'),
          activeSettingsPanel === 'import' ? h(Card, { key: 'panel-import' }, [
            h('strong', { key: 't', style: { fontSize: '12px' } }, '导入 Obsidian Prompt 卡片'),
            h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '粘贴一张 Markdown 卡片即可，仅保存到当前浏览器；不会读取或上传你的笔记库。'),
            h('textarea', { key: 'md', value: privateMarkdown, onChange: event => setPrivateMarkdown(event.target.value), placeholder: '# 我的方法\n\n## Prompt\n```\n提示词正文\n```', style: { ...workbenchStyle.input, width: '100%', minHeight: '90px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            h('button', { key: 'go', className: 'pk-btn', disabled: !privateMarkdown.trim(), onClick: importPrivateMethod, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateMarkdown.trim() ? 1 : .55 } }, privateEditingId ? '保存修改' : '导入到我的私有方法'),
            privateNotice ? h('div', { key: 'nt', style: { marginTop: '5px', color: C.teal, fontSize: '10px' } }, privateNotice) : null
          ]) : activeSettingsPanel === 'backup' ? h(Card, { key: 'panel-backup' }, [
            h('strong', { key: 't', style: { fontSize: '12px' } }, '备份或恢复私有方法'),
            h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '导出 JSON 备份；恢复只会追加，不会删除当前私有方法。'),
            h('button', { key: 'exp', className: 'pk-btn', onClick: exportPrivateMethods, style: { ...workbenchStyle.action, marginTop: '6px' } }, '导出私有方法'),
            h('textarea', { key: 'bk', value: privateBackup, onChange: event => setPrivateBackup(event.target.value), placeholder: '粘贴此前导出的 JSON 备份', style: { ...workbenchStyle.input, width: '100%', minHeight: '64px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            h('button', { key: 'imp', className: 'pk-btn', disabled: !privateBackup.trim(), onClick: importPrivateBackup, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateBackup.trim() ? 1 : .55 } }, '恢复私有方法'),
          ]) : h(Card, { key: 'panel-manage' }, [
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
  const panel = open ? h('section', { className: 'pk-scroll', role: 'dialog', 'aria-label': '对话增强器', style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: `${panelW}px`, maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px var(--pk-shadow-lg)', color: C.ink, zIndex: 30, animation: 'pk-pop .2s ease' } }, [
        h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, libraryOpen ? '从提示词库选择模板：可直接填入消息框，或基于当前草稿调用模型按该方法改造。' : mode === 'enhance' ? '把当前输入框提示词做增强或改写，只填入消息框，不会自动发送。' : '写问题即可直接处理；也可选择对话消息作为额外参考。生成内容只填入消息框，不会自动发送。')]), h('div', { key: 'actions', style: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 } }, [h('button', { key: 'gear', 'data-gear-button': 'true', onClick: () => { setSettingsOpen(value => !value); if (settingsOpen) setActiveSettingsPanel(null) }, style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: settingsOpen ? C.tealTint : 'transparent', color: C.teal, cursor: 'pointer' }, 'aria-label': '设置' }, h(Icon, { key: 'ic', name: 'settings', size: 16 })), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))])]),
        libraryOpen || vaultOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '10px 11px', borderRadius: '10px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, [h('span', { key: 'count' }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '未选择对话 · 可直接写问题'), msgs.length ? h('button', { key: 'recent', onClick: () => setSelected(msgs.slice(0, 4).map(item => item.id)), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '选择最近 4 条') : null]),
        undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } clearOutcomeAt('undo'); composer?.write(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
assetProvider ? h('div', { key: 'vault-quick', style: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px', marginTop: '10px' } }, [h('button', { key: 'save', disabled: !draft.trim(), onClick: () => saveToVault(draft, { kind: 'quick-capture' }), style: { padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: draft.trim() ? C.tealTint : C.surface, color: draft.trim() ? C.teal : C.muted, cursor: draft.trim() ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 800 } }, '收藏当前草稿'), h('button', { key: 'manage', onClick: () => { setVaultOpen(true); setLibraryOpen(false) }, style: { padding: '8px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '打开灵感库 →')]) : null,
        h('div', { key: 'mode', style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '12px' } }, [['enhance', '智能增强'], ['method', '手动选方法']].map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => { setMode(id); setLibraryOpen(false); setVaultOpen(false) }, style: { padding: '8px', border: `1px solid ${mode === id && !libraryOpen && !vaultOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: mode === id && !libraryOpen && !vaultOpen ? C.tealTintDeep : C.surface, color: mode === id && !libraryOpen && !vaultOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label)).concat(h('button', { key: 'library', className: 'pk-btn', onClick: () => { const next = !libraryOpen; setMode(next ? 'library' : 'method'); setLibraryOpen(next); setVaultOpen(false) }, style: { padding: '8px', border: `1px solid ${libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: libraryOpen ? C.tealTintDeep : C.surface, color: libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '方法库'))),

        mode === 'enhance' && !libraryOpen && (requirement.trim() || useConversationContext || useMemoryContext) ? stepperNode : null,
        settingsOpen ? settingsSection : null,
        libraryOpen ? h('div', { key: 'library-panel', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, animation: 'pk-fade .2s ease' } }, [h('input', { key: 'search', value: librarySearch, onChange: event => setLibrarySearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }), libraryFavorites.length ? h('div', { key: 'favorites', style: { marginTop: '8px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '我的收藏：'), ' ', libraryFavorites.map(id => methods.find(method => method.id === id)).filter(Boolean).map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, method.title))]) : null, libraryHistory.length ? h('div', { key: 'history', style: { marginTop: '7px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '最近生成：'), ' ', libraryHistory.slice(0, 3).map(item => h('button', { key: `${item.id}:${item.at}`, className: 'pk-btn', onClick: () => { setSelectedMethodId(item.id); setMode('method'); if (item.question) setRequirement(item.question); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, item.title || '未命名方法'))]) : null, h('div', { key: 'matches', style: { display: 'grid', gap: '5px', maxHeight: '180px', overflowY: 'auto', marginTop: '8px' } }, libraryMatches.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '10px 11px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: method.id === selectedMethodId ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '12px' } }, [h('strong', { key: 'title', style: { fontSize: '12px', fontWeight: 800 } }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted, fontSize: '11px' } }, method.purpose || method.category)])))] ) : null,
        libraryOpen ? h('div', { key: 'library-actions', style: { marginTop: '8px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface, animation: 'pk-fade .2s ease' } }, [h('select', { key: 'select', value: selectedMethodId, onChange: event => setSelectedMethodId(event.target.value), style: { width: '100%', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, fontSize: '12px' } }, [h('option', { key: 'empty', value: '' }, '选择一个提示词…'), ...libraryMatches.map(method => h('option', { key: method.id, value: method.id }, method.title))]), libraryMethod ? h('div', { key: 'selected', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, `已选择「${libraryMethod.title}」：可直接填充模板，或基于当前草稿改造。`) : null, h('div', { key: 'buttons', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '9px' } }, [h('button', { key: 'fill', className: 'pk-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.actionPrimary, opacity: libraryMethod ? 1 : .5 } }, '填充模板'), h('button', { key: 'adapt', className: 'pk-btn', disabled: !libraryMethod || !draft.trim() || loading || !enhancer, onClick: adaptLibraryDraft, style: { ...workbenchStyle.action, opacity: libraryMethod && draft.trim() && enhancer ? 1 : .55 } }, loading ? h(Spinner, { key: 'spin', text: '改造中…' }) : '基于草稿改造')])]) : null,
        mode === 'enhance' ? enhanceBody : null,
        mode === 'enhance' ? h('button', { key: 'enhance-main', className: 'pk-btn', disabled: !draft.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { width: '100%', marginTop: '12px', padding: '12px', border: 0, borderRadius: '10px', background: draft.trim() && !loading ? C.actionBg : C.surfaceAlt, color: draft.trim() && !loading ? C.actionFg : C.muted, cursor: draft.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消增强' }) : loading ? h(Spinner, { key: 'spin', text: '正在增强…' }) : '应用增强到消息框') : null,
        mode === 'method' ? h('div', { key: 'method-config', style: { animation: 'pk-fade .2s ease' } }, [draftStatusNode, requirementNode, contextLevelNode, contextNode]) : null,
        lastEnhancement ? h('div', { key: 'feedback', style: { marginTop: '12px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, color: C.slate, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ck', name: 'check', size: 14, style: { color: C.teal } }), h('span', { key: 'label', style: { flex: 1 } }, '增强完成，可在此撤销或反馈'), h('button', { key: 'up', onClick: () => saveFeedback('up'), title: '有用', 'aria-label': '有用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-u', name: 'thumbsUp', size: 15 })), h('button', { key: 'down', onClick: () => saveFeedback('down'), title: '没用', 'aria-label': '没用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-d', name: 'thumbsDown', size: 15 }))]) : null,
        h('div', { key: 'methods', style: { display: mode === 'method' ? 'block' : 'none', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.divide}` } }, [
          h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]),
          h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'),
          recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null,
          methodCards, structurePreview, methodFooter,
        ]),
        noticeState ? h('div', { key: 'notice', role: 'status', 'aria-live': 'polite', style: { marginTop: '10px', padding: '9px 11px', borderRadius: '8px', border: `1px solid ${noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amberLine : C.tealLine}`, background: noticeState.kind === 'error' ? C.redTint : noticeState.kind === 'warn' ? C.amberTint : C.tealTint, color: noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amber : C.teal, fontSize: '12px', lineHeight: 1.45 } }, noticeState.text) : null,
      ]) : null
  const slashMenu = slashOpen ? h('div', { key: 'slash-menu', role: 'listbox', style: { position: 'fixed', right: '76px', bottom: '86px', width: 'min(360px, calc(100vw - 32px))', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '12px', background: C.surface, boxShadow: C.shadowLg, zIndex: 61 } }, [h('div', { key: 'label', style: { padding: '4px 6px 7px', color: C.muted, fontSize: '11px' } }, `灵感库 · /pk ${vaultSearch} · ↑↓ 选择，Enter 插入`), ...(slashMatches.length ? slashMatches.map((item, index) => h('button', { key: item.id, role: 'option', 'aria-selected': index === slashActiveIndex, onClick: () => useVaultItem(item, 'replace'), style: { width: '100%', padding: '8px', border: 0, borderRadius: '7px', background: index === slashActiveIndex ? C.tealTint : 'transparent', color: C.ink, textAlign: 'left', cursor: 'pointer' } }, [h('strong', { key: 'title', style: { fontSize: '12px' } }, item.title), h('div', { key: 'meta', style: { marginTop: '2px', color: C.muted, fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.tags?.length ? `#${item.tags.join(' #')}` : item.type)])) : [h('div', { key: 'empty', style: { padding: '10px 6px', color: C.muted, fontSize: '11px' } }, '未找到匹配灵感；继续输入关键词或按 Esc。')])]) : null
  return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 30 } }, [h(GlobalStyle, { key: 'gcss' }), slashMenu, reviewPanel, h('button', { key: 'launcher', type: 'button', className: 'pk-fab', onPointerDown: event => { suppressClick.current = false; drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y, moved: false } }, onClick: () => { if (suppressClick.current) { suppressClick.current = false; return } setMode('enhance'); setLibraryOpen(false); setOpen(true) }, style: buttonStyle, title: '智能增强（⌘K）', 'aria-label': '打开智能增强', onMouseEnter: event => { event.currentTarget.style.transform = 'scale(1.06)' }, onMouseLeave: event => { event.currentTarget.style.transform = 'scale(1)' } }, h(Icon, { key: 'ic', name: 'sparkles', size: 18 })), panel, vaultOpen ? vaultPanel : null])
}

export { ConversationQuickAction as QuickEnhancer }
