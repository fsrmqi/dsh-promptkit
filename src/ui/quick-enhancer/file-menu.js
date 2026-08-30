// 两个草稿前置弹层：
//   FileMenuNode        @ 文件引用补全菜单（输入 @ 触发，↑↓ 导航，Enter/点击插入）
//   VariableFillNode    模板变量补值面板（Vault 条目含 {{var}} 时弹出，确认后才写入）
// 两者都是 fixed 定位的浮层，zIndex 与抽屉同层（20004/20005），由主组件挂到插件根。
import { h, C, Icon, workbenchStyle } from '../foundation.js'
import { templateVariables } from '../../lib/utils.js'

export function FileMenuNode({ fileMenu, onHoverIndex, onInsert }) {
  if (!fileMenu) return null
  return h('div', { key: 'file-menu', role: 'listbox', 'aria-label': '文件引用补全', style: { position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '86px', width: 'min(400px, calc(100vw - 32px))', maxHeight: '260px', overflowY: 'auto', padding: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '12px', background: C.surface, boxShadow: C.shadowLg, zIndex: 20004 } }, [
    h('div', { key: 'label', style: { padding: '3px 6px 7px', color: C.muted, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' } }, [
      h(Icon, { key: 'ic', name: 'file', size: 12 }),
      `文件引用 · @${fileMenu.query || '…'} · ↑↓ 选择，Enter 插入`,
    ]),
    fileMenu.status === 'loading' ? h('div', { key: 'loading', style: { padding: '9px 8px', color: C.muted, fontSize: '11px' } }, '正在检索工作区文件…') : null,
    fileMenu.truncated ? h('div', { key: 'partial', style: { padding: '6px 8px', color: C.amber, fontSize: '11px' } }, '工作区较大或部分目录不可读，当前仅显示已索引文件。') : null,
    fileMenu.status === 'empty' ? h('div', { key: 'empty', style: { padding: '9px 8px', color: C.muted, fontSize: '11px' } }, '未匹配到文件；继续输入路径关键词，或按 Esc 关闭。') : null,
    // 等宽字体呈现路径；悬停与键盘导航共用 activeIndex，保证两者视觉一致。
    ...fileMenu.files.map((path, index) => h('button', {
      key: path,
      role: 'option',
      'aria-selected': index === fileMenu.activeIndex,
      onMouseEnter: () => onHoverIndex(index),
      onClick: () => onInsert(path),
      style: { width: '100%', padding: '7px 8px', border: 0, borderRadius: '7px', background: index === fileMenu.activeIndex ? C.tealTint : 'transparent', color: C.ink, textAlign: 'left', cursor: 'pointer', fontSize: '11px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    }, `@${path}`)),
  ])
}

export function VariableFillNode({ fill, onCancel, onConfirm }) {
  if (!fill) return null
  return h('div', {
    key: 'variable-fill',
    role: 'dialog',
    'aria-label': '填写模板变量',
    // 点遮罩关闭：只在点中 backdrop 自身时触发，面板内点击不冒泡误关。
    onClick: event => { if (event.target === event.currentTarget) onCancel() },
    style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 20005, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', animation: 'pk-fade .15s ease' },
  }, h('div', { style: { width: 'min(400px, calc(100vw - 40px))', maxHeight: '70vh', overflowY: 'auto', padding: '14px', borderRadius: '12px', background: C.surface, border: `1px solid ${C.tealLine}`, boxShadow: C.shadowLg, display: 'grid', gap: '8px' } }, [
    h('strong', { key: 'title', style: { fontSize: '13px' } }, `填写「${fill.item.title}」的变量`),
    // 每个变量一个补值输入；留空提交时 fillTemplateVariables 会保留 {{name}} 占位符。
    ...templateVariables(fill.item.body).map(name => h('label', { key: name, style: { display: 'grid', gap: '3px', fontSize: '11px', color: C.slate } }, [
      `{{${name}}}`,
      h('textarea', {
        key: 'value',
        value: fill.values[name] || '',
        onChange: event => fill.onChange(name, event.target.value),
        placeholder: `填入 ${name}（留空则保留占位符）`,
        style: { ...workbenchStyle.input, minHeight: '44px', resize: 'vertical', fontSize: '11px' },
      }),
    ])),
    h('div', { key: 'actions', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' } }, [
      h('button', { key: 'cancel', onClick: onCancel, style: { ...workbenchStyle.action } }, '取消'),
      h('button', { key: 'ok', onClick: onConfirm, style: { ...workbenchStyle.actionPrimary } }, '填入消息框'),
    ]),
  ]))
}
