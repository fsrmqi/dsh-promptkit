// 草稿前置弹层：VariableFillNode 模板变量补值面板（Vault 条目含 {{var}} 时弹出，确认后才写入）。
// fixed 定位浮层，zIndex 20005，由主组件挂到插件根。
// 历史注记：原 FileMenuNode（@ 文件引用补全菜单）已移除——DSH 原生 @ 提及
// 提供同类能力且为超集（文件+会话、目录下钻、原子行内引用），插件在宿主
// 输入框上重复实现只会产生双菜单重叠与吞键冲突。
import { h, C, workbenchStyle } from '../foundation.js'
import { templateVariables } from '../../lib/utils.js'

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
