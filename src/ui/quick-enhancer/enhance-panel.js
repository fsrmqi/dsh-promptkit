// 增强面板的右列（预览侧）：决策摘要 details 容器 + 内部的各状态区块。
// 数据流单向：全部内容由主组件计算好以 props 传入，本文件只做渲染编排。
//   强度选择器 / 自动增强开关 → 主组件状态
//   流式面板（阶段 + 分段 + 取消）→ streamState
//   五维诊断 + 知识区入口 → DiagnosisSection
//   技能引用修复提示 → skillRestore
import { h, C, Icon, workbenchStyle } from '../foundation.js'
import { DiagnosisSection } from './diagnosis-section.js'

// 强度三档（仅语义档生效）：档位注入 host 指令控制篇幅预算（≈1x/1.5x/3x）。
const STRENGTH_OPTIONS = [['low', '低 · 润色'], ['mid', '中 · 标准'], ['high', '高 · 展开']]

export function StrengthSelector({ value, onChange }) {
  return h('div', { key: 'strength', style: { marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' } }, [
    h('span', { key: 'label', style: { color: C.muted, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' } }, [h(Icon, { key: 'ic', name: 'gauge', size: 12 }), '强度']),
    ...STRENGTH_OPTIONS.map(([id, label]) => h('button', {
      key: id,
      className: 'pk-btn',
      onClick: () => onChange(id),
      style: { border: `1px solid ${value === id ? C.tealLineActive : C.tealLine}`, borderRadius: '999px', background: value === id ? C.tealTintDeep : C.surface, color: value === id ? C.teal : C.slate, cursor: 'pointer', padding: '3px 8px', fontSize: '10px', fontWeight: 800 },
    }, value === id ? [h(Icon, { key: 'ck', name: 'check', size: 11, style: { marginRight: '2px' } }), label] : label)),
  ])
}

// 发送前自动增强开关：仅在宿主注入 onSubmitDraft 时展示（否则没有可靠发送通道）。
// 只有增强失败才回退原文；发送失败不得自动重试。
export function AutoEnhanceToggle({ enabled, onChange }) {
  return h('label', { key: 'auto-enhance', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '8px', padding: '8px 10px', border: `1px solid ${enabled ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enabled ? C.tealTint : C.surface, cursor: 'pointer', fontSize: '11px', color: C.slate } }, [
    h('span', { key: 'text' }, [
      h('strong', { key: 't', style: { color: enabled ? C.teal : C.slate } }, '发送前自动增强'),
      h('div', { key: 'd', style: { marginTop: '2px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, enabled ? '仅拦截消息框 Enter；增强失败发原文，发送失败不重试。' : '开启后按消息框 Enter 时先增强再发送；Shift+Enter 换行不受影响。'),
    ]),
    h('input', { key: 'cb', type: 'checkbox', checked: enabled, onChange: event => onChange(event.target.checked), style: { accentColor: C.teal, cursor: 'pointer', flexShrink: 0 } }),
  ])
}

// 流式增强预览：阶段提示（等待 → 诊断中 → 输出中 → 完成用时）+ 实时计时 + 诊断/正文分段上屏。
// segments 已经过 [DIAG]/===PROMPT=== 过滤，只含真正的改写内容。
export function StreamPanel({ streamState, loading, onCancel }) {
  if (!streamState) return null
  if (streamState.phase === 'error') return null
  const phaseText = streamState.phase === 'waiting'
    ? '等待模型响应…'
      : streamState.phase === 'diagnosing'
      ? '正在分析任务信息…'
      : streamState.phase === 'streaming'
        ? '正在输出优化稿…'
      : streamState.phase === 'cancelled' ? '已取消，草稿未改动'
            : `完成 · 用时 ${(streamState.elapsedMs / 1000).toFixed(1)}s`
  return h('div', { key: 'stream-panel', role: 'status', 'aria-live': 'polite', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surface, fontSize: '11px', lineHeight: 1.5 } }, [
    h('div', { key: 'phase', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: C.teal, fontWeight: 800 } }, [
      h('span', { key: 'text' }, loading && (streamState.phase === 'waiting' || streamState.phase === 'diagnosing' || streamState.phase === 'streaming') ? `${phaseText} ${(streamState.elapsedMs / 1000).toFixed(0)}s` : phaseText),
      null,
    ]),
    streamState.segments.length ? h('div', { key: 'segments', style: { marginTop: '6px', display: 'grid', gap: '6px', maxHeight: '180px', overflowY: 'auto' } }, streamState.segments.map((segment, index) => h('div', { key: index, style: { padding: '6px 8px', borderRadius: '6px', background: C.surfaceAlt, color: C.slate, whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }, segment))) : null,
  ])
}

// 技能引用修复提示：改写丢失草稿中的 /xxx 记号时出现；「补回」把引用还原到稿末。
export function SkillRestoreNode({ skillRestore, onDismiss }) {
  if (!skillRestore) return null
  return h('div', { key: 'skill-restore', role: 'status', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.amberTint, fontSize: '11px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h(Icon, { key: 'ic', name: 'shield', size: 13, style: { color: C.amber, flexShrink: 0 } }),
    h('span', { key: 'text', style: { flex: 1, color: C.slate } }, `已自动补回技能引用：${skillRestore.lost.join('、')}`),
    h('button', { key: 'dismiss', onClick: onDismiss, style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px', flexShrink: 0 } }, '知道了'),
  ])
}

// 决策摘要 details 容器：把预览侧各区块按语义档/轻量档编排。
// 轻量档显示方法摘要 + diff + 成本 + 信号；语义档显示策略 + 流式 + 诊断 + 修复。
export function EnhancerPanel({
  mode, draft, enhancementKind, enhancementPlan, strategyNode,
  useMemoryContext, memoryPreview, onLoadMemory, memorySourceLabels, memoryReceipt,
  methodSummaryNode, diffPreview, costNode, signalsNode,
  actionNode, showAdvanced, onRefine,
  methodOptions, selectedMethodId, suggestedMethod, onMethodChange,
  streamState, loading, onCancelEnhance,
  diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge,
  skillRestore, onDismissSkills,
}) {
  const semantic = enhancementKind === 'semantic'
  return h('details', { key: 'enhancer', open: true, style: { position: 'relative', marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [
    h('summary', { key: 'title', style: { paddingRight: '70px', fontSize: '13px', color: C.ink, cursor: 'pointer', fontWeight: 800 } }, '决策摘要'),
    h('div', { key: 'apply', style: { position: 'absolute', top: '8px', right: '10px' } }, actionNode),
    h('div', { key: 'apply-hint', style: { marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, [
      h('label', { key: 'method', style: { display: 'inline-flex', alignItems: 'center', gap: '5px', minWidth: 0 } }, [
        h('span', { key: 'label', style: { flexShrink: 0 } }, '处理方式：'),
        h('select', { key: 'select', value: selectedMethodId || '', onChange: event => onMethodChange(event.target.value), 'aria-label': '选择增强方法', style: { maxWidth: '150px', border: `1px solid ${C.tealLineActive}`, borderRadius: '999px', background: C.surface, color: C.teal, padding: '3px 22px 3px 7px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' } }, [
          h('option', { key: 'auto', value: '' }, suggestedMethod ? `智能推荐：${suggestedMethod.title}` : '智能推荐：轻量整理'),
          ...methodOptions.map(method => h('option', { key: method.id, value: method.id }, method.title))
        ])
      ]),
      !showAdvanced ? h('button', { key: 'refine', className: 'pk-btn', onClick: onRefine, style: { flexShrink: 0, border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', padding: 0, fontSize: '11px', fontWeight: 800 } }, '再细化…') : null
    ]),
    // 项目记忆预览：语义档 + 勾选「加项目记忆」时出现，先看命中再决定注入。
    useMemoryContext && semantic ? h('div', { key: 'memory-preview', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' } }, [
        h('strong', { key: 'label', style: { color: C.teal } }, '项目记忆预览'),
        h('button', { key: 'preview', className: 'pk-btn', disabled: memoryPreview.status === 'loading' || draft.trim().length < 8, onClick: onLoadMemory, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, memoryPreview.status === 'loading' ? '检索中…' : '检索'),
      ]),
      memoryPreview.status === 'ready'
        ? h('div', { key: 'text', style: { marginTop: '6px', whiteSpace: 'pre-wrap' } }, [memoryPreview.text, memorySourceLabels(memoryPreview.sources)])
        : memoryPreview.status === 'empty'
          ? h('div', { key: 'empty', style: { marginTop: '6px', color: C.muted } }, '未命中可用项目记忆。')
          : memoryPreview.status === 'error'
            ? h('div', { key: 'error', style: { marginTop: '6px', color: C.red } }, memoryPreview.text)
            : h('div', { key: 'hint', style: { marginTop: '6px', color: C.muted } }, draft.trim().length < 8 ? '草稿至少 8 个字符后可检索。' : '先预览命中的摘要，再决定是否交给模型。'),
    ]) : null,
    // 记忆回执：增强完成后说明「本次实际注入了什么」，避免用户猜。
    memoryReceipt ? h('div', { key: 'memory-receipt', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${memoryReceipt.used ? C.tealLine : C.amberLine}`, borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, memoryReceipt.used ? [h('div', { key: 'text' }, `本次已注入项目记忆摘要：${memoryReceipt.text}`), memorySourceLabels(memoryReceipt.sources)] : '本次未注入项目记忆：未命中可用摘要。') : null,
    semantic
      ? h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode)
      : h('div', { key: 'summary', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [methodSummaryNode, diffPreview, costNode, signalsNode]),
    semantic ? h(StreamPanel, { key: 'stream', streamState, loading, onCancel: onCancelEnhance }) : null,
    showAdvanced ? h(DiagnosisSection, { key: 'diagnosis', diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge }) : null,
    showAdvanced ? h(SkillRestoreNode, { key: 'skills', skillRestore, onDismiss: onDismissSkills }) : null,
  ])
}
