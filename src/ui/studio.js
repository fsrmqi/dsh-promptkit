import React from 'react'
import { h, C, S, workbenchStyle, GlobalStyle, Spinner, Panel } from './foundation.js'
import { list, cleanSummary, cleanContext, selectedConversationDraft } from '../lib/utils.js'
import { withPrefix } from '../core/composer.js'

// PromptStudio（方法工坊）：开源核心组件，零宿主依赖。
// 所有外部能力经 props 注入；未注入的可选能力对应 UI 区块自动隐藏，组件始终可用：
//   methodProvider    (必填) MethodProvider：方法源 + compose + 收藏/历史持久化
//   messages          (可选) [{ id, role:'user'|'assistant', text }]：当前对话，用于「从当前对话提取」
//   onSend            (可选) (text) => Promise：直接发送生成的 Prompt（如发送到当前会话）
//   composer          (可选) Composer 实例：把生成的 Prompt 写入目标输入框
//   getRecentSessions (可选) () => Promise<Array<{ intent?, summary? }>>：追加最近会话摘要
//   searchMemory      (可选) (query) => Promise<string>：按自然语言检索项目记忆
function PromptStudio({ methodProvider, messages, onSend, composer, getRecentSessions, searchMemory }) {
  const [methods, setMethods] = React.useState([])
  const [loadingMethods, setLoadingMethods] = React.useState(true)
  const [methodId, setMethodId] = React.useState('')
  const [category, setCategory] = React.useState('全部')
  const [search, setSearch] = React.useState('')
  const [favorites, setFavorites] = React.useState([])
  const [history, setHistory] = React.useState([])
  const [question, setQuestion] = React.useState('')
  const [facts, setFacts] = React.useState('')
  const [constraints, setConstraints] = React.useState('')
  const [options, setOptions] = React.useState('')
  const [recentLimit, setRecentLimit] = React.useState('0')
  const [recentPreview, setRecentPreview] = React.useState(null)
  const [contextQuery, setContextQuery] = React.useState('')
  const [contextPreview, setContextPreview] = React.useState('')
  const [preview, setPreview] = React.useState(null)
  const [extracted, setExtracted] = React.useState(null)
  const [message, setMessage] = React.useState('')
  React.useEffect(() => {
    let alive = true
    setLoadingMethods(true)
    methodProvider.list().then(value => { if (alive) setMethods(list(value)) }).catch(error => { if (alive) setMessage(String(error?.message || error)) }).finally(() => { if (alive) setLoadingMethods(false) })
    methodProvider.getFavorites?.().then(value => { if (alive) setFavorites(list(value)) }).catch(() => {})
    methodProvider.getHistory?.().then(value => { if (alive) setHistory(list(value)) }).catch(() => {})
    return () => { alive = false }
  }, [methodProvider])
  const categories = ['全部', ...Array.from(new Set(methods.map(item => item.category))).filter(Boolean)]
  const pinnedNames = ['苏格拉底式提问', '第一性原理', '双向钢人论证']
  const pinned = pinnedNames.map(name => methods.find(item => item.title === name)).filter(Boolean)
  const visibleMethods = (category === '全部' ? methods : methods.filter(item => item.category === category)).filter(item => !search.trim() || `${item.title} ${item.purpose} ${item.tags}`.toLowerCase().includes(search.trim().toLowerCase()))
  React.useEffect(() => { if (!methodId && methods.length) setMethodId(methods[0].id) }, [methodId, methods.length])
  const method = methods.find(item => item.id === methodId)
  const toggleFavorite = id => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
    setFavorites(next)
    methodProvider.setFavorites?.(next).catch(() => {})
  }
  const compose = () => methodProvider.compose({ methodId, question, facts, constraints, options }).then(value => {
    setPreview(value)
    return methodProvider.pushHistory({ id: methodId, title: value.method?.title || method?.title || '', question: cleanSummary(question), at: Date.now() }).catch(() => {}).then(() => methodProvider.getHistory?.()).then(rows => { if (rows) setHistory(list(rows)) })
  }).catch(error => setMessage(String(error?.message || error)))
  const previewRecent = async () => {
    try {
      const items = list(await getRecentSessions()).slice(0, Number(recentLimit))
      const summary = items.map(item => cleanContext(item.intent || item.summary)).filter(Boolean).join('\n').slice(0, 1200)
      setRecentPreview({ count: items.length, summary })
      setMessage(summary ? '' : '没有可追加的已保存会话摘要。')
    } catch (error) { setMessage(String(error?.message || error)) }
  }
  const appendRecent = () => {
    const summary = cleanContext(recentPreview?.summary || '')
    if (summary) setFacts(value => [value, '最近会话摘要：', summary].filter(Boolean).join('\n'))
    setRecentPreview(null)
    setMessage(summary ? `已追加最近 ${recentPreview.count} 个会话摘要。` : '没有可追加的已保存会话摘要。')
  }
  const searchContext = () => searchMemory(contextQuery).then(value => setContextPreview(String(value ?? ''))).catch(error => setMessage(String(error?.message || error)))
  const appendContext = () => {
    const context = cleanContext(contextPreview || '')
    if (context) setFacts(value => [value, '项目记忆检索：', context].filter(Boolean).join('\n'))
    setContextPreview('')
  }
  const writePreview = () => {
    const next = withPrefix(composer.getDraft(), preview.prompt)
    composer.write(next)
    setMessage('已写入输入框，可编辑后发送。')
  }
  const copyPreview = async () => {
    try { await navigator.clipboard?.writeText(preview.prompt); setMessage('Prompt 已复制到剪贴板。') }
    catch { setMessage('复制失败，请手动选择预览文本复制。') }
  }
  const previewPanel = preview ? h(Panel, { key: 'preview', title: '发送前预览', hint: `${preview.estimated_chars} 字符` }, h('div', { style: { padding: '18px' } }, [
    h('pre', { key: 'text', style: { margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: 1.55, color: C.slate, maxHeight: '280px', overflow: 'auto' } }, preview.prompt),
    h('div', { key: 'actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' } }, [
      onSend ? h('button', { key: 'send', onClick: () => onSend(preview.prompt).then(() => setMessage('已发送。')).catch(error => setMessage(String(error?.message || error))), style: workbenchStyle.action }, '发送到当前会话') : null,
      composer ? h('button', { key: 'write', onClick: writePreview, style: { ...workbenchStyle.action, background: C.surface, color: C.teal } }, '写入输入框') : null,
      h('button', { key: 'copy', onClick: copyPreview, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '复制 Prompt'),
    ]),
  ])) : null
  return h('main', { style: S.page }, [
    h(GlobalStyle, { key: 'gcss' }),
    h('h1', { key: 'title', style: S.title }, '方法工坊'),
    h('p', { key: 'lead', style: S.lead }, '选择方法后，用精简的问题、事实和约束生成可编辑 Prompt；对话页也可用右下角快捷按钮处理。'),
    loadingMethods ? h('div', { key: 'loading', style: S.empty }, h(Spinner, { text: '正在读取方法库…' })) : h('div', { key: 'layout', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '18px', alignItems: 'start' } }, [
      h(Panel, { key: 'methods', title: '选择方法', hint: `${visibleMethods.length} / ${methods.length}`, style: { position: 'sticky', top: '14px', maxHeight: 'calc(100vh - 146px)', overflowY: 'auto' } }, [
        h('div', { key: 'filter', style: { padding: '14px', borderBottom: `1px solid ${C.divide}`, display: 'grid', gap: '8px' } }, [h('input', { key: 'search', value: search, onChange: event => setSearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 10px' } }), h('select', { key: 'select', value: category, onChange: event => setCategory(event.target.value), style: { width: '100%', padding: '8px 10px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, color: C.ink } }, categories.map(value => h('option', { key: value, value }, value)))]),
        h('div', { key: 'pinned', style: { padding: '14px', borderBottom: `1px solid ${C.divide}`, background: C.tealTint } }, [h('div', { key: 'label', style: { marginBottom: '9px', color: C.teal, fontSize: '11px', fontWeight: 800, letterSpacing: '.06em' } }, '常用方法'), h('div', { key: 'items', style: { display: 'grid', gap: '7px' } }, pinned.map(item => h('button', { key: item.id, className: 'pk-btn', onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') }, style: { padding: '9px 10px', border: `1px solid ${item.id === methodId ? C.tealLineStrong : C.tealLine}`, borderRadius: '8px', background: item.id === methodId ? C.tealTint : C.surface, textAlign: 'left', cursor: 'pointer' } }, [h('div', { key: 'title', style: { ...S.name, fontSize: '12px' } }, item.title), h('div', { key: 'purpose', style: { ...S.meta, marginTop: '3px', fontSize: '11px' } }, item.purpose)])))]),
        favorites.length ? h('div', { key: 'favorites', style: { padding: '12px 14px', borderBottom: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { marginBottom: '7px', color: C.muted, fontSize: '11px', fontWeight: 800 } }, '我的收藏'), h('div', { key: 'items', style: { display: 'flex', flexWrap: 'wrap', gap: '5px' } }, favorites.map(id => methods.find(item => item.id === id)).filter(Boolean).map(item => h('button', { key: item.id, onClick: () => setMethodId(item.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `★ ${item.title}`)))] ) : null,
        visibleMethods.map(item => h('button', { key: item.id, className: 'pk-btn', onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') }, style: { width: '100%', padding: '15px', border: 0, borderBottom: `1px solid ${C.divide}`, background: item.id === methodId ? C.tealTint : C.surface, textAlign: 'left', cursor: 'pointer' } }, [h('div', { key: 'title', style: S.name }, item.title), h('div', { key: 'purpose', style: { ...S.meta, marginTop: '5px', color: C.ink, lineHeight: 1.45 } }, item.purpose || '查看方法说明后再决定是否使用。'), h('div', { key: 'meta', style: { ...S.meta, marginTop: '6px' } }, `${item.category} · ${item.mode === 'guided' ? '会逐步追问' : '会一次性分析'}`)])),
      ]),
      h('div', { key: 'form', style: S.side }, [
        h(Panel, { key: 'input', title: method?.title || '方法输入', hint: method?.purpose || '' }, h('div', { style: { padding: '18px', display: 'grid', gap: '12px' } }, [
          method ? h('div', { key: 'guide', style: { padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, color: C.slate, fontSize: '12px', lineHeight: 1.55 } }, [h('strong', { key: 'label', style: { color: C.teal } }, '你会得到：'), ` ${method.outcome || (method.mode === 'guided' ? 'AI 会逐步追问，直到问题足够清楚。' : '一份结构化分析、风险和下一步行动。')}`]) : null,
          h('div', { key: 'extract-actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [messages?.length ? h('button', { key: 'extract', onClick: () => setExtracted(selectedConversationDraft(messages)), style: workbenchStyle.action }, '从当前对话提取') : null, method ? h('button', { key: 'favorite', onClick: () => toggleFavorite(method.id), style: { ...workbenchStyle.action, background: favorites.includes(method.id) ? C.tealTintDeep : C.surface } }, favorites.includes(method.id) ? '★ 已收藏' : '☆ 收藏方法') : null, h('button', { key: 'clear', onClick: () => { setQuestion(''); setFacts(''); setConstraints(''); setOptions(''); setExtracted(null) }, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '清空')]),
          extracted ? h('div', { key: 'extracted', style: { padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55 } }, [h('strong', { key: 'head', style: { color: C.teal } }, `已从 ${extracted.source_count} 条文本消息生成草稿`), h('div', { key: 'summary', style: { ...S.meta, marginTop: '5px' } }, `问题 ${extracted.question ? '✓' : '—'} · 事实 ${extracted.facts ? '✓' : '—'} · 约束 ${extracted.constraints ? '✓' : '—'} · 未决问题 ${extracted.unresolved ? '✓' : '—'}`), extracted.question ? h('div', { key: 'question', style: { marginTop: '7px', color: C.slate } }, `问题：${cleanSummary(extracted.question)}`) : null, extracted.unresolved ? h('div', { key: 'unresolved', style: { marginTop: '4px', color: C.slate } }, `未决：${cleanSummary(extracted.unresolved)}`) : null, h('button', { key: 'apply', onClick: () => { setQuestion(extracted.question); setFacts(extracted.facts); setConstraints(extracted.constraints); setOptions(extracted.options); setExtracted(null) }, style: { ...workbenchStyle.action, marginTop: '9px' } }, '确认并填入表单')]) : null,
          h('textarea', { key: 'q', value: question, onChange: e => setQuestion(e.target.value), placeholder: '输入你想解决的问题', style: { ...workbenchStyle.input, minHeight: '92px', resize: 'vertical' } }),
          h('div', { key: 'supporting', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' } }, [h('textarea', { key: 'f', value: facts, onChange: e => setFacts(e.target.value), placeholder: '可选：已知事实', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } }), h('textarea', { key: 'c', value: constraints, onChange: e => setConstraints(e.target.value), placeholder: '可选：现实约束、资源或不可接受结果', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } }), h('textarea', { key: 'o', value: options, onChange: e => setOptions(e.target.value), placeholder: '可选：已有方案、备选路径或尚未解决的问题', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } })]),
          getRecentSessions ? h('div', { key: 'history', style: { paddingTop: '4px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { ...S.label, marginBottom: '4px' } }, '追加最近会话摘要'), h('div', { key: 'hint', style: { ...S.meta, marginBottom: '7px' } }, '只读取已保存的简短摘要，不读取完整历史对话、工具参数或工具结果。'), h('div', { key: 'controls', style: { display: 'flex', gap: '8px' } }, [h('select', { key: 'limit', value: recentLimit, onChange: e => { setRecentLimit(e.target.value); setRecentPreview(null) }, style: { padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px' } }, [['0', '不追加'], ['1', '最近 1 个'], ['3', '最近 3 个'], ['5', '最近 5 个']].map(([value, label]) => h('option', { key: value, value }, label))), h('button', { key: 'preview', disabled: recentLimit === '0', onClick: previewRecent, style: workbenchStyle.action }, '预览摘要')]), recentPreview ? h('div', { key: 'preview', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [h('div', { key: 'text', style: { color: C.slate } }, recentPreview.summary || '未找到可追加的已保存会话摘要。'), h('button', { key: 'apply', disabled: !recentPreview.summary, onClick: appendRecent, style: { ...workbenchStyle.action, marginTop: '8px' } }, `追加 ${recentPreview.count} 个摘要到事实`)]) : null]) : null,
          searchMemory ? h('div', { key: 'search', style: { paddingTop: '4px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { ...S.label, marginBottom: '4px' } }, '按自然语言搜索项目记忆'), h('div', { key: 'hint', style: { ...S.meta, marginBottom: '7px' } }, '用一句自然语言描述你要找的旧决策或证据；搜索范围由宿主注入的 searchMemory 决定。'), h('div', { key: 'controls', style: { display: 'flex', gap: '8px' } }, [h('input', { key: 'query', value: contextQuery, onChange: e => setContextQuery(e.target.value), placeholder: '例如：之前关于 Feign 兼容的决策', style: workbenchStyle.input }), h('button', { key: 'search', disabled: !contextQuery.trim(), onClick: searchContext, style: workbenchStyle.action }, '搜索')]), contextPreview ? h('div', { key: 'preview', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [h('div', { key: 'text', style: { color: C.slate } }, cleanContext(contextPreview) || '未找到可追加的项目记忆。'), h('button', { key: 'apply', onClick: appendContext, style: { ...workbenchStyle.action, marginTop: '8px' } }, '追加到事实')]) : null]) : null,
          h('button', { key: 'compose', onClick: compose, style: workbenchStyle.action }, '生成 Prompt 预览'),
        ])),
        previewPanel,
        history.length ? h(Panel, { key: 'history-panel', title: '最近生成', hint: `${history.length} 条` }, h('div', { style: { padding: '10px 14px', display: 'grid', gap: '6px' } }, history.map(item => h('button', { key: `${item.id}:${item.at}`, onClick: () => { setMethodId(item.id); setQuestion(item.question); setMessage('已恢复最近一次问题，可继续编辑。') }, style: { padding: '8px 9px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, textAlign: 'left', cursor: 'pointer', fontSize: '11px', color: C.slate } }, `${item.title} · ${item.question || '未命名问题'} · ${item.at ? new Date(item.at).toLocaleTimeString() : ''}`)))) : null,
        message ? h('div', { key: 'message', style: { color: C.teal, fontSize: '13px' } }, message) : null,
      ]),
    ]),
  ])
}

export { PromptStudio }
