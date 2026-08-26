import React from 'react'

const h = React.createElement
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
      divide: 'var(--pk-divide)', surfaceAlt: 'var(--pk-surface-alt)', track: 'var(--pk-track)',
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
  --pk-divide: #edf1f4; --pk-surface-alt: #fcfdff; --pk-track: #e8eef2;
}
@media (prefers-color-scheme: dark) {
  :root {
    --pk-ink: #e8eaed; --pk-muted: #9aa0a6; --pk-line: #3c4043; --pk-canvas: #181a20; --pk-surface: #242830;
    --pk-paper: #1e2127; --pk-paper-warm: #1a1d22;
    --pk-on-ink: #f4f7f9;
    --pk-action-bg: #2a9d94;
    --pk-action-fg: #ffffff;
    --pk-shadow-card: 0 1px 2px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.30);
    --pk-shadow-panel: 0 1px 2px rgba(0,0,0,.30),0 10px 24px rgba(0,0,0,.22);
    --pk-shadow-fab: 0 4px 14px rgba(0,0,0,.50),0 0 0 1px rgba(0,0,0,.30);
    --pk-shadow-faint: 0 6px 16px rgba(0,0,0,.35);
    --pk-shadow-lg: 0 20px 50px rgba(0,0,0,.55);
    --pk-teal: #3dbdb4; --pk-teal-strong: #2a9d94;
    --pk-teal-line: #1a3d38; --pk-teal-line-strong: #2a6a60; --pk-teal-line-active: #3a9a8a;
    --pk-teal-tint: #1a2e2c; --pk-teal-tint-deep: #162a28;
    --pk-blue: #5c9dff; --pk-amber: #f0a040; --pk-amber-line: #5a3a10; --pk-amber-tint: #2a1f10;
    --pk-red: #ff6b6b; --pk-red-tint: #3a1a1a; --pk-slate: #8a9199;
    --pk-divide: #2d3139; --pk-surface-alt: #1e2127; --pk-track: #2d3139;
  }
  .pk-spinner { border-color: rgba(61,189,180,.22) }
  .pk-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
  button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline-color: rgba(61,189,180,.45) }
  .pk-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
  .pk-fab:hover { box-shadow: 0 6px 18px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.35) }
}
/* DSH 暗色主题：DSH 通过 body[data-ds-dark-theme] 属性 + root color-scheme 切换明暗，
  不改变系统 prefers-color-scheme，故此处显式跟随该属性，与上方系统暗色共用同一组暗色值。 */
body[data-ds-dark-theme] {
  --pk-ink: #e8eaed; --pk-muted: #9aa0a6; --pk-line: #3c4043; --pk-canvas: #181a20; --pk-surface: #242830;
  --pk-paper: #1e2127; --pk-paper-warm: #1a1d22;
  --pk-on-ink: #f4f7f9;
  --pk-action-bg: #2a9d94;
  --pk-action-fg: #ffffff;
  --pk-shadow-card: 0 1px 2px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.30);
  --pk-shadow-panel: 0 1px 2px rgba(0,0,0,.30),0 10px 24px rgba(0,0,0,.22);
  --pk-shadow-fab: 0 4px 14px rgba(0,0,0,.50),0 0 0 1px rgba(0,0,0,.30);
  --pk-shadow-faint: 0 6px 16px rgba(0,0,0,.35);
  --pk-shadow-lg: 0 20px 50px rgba(0,0,0,.55);
  --pk-teal: #3dbdb4; --pk-teal-strong: #2a9d94;
  --pk-teal-line: #1a3d38; --pk-teal-line-strong: #2a6a60; --pk-teal-line-active: #3a9a8a;
  --pk-teal-tint: #1a2e2c; --pk-teal-tint-deep: #162a28;
  --pk-blue: #5c9dff; --pk-amber: #f0a040; --pk-amber-line: #5a3a10; --pk-amber-tint: #2a1f10;
  --pk-red: #ff6b6b; --pk-red-tint: #3a1a1a; --pk-slate: #8a9199;
  --pk-divide: #2d3139; --pk-surface-alt: #1e2127; --pk-track: #2d3139;
}
body[data-ds-dark-theme] .pk-spinner { border-color: rgba(61,189,180,.22) }
body[data-ds-dark-theme] .pk-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
body[data-ds-dark-theme] button:focus-visible, body[data-ds-dark-theme] input:focus-visible, body[data-ds-dark-theme] textarea:focus-visible, body[data-ds-dark-theme] select:focus-visible { outline-color: rgba(61,189,180,.45) }
body[data-ds-dark-theme] .pk-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
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

export { h, C, GLOBAL_CSS, GlobalStyle, Spinner, ICON_PATHS, Icon, S, workbenchStyle, Panel }
