import React from 'react'

const h = React.createElement
    const C = {
      ink: 'var(--mc-ink)', muted: 'var(--mc-muted)', line: 'var(--mc-line)', canvas: 'var(--mc-canvas)', surface: 'var(--mc-surface)',
      teal: 'var(--mc-teal)', tealStrong: 'var(--mc-teal-strong)',
      tealLine: 'var(--mc-teal-line)', tealLineStrong: 'var(--mc-teal-line-strong)', tealLineActive: 'var(--mc-teal-line-active)',
      tealTint: 'var(--mc-teal-tint)', tealTintDeep: 'var(--mc-teal-tint-deep)',
      blue: 'var(--mc-blue)', amber: 'var(--mc-amber)', amberLine: 'var(--mc-amber-line)', amberTint: 'var(--mc-amber-tint)',
      red: 'var(--mc-red)', redTint: 'var(--mc-red-tint)', slate: 'var(--mc-slate)',
      divide: 'var(--mc-divide)', surfaceAlt: 'var(--mc-surface-alt)', track: 'var(--mc-track)',
    }
    const GLOBAL_CSS = `
:root {
  --mc-ink: #17212b; --mc-muted: #607080; --mc-line: #d8e1e8; --mc-canvas: #f4f7f9; --mc-surface: #fff;
  --mc-teal: #0f766e; --mc-teal-strong: #0b5f58;
  --mc-teal-line: #cce8e2; --mc-teal-line-strong: #8acbbd; --mc-teal-line-active: #67b9aa;
  --mc-teal-tint: #f1faf8; --mc-teal-tint-deep: #effaf7;
  --mc-blue: #2563eb; --mc-amber: #b45309; --mc-amber-line: #f1d4a5; --mc-amber-tint: #fff7ed;
  --mc-red: #b91c1c; --mc-red-tint: #fdecec; --mc-slate: #52606d;
  --mc-divide: #edf1f4; --mc-surface-alt: #fcfdff; --mc-track: #e8eef2;
}
@media (prefers-color-scheme: dark) {
  :root {
    --mc-ink: #e8eaed; --mc-muted: #9aa0a6; --mc-line: #3c4043; --mc-canvas: #181a20; --mc-surface: #242830;
    --mc-teal: #3dbdb4; --mc-teal-strong: #2a9d94;
    --mc-teal-line: #1a3d38; --mc-teal-line-strong: #2a6a60; --mc-teal-line-active: #3a9a8a;
    --mc-teal-tint: #1a2e2c; --mc-teal-tint-deep: #162a28;
    --mc-blue: #5c9dff; --mc-amber: #f0a040; --mc-amber-line: #5a3a10; --mc-amber-tint: #2a1f10;
    --mc-red: #ff6b6b; --mc-red-tint: #3a1a1a; --mc-slate: #8a9199;
    --mc-divide: #2d3139; --mc-surface-alt: #1e2127; --mc-track: #2d3139;
  }
  .mc-spinner { border-color: rgba(61,189,180,.22) }
  .mc-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
  button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline-color: rgba(61,189,180,.45) }
  .mc-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
}
@keyframes mc-pop { from { opacity: 0; transform: translateY(6px) scale(.985) } to { opacity: 1; transform: none } }
@keyframes mc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mc-spin { to { transform: rotate(360deg) } }
@keyframes mc-fan-in { from { opacity: 0; transform: translateY(4px) scale(.9) } to { opacity: 1; transform: none } }
.mc-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(15,118,110,.22); border-top-color: var(--mc-teal); border-radius: 50%; animation: mc-spin .7s linear infinite; vertical-align: -2px; margin-right: 7px }
.mc-fab { transition: transform .18s ease, box-shadow .18s ease }
.mc-fab:hover { transform: scale(1.06) }
.mc-fab:active { transform: scale(.96) }
.mc-btn { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease, opacity .15s ease }
.mc-btn:hover:not(:disabled) { transform: translateY(-1px) }
.mc-btn:active:not(:disabled) { transform: translateY(0) scale(.98) }
.mc-card { transition: transform .18s ease, box-shadow .18s ease }
.mc-card:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(17,38,60,.08) }
.mc-scroll::-webkit-scrollbar { width: 8px; height: 8px }
.mc-scroll::-webkit-scrollbar-thumb { background: #cdd8df; border-radius: 999px }
.mc-scroll::-webkit-scrollbar-track { background: transparent }
button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid rgba(15,118,110,.45); outline-offset: 2px }
`
    const GlobalStyle = () => h('style', { key: 'mc-global-css', dangerouslySetInnerHTML: { __html: GLOBAL_CSS } })
    const Spinner = ({ text }) => h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', lineHeight: 1.5 } }, [h('span', { key: 'spin', className: 'mc-spinner', 'aria-hidden': 'true' }), text])
    const ICON_PATHS = {
      sparkles: 'M12 3.2l1.7 4.1 4.1 1.7-4.1 1.7L12 14.8l-1.7-4.1-4.1-1.7 4.1-1.7L12 3.2zM18.8 13.5l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2z',
      wand: 'M14.5 5.5 18.5 9.5M4 20 13.5 10.5M13.5 10.5l1.5-1.5a2.12 2.12 0 0 1 3 3L16.5 13.5',
      close: 'M6 6l12 12M18 6 6 18',
      star: 'M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2z',
      check: 'M4.5 12.5l5 5L19.5 7',
    }
    const Icon = ({ name, size = 14, style, strokeWidth = 1.7 }) => h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style }, ICON_PATHS[name] ? h('path', { d: ICON_PATHS[name] }) : null)
    function Panel({ title, hint, children, style }) { return h('section', { style: { ...S.panel, ...style } }, [h('div', { key: 'h', style: S.head }, [h('h2', { key: 't', style: S.h2 }, title), h('span', { key: 'i', style: S.hint }, hint)]), children]) }
    const S = { page: { minHeight: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '24px', background: C.canvas, color: C.ink }, title: { margin: 0, fontSize: '20px', fontWeight: 720 }, lead: { margin: '6px 0 20px', color: C.muted, fontSize: '13px' }, cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(132px,1fr))', gap: '10px', marginBottom: '16px' }, card: { minHeight: '82px', padding: '14px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, label: { color: C.muted, fontSize: '12px', fontWeight: 600 }, value: { marginTop: '8px', fontSize: '23px', fontWeight: 720 }, layout: { display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(270px,.8fr)', gap: '16px', alignItems: 'start' }, side: { display: 'grid', gap: '16px' }, panel: { overflow: 'hidden', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, head: { display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.line}` }, h2: { margin: 0, fontSize: '14px', fontWeight: 700 }, hint: { color: C.muted, fontSize: '12px' }, row: { display: 'grid', gridTemplateColumns: '9px minmax(0,1fr) auto', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: `1px solid ${C.divide}` }, name: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 600 }, meta: { marginTop: '3px', color: C.muted, fontSize: '12px' }, small: { color: C.muted, fontSize: '12px', fontVariantNumeric: 'tabular-nums' }, empty: { padding: '28px 16px', color: C.muted, fontSize: '13px', lineHeight: 1.6 }, bars: { padding: '4px 16px 12px' }, bar: { padding: '10px 0' }, top: { display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px', fontSize: '12px' }, track: { height: '6px', overflow: 'hidden', borderRadius: '999px', background: C.track }, privacy: { marginTop: '16px', padding: '11px 13px', border: `1px solid ${C.tealLineStrong}`, borderRadius: '8px', background: C.tealTint, color: C.tealStrong, fontSize: '12px', lineHeight: 1.55 } }
    Object.assign(S, {
      page: { ...S.page, padding: '30px 34px 48px', background: C.canvas },
      title: { ...S.title, fontSize: '27px', letterSpacing: '-.035em', fontWeight: 760 },
      lead: { ...S.lead, margin: '8px 0 22px', fontSize: '14px', lineHeight: 1.55 },
      card: { ...S.card, minHeight: '96px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17,38,60,.04),0 8px 22px rgba(17,38,60,.035)' },
      panel: { ...S.panel, borderRadius: '12px', boxShadow: '0 1px 2px rgba(17,38,60,.04),0 10px 24px rgba(17,38,60,.025)' },
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
      input: { width: '100%', boxSizing: 'border-box', padding: '10px 11px', border: `1px solid ${C.line}`, borderRadius: '7px', fontSize: '13px' },
      actions: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' },
    }
    Object.assign(workbenchStyle, {
      tabs: { display: 'inline-flex', gap: '3px', margin: '0 0 22px', padding: '4px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: '0 4px 14px rgba(17,38,60,.035)' },
      tab: active => ({ padding: '8px 13px', border: 0, borderRadius: '8px', background: active ? C.tealTintDeep : 'transparent', color: active ? C.teal : C.muted, cursor: 'pointer', fontSize: '13px', fontWeight: active ? 750 : 600, transition: 'background .16s ease,color .16s ease' }),
      overviewMetrics: { ...workbenchStyle.overviewMetrics, gridTemplateColumns: 'repeat(4,minmax(160px,230px))', gap: '12px', margin: '18px 0' },
      overviewBody: { ...workbenchStyle.overviewBody, gap: '18px' },
      hero: { ...workbenchStyle.hero, padding: '24px', border: `1px solid ${C.tealLine}`, borderRadius: '16px', background: `linear-gradient(120deg,${C.surface} 0%,${C.tealTintDeep} 58%,${C.tealTint} 100%)`, boxShadow: '0 10px 28px rgba(15,118,110,.07)' },
      heroKicker: { ...workbenchStyle.heroKicker, textTransform: 'uppercase', letterSpacing: '.09em' },
      heroTitle: { ...workbenchStyle.heroTitle, fontSize: '30px', fontWeight: 780 },
      taskRow: { ...workbenchStyle.taskRow, padding: '15px 18px' },
      taskGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', padding: '14px' },
      taskCard: { minHeight: '154px', boxSizing: 'border-box', padding: '16px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: '0 3px 10px rgba(17,38,60,.025)' },
      compact: { ...workbenchStyle.compact, padding: '14px 18px' },
      action: { ...workbenchStyle.action, padding: '9px 16px', borderColor: C.tealLineStrong, background: C.tealTint, color: C.teal, flexShrink: 0, whiteSpace: 'nowrap' },
      input: { ...workbenchStyle.input, flex: 1, minWidth: 0, padding: '11px 12px', borderRadius: '8px', background: C.surface },
    })

export { h, C, GLOBAL_CSS, GlobalStyle, Spinner, ICON_PATHS, Icon, S, workbenchStyle, Panel }
