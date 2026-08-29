// 对话参考选择弹层：从当前会话消息中勾选若干条，作为增强/组装的额外上下文。
// 提供全选、最近 N 条、清空三种快捷方式；确认后由主组件把选中 id 集合用于上下文拼装。
import { h, C } from '../foundation.js'
import { cleanSummary } from '../../lib/utils.js'

export function ContextOverlay({
  messages, selectedIds, activeMessages, selectedDraft, recentInputRef,
  onToggle, onSelectAll, onSelectRecent, onClear, onClose, onConfirm,
}) {
  return h('div', { key: 'overlay-backdrop', onClick: e => { if (e.target === e.currentTarget) onClose() }, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 80, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', paddingBottom: '4vh', paddingLeft: '16px', paddingRight: '16px', animation: 'pk-fade .15s ease', overflowY: 'auto' } }, [
    h('div', { key: 'overlay-panel', onClick: e => e.stopPropagation(), style: { width: 'min(360px, calc(100vw - 48px))', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', boxSizing: 'border-box', borderRadius: '10px', background: C.surface, border: `1px solid ${C.line}`, boxShadow: '0 24px 68px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' } }, [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        h('strong', { style: { fontSize: '12.5px', fontWeight: 700 } }, '选择对话参考'),
        h('button', { onClick: onClose, style: { border: 0, background: 'transparent', color: C.muted, fontSize: '15px', cursor: 'pointer', padding: '1px 5px' } }, '×'),
      ]),
      h('div', { key: 'toolbar', style: { display: 'flex', flexWrap: 'nowrap', gap: '5px', alignItems: 'center' } }, [
        h('button', { key: 'sel-all', onClick: onSelectAll, style: { padding: '2px 7px', border: `1px solid ${C.tealLine}`, borderRadius: '5px', background: C.surfaceAlt, color: C.teal, cursor: 'pointer', fontSize: '10.5px', fontWeight: 700 } }, `全选 (${messages.length})`),
        h('div', { key: 'recent-group', style: { display: 'inline-flex', alignItems: 'center', gap: '3px', border: `1px solid ${C.line}`, borderRadius: '5px', padding: '1px 5px', background: C.surfaceAlt } }, [
          h('span', { style: { fontSize: '11px', color: C.muted, fontWeight: 600 } }, '最近'),
          h('input', { key: 'recent-n', ref: recentInputRef, type: 'number', min: 1, max: messages.length, defaultValue: 3, style: { width: '32px', padding: '1px 3px', border: `1px solid ${C.line}`, borderRadius: '3px', fontSize: '11px', textAlign: 'center', background: C.surface, color: C.ink } }),
          h('button', { key: 'sel-recent', onClick: onSelectRecent, style: { padding: '2px 6px', border: `1px solid ${C.tealLine}`, borderRadius: '4px', background: C.tealTint, color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 700 } }, '选'),
        ]),
        h('button', { key: 'clear', onClick: onClear, disabled: selectedIds.length === 0, style: { padding: '3px 8px', border: `1px solid ${C.line}`, borderRadius: '5px', background: selectedIds.length > 0 ? '#fff0f0' : C.surfaceAlt, color: selectedIds.length > 0 ? '#c44' : C.muted, cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed', fontSize: '11px', fontWeight: 700 } }, '清空'),
      ]),
      // 分类摘要：帮助用户在勾选前判断这组消息能提供什么（问题/事实/约束/方案）。
      activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.25, padding: '1px 0' } }, `已选 ${activeMessages.length} 条：${selectedDraft.question ? ' 问题' : ''}${selectedDraft.facts ? ' 事实' : ''}${selectedDraft.constraints ? ' 约束' : ''}${selectedDraft.options ? ' 方案' : ''}`) : null,
      h('div', { key: 'messages', style: { maxHeight: '180px', minHeight: '60px', overflowY: 'auto', paddingRight: '4px', display: 'grid', gap: '2px' } }, messages.slice().reverse().map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: '4px', padding: '4px 6px', border: `1px solid ${selectedIds.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '6px', background: selectedIds.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [
        h('input', { key: 'check', type: 'checkbox', checked: selectedIds.includes(item.id), onChange: () => onToggle(item.id), style: { marginTop: '0', accentColor: C.teal } }),
        h('div', { key: 'text' }, [
          h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '10.5px', fontWeight: 800 } }, item.role === 'user' ? '你' : '助手'),
          h('div', { key: 'body', style: { marginTop: '0', color: C.slate, fontSize: '11px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`),
        ]),
      ]))),
      h('div', { key: 'footer', style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '5px', borderTop: `1px solid ${C.divide}` } }, [
        h('button', { key: 'cancel', onClick: onClose, style: { padding: '5px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.surfaceAlt, color: C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '取消'),
        h('button', { key: 'confirm', onClick: onConfirm, style: { padding: '5px 16px', border: 0, borderRadius: '6px', background: C.actionBg, color: C.actionFg, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, `确认选择 (${selectedIds.length})`),
      ]),
    ]),
  ])
}
