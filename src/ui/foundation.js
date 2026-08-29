import React from 'react'

const h = React.createElement

// 优先复用宿主已加载的 KaTeX；未提供时保留可复制的 LaTex 源码，避免为核心包引入运行时依赖。
function LatexText({ text, block = false }) {
  const source = String(text || '')
  const parts = source.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
  const renderFormula = (raw, index) => {
    const display = raw.startsWith('$$')
    const latex = raw.slice(display ? 2 : 1, display ? -2 : -1)
    try {
      const katex = typeof window !== 'undefined' ? window.katex : null
      if (katex?.renderToString) return h('span', { key: index, className: 'pk-latex', title: '点击复制 LaTeX 源码', onClick: () => navigator.clipboard?.writeText(latex).catch(() => {}), style: { display: display ? 'block' : 'inline-block', margin: display ? '5px 0' : '0 2px', cursor: 'copy' }, dangerouslySetInnerHTML: { __html: katex.renderToString(latex, { displayMode: display, throwOnError: false, trust: false }) } })
    } catch {}
    return h('code', { key: index, className: 'pk-mono', title: '点击复制 LaTeX 源码', onClick: () => navigator.clipboard?.writeText(latex).catch(() => {}), style: { display: display ? 'block' : 'inline', padding: '1px 4px', borderRadius: '4px', background: 'var(--pk-paper-warm)', color: 'var(--pk-teal)', cursor: 'copy' } }, raw)
  }
  return h(block ? 'div' : 'span', { style: block ? { whiteSpace: 'pre-wrap' } : undefined }, parts.map((part, index) => /^\$\$[\s\S]+\$\$$|^\$[^$\n]+\$$/.test(part) ? renderFormula(part, index) : h('span', { key: index }, part)))
}
    const C = {
      ink: 'var(--pk-ink)', muted: 'var(--pk-muted)', line: 'var(--pk-line)', canvas: 'var(--pk-canvas)', surface: 'var(--pk-surface)',
      paper: 'var(--pk-paper)', paperWarm: 'var(--pk-paper-warm)',
      onInk: 'var(--pk-on-ink)',
      actionBg: 'var(--pk-action-bg)', actionFg: 'var(--pk-action-fg)',
      shadowCard: 'var(--pk-shadow-card)', shadowPanel: 'var(--pk-shadow-panel)', shadowFab: 'var(--pk-shadow-fab)', shadowLg: 'var(--pk-shadow-lg)',
      teal: 'var(--pk-teal)', tealStrong: 'var(--pk-teal-strong)',
      tealLine: 'var(--pk-teal-line)', tealLineStrong: 'var(--pk-teal-line-strong)', tealLineActive: 'var(--pk-teal-line-active)',
      tealTint: 'var(--pk-teal-tint)', tealTintDeep: 'var(--pk-teal-tint-deep)',
      blue: 'var(--pk-blue)', amber: 'var(--pk-amber)', amberLine: 'var(--pk-amber-line)', amberTint: 'var(--pk-amber-tint)',
      red: 'var(--pk-red)', redTint: 'var(--pk-red-tint)', slate: 'var(--pk-slate)',
      statusVerified: 'var(--pk-status-verified)', statusInferred: 'var(--pk-status-inferred)', statusToVerify: 'var(--pk-status-toverify)', statusPreference: 'var(--pk-status-preference)', statusRefuted: 'var(--pk-status-refuted)',
      divide: 'var(--pk-divide)', surfaceAlt: 'var(--pk-surface-alt)', track: 'var(--pk-track)',
      font: 'var(--pk-font)', fontMono: 'var(--pk-font-mono)',
    }
    const GLOBAL_CSS = `
:root {
  --pk-ink: #17212b; --pk-muted: #607080; --pk-line: #d8e1e8; --pk-canvas: #f4f7f9; --pk-surface: #fff;
  --pk-paper: #fafaf7; --pk-paper-warm: #f7f6f2;
  --pk-on-ink: #ffffff;
  --pk-action-bg: #0b5f58;
  --pk-action-fg: #ffffff;
  --pk-shadow-card: 0 1px 2px rgba(17,38,60,.04),0 8px 22px rgba(17,38,60,.035);
  --pk-shadow-panel: 0 1px 2px rgba(17,38,60,.04),0 10px 24px rgba(17,38,60,.025);
  --pk-shadow-fab: 0 4px 14px rgba(17,38,60,.18);
  --pk-shadow-faint: 0 6px 16px rgba(17,38,60,.14);
  --pk-shadow-lg: 0 20px 50px rgba(17,38,60,.20);
  --pk-teal: #0f766e; --pk-teal-strong: #0b5f58;
  --pk-teal-line: #cce8e2; --pk-teal-line-strong: #8acbbd; --pk-teal-line-active: #67b9aa;
  --pk-teal-tint: #f1faf8; --pk-teal-tint-deep: #effaf7;
  --pk-blue: #2563eb; --pk-amber: #b45309; --pk-amber-line: #f1d4a5; --pk-amber-tint: #fff7ed;
  --pk-red: #b91c1c; --pk-red-tint: #fdecec; --pk-slate: #52606d;
  --pk-status-verified: #15803d; --pk-status-inferred: #2563eb; --pk-status-toverify: #b45309; --pk-status-preference: #7c3aed; --pk-status-refuted: #b91c1c;
  --pk-divide: #edf1f4; --pk-surface-alt: #fcfdff; --pk-track: #e8eef2;
  --pk-font: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --pk-font-mono: ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Code", Menlo, Consolas, "Liberation Mono", monospace;
}
body { font-family: var(--pk-font); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
pre, code, .pk-mono { font-family: var(--pk-font-mono); }
.pk-field { display: block }
.pk-label { display: block; margin-bottom: 6px; font-size: 12px; font-weight: 500; color: var(--pk-ink); transition: color .15s ease }
.pk-label--muted { color: var(--pk-muted); font-weight: 700; font-size: 11px }
.pk-field:focus-within > .pk-label, .pk-field:focus-within > div > .pk-label { color: var(--pk-teal) }
@keyframes pk-breath { 0%,100% { box-shadow: 0 0 0 2px var(--pk-teal-tint) } 50% { box-shadow: 0 0 0 4px var(--pk-teal-tint) } }
input:focus, textarea:focus, select:focus { outline: 2px solid rgba(15,118,110,.45); outline-offset: 1px; border-color: var(--pk-teal-line-active) !important; animation: pk-breath 1.8s ease-in-out infinite }
/* ── 暗色调色板：唯一定义处（单一真源）──
   系统暗色（@media prefers-color-scheme: dark）与 DSH 暗色（body[data-ds-dark-theme]）
   两路触发都引用这里的 --pk-d-* 值。改任一暗色只需改此块，旧实现中两套暗色块各自
   复制导致的漂移问题已消除。 */
:root {
  --pk-d-ink: #e8eaed; --pk-d-muted: #9aa0a6; --pk-d-line: #3c4043; --pk-d-canvas: #181a20; --pk-d-surface: #242830;
  --pk-d-paper: #1e2127; --pk-d-paper-warm: #1a1d22;
  --pk-d-on-ink: #f4f7f9;
  --pk-d-action-bg: #2a9d94;
  --pk-d-action-fg: #ffffff;
  --pk-d-shadow-card: 0 1px 2px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.30);
  --pk-d-shadow-panel: 0 1px 2px rgba(0,0,0,.30),0 10px 24px rgba(0,0,0,.22);
  --pk-d-shadow-fab: 0 4px 14px rgba(0,0,0,.50),0 0 0 1px rgba(0,0,0,.30);
  --pk-d-shadow-faint: 0 6px 16px rgba(0,0,0,.35);
  --pk-d-shadow-lg: 0 20px 50px rgba(0,0,0,.55);
  --pk-d-teal: #3dbdb4; --pk-d-teal-strong: #2a9d94;
  --pk-d-teal-line: #1a3d38; --pk-d-teal-line-strong: #2a6a60; --pk-d-teal-line-active: #3a9a8a;
  --pk-d-teal-tint: #1a2e2c; --pk-d-teal-tint-deep: #162a28;
  --pk-d-blue: #5c9dff; --pk-d-amber: #f0a040; --pk-d-amber-line: #5a3a10; --pk-d-amber-tint: #2a1f10;
  --pk-d-red: #ff6b6b; --pk-d-red-tint: #3a1a1a; --pk-d-slate: #8a9199;
  --pk-d-status-verified: #34d399; --pk-d-status-inferred: #5c9dff; --pk-d-status-toverify: #f0a040; --pk-d-status-preference: #b794f6; --pk-d-status-refuted: #ff6b6b;
  --pk-d-divide: #2d3139; --pk-d-surface-alt: #1e2127; --pk-d-track: #2d3139;
}
/* 系统暗色：跟随操作系统偏好 */
@media (prefers-color-scheme: dark) {
  :root {
    --pk-ink: var(--pk-d-ink); --pk-muted: var(--pk-d-muted); --pk-line: var(--pk-d-line); --pk-canvas: var(--pk-d-canvas); --pk-surface: var(--pk-d-surface);
    --pk-paper: var(--pk-d-paper); --pk-paper-warm: var(--pk-d-paper-warm);
    --pk-on-ink: var(--pk-d-on-ink);
    --pk-action-bg: var(--pk-d-action-bg);
    --pk-action-fg: var(--pk-d-action-fg);
    --pk-shadow-card: var(--pk-d-shadow-card); --pk-shadow-panel: var(--pk-d-shadow-panel); --pk-shadow-fab: var(--pk-d-shadow-fab); --pk-shadow-faint: var(--pk-d-shadow-faint); --pk-shadow-lg: var(--pk-d-shadow-lg);
    --pk-teal: var(--pk-d-teal); --pk-teal-strong: var(--pk-d-teal-strong);
    --pk-teal-line: var(--pk-d-teal-line); --pk-teal-line-strong: var(--pk-d-teal-line-strong); --pk-teal-line-active: var(--pk-d-teal-line-active);
    --pk-teal-tint: var(--pk-d-teal-tint); --pk-teal-tint-deep: var(--pk-d-teal-tint-deep);
    --pk-blue: var(--pk-d-blue); --pk-amber: var(--pk-d-amber); --pk-amber-line: var(--pk-d-amber-line); --pk-amber-tint: var(--pk-d-amber-tint);
    --pk-red: var(--pk-d-red); --pk-red-tint: var(--pk-d-red-tint); --pk-slate: var(--pk-d-slate);
    --pk-status-verified: var(--pk-d-status-verified); --pk-status-inferred: var(--pk-d-status-inferred); --pk-status-toverify: var(--pk-d-status-toverify); --pk-status-preference: var(--pk-d-status-preference); --pk-status-refuted: var(--pk-d-status-refuted);
    --pk-divide: var(--pk-d-divide); --pk-surface-alt: var(--pk-d-surface-alt); --pk-track: var(--pk-d-track);
  }
  .pk-spinner { border-color: rgba(61,189,180,.22) }
  .pk-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
  button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline-color: rgba(61,189,180,.45) }
  .pk-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
  .pk-fab:hover { box-shadow: 0 6px 18px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.35) }
}
/* DSH 暗色主题：DSH 通过 body[data-ds-dark-theme] 属性切换明暗，不改变系统 prefers-color-scheme，
   故此处显式跟随该属性；暗色值复用上方 --pk-d-* 单一真源，与系统暗色完全一致。 */
body[data-ds-dark-theme] {
  --pk-ink: var(--pk-d-ink); --pk-muted: var(--pk-d-muted); --pk-line: var(--pk-d-line); --pk-canvas: var(--pk-d-canvas); --pk-surface: var(--pk-d-surface);
  --pk-paper: var(--pk-d-paper); --pk-paper-warm: var(--pk-d-paper-warm);
  --pk-on-ink: var(--pk-d-on-ink);
  --pk-action-bg: var(--pk-d-action-bg);
  --pk-action-fg: var(--pk-d-action-fg);
  --pk-shadow-card: var(--pk-d-shadow-card); --pk-shadow-panel: var(--pk-d-shadow-panel); --pk-shadow-fab: var(--pk-d-shadow-fab); --pk-shadow-faint: var(--pk-d-shadow-faint); --pk-shadow-lg: var(--pk-d-shadow-lg);
  --pk-teal: var(--pk-d-teal); --pk-teal-strong: var(--pk-d-teal-strong);
  --pk-teal-line: var(--pk-d-teal-line); --pk-teal-line-strong: var(--pk-d-teal-line-strong); --pk-teal-line-active: var(--pk-d-teal-line-active);
  --pk-teal-tint: var(--pk-d-teal-tint); --pk-teal-tint-deep: var(--pk-d-teal-tint-deep);
  --pk-blue: var(--pk-d-blue); --pk-amber: var(--pk-d-amber); --pk-amber-line: var(--pk-d-amber-line); --pk-amber-tint: var(--pk-d-amber-tint);
  --pk-red: var(--pk-d-red); --pk-red-tint: var(--pk-d-red-tint); --pk-slate: var(--pk-d-slate);
  --pk-status-verified: var(--pk-d-status-verified); --pk-status-inferred: var(--pk-d-status-inferred); --pk-status-toverify: var(--pk-d-status-toverify); --pk-status-preference: var(--pk-d-status-preference); --pk-status-refuted: var(--pk-d-status-refuted);
  --pk-divide: var(--pk-d-divide); --pk-surface-alt: var(--pk-d-surface-alt); --pk-track: var(--pk-d-track);
}
body[data-ds-dark-theme] .pk-spinner { border-color: rgba(61,189,180,.22) }
body[data-ds-dark-theme] .pk-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
body[data-ds-dark-theme] button:focus-visible, body[data-ds-dark-theme] input:focus-visible, body[data-ds-dark-theme] textarea:focus-visible, body[data-ds-dark-theme] select:focus-visible { outline-color: rgba(61,189,180,.45) }
body[data-ds-dark-theme] .pk-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
body[data-ds-dark-theme] .pk-fab:hover { box-shadow: 0 6px 18px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.35) }
@keyframes pk-pop { from { opacity: 0; transform: translateY(6px) scale(.985) } to { opacity: 1; transform: none } }
@keyframes pk-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pk-spin { to { transform: rotate(360deg) } }
@keyframes pk-fan-in { from { opacity: 0; transform: translateY(4px) scale(.9) } to { opacity: 1; transform: none } }
.pk-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(15,118,110,.22); border-top-color: var(--pk-teal); border-radius: 50%; animation: pk-spin .7s linear infinite; vertical-align: -2px; margin-right: 7px }
.pk-fab { transition: transform .18s ease, box-shadow .18s ease; box-shadow: var(--pk-shadow-fab) }
.pk-fab:hover { transform: scale(1.06); box-shadow: var(--pk-shadow-fab) }
.pk-fab:active { transform: scale(.96) }
.pk-btn { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease, opacity .15s ease }
.pk-btn:hover:not(:disabled) { transform: translateY(-1px) }
.pk-btn:active:not(:disabled) { transform: translateY(0) scale(.98) }
.pk-action-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px) }
.pk-action-primary:active:not(:disabled) { transform: translateY(0) scale(.98) }
.pk-action-primary:disabled { opacity: 0.5; cursor: not-allowed }
.pk-card { transition: transform .18s ease, box-shadow .18s ease }
.pk-card:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(17,38,60,.08) }
.pk-scroll::-webkit-scrollbar { width: 8px; height: 8px }
.pk-scroll::-webkit-scrollbar-thumb { background: #cdd8df; border-radius: 999px }
.pk-scroll::-webkit-scrollbar-track { background: transparent }
button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid rgba(15,118,110,.45); outline-offset: 2px }
`
    const GlobalStyle = () => h('style', { key: 'pk-global-css', dangerouslySetInnerHTML: { __html: GLOBAL_CSS } })
    const Spinner = ({ text }) => h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', lineHeight: 1.5 } }, [h('span', { key: 'spin', className: 'pk-spinner', 'aria-hidden': 'true' }), text])
    const ICON_PATHS = {
      sparkles: 'M12 3.2l1.7 4.1 4.1 1.7-4.1 1.7L12 14.8l-1.7-4.1-4.1-1.7 4.1-1.7L12 3.2zM18.8 13.5l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2z',
      sparkle: 'M12 3.2l1.7 4.1 4.1 1.7-4.1 1.7L12 14.8l-1.7-4.1-4.1-1.7 4.1-1.7L12 3.2z',
      wand: 'M14.5 5.5 18.5 9.5M4 20 13.5 10.5M13.5 10.5l1.5-1.5a2.12 2.12 0 0 1 3 3L16.5 13.5',
      close: 'M6 6l12 12M18 6 6 18',
      star: 'M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2z',
      check: 'M4.5 12.5l5 5L19.5 7',
      thumbsUp: 'M7 11v8H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h3zm0 0 4.2-6.6a1.6 1.6 0 0 1 2.8 1.1V8h4.6a2 2 0 0 1 2 2.4l-1.3 6.2A2 2 0 0 1 16.9 18H7',
      thumbsDown: 'M17 13v-8h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3zm0 0-4.2 6.6a1.6 1.6 0 0 1-2.8-1.1V16H5.4a2 2 0 0 1-2-2.4l1.3-6.2A2 2 0 0 1 7.1 6H17',
      extract: 'M4 6h16M4 12h9M4 18h6M13 14l3 3 3-3M16 11v6',
      send: 'M4 12 20 4l-6 16-3-6-7-2z',
      copy: 'M9 9h10v10H9zM5 15V5h10v2',
      history: 'M12 7v5l3 2M21 12a9 9 0 1 1-2.6-6.4M21 4v4h-4',
      search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.6-3.6',
      edit: 'M4 20h4L18.5 9.5l-4-4L4 16v4zM13.5 6.5l4 4',
      trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
      refresh: 'M20 11a8 8 0 1 0-1.8 5M20 5v6h-6',
      document: 'M6 3h8l4 4v14H6zM14 3v4h4',
      chevronDown: 'M6 9l6 6 6-6',
      link: 'M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 5.6 5.6l-1 1M13.5 17.5l-1 1a4 4 0 0 1-5.6-5.6l1-1',
      arrowRight: 'M5 12h14M13 6l6 6-6 6',
      plus: 'M12 5v14M5 12h14',
      settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
      file: 'M14 3v5h5M6 3h8l5 5v13H6zM8 13h8M8 17h5',
      undo: 'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
      variable: 'M8 4C5 8 5 16 8 20M16 4c3 4 3 12 0 16M9.5 9.5 12 12l-2.5 2.5M14.5 9.5 12 12l2.5 2.5',
      shield: 'M12 3l8 3v6c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V6l8-3zM9 12l2 2 4-4',
      gauge: 'M12 13l4-4M4.5 19a9 9 0 1 1 15 0M12 21h.01',
    }
    const Icon = ({ name, size = 14, style, strokeWidth = 1.7 }) => h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style }, ICON_PATHS[name] ? h('path', { d: ICON_PATHS[name] }) : null)
    function Panel({ title, hint, children, style }) { return h('section', { style: { ...S.panel, ...style } }, [h('div', { key: 'h', style: S.head }, [h('h2', { key: 't', style: S.h2 }, title), h('span', { key: 'i', style: S.hint }, hint)]), children]) }
    // 浮层分区卡片外壳：quick-enhancer 多处复用的「带边框圆角容器」共性样式。
    // 仅负责容器外观（边框 / 圆角 / 背景 / 可选小字号），标题行与内部内容由调用处自行组织，
    // 以保持与浮层现有视觉（tealLine 淡青边框、9px 圆角）完全一致，且不影响 studio 全页 Panel。
    function Card({ tint = false, fontSize, as = 'div', style, children }) {
      return h(as, {
        style: {
          padding: '9px',
          border: `1px solid ${C.tealLine}`,
          borderRadius: '9px',
          background: tint ? C.tealTint : C.surface,
          ...(fontSize ? { fontSize } : {}),
          ...style,
        },
      }, children)
    }
    const S = { page: { minHeight: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '24px', background: C.canvas, color: C.ink }, title: { margin: 0, fontSize: '20px', fontWeight: 720 }, lead: { margin: '6px 0 20px', color: C.muted, fontSize: '13px' }, cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(132px,1fr))', gap: '10px', marginBottom: '16px' }, card: { minHeight: '82px', padding: '14px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, label: { color: C.muted, fontSize: '12px', fontWeight: 600 }, value: { marginTop: '8px', fontSize: '23px', fontWeight: 720 }, layout: { display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(270px,.8fr)', gap: '16px', alignItems: 'start' }, side: { display: 'grid', gap: '16px' }, panel: { overflow: 'hidden', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, head: { display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.line}` }, h2: { margin: 0, fontSize: '14px', fontWeight: 700 }, hint: { color: C.muted, fontSize: '12px' }, row: { display: 'grid', gridTemplateColumns: '9px minmax(0,1fr) auto', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: `1px solid ${C.divide}` }, name: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 600 }, meta: { marginTop: '3px', color: C.muted, fontSize: '12px' }, small: { color: C.muted, fontSize: '12px', fontVariantNumeric: 'tabular-nums' }, empty: { padding: '28px 16px', color: C.muted, fontSize: '13px', lineHeight: 1.6 }, bars: { padding: '4px 16px 12px' }, bar: { padding: '10px 0' }, top: { display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px', fontSize: '12px' }, track: { height: '6px', overflow: 'hidden', borderRadius: '999px', background: C.track }, privacy: { marginTop: '16px', padding: '11px 13px', border: `1px solid ${C.tealLineStrong}`, borderRadius: '8px', background: C.tealTint, color: C.tealStrong, fontSize: '12px', lineHeight: 1.55 } }
    Object.assign(S, {
      page: { ...S.page, padding: '30px 34px 48px', background: C.canvas },
      title: { ...S.title, fontSize: '27px', letterSpacing: '-.035em', fontWeight: 760 },
      lead: { ...S.lead, margin: '8px 0 22px', fontSize: '14px', lineHeight: 1.55 },
      card: { ...S.card, minHeight: '96px', borderRadius: '12px', boxShadow: C.shadowCard },
      panel: { ...S.panel, borderRadius: '12px', boxShadow: C.shadowPanel },
      head: { ...S.head, padding: '15px 18px', background: C.surfaceAlt },
      h2: { ...S.h2, letterSpacing: '-.01em' },
      empty: { ...S.empty, padding: '30px 18px', background: C.surfaceAlt },
    })
    const workbenchStyle = {
      tabs: { display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: `1px solid ${C.line}` },
      tab: active => ({ padding: '9px 12px', border: 0, borderBottom: active ? `2px solid ${C.teal}` : '2px solid transparent', background: 'transparent', color: active ? C.ink : C.muted, cursor: 'pointer', fontSize: '13px', fontWeight: active ? 700 : 600 }),
      action: { padding: '7px 10px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, color: C.ink, cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '12px' },
      overviewMetrics: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(150px,220px))', gap: '10px', margin: '16px 0' },
      overviewBody: { display: 'grid', gridTemplateColumns: 'minmax(0,1.35fr) minmax(300px,.85fr)', gap: '16px', alignItems: 'start' },
      hero: { padding: '20px', border: `1px solid ${C.line}`, borderRadius: '12px', background: `linear-gradient(120deg,${C.surface} 0%,${C.tealTint} 100%)` },
      heroKicker: { color: C.teal, fontSize: '12px', fontWeight: 700, letterSpacing: '.04em' },
      heroTitle: { margin: '8px 0 6px', fontSize: '26px', lineHeight: 1.2, letterSpacing: '-.03em' },
      heroMeta: { color: C.muted, fontSize: '13px', lineHeight: 1.5 },
      taskRow: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '13px 16px', borderBottom: `1px solid ${C.divide}` },
      badge: color => ({ display: 'inline-block', padding: '2px 7px', borderRadius: '999px', background: `${color}15`, color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }),
      compact: { padding: '12px 16px', borderBottom: `1px solid ${C.divide}`, fontSize: '13px', lineHeight: 1.5 },
      input: { width: '100%', boxSizing: 'border-box', padding: '10px 11px', border: `1px solid ${C.line}`, borderRadius: '7px', fontSize: '13px', background: C.surface, color: C.ink },
      actions: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' },
    }
    Object.assign(workbenchStyle, {
      tabs: { display: 'inline-flex', gap: '3px', margin: '0 0 22px', padding: '4px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: C.shadowCard },
      tab: active => ({ padding: '8px 13px', border: 0, borderRadius: '8px', background: active ? C.tealTintDeep : 'transparent', color: active ? C.teal : C.muted, cursor: 'pointer', fontSize: '13px', fontWeight: active ? 750 : 600, transition: 'background .16s ease,color .16s ease' }),
      overviewMetrics: { ...workbenchStyle.overviewMetrics, gridTemplateColumns: 'repeat(4,minmax(160px,230px))', gap: '12px', margin: '18px 0' },
      overviewBody: { ...workbenchStyle.overviewBody, gap: '18px' },
      hero: { ...workbenchStyle.hero, padding: '24px', border: `1px solid ${C.tealLine}`, borderRadius: '16px', background: `linear-gradient(120deg,${C.surface} 0%,${C.tealTintDeep} 58%,${C.tealTint} 100%)`, boxShadow: '0 10px 28px rgba(15,118,110,.07),inset 0 0 0 1px rgba(15,118,110,.04)' },
      heroKicker: { ...workbenchStyle.heroKicker, textTransform: 'uppercase', letterSpacing: '.09em' },
      heroTitle: { ...workbenchStyle.heroTitle, fontSize: '30px', fontWeight: 780 },
      taskRow: { ...workbenchStyle.taskRow, padding: '15px 18px' },
      taskGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', padding: '14px' },
      taskCard: { minHeight: '154px', boxSizing: 'border-box', padding: '16px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: C.shadowCard },
      compact: { ...workbenchStyle.compact, padding: '14px 18px' },
      action: { ...workbenchStyle.action, padding: '9px 16px', borderColor: C.tealLineStrong, background: C.tealTint, color: C.teal, flexShrink: 0, whiteSpace: 'nowrap' },
      actionPrimary: { padding: '10px 18px', border: `1px solid ${C.actionBg}`, borderRadius: '8px', background: C.actionBg, color: C.actionFg, cursor: 'pointer', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', transition: 'opacity .15s ease, transform .15s ease' },
      actionPrimaryHover: { opacity: 0.92 },
      input: { ...workbenchStyle.input, flex: 1, minWidth: 0, padding: '11px 12px', borderRadius: '8px', background: C.surface },
    })

export { h, C, GLOBAL_CSS, GlobalStyle, Spinner, ICON_PATHS, Icon, LatexText, S, workbenchStyle, Panel, Card }
