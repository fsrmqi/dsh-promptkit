/* eslint-disable */
/* dsh-promptkit 独立 DSH 浏览器视图 — 本文件由 scripts/build-client.mjs 生成，勿手改。 */
window.__ModuleLoader__.load({
  id: 'dsh-promptkit/ui',
  factory: require => {
    const React = require('react')

      /* ================= dsh-promptkit foundation（C / GlobalStyle / Icon / S / workbenchStyle，pk-* 视觉命名空间） ================= */
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

      /* ================= dsh-promptkit utils（纯函数 + 分类链 + DSH 快照转换） ================= */
      // 纯函数工具（从 Memory Center 抽取，通用、不含宿主私有逻辑）。
      // 组件只消费宿主无关的数据结构：messages = [{ id, role: 'user'|'assistant', text }]。
      // 把宿主自有会话结构（如 DSH snapshot nodes）转成 messages 是宿主 adapter 的职责，不在本包内。

          const safeText = value => typeof value === 'string' ? value.slice(0, 240) : ''

          const list = value => Array.isArray(value) ? value : []

          const obj = value => value && typeof value === 'object' ? value : {}

          const cleanSummary = value => safeText(value)
            .replace(/```[\s\S]*?```/g, '代码片段已省略')
            .replace(/#{1,6}\s*/g, '')
            .replace(/\*{1,3}/g, '')
            .replace(/`/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 190)

          const cleanContext = value => String(value ?? '')
            .slice(0, 6000)
            .replace(/```[\s\S]*?```/g, '代码片段已省略')
            .replace(/#{1,6}\s*/g, '')
            .replace(/\*{1,3}/g, '')
            .replace(/`/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 1200)

          // 通用文本清洗：宿主 adapter 把自有会话文本转成 messages 时可复用。
          const cleanConversationText = value => String(value || '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})/g, '[已省略敏感片段]')
            .replace(/\s+/g, ' ')
            .trim()

          // 与 dsh-at-file 的草稿解析一致：只识别未被其粘贴保护标记包裹的 @ 引用。
          function fileMentions(draft) {
            const seen = new Set()
            const mentions = []
            for (const match of String(draft || '').matchAll(/@([^\s@]+)/g)) {
              const raw = match[1]
              if (raw.includes('\u2060')) continue
              const path = raw.endsWith('/') ? raw.slice(0, -1) : raw
              if (!path || seen.has(path)) continue
              seen.add(path)
              mentions.push(path)
            }
            return mentions
          }

          // 从已选消息数组生成表单草稿（问题/事实/约束/方案/未决）。
          function selectedConversationDraft(messages) {
            const items = list(messages)
            const users = items.filter(item => item.role === 'user').map(item => item.text).filter(Boolean)
            const assistants = items.filter(item => item.role === 'assistant').map(item => item.text).filter(Boolean)
            const answer = assistants.join('\n').slice(0, 1500)
            const sentences = answer.split(/(?<=[。！？.!?])\s+/).filter(Boolean)
            const pick = matcher => sentences.filter(text => matcher.test(text)).slice(0, 5).join('\n').slice(0, 700)
            return {
              question: users.at(-1) || '',
              facts: pick(/已确认|事实|发现|修改完成|验证通过|测试通过|当前|存在/) || answer.slice(0, 700),
              constraints: pick(/必须|不能|约束|限制|兼容|风险|时间|成本/),
              options: pick(/方案|选项|路径|建议|A[、. ]|B[、. ]/),
              unresolved: pick(/待确认|需要确认|未知|未决|还需|下一步|TBD/),
              source_count: users.length + assistants.length,
            }
          }

          function methodChoice(methods, title) { return methods.find(item => item.title === title) }

          function detectLanguage(text) {
            const source = String(text || '')
            const letters = source.match(/[A-Za-z]/g)?.length ?? 0
            const cjk = source.match(/[\u4e00-\u9fff]/g)?.length ?? 0
            const total = letters + cjk
            if (total === 0) return 'zh'
            const ratio = letters / total
            if (ratio > 0.7) return 'en'
            if (ratio > 0.3) return 'mixed'
            return 'zh'
          }

          // 方法触发词表：轻量增强、方法推荐与冲突检测共用同一份信号，避免“推荐 ≠ 采用”。
          // MethodProvider 返回的方法 keywords（触发词）会覆盖同名条目。
          const METHOD_SIGNATURES = {
            '第一性原理': ['全链路', '链路', '整体分析', '本质', '根因', '拆解', '架构', '审查'],
            '苏格拉底式提问': ['报错', '异常', '失败', '为什么', '原因', '排查'],
            '用最小实验替代空想': ['实现', '开发', '修改', '重构', '新增', '优化'],
            '双向钢人论证': ['方案', '选型', '取舍', '哪个好', '是否', '比较', '对比', '决策', '选择', '风险'],
          }
          // 轻量增强模板的语义展示名：内置模板是单轮整形，与多轮方法名实不符，
          // 展示用语义名（链路审查/排障收敛/开发收敛/决策权衡），内部仍按方法名联动推荐。
          const TEMPLATE_LABELS = {
            '第一性原理': '链路审查',
            '苏格拉底式提问': '排障收敛',
            '用最小实验替代空想': '开发收敛',
            '双向钢人论证': '决策权衡',
          }
          // 计分制：强信号命中 1 个即判该方法，弱信号需 ≥2 个组合命中才判，
          // 避免 ‘是否’/‘选择’/‘风险’ 等常见词单独出现时误分类。
          // 集合覆盖：内置 4 卡的触发词（决策/审查类）+ 场景卡的核心意图词（技术方案、接口、
          // 论文、数据分析等）。命中词只对已声明该词的方法生效；此集合决定该词计几分。
          const STRONG_SIGNALS = new Set([
            '选型', '取舍', '哪个好', '对比', '决策', '全链路', '链路', '本质', '根因', '报错', '异常', '排查',
            '技术方案', '接口设计', '代码评审', '代码审查', 'code review', '接口文档', 'API 文档', '论文', '文献', '精读',
            '数据分析', '数据挖掘', '核查', '科普', '逆向拆解', '横向', '纵向', '会诊', '跨域迁移', '人生设计', '天赋',
          ])

          function buildSignatures(methods) {
            const signatures = { ...METHOD_SIGNATURES }
            for (const method of list(methods)) {
              const keywords = method?.triggerKeywords || method?.keywords
              if (method?.title && keywords?.length) signatures[method.title] = keywords
            }
            return signatures
          }

          function lightTemplate(method, source, suffix) {
            const label = TEMPLATE_LABELS[method] || method
            if (method === '第一性原理') return { label, reason: '需要拆开链路、依赖、假设与验证点，避免只罗列现象。', prompt: `请基于草稿中提供的信息，对“${source}”做一次系统性审查。\n\n请按链路环节逐一拆解：目标、输入输出、依赖、关键假设和验证点；再输出已确认部分、按高/中/低分级的问题与风险，以及每项的最小验证动作和下一步。\n\n仅基于草稿已有信息判断；信息不足时标记“待确认”，不要补造事实。${suffix}` }
            if (method === '苏格拉底式提问') return { label, reason: '排障信息通常不完整，应先收敛关键假设，再做最小验证。', prompt: `请排查这个问题：${source}\n\n先给出最可能的原因排序；对每个原因说明已有证据、最小验证步骤和修复建议。若关键信息不足，只询问最能缩小范围的一个问题；不要假设未提供的环境、配置或日志。${suffix}` }
            if (method === '用最小实验替代空想') return { label, reason: '开发任务优先收敛范围与验收，避免在未验证前扩大改动。', prompt: `请完成这个开发任务：${source}\n\n先明确最小改动范围、兼容边界和验收标准；优先用最小验证确认关键假设，再实施。完成后说明改动、验证结果、已知风险和下一步。不要进行超出任务范围的重构。${suffix}` }
            if (method === '双向钢人论证') return { label, reason: '存在方案取舍时，需要完整呈现支持与反对理由再做判断。', prompt: `请分析这项决策：${source}\n\n分别完整说明主要方案的支持理由、反对理由、适用条件和风险；再给出推荐方案、成立前提与最小验证动作。不要把不确定信息当作事实。${suffix}` }
            return { label, reason: '任务意图已较清楚，不强行套用方法，只做最小化表达整理。', prompt: `请直接处理这项任务：${source}\n\n先给出结论或可执行方案；再说明关键依据、资源/时间/数据可得性等现实限制与下一步。若信息不足，只提出最关键的澄清问题，不要编造事实。${suffix}` }
          }

          function classify(source, guidance, signatures, promptSource = source, singleTriggerTitles = new Set()) {
            const suffix = guidance ? `\n\n额外要求：${guidance}` : ''
            const hits = []
            for (const [title, triggers] of Object.entries(signatures)) {
              // 统一计分制（P1-2，2026-08）：内置方法与场景卡方法使用同一套强/弱信号规则，
              // 不再"内置计分、扩展一命中即判"双轨。强命中 ≥1 或弱命中 ≥2 判定为候选；
              // 同一方法的候选命中按强→弱排序交由上层按命中顺序取主方法。
              const strong = triggers.filter(token => STRONG_SIGNALS.has(token) && source.includes(token))
              const weak = triggers.filter(token => !STRONG_SIGNALS.has(token) && source.includes(token))
              if (strong.length >= 1 || weak.length >= 2 || (singleTriggerTitles.has(title) && weak.length >= 1)) hits.push({ title, signals: [...strong, ...weak] })
            }
            // 多个候选时：唯一强命中者优先；否则按命中信号总数降序，作为主方法候选顺序。
            hits.sort((a, b) => {
              const sa = STRONG_SIGNALS.has(a.signals[0] ?? '') ? 1 : 0
              const sb = STRONG_SIGNALS.has(b.signals[0] ?? '') ? 1 : 0
              if (sa !== sb) return sb - sa
              return b.signals.length - a.signals.length
            })
            const first = hits[0]
            if (!first) return { method: '', label: '', signals: [], conflicts: [], ...lightTemplate('', promptSource, suffix) }
            const conflicts = hits.slice(1).map(item => ({ title: item.title, label: TEMPLATE_LABELS[item.title] || item.title, signals: item.signals }))
            return { method: first.title, label: TEMPLATE_LABELS[first.title] || first.title, signals: hits.flatMap(item => item.signals), conflicts, ...lightTemplate(first.title, promptSource, suffix) }
          }

          function planPromptEnhancement(draft, extra = '', methods = [], context = '') {
            const source = String(draft || '').trim()
            const guidance = String(extra || '').trim()
            const signals = [source, String(context || '').trim()].filter(Boolean).join('\n')
            const privateTitles = new Set(list(methods).filter(method => method?.source === 'private').map(method => method.title))
            const lang = detectLanguage(source)
            if (source && source.length < 8) return { lang, method: '', label: '', signals: [], conflicts: [], tooShort: true, reason: '输入过短，直接使用原文，不做增强。', prompt: source }
            const classified = classify(signals, guidance, buildSignatures(methods), source, privateTitles)
            if (lang === 'en') return { lang, ...classified, reason: '检测到英文输入，采用英文整理模板；方法匹配仍按触发词执行。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
            if (lang === 'mixed') return { lang, ...classified, reason: '检测到中英混合输入，保留原语言比例；方法匹配仍按触发词执行。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. Keep the output language proportional to the input (mixed Chinese/English). If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
            return { lang, ...classified }
          }

          function recommendMethods(methods, requirement) {
            const text = String(requirement || '').trim()
            if (!text) return []
            const plan = planPromptEnhancement(text, '', methods)
            if (plan.tooShort) return []
            if (plan.method) {
              const candidates = [plan.method, ...plan.conflicts.map(item => item.title)].map(title => methodChoice(methods, title)).filter(Boolean)
              return candidates.slice(0, 2)
            }
            return [methodChoice(methods, '苏格拉底式提问'), methodChoice(methods, '第一性原理')].filter(Boolean)
          }

      function conversationDraft(snapshot) {
        const nodes = list(snapshot?.nodes)
        const users = nodes.filter(node => node?.kind === 'user')
        const assistants = nodes.filter(node => node?.kind === 'assistant')
        const userText = users.map(node => list(node.content).filter(block => block?.type === 'text').map(block => block.text).join(' ')).filter(Boolean)
        const assistantText = assistants.map(node => list(node.blocks).filter(block => block?.kind === 'text').map(block => block.text).join(' ')).filter(Boolean)
        const latestUser = cleanConversationText(userText.at(-1)).slice(0, 700)
        const latestAssistant = cleanConversationText(assistantText.at(-1))
        const sentences = latestAssistant.split(/(?<=[。！？.!?])\s+/).filter(Boolean)
        const pick = matcher => sentences.filter(text => matcher.test(text)).slice(0, 4).join('\n').slice(0, 700)
        return {
          question: latestUser,
          facts: pick(/已确认|事实|发现|修改完成|验证通过|测试通过|当前|存在/),
          constraints: pick(/必须|不能|约束|限制|兼容|风险|时间|成本/),
          options: pick(/方案|选项|路径|建议|A[、. ]|B[、. ]/),
          unresolved: pick(/待确认|需要确认|未知|未决|还需|下一步/),
          source_count: userText.length + assistantText.length,
        }
      }
      function conversationMessages(snapshot, limit = 12) {
        const nodes = list(snapshot?.nodes)
        const messages = []
        // The launcher only ever renders a small recent window. Scan backwards
        // and stop once it is full so a long-lived DSH session stays responsive.
        for (let index = nodes.length - 1; index >= 0 && messages.length < limit; index -= 1) {
          const node = nodes[index]
          const role = node?.kind === 'user' ? 'user' : node?.kind === 'assistant' ? 'assistant' : ''
          if (!role) continue
          const blocks = role === 'user' ? list(node.content) : list(node.blocks)
          const text = cleanConversationText(blocks.filter(block => block?.type === 'text' || block?.kind === 'text').map(block => block.text).join(' '))
          if (!text) continue
          messages.push({ id: `${role}:${node.turn ?? ''}:${node.step ?? ''}:${index}`, role, text: text.slice(0, 900), truncated: text.length > 900 })
        }
        return messages
      }

      /* ================= dsh-promptkit core: MethodProvider ================= */
      // MethodProvider：方法源抽象。
      // 解耦 PromptKit 与任何特定宿主（Memory Center / DSH / 通用前端）。
      // 开源核心只依赖此接口；具体实现（内置静态方法、MC 私有 catalog、DSH 适配器）由宿主注入。

      /**
       * @typedef {Object} Method
       * @property {string} id
       * @property {string} title
       * @property {string} [purpose]
       * @property {string} [category]
       * @property {'guided'|'structured'} [mode]
       * @property {string} [outcome]
       * @property {string} [tags]
       * @property {string} [template]
       */

      class MethodProvider {
        /** @returns {Promise<Method[]>} 全部方法 */
        async list() { throw new Error('MethodProvider.list() 未实现') }

        /** @param {string} query @returns {Promise<Method[]>} 按关键词搜索 */
        async search(query) {
          const all = await this.list()
          if (!query) return all
          const q = query.toLowerCase()
          return all.filter(m => `${m.title} ${m.purpose || ''} ${m.tags || ''}`.toLowerCase().includes(q))
        }

        /** @param {string} id @returns {Promise<Method|null>} 按 id 取单个 */
        async getById(id) { return (await this.list()).find(m => m.id === id) || null }

        /**
         * 组合生成最终 Prompt。
         * @param {{ methodId:string, question?:string, facts?:string, constraints?:string, options?:string }} input
         * @returns {Promise<{ prompt:string, estimated_chars:number, method:Method }>}
         */
        async compose(input) { throw new Error('MethodProvider.compose() 未实现') }

        /** @param {string} methodId @returns {Promise<{ prompt:string }>} 取模板（提示词库） */
        async getTemplate(methodId) { throw new Error('MethodProvider.getTemplate() 未实现') }

        /** @returns {Promise<string[]>} 收藏 id 列表（可选覆盖） */
        async getFavorites() { return [] }
        /** @param {string[]} ids */
        async setFavorites(ids) {}

        /** @returns {Promise<Array<{id:string,title:string,question?:string,at?:number}>>} 最近生成记录 */
        async getHistory() { return [] }
        /** @param {{id:string,title:string,question?:string}} item */
        async pushHistory(item) {}
        /** @param {(items:Array<{id:string,title:string,question?:string,at?:number}>)=>void} callback @returns {()=>void} */
        onHistoryChange(callback) { return () => {} }
      }

      /* ================= dsh-promptkit core: Composer / withPrefix ================= */
      // Composer：写入目标输入框的抽象。
      // 开源版可接任意 <textarea>，闭源版（DSH 插件）接消息框 inputActions。

      class Composer {
        /** @returns {string} 当前草稿 */
        getDraft() { return '' }

        /** @param {string} text 写入目标 */
        write(text) { throw new Error('Composer.write() 未实现') }

        /** @returns {{start:number,end:number,text:string,draft:string}|null} 当前选区（可选实现） */
        getSelection() { return null }

        /** 用 text 替换给定选区；不支持选区的宿主可不实现。 */
        replaceSelection(text, selection = this.getSelection()) { this.write(text) }

        /**
         * 订阅草稿变化（含用户手动输入与 write() 写入），组件据此同步本地状态。
         * @param {(text:string)=>void} cb
         * @returns {()=>void} 取消订阅函数（可选实现）
         */
        onChange(cb) { return () => {} }
      }

      /** 构造 “前缀 + 新内容”：若当前草稿非空，插入空行分隔。 */
      function withPrefix(current, next) {
        const cur = (current || '').trim()
        return cur ? `${cur}\n\n${next}` : next
      }

      /* ================= dsh-promptkit core: Enhancer ================= */
      // Enhancer：语义 / 轻量增强的模型调用抽象。
      // 开源版可接任意 LLM（如 OpenAI 兼容端点），闭源版接当前会话模型。

      class Enhancer {
        /** @returns {boolean} 是否正在增强 */
        get loading() { return false }

        /**
         * @param {{ draft:string, extra?:string, lang?:string, kind?:'light'|'semantic', method?:object }} input
         * @returns {Promise<{ prompt:string, model?:string }>}
         */
        async enhance(input) { throw new Error('Enhancer.enhance() 未实现') }

        /** 取消进行中的增强 */
        cancel() {}
      }

      /* ================= dsh-promptkit 内置方法库（12 个完整 Markdown 方法，构建时内联 JSON） ================= */
      // 完整方法库：从 prompts/ 目录解析的 12 个 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
      // 在 DSH 插件形态中，build-client.mjs 会把 builtin.json 内联为常量注入。

      // 使用 top-level await 加载 JSON（Node 22 + 现代浏览器支持 import assertions）。
      // 若环境不支持断言，fallback 到 fetch。
      const _builtin = [{"id":"双向钢人论证","title":"双向钢人论证","category":"决策","purpose":"有答案但不知道选哪个时，做决策用","tags":["提示词","决策","双向钢人论证"],"triggerKeywords":["方案","选型","取舍","哪个好","是否","比较","对比","决策","选择","风险"],"prompt":"我需要做的决定是：【写清问题、两个选项、目标和现实约束】。\n\n先别急着回答，也别默认我已经把问题想清楚。请先做一次双向钢人论证：\n\n1. 用最完整、有力的方式，重述我真正需要做出的选择；\n2. 分别给出支持两个方向的最强理由、适用条件、最大收益、最大风险，以及最难回答的反对意见；\n3. 找出双方真正的分歧、最可能改变结论的关键变量，以及还需要补充的信息；\n4. 只问我一个最可能改变结论的问题。\n\n等我回答以后，再给出明确判断、理由、适用条件和下一步行动。","mode":"guided","outcome":"先问一个最可能改变结论的问题，回答后给出明确判断与下一步行动"},{"id":"用最小实验替代空想","title":"用最小实验替代空想","category":"决策","purpose":"用最小实验替代空想，迈出第一步，看现实反馈","tags":["提示词","决策","最小实验"],"triggerKeywords":["实现","开发","修改","重构","新增","优化"],"prompt":"我正在纠结的是：【填写你的选择或想法】。\n\n请先找出这个决定背后最需要验证的3个假设，再选出最可能改变最终结论的那一个。\n\n围绕这个假设，帮我设计一个低成本、可逆、能在【7天或你能接受的周期】内完成的最小实验。\n\n请写清：\n1. 具体要做什么；\n2. 需要投入多少时间和资源；\n3. 观察什么指标；\n4. 什么结果支持继续；\n5. 什么结果提醒我停止；\n6. 实验结束后能获得什么新信息。\n\n最后告诉我，明天就能开始的第一个动作是什么。","mode":"structured","outcome":"一个最小可行实验方案与验证标准"},{"id":"事实核查","title":"事实核查","category":"学习","purpose":"核查观点、结论、数据、方案的真假与逻辑漏洞","tags":["提示词","学习","事实核查"],"triggerKeywords":["核查","核实","证据","真伪","来源","数据验证"],"prompt":"我要核查的说法是：【粘贴观点、结论、数据或方案】。\n\n请先把它拆成：\n1. 可以被外部验证的事实；\n2. 从事实推出的结论；\n3. 其中包含的价值判断。\n\n对于事实部分，请联网核查来源、样本、时间和完整上下文，并标记为：\n1. 已证实；\n2. 基本成立，但需要收窄；\n3. 存在争议；\n4. 证据不足；\n5. 明显错误。\n\n在假设相关事实成立的情况下，继续检查：\n1. 这些事实能否推出当前结论；\n2. 是否藏着未经验证的假设；\n3. 是否混淆相关性和因果关系；\n4. 是否遗漏了其他解释或关键信息；\n5. 结论在什么条件下成立或失效。\n\n最后请输出：\n1. 哪些事实可信，哪些需要修正；\n2. 推理链中最关键的漏洞；\n3. 补强后的最合理版本；\n4. 我目前可以相信到什么程度。","mode":"structured","outcome":"逐条核查结论：属实 / 存疑 / 不实，并给出依据"},{"id":"双层解释法","title":"双层解释法","category":"学习","purpose":"分小白/专业两层解释，避免停留在\"好像懂了\"阶段","tags":["提示词","学习","双层解释"],"triggerKeywords":["科普","讲给外行","通俗解释","小白版","入门实例"],"prompt":"我想学习的是：【填写概念或问题】。\n\n请分两层解释：\n\n第一层，小白版。\n用生活化的语言和一个具体例子，让完全没有基础的人也能听懂。\n\n第二层，专业版。\n使用准确术语，讲清核心机制、适用边界和常见误解。\n\n最后请整理出：\n1. 列出小白说法与专业术语的对应关系；\n2. 我最容易理解错的地方；\n3. 3个用于检查我是否真正理解的问题。","mode":"structured","outcome":"小白版 + 专业版双层解释"},{"id":"反向拆解","title":"反向拆解","category":"学习","purpose":"拆解优秀成品，学习它为什么有效","tags":["提示词","学习","反向拆解"],"triggerKeywords":["逆向拆解","拆解案例","对标分析","为什么要写","复用思路"],"prompt":"我想拆解的优秀范例是：【粘贴产品页面、网页、方案、流程说明、数据看板或其他成品】。\n我想学会的是：【填写你希望从中学会什么】。\n\n请先用一句话说明它解决了什么问题，再反向拆解它为什么有效。\n\n重点分析：\n1. 它服务谁，目标是什么；\n2. 它采用了什么结构或流程；\n3. 哪些关键选择拉开了质量差距；\n4. 它的完成标准是什么；\n5. 哪些规律可以迁移，哪些细节只适合这个案例。\n\n最后请给我：\n1. 提炼3到5条可复用规律；\n2. 一份可以照着执行的操作清单；\n3. 一个最值得先尝试的小练习。","mode":"structured","outcome":"成品为何有效的底层机制拆解清单"},{"id":"横纵分析法","title":"横纵分析法","category":"学习","purpose":"用横纵两条轴对陌生领域做深度研究，半小时建立框架","tags":["提示词","学习","横纵分析","深度研究"],"triggerKeywords":["横纵","纵向","横向","陌生领域","行业盘点","研究框架"],"prompt":"研究对象是：【填写产品、公司、人物、技术、行业或事件】。\n\n请使用横纵分析法，对它完成一份可追溯的深度研究。研究截止时间为执行当天。\n\n纵向分析：\n1. 它在什么背景和需求下诞生，关键推动者是谁；\n2. 它经历了哪些重要转折、成功和失败；\n3. 哪些早期选择变成了今天的能力、路径依赖或包袱。\n   \n横向分析：\n1. 选择最值得比较的对象，并说明为什么选它们；\n2. 用统一维度比较各自的强项、短板和独特性；\n3. 解释用户、客户或市场为什么选择它，又为什么放弃它。\n\n把两条轴合起来，继续判断：\n1. 过去形成的能力、路径依赖和约束会怎样影响未来；\n2. 未来最可能出现哪3条路径；\n3. 每条路径出现的前提和预警信号是什么。\n\n请遵守这些证据规则：\n1. 优先使用官方资料、原始数据、论文、财报和访谈等一手来源；\n2. 重要结论就近标注来源与日期；\n3. 事实、推断和观点分开写；\n4. 遇到冲突信息时并列呈现，找不到证据时明确写\"暂未核实\"。\n\n最后按以下顺序输出：核心结论、关键时间线、横向对比表、详细分析、未来判断、仍待确认的问题。报告需要在10000～30000字之间，语言尽量通俗，不要堆砌资料。","mode":"structured","outcome":"陌生领域的纵横框架与研究地图"},{"id":"论文深度拆解","title":"论文深度拆解","category":"学习","purpose":"深度学习一篇论文，按研究问题/方法/实验/局限/可复现性拆成可执行要点","tags":["提示词","学习","论文拆解"],"triggerKeywords":["论文","文献","paper","期刊","精读","拆解论文","复现","审稿"],"prompt":"请把这篇论文拆解成一份可复用的档案。信息如下：\n【粘贴论文标题、摘要、原文节选，或告诉我要拆解的论文】\n\n按这个顺序输出：\n\n1. 一句话贡献——这篇论文做了什么事，和已有方法比，真正的差异点是什么；\n2. 问题与研究线——它解决什么问题，为什么这是个真问题，跟主流方案的位置关系；\n3. 方法——把方法拆到\"能讲给别人听\"的粒度：模型/框架/关键公式/训练与推断流程；与标准方法的差异点；\n4. 实验与证据——数据集、基线、指标、消融实验；哪些证据强、哪些弱、是否有统计显著性说明；\n5. 局限与盲区——作者自承认的局限 + 你没看到验证的盲区 + 它没说清的假设；\n6. 可复现性评估——需要的依赖/超参/算力、原始数据可得性、复现最可能卡在哪；\n7. 我能怎么用——把论文对接成具体建议：可借用方法 / 可补的实验 / 可避免的坑，按重要度排序。\n\n规则：\n- 只基于我提供的论文内容与它的信息；你记忆中关于它的常识要用的时候标【常识】，不确定标【待确认】；\n- 事实、论文的声称、你自己的推断三者分开写；\n- 输出 400-800 字左右正文，最后给我\"下一步值得看的 3 篇或问题\"。","mode":"structured","outcome":"论文拆解档案（贡献/方法/证据强度/局限/可复现性）"},{"id":"代码评审","title":"代码评审","category":"技术开发","purpose":"对代码做一次系统化评审，按意图/正确性/安全/性能/可维护五层过一遍","tags":["提示词","技术开发","代码评审"],"triggerKeywords":["代码评审","代码审查","code review","评审代码","走查","PR 评审","review"],"prompt":"请对下面的代码做一次系统评审：【粘贴代码；有上下文或依赖说明时也放进来】。\n\n按下面的顺序逐层检查，不要跳层：\n\n第一层：意图——这段代码要解决什么问题，输入输出是什么，是否达到了它的目的；\n第二层：正确性——逻辑漏洞、边界情况（空值、越界、超时、并发）、异常处理、off-by-one；\n第三层：安全——注入（SQL / XSS / 命令）、未验证的输入、敏感信息泄露、越权访问；\n第四层：性能与并发——复杂度、死锁、连接 / 内存泄漏、缓存一致性、不必要的 IO；\n第五层：可维护性——命名、重复代码、职责拆分、测试覆盖、注释与实际行为是否一致。\n\n输出：\n1. 按【阻断 / 高 / 中 / 低】分四档列出问题，每条给出：位置（行号或函数名）、为什么严重、具体的修改建议（含代码）；\n2. 已做对的、值得保留的部分简单列一下；\n3. 最后给出\"必须现在改\"和\"可以后面跟进\"的两个清单。\n\n规则：\n- 只基于给定的代码与上下文给出，资源/依赖未说明时标【待确认：…】，不要脑补架构；\n- 对每条建议给出修改后代码，别只说\"建议优化\"；\n- 结论放最前面。","mode":"structured","outcome":"按严重程度分档的代码评审报告"},{"id":"技术方案设计","title":"技术方案设计","category":"技术开发","purpose":"从需求到可落地的技术方案，明确边界、模块、接口、风险与验收","tags":["提示词","技术开发","技术方案"],"triggerKeywords":["技术方案","技术评审","接口设计","模块拆分","系统设计","落库设计","方案评审"],"prompt":"我要做一个技术方案，需求是这个：【写清目标、现状、约束条件】。\n\n请按下面顺序产出一份可以直接评审的技术方案：\n\n1. 目标与边界——我到底要解决什么；明确\"本期不做\"的事；\n2. 现状与约束——现有系统/技术栈/依赖、上线窗口、可用资源；\n3. 模块与职责——拆成哪几个模块，各自职责、相互依赖方向；\n4. 关键设计——数据模型 / 接口 / 状态机 / 并发与一致性，每个决策给理由；\n5. 风险与备选——每个关键决策列出备选方案、放弃它们的原因、剩余风险；\n6. 实施步骤——按依赖排序的增量步骤，每一步可验证的结果是什么。\n\n规则：\n- 已有确定性信息与\"需要验证的假设\"分开标注；不确定的写【待确认：…】，不要自行假设；\n- 关键决策必须给\"为什么选它、不选什么、什么时候它失效\"；\n- 最后单独给\"最值得先验证的 3 个点\"，不要塞进正文。","mode":"structured","outcome":"可评审的技术方案（目标/边界/模块/关键设计/风险/步骤）"},{"id":"接口文档生成","title":"接口文档生成","category":"技术开发","purpose":"从代码定义或口头需求生成可直接对接的接口文档（请求/响应/示例/边界）","tags":["提示词","技术开发","接口文档"],"triggerKeywords":["接口文档","API 文档","接口规范","API 接口","文档生成","接口对接"],"prompt":"根据下面的接口信息，生成一份可直接交接的接口文档：【粘贴接口签名、路由、Schema、已有注释，或直接描述接口需求】。\n\n文档包含：\n\n1. 请求总览——方法、路径、鉴权方式、Content-Type；\n2. 请求参数表——字段名 / 类型 / 必填 / 说明 / 默认值 / 枚举值，按 path / header / query / body 分组；\n3. 响应结构——成功响应体字段表 + 示例；错误码表（对应什么场景、调用方如何处理）；\n4. 完整示例——一个真实可用的请求示例 + 对应的成功响应 + 一个失败响应；\n5. 边界与约定——超时、幂等性、限流、分页、敏感字段的脱敏、空值行为。\n\n规则：\n- 只基于你拿到的接口信息书写，缺失字段标【待确认：…】，不要编造或脑补字段；\n- 字段表用 Markdown 表格，示例用代码块；\n- 字段说明要写\"为什么存在\"或\"什么场景使用\"，别只复制类型叫法。","mode":"structured","outcome":"含请求/响应/示例/边界的标准接口文档"},{"id":"数据分析","title":"数据分析","category":"数据分析","purpose":"对数据做体检/探索/结论/行动四段式分析，每个结论标注证据强度","tags":["提示词","数据分析","数据洞察","SQL"],"triggerKeywords":["数据分析","数据洞察","报表解读","相关性","数据可视化","数据清洗","EDA"],"prompt":"请对下面的数据/需求做一次完整的数据分析：\n【粘贴数据样例、字段说明、或直接描述你想分析的问题】\n\n按四个阶段输出：\n\n1. 数据体检——列出主要字段、类型、粒度、缺失情况、重复、明显异常；一句话总结这份数据\"能不能用、最要紧的坑在哪\"；\n2. 探索性分析——针对我的目标提出 3-5 个可检验的问题假设；用你能做的方式检查（分组、时间序列、相关性、分布、Top/Bottom）；每个发现写清楚\"你看到了什么\"；\n3. 验证与结论——逐条回答原始问题；每条结论标注证据强度：【数据支持 / 部分支持 / 证据不足 / 与直觉相反】；需要统计检验的地方说明该用什么检验；\n4. 行动建议——给 3 条可执行建议，标清楚每条依赖的数据和前提；缺什么补充数据、什么条件下结论会翻转。\n\n规则：\n- 关键数字注明出处；如果是我没提供的数据，你要么用【估算】标注、要么写\"需要你提供\"；\n- 无法判断的写\"无法判断\"，不要用相似数字补位；\n- 区分\"数据表现的\"与\"我的解释\"；\n- 最后单独给\"这份分析最不能确定的部分\"。","mode":"structured","outcome":"四段式分析报告（体检/探索/结论/行动）"},{"id":"专家会诊","title":"专家会诊","category":"解决问题","purpose":"让 AI 组一个真正互补的小型专家团，再让他们互相挑战","tags":["提示词","解决问题","专家会诊"],"triggerKeywords":["会诊","多方视角","专家团","互相质疑","不同视角"],"prompt":"我的问题是：【填写问题、已知事实、目标和现实约束】。\n\n先不要直接给方案。请为这个问题选择3种真正互补的专业视角，并说明每种视角为什么必要。\n\n让每种视角分别回答：\n1. 它怎样重新定义这个问题；\n2. 它最推荐的解决路径；\n3. 其他视角最容易忽略的风险；\n4. 什么新证据会让它改变判断。\n   \n然后让三种视角互相质疑，找出：\n1. 共同认可的事实；\n2. 真正的分歧；\n3. 分歧背后的不同假设。\n\n最后请综合输出：\n1. 综合后最推荐的方案；\n2. 适用条件；\n3. 最大风险；\n4. 退出条件；\n5. 第一步行动。\n\n不要选择三个高度相似的身份，也不要模仿或编造真实人物的观点。信息不足时，先只问我一个最关键的问题。","mode":"structured","outcome":"互补专家团的会诊意见与交锋结论"},{"id":"第一性原理","title":"第一性原理","category":"解决问题","purpose":"处理路径依赖，回归问题本质，推倒重来","tags":["提示词","解决问题","第一性原理"],"triggerKeywords":["全链路","链路","整体分析","本质","根因","拆解","架构","审查"],"prompt":"我想解决的问题是：【填写你的问题】。\n\n请用第一性原理把它拆回最底层，区分：\n1. 已经确认、无法绕开的基本事实；\n2. 习惯性接受、却没有验证过的假设；\n3. 真正想实现的目标；\n4. 现实中的资源与约束。\n   \n暂时放下行业惯例和现成方案，只从基本事实、目标和约束出发，重新推导可行路径。\n   \n最后请输出：\n1. 原方案中只在修补表面的部分；\n2. 从基本事实重新推导出的新路径；\n3. 这条路径成立的前提；\n4. 验证它的第一步。","mode":"structured","outcome":"回归问题本质的重新推导与重构方案"},{"id":"跨领域借解","title":"跨领域借解","category":"解决问题","purpose":"从其他领域借解法，拓宽视角","tags":["提示词","解决问题","跨领域"],"triggerKeywords":["跨域迁移","跨界联想","借解","类比迁移","换个思路"],"prompt":"我的困惑是：【说明背景、当前做法、现实约束和具体卡点】。\n\n请先剥掉行业术语，把它抽象成一个人类在其他领域也可能遇到的问题，并找出：\n1. 问题的底层结构；\n2. 真正的核心矛盾；\n3. 普通解法失效的原因。\n   \n然后从历史案例，以及至少3个彼此距离较远的领域中\n\n每个案例都要说明：\n1. 那个领域遇到了什么问题；\n2. 使用了什么解决机制；\n3. 与我的问题相似在哪里；\n4. 哪些部分可以迁移；\n5. 什么条件下会失效。\n\n最后请选出最值得借用的3种机制，把它们翻译成适合我当前处境的解决方案，再推荐一个最值得先试的低成本、可逆实验。","mode":"structured","outcome":"可迁移到当前问题的他领域解法清单"},{"id":"人生设计术","title":"人生设计术","category":"认识你自己","purpose":"基于斯坦福人生设计方法，规划未来，生成《个人人生设计蓝图》","tags":["提示词","认识自己","人生设计"],"triggerKeywords":["人生设计","职业生涯方向","五年","人生规划","奥德赛"],"prompt":"# Role：人生设计师\n\n## 角色\n你是一位熟悉斯坦福人生设计方法、心流理论和积极心理学的资深人生设计师。你的任务是陪用户把当下的人生当成一个可以反复设计、低成本试错的项目，先看清位置，再找到方向，最后把可能的路真正试出来。\n\n## 目标\n通过多轮深度对话，帮助用户看清自己现在真实的位置，分清无法解决的重力问题与可以动手设计的真问题，最终生成三个完全不同、同样值得认真考虑的五年人生版本，以及马上可以开始的原型行动。最终产出一份极度详细、有温度也够犀利的《个人人生设计蓝图》。\n\n## 核心理念\n1. 人生是设计问题，没有唯一正解。它需要大量尝试、做原型、边走边看；\n2. 重新定义问题。很多人一直在解决一个问错了的问题，找到真问题比急着给答案更重要；\n3. 区分重力问题。年龄、自然规律、整个行业的现实等无法直接改变的事，需要先接受，再把注意力转向可设计的部分；\n4. 数量本身含有质量。好的选择来自足够多的选择；\n5. 激情经常是行动与反馈带来的结果。用户无需先找到命中注定的热爱，才有资格开始；\n6. 人生是一场无限游戏。任何原型都会留下信息，所以人可以对失败免疫。\n   \n## 对话规则\n1. 每轮只问一个问题，采用\"你问 → 用户答 → 你简短而走心地反馈 → 再问下一题\"的节奏；\n2. 使用苏格拉底式追问，多问具体事件、当时的感觉与行动，避免过早下结论；\n3. 保持温暖和接纳，同时敏锐指出用户的逻辑漏洞、自我设限，以及语言与实际行为之间的落差；\n4. 主动区分重力问题和可设计的真问题。承认现实不等于认输，看清边界本身就是设计的一部分；\n5. 不评判用户的选择，也不替用户做决定；\n6. 主问题总数控制在12个以内，可以根据回答灵活调整顺序和追问深度；每个阶段内保持\"1轮1问\"，信息足够就及时进入下一阶段，不要为了凑数硬问。\n   \n## 提问流程\n\n### 第一阶段：你在这里\n1. 请用户给健康、工作、娱乐、爱四个方面分别打0到10分，并说明哪一项亮了红灯。健康包含身体、情绪和心理，娱乐指纯粹为了快乐而做的事，爱强调双向关系；\n2. 问他现在最焦虑、最想解决的人生问题是什么。判断它属于可设计的真问题，还是无法改变的重力问题。如果属于后者，温和地点破，并引导他重新定义成可以行动的问题；\n3. 如果用户状态稳定，可以先征求同意，再邀请他做一次反向推演。让他想象未来五年什么都不改变时，一个普通的周二会怎样度过，再把这幅画面拉到十年后。帮助他看清维持现状的代价。察觉用户处于低谷或情绪脆弱时，跳过这一步。\n   \n### 第二阶段：你的指南针\n1. 询问他的工作观：为什么工作，工作与金钱、他人和世界是什么关系；\n2. 询问他的人生观：什么会让他觉得这一生没有白活，他想怎样与家人和更大的世界连接；\n3. 比较工作观与人生观是否一致，指出冲突、妥协和真正的正北方向。\n   \n### 第三阶段：寻路\n1. 请他回忆最近或过去的心流时刻，追问当时具体在做什么、和谁、处在什么环境；\n2. 区分让他回血的事情、抽干他的事情，以及\"擅长但不热爱\"的事情。\n   \n### 第四阶段：摆脱困境与创造可能\n1. 询问他是否有一个早已失效、却始终不愿放手的执念或方案。找到这个锚问题背后真正想守住的东西；\n2. 陪他生成三个完全不同的五年人生版本：\n   第一个是他已经在走，或者盘算很久的路；\n   第二个是假如第一条路明天彻底消失，他会选择的路；\n   第三个是假如不用考虑钱和他人的评价，他真正想过的生活。\n3. 三个版本都必须是用户真心愿意考虑的A计划，谁也不能成为凑数的备胎。\n   \n## 输出\n当素材足够丰富后，输出一份8000到12000字的《个人人生设计蓝图》，使用以下固定 Markdown 标题层级（小节缺失时跳过，不强行补齐）：\n## 你在这里 / ## 你的指南针 / ## 能量地图 / ## 三个五年版本 / ## 原型行动清单 / ## 失败免疫\n内容自然覆盖：\n1. \"你在这里\"：解读四个仪表盘，指出真正失衡和长期被忽略的部分；\n2. \"真问题\"：重新定义用户最初的困扰，分清重力问题与可设计问题；\n3. \"你的指南针\"：提炼工作观、人生观与两者之间的一致性；\n4. \"你的能量地图\"：总结心流、回血区、高消耗区和未来设计需要偏向的环境；\n5. \"三个奥德赛计划\"：每套配一个简短有力的标题、一条五年时间线、两到三个待验证问题，以及资源、喜欢程度、自信心、一致性四项评估；\n6. 如果用户已经明显倾向其中一个版本，继续把它拆成本季度要验证的核心问题、一个月内能做出的原型、每天可以推进的小动作，以及绝不愿牺牲的底线；\n7. \"原型行动清单\"：设计一次人生对谈、一天到一周的原型体验，以及本周可以迈出的第一小步；\n8. \"失败免疫\"：提醒用户，这三个版本都可以先试再调。原型即使走不通，也会为下一步留下有用信息。\n   \n## 开始\n请用温暖、专业、有共情力的语言开场。先解释这套方法的基本思路、预计需要的时间和希望帮用户达成的目标。告诉用户，他无需先想清楚自己热爱什么，我们会在行动、对话与反馈里慢慢把它找出来。然后进入第一个问题。","mode":"structured","outcome":"《个人人生设计蓝图》"},{"id":"挖掘隐藏天赋","title":"挖掘隐藏天赋","category":"认识你自己","purpose":"通过多轮深度对话，挖掘被忽视或压抑的天赋，生成《个人天赋使用说明书》","tags":["提示词","认识自己","天赋"],"triggerKeywords":["天赋","擅长","优势","自我剖析","性格特质"],"prompt":"# Role：深度天赋挖掘机\n\n## 角色\n你是一位熟悉盖洛普优势识别体系、心流理论与荣格心理学的资深生涯咨询师。你相信天赋是一种可以迁移的底层能力，它经常藏在一个人的怪癖、缺点、嫉妒、无意识胜任区和能量模式里。\n\n## 目标\n通过多轮深度对话，帮助用户找到被忽视或压抑的天赋，最终生成一份极度详细、专业且有共情力的《个人天赋使用说明书》。\n\n## 核心理念\n1. 反宿命论。天赋不等于某个固定技能，也不会因为年龄增长而过期；\n2. 能量审计。真正的天赋往往会让人回血。一个人单纯擅长、做完却极度消耗的事情，需要单独区分；\n3. 阴影即宝藏。那些从小反复被批评的缺点、难以改变的怪癖，以及对他人的嫉妒，可能是天赋被压抑后的背面。\n   \n## 对话规则\n1. 每次只问一个问题。必须采用\"你问 → 用户答 → 你简短反馈 → 再问下一题\"的节奏；\n2. 使用苏格拉底式追问。多问\"当时几岁\"\"具体发生了什么\"\"你是什么感觉\"\"为什么会这样做\"，避免根据一句话仓促贴标签；\n3. 保持温暖、共情和敏锐。发现矛盾、伪装或潜意识线索时，可以直接指出，但不要用空泛赞美安慰用户；\n4. 所有判断都要对应用户讲过的具体经历。证据不足时明确使用\"可能\"，并继续追问；\n5. 全程最多10个主问题，可以根据回答改变顺序或增加追问，但必须覆盖下面四条主线。\n   \n## 必须覆盖的主线\n1. 16岁以前，有哪些事情是没人要求也会废寝忘食去做的？有哪些从小反复被批评、一直改不掉的\"顽固缺点\"？\n2. 成年后的工作或生活中，哪些事情会让用户觉得\"这还需要学吗\"，周围人却普遍觉得困难？寻找他的无意识胜任区；\n3. 哪些事情做完以后，身体虽然累，精神却极度亢奋？哪些事情他做得很好，却会明显抽干能量？\n4. 用户曾经强烈嫉妒过谁，或者羡慕过哪种生活状态？继续追问他真正渴望的是对方身上的什么。\n   \n## 输出\n当信息足够丰富后，输出一份一万字左右的《个人天赋使用说明书》，建议使用以下 Markdown 标题层级（小节名可微调）：\n## 底层天赋 / ## 天赋的阴影面 / ## 能量地图 / ## 适合的环境 / ## 落地路径 / ## 30天实验清单\n结构可以根据用户的回答自由组织，但必须覆盖：\n1. 最有证据支撑的底层天赋，以及每一项天赋对应的经历链；\n2. 天赋的阴影面，它过去为什么会被误解成缺点；\n3. 用户的能量地图、无意识优势区和高消耗区；\n4. 这些天赋最容易发挥、最容易失效的环境；\n5. 适合他的工作方式、合作方式、职业方向和现实限制；\n6. 接下来30天可以尝试的低成本实验，用现实反馈继续验证这些判断。\n   \n## 开始\n请用温暖、专业、通俗的语言向用户说明接下来的流程、大概需要的时间和希望达成的目标。告诉他：\"天赋永远不会过期，我们只是要找到你的底层天赋。\"然后进入第一个问题。","mode":"guided","outcome":"《个人天赋使用说明书》"},{"id":"苏格拉底式提问","title":"苏格拉底式提问","category":"问清问题","purpose":"通过苏格拉底式追问，帮你找到真正值得回答的问题","tags":["提示词","问清问题","苏格拉底式提问"],"triggerKeywords":["报错","异常","失败","为什么","原因","排查"],"prompt":"我的困惑是：【尽量具体地描述发生了什么、你怎么理解，以及你卡在哪里】。\n先不要给建议。请对我进行一次苏格拉底式问诊，通过最多6个问题，帮我找到真正值得回答的问题。\n\n请遵守这些规则：\n1. 每次只问一个问题，根据我的回答决定下一问，不要提前给我一整套问卷；\n2. 优先区分我说的是可验证的事实、对事实的解释、价值判断，还是我希望实现的目标；\n3. 检查关键词是否含糊、我默认了哪些前提、证据来自哪里、有没有相反解释，以及结论成立或不成立分别意味着什么；\n4. 每次提问前，用一句话说明上一条回答让你更新了什么判断；\n5. 只问可能改变结论的问题。信息足够时立刻停止，不必凑满6个。\n\n问诊结束后，请整理出：\n1. 我最开始问的问题；\n2. 我真正想解决的问题；\n3. 已经确认的事实；\n4. 仍未验证的假设；\n5. 最可能改变结论的关键变量；\n6. 一个准确、具体、可以继续行动的新问题。\n\n等我确认这个新问题以后，再给出你的判断、理由和下一步行动。","mode":"guided","outcome":"通过多轮追问澄清出真正值得回答的问题"}];
      async function loadBuiltinMethods() { return _builtin }
      const BUILTIN_METHODS = _builtin

      /* ================= dsh-promptkit adapter: StaticMethodProvider ================= */
      // 开源默认 MethodProvider：从 builtin.json 加载完整方法（含 frontmatter 元数据 + prompt 模板）。
      // 不依赖任何后端；闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。
      // storagePrefix 用于宿主隔离收藏/历史数据（如 MC 用 'memory-center.' 沿用旧版 key）。

      let _cachedMethods
      async function getMethods() {
        if (_cachedMethods) return _cachedMethods
        _cachedMethods = await loadBuiltinMethods()
        return _cachedMethods
      }

      class StaticMethodProvider extends MethodProvider {
        constructor({ storagePrefix = 'promptkit.' } = {}) {
          super()
          this.favoritesKey = `${storagePrefix}prompt-library.favorites.v1`
          this.historyKey = `${storagePrefix}prompt-library.history.v1`
          this.privateMethodsKey = `${storagePrefix}prompt-library.private-methods.v1`
          this.historyEvent = `${storagePrefix}prompt-library.history.changed.v1`
          this.historyListeners = new Set()
        }

        async list() { return [...await getMethods(), ...this._privateMethods()] }

        async search(query) {
          const methods = await this.list()
          if (!query) return methods
          const q = query.toLowerCase()
          return methods.filter(m =>
            (m.id || '').toLowerCase().includes(q) ||
            (m.title || '').toLowerCase().includes(q) ||
            (m.purpose || '').toLowerCase().includes(q) ||
            (m.category || '').toLowerCase().includes(q) ||
            (Array.isArray(m.tags) ? m.tags.join(' ') : String(m.tags || '')).toLowerCase().includes(q) ||
            (Array.isArray(m.triggerKeywords) ? m.triggerKeywords.join(' ') : String(m.triggerKeywords || '')).toLowerCase().includes(q)
          )
        }

        // 与 MC 原 prompt_studio.composePrompt() 一致：模板原样保留（【…】占位符即方法对模型的
        // 填写指令），用户输入以「本次任务输入」结构块追加在模板之后，不做正则替换。
        // 追加的引导语对模型显式声明【…】是填写指示符（非字面文本），并把实际内容定位到结构块。
        async compose({ methodId, question, facts, constraints, options }) {
          const methods = await this.list()
          const method = methods.find(m => m.id === methodId) || methods[0]
          const base = method.prompt || ''
          const clean = value => String(value ?? '').trim()
          const sections = [
            '---',
            '# 本次任务输入',
            clean(question) ? `问题：${clean(question)}` : '',
            clean(facts) ? `已知事实：${clean(facts)}` : '',
            clean(constraints) ? `现实约束：${clean(constraints)}` : '',
            clean(options) ? `选项或备选路径：${clean(options)}` : '',
          ].filter(Boolean)
          const hasInput = sections.length > 1
          const full = hasInput
            ? `${base}\n\n${sections.join('\n')}\n\n模板中出现的【…】是填写指示符，不是字面占位；请以「# 本次任务输入」中的实际内容为准；缺失的信息按该方法要求提问，不要编造事实。`
            : base
          return { prompt: full, estimated_chars: full.length, method }
        }

        async getTemplate(methodId) {
          const methods = await this.list()
          const m = methods.find(x => x.id === methodId)
          if (!m) return { prompt: '' }
          return { prompt: m.prompt || '' }
        }

        async getFavorites() { return this._readStore(this.favoritesKey, []) }
        async setFavorites(ids) { this._writeStore(this.favoritesKey, Array.isArray(ids) ? ids : []) }

        async getHistory() { return this._readStore(this.historyKey, []) }
        async pushHistory(item) {
          const next = [item, ...this._readStore(this.historyKey, [])].slice(0, 20)
          this._writeStore(this.historyKey, next)
          this._notifyHistory(next)
          return next
        }

        onHistoryChange(callback) {
          this.historyListeners.add(callback)
          const refresh = () => { try { callback(this._readStore(this.historyKey, [])) } catch {} }
          const onCustom = event => { if (event?.detail?.key === this.historyKey) refresh() }
          const onStorage = event => { if (event?.key === this.historyKey) refresh() }
          window.addEventListener?.(this.historyEvent, onCustom)
          window.addEventListener?.('storage', onStorage)
          return () => {
            this.historyListeners.delete(callback)
            window.removeEventListener?.(this.historyEvent, onCustom)
            window.removeEventListener?.('storage', onStorage)
          }
        }

        _notifyHistory(items) {
          this.historyListeners.forEach(callback => { try { callback(items) } catch {} })
          try { window.dispatchEvent?.(new CustomEvent(this.historyEvent, { detail: { key: this.historyKey } })) } catch {}
        }

        /** 导入一张 Obsidian/Markdown 提示词卡片；仅保存到当前浏览器 localStorage。 */
        async importPrivateMarkdown(raw) {
          const method = this._privateMethodFromMarkdown(raw)
          this._writeStore(this.privateMethodsKey, [method, ...this._privateMethods()])
          return method
        }

        async updatePrivateMarkdown(id, raw) {
          const current = this._privateMethods()
          if (!current.some(method => method.id === id)) throw new Error('未找到要编辑的私有方法。')
          const updated = { ...this._privateMethodFromMarkdown(raw), id }
          this._writeStore(this.privateMethodsKey, current.map(method => method.id === id ? updated : method))
          return updated
        }

        async removePrivateMethod(id) {
          this._writeStore(this.privateMethodsKey, this._privateMethods().filter(method => method.id !== id))
        }

        async exportPrivateMethods() {
          return JSON.stringify({ version: 1, methods: this._privateMethods() }, null, 2)
        }

        async importPrivateBackup(raw) {
          let parsed
          try { parsed = JSON.parse(String(raw || '')) } catch { throw new Error('备份文件不是有效 JSON。') }
          const methods = Array.isArray(parsed?.methods) ? parsed.methods : []
          const valid = methods.filter(method => method && typeof method.title === 'string' && typeof method.prompt === 'string')
            .map(method => ({ ...method, id: `private:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, source: 'private' }))
          if (!valid.length) throw new Error('备份中没有可导入的私有方法。')
          this._writeStore(this.privateMethodsKey, [...valid, ...this._privateMethods()])
          return valid
        }

        _privateMethods() {
          return this._readStore(this.privateMethodsKey, []).filter(method => method && typeof method.id === 'string' && method.id.startsWith('private:') && typeof method.prompt === 'string')
        }
        _privateMethodFromMarkdown(raw) {
          const source = String(raw || '').trim()
          if (!source) throw new Error('请粘贴一张 Markdown 提示词卡片。')
          const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)
          const meta = Object.fromEntries((frontmatter?.[1] || '').split('\n').map(line => {
            const match = line.match(/^([^:]+):\s*(.*)$/)
            return match ? [match[1].trim(), match[2].trim()] : []
          }).filter(pair => pair.length))
          const body = source.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
          const title = meta.title || meta['标题'] || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || `我的方法 ${this._privateMethods().length + 1}`
          const prompt = body.match(/## Prompt\s*\n+```(?:\w+)?\n([\s\S]*?)```/)?.[1]?.trim() || body.replace(/^#\s+[^\n]+\n?/, '').trim()
          if (!prompt) throw new Error('卡片中没有可用的提示词正文。')
          return { id: `private:${Date.now().toString(36)}`, title, category: meta.category || meta['场景'] || '我的方法', purpose: meta.purpose || meta['用途'] || '从我的 Obsidian Prompt 卡片导入', tags: this._parseTags(meta.tags || meta['标签']), triggerKeywords: this._parseTags(meta.keywords || meta['触发词']), prompt, mode: 'structured', outcome: meta.outcome || '按我的私有方法组织输出', source: 'private' }
        }
        _parseTags(value) {
          return String(value || '').replace(/^\[|\]$/g, '').split(/[,，]/).map(item => item.trim()).filter(Boolean)
        }

        _readStore(key, fallback) {
          try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
        }
        _writeStore(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }
      }

      /* ================= dsh-promptkit adapter: TextareaComposer ================= */
      // 示例 Composer：写入任意 <textarea> 元素，并对用户输入保持响应（input 事件订阅）。
      // 闭源版（DSH 插件）可继承 Composer 并桥接到 inputActions.setDraft。
      class TextareaComposer extends Composer {
        /** @param {HTMLTextAreaElement} el */
        constructor(el) {
          super()
          this.el = el
          this._subs = new Set()
          if (el) el.addEventListener('input', () => this._notify())
        }

        getDraft() { return this.el ? this.el.value : '' }

        write(text) {
          if (!this.el) return
          this.el.value = text
          // 派发 input 事件：既让宿主框架感知变化，也触发 _notify 同步订阅者。
          this.el.dispatchEvent(new Event('input', { bubbles: true }))
        }

        getSelection() {
          if (!this.el || !Number.isInteger(this.el.selectionStart) || !Number.isInteger(this.el.selectionEnd)) return null
          const start = this.el.selectionStart
          const end = this.el.selectionEnd
          if (start === end) return null
          return { start, end, text: this.el.value.slice(start, end), draft: this.el.value }
        }

        replaceSelection(text, selection = this.getSelection()) {
          if (!this.el || !selection) { this.write(text); return }
          const next = `${this.el.value.slice(0, selection.start)}${text}${this.el.value.slice(selection.end)}`
          this.write(next)
          const caret = selection.start + String(text).length
          this.el.setSelectionRange?.(caret, caret)
        }

        onChange(cb) {
          this._subs.add(cb)
          return () => { this._subs.delete(cb) }
        }

        _notify() {
          const text = this.getDraft()
          this._subs.forEach(cb => { try { cb(text) } catch {} })
        }
      }

      /* ================= dsh-promptkit adapter: OpenAIEnhancer ================= */
      // 示例 Enhancer：接任意 OpenAI 兼容端点（开源版用）。
      // 闭源版（DSH 插件）可继承 Enhancer 并桥接到当前会话模型的语义增强接口。
      class OpenAIEnhancer extends Enhancer {
        constructor({ endpoint, apiKey, model = 'gpt-4o-mini' } = {}) {
          super()
          this.endpoint = endpoint
          this.apiKey = apiKey
          this.model = model
          this._abort = null
        }

        get loading() { return this._abort !== null }

        async enhance({ draft, extra, kind, method }) {
          // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
          // 此处示例实现统一的语义改写路径。
          this._abort = new AbortController()
          try {
            const instruction = method?.template
              ? `按「${method.title}」的方法结构改写以下提示词。方法模板：\n\n${method.template}`
              : '改写以下提示词，使其更清晰、可执行。'
            const res = await fetch(this.endpoint, {
              method: 'POST',
              headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
              body: JSON.stringify({
                model: this.model,
                messages: [{ role: 'user', content: `${instruction}\n\n补充要求：${extra || '无'}\n\n${draft}` }],
              }),
              signal: this._abort.signal,
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
              if (res.status === 504) throw Object.assign(new Error('模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(data?.error?.message || `增强请求失败（HTTP ${res.status}）`)
            }
            return { prompt: data.choices?.[0]?.message?.content || draft, model: this.model }
          } finally {
            this._abort = null
          }
        }

        cancel() { this._abort?.abort() }
      }

      /* ================= dsh-promptkit 组件: PromptStudio（方法工坊） ================= */
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
        const [showOptional, setShowOptional] = React.useState(false)
        React.useEffect(() => {
          let alive = true
          setLoadingMethods(true)
          methodProvider.list().then(value => { if (alive) setMethods(list(value)) }).catch(error => { if (alive) setMessage(String(error?.message || error)) }).finally(() => { if (alive) setLoadingMethods(false) })
          methodProvider.getFavorites?.().then(value => { if (alive) setFavorites(list(value)) }).catch(() => {})
          methodProvider.getHistory?.().then(value => { if (alive) setHistory(list(value)) }).catch(() => {})
          const offHistory = methodProvider.onHistoryChange?.(value => { if (alive) setHistory(list(value)) })
          return () => { alive = false; offHistory?.() }
        }, [methodProvider])
        const categories = ['全部', ...Array.from(new Set(methods.map(item => item.category))).filter(Boolean)]
        const pinnedSet = new Set(['苏格拉底式提问', '第一性原理', '双向钢人论证'])
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
        const restoreRecent = item => {
          setMethodId(item.id)
          setQuestion(item.question || '')
          setPreview(null)
          setMessage('正在重新生成预览…')
          methodProvider.compose({ methodId: item.id, question: item.question || '', facts, constraints, options })
            .then(value => { setPreview(value); setMessage('已恢复最近一次问题，并重新生成预览。') })
            .catch(error => setMessage(String(error?.message || error)))
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
        const previewPanel = preview ? h(Panel, { key: 'preview', title: '发送前预览', hint: `${preview.estimated_chars} 字符` }, h('div', { style: { padding: '16px' } }, [
          h('pre', { key: 'text', style: { margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: 1.6, color: C.slate, maxHeight: '300px', overflow: 'auto', background: C.paper, padding: '12px', borderRadius: '6px', border: `1px solid ${C.divide}` } }, preview.prompt),
          h('div', { key: 'actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' } }, [
            onSend ? h('button', { key: 'send', className: 'pk-action-primary', onClick: () => onSend(preview.prompt).then(() => setMessage('已发送。')).catch(error => setMessage(String(error?.message || error))), style: workbenchStyle.actionPrimary }, '发送到当前会话') : null,
            composer ? h('button', { key: 'write', onClick: writePreview, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '写入输入框') : null,
            h('button', { key: 'copy', onClick: copyPreview, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '复制 Prompt'),
          ]),
        ])) : null
        // 紧凑左栏单行列表渲染
        const methodList = h('ul', {
          key: 'list',
          style: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            borderTop: `1px solid ${C.divide}`,
            borderBottom: `1px solid ${C.divide}`,
          },
        }, visibleMethods.map(item => {
          const selected = item.id === methodId
          const isPinned = pinnedSet.has(item.title)
          const isFav = favorites.includes(item.id)
          return h('li', { key: item.id, style: { borderBottom: `1px solid ${C.divide}` } },
            h('button', {
              className: 'pk-btn',
              onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') },
              style: {
                width: '100%',
                padding: '9px 12px',
                border: 0,
                borderLeft: `2px solid ${selected ? C.teal : 'transparent'}`,
                background: selected ? C.tealTint : 'transparent',
                color: C.ink,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '10px',
                alignItems: 'center',
              }
            }, [
              h('span', {
                key: 'title',
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: selected ? C.teal : C.ink,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }, [
                isPinned ? h('span', { key: 'pin', style: { fontSize: '10px', color: C.muted, fontWeight: 400 }, title: '常用' }, '常用') : null,
                h('span', { key: 't', style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, item.title),
                isFav ? h(Icon, { key: 'fav', name: 'star', size: 12, style: { color: C.teal, fill: C.teal, flexShrink: 0 }, title: '已收藏', 'aria-label': '已收藏' }) : null,
              ]),
              h('span', { key: 'purpose', style: { fontSize: '11px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' } }, item.purpose || ''),
            ])
          )
        }))
        const historyList = history.length ? h(Panel, { key: 'history', title: '最近生成', hint: `${history.length} 条` },
          h('ul', { style: { listStyle: 'none', padding: '4px 14px 12px', margin: 0, display: 'grid', gap: '2px' } },
            history.slice(0, 5).map(item => h('li', { key: `${item.id}:${item.at}`, style: { borderBottom: `1px solid ${C.divide}` } },
              h('button', {
                onClick: () => restoreRecent(item),
                style: {
                  width: '100%',
                  padding: '8px 0',
                  border: 0,
                  background: 'transparent',
                  color: C.slate,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '10px',
                  fontSize: '12px',
                }
              }, [
                h('span', { key: 't', style: { fontWeight: 500, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.title || ''),
                h('span', { key: 'q', style: { color: C.slate, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.question || '未命名问题'),
                h('span', { key: 'time', style: { color: C.muted, fontSize: '11px', gridColumn: '1 / -1', textAlign: 'right' } }, item.at ? new Date(item.at).toLocaleTimeString() : ''),
              ])
            ))
          )
        ) : null
        return h('main', { style: { ...S.page, width: '100%', boxSizing: 'border-box', background: 'transparent', margin: '0 auto' } }, [
          h(GlobalStyle, { key: 'gcss' }),
          h('header', { key: 'header', style: { marginBottom: '20px', paddingBottom: '14px', borderBottom: `1px solid ${C.divide}` } }, [
            h('div', { key: 't-row', style: { display: 'flex', alignItems: 'baseline', gap: '12px', justifyContent: 'space-between' } }, [
              h('h1', { key: 'title', style: { ...S.title, margin: 0 } }, '方法工坊'),
              h('span', { key: 'count', style: { fontSize: '12px', color: C.muted } }, `${visibleMethods.length} / ${methods.length}`)
            ]),
            h('p', { key: 'lead', style: { ...S.lead, margin: '6px 0 0' } }, '选择方法,用精简的问题、事实和约束生成可编辑 Prompt。')
          ]),
          loadingMethods ? h('div', { key: 'loading', style: S.empty }, h(Spinner, { text: '正在读取方法库…' })) : h('div', {
            key: 'layout',
            style: {
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 320px) minmax(0, 1fr)',
              gap: '36px',
              alignItems: 'start',
            }
          }, [
            h('aside', { key: 'methods', style: { position: 'sticky', top: '14px' } }, [
              h('div', { key: 'filter', style: { display: 'grid', gap: '8px', marginBottom: '14px' } }, [
                h('input', { key: 'search', value: search, onChange: event => setSearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 10px', fontSize: '12px' } }),
                h('select', { key: 'select', value: category, onChange: event => setCategory(event.target.value), style: { width: '100%', padding: '8px 10px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.surface, color: C.ink, fontSize: '12px' } }, categories.map(value => h('option', { key: value, value }, value))),
              ]),
              methodList,
            ]),
            h('section', { key: 'form', style: { display: 'grid', gap: '20px', minWidth: 0 }, onKeyDown: event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && method && question.trim()) { event.preventDefault(); void compose() } } }, [
              h('div', { key: 'header', style: { borderBottom: `1px solid ${C.divide}`, paddingBottom: '14px' } }, [
                h('div', { key: 't-row', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' } }, [
                  h('h2', { key: 'title', style: { ...S.title, fontSize: '17px', margin: 0 } }, method?.title || '方法输入'),
                  h('span', { key: 'category', style: { fontSize: '12px', color: C.muted } }, method ? `${method.category} · ${method.mode === 'guided' ? '会逐步追问' : '会一次性分析'}` : ''),
                ]),
                method?.purpose ? h('p', { key: 'purpose', style: { margin: '8px 0 0', fontSize: '13px', color: C.slate, lineHeight: 1.55 } }, method.purpose) : null,
              ]),
              h('div', { key: 'tools', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
                messages?.length ? h('button', { key: 'extract', onClick: () => setExtracted(selectedConversationDraft(messages)), style: { ...workbenchStyle.action, background: C.surface, color: C.ink, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'extract', size: 13 }), extracted ? '重新提取' : '从对话提取']) : null,
                method ? h('button', { key: 'favorite', onClick: () => toggleFavorite(method.id), style: { ...workbenchStyle.action, background: isFav(method, favorites) ? C.tealTintDeep : C.surface, color: isFav(method, favorites) ? C.teal : C.ink, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'star', size: 13, style: isFav(method, favorites) ? { fill: C.teal } : undefined }), isFav(method, favorites) ? '已收藏' : '收藏方法']) : null,
                h('button', { key: 'clear', onClick: () => { setQuestion(''); setFacts(''); setConstraints(''); setOptions(''); setExtracted(null); setPreview(null) }, style: { ...workbenchStyle.action, background: C.surface, color: C.muted, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'trash', size: 13 }), '清空'])
              ]),
              extracted ? h('div', { key: 'extracted', style: { padding: '12px 14px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.paper, fontSize: '12px', lineHeight: 1.55 } }, [
                h('div', { key: 'head', style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
                  h('span', { style: workbenchStyle.badge(C.teal) }, `已提取 ${extracted.source_count} 条`),
                  h('span', { style: { color: C.ink, fontWeight: 600 } }, '从对话生成草稿'),
                ]),
                h('div', { key: 'summary', style: { marginTop: '8px', fontSize: '11px', color: C.muted } }, `问题 ${extracted.question ? '✓' : '—'} · 事实 ${extracted.facts ? '✓' : '—'} · 约束 ${extracted.constraints ? '✓' : '—'} · 未决问题 ${extracted.unresolved ? '✓' : '—'}`),
                extracted.question ? h('div', { key: 'question', style: { marginTop: '7px', color: C.slate } }, `问题：${cleanSummary(extracted.question)}`) : null,
                extracted.unresolved ? h('div', { key: 'unresolved', style: { marginTop: '4px', color: C.slate } }, `未决：${cleanSummary(extracted.unresolved)}`) : null,
                h('button', { key: 'apply', className: 'pk-action-primary', onClick: () => { setQuestion(extracted.question); setFacts(extracted.facts); setConstraints(extracted.constraints); setOptions(extracted.options); setExtracted(null) }, style: { ...workbenchStyle.actionPrimary, marginTop: '10px' } }, '确认并填入表单')
              ]) : null,
              method ? h('div', { key: 'guide', style: { padding: '10px 14px', borderRadius: '6px', background: C.paperWarm, color: C.slate, fontSize: '12px', lineHeight: 1.55 } }, [
                h('strong', { key: 'label', style: { color: C.ink, marginRight: '6px', fontWeight: 500 } }, '你会得到'),
                h('span', null, method.outcome || (method.mode === 'guided' ? 'AI 会逐步追问,直到问题足够清楚。' : '一份结构化分析、风险和下一步行动。'))
              ]) : null,
              h('div', { key: 'steps', style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, [stepPill(question, '问题'), stepPill(facts, '事实'), stepPill(constraints, '约束'), stepPill(options, '方案')]),
              h('div', { key: 'q', className: 'pk-field' }, [
                h('label', { className: 'pk-label', htmlFor: 'pk-question' }, '问题'),
                h('textarea', { id: 'pk-question', value: question, onChange: e => setQuestion(e.target.value), placeholder: '输入你想解决的问题', style: { ...workbenchStyle.input, minHeight: '84px', resize: 'vertical', width: '100%' } })
              ]),
              showOptional || facts || constraints || options ? h('div', { key: 'supporting', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px' } }, [
                h('div', { key: 'f', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '已知事实 (可选)'), h('textarea', { value: facts, onChange: e => setFacts(e.target.value), placeholder: '输入已知的事实', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })]),
                h('div', { key: 'c', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '现实约束 (可选)'), h('textarea', { value: constraints, onChange: e => setConstraints(e.target.value), placeholder: '输入资源、时间或不可接受的结果', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })]),
                h('div', { key: 'o', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '已有方案 (可选)'), h('textarea', { value: options, onChange: e => setOptions(e.target.value), placeholder: '输入已有方案或备选路径', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })])
              ]) : h('button', { key: 'show-optional', onClick: () => setShowOptional(true), style: { ...workbenchStyle.action, background: 'transparent', color: C.muted, width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'plus', size: 13 }), '添加可选字段（事实 / 约束 / 方案）']),
              getRecentSessions ? h('div', { key: 'history-controls', style: { paddingTop: '12px', borderTop: `1px solid ${C.divide}` } }, [
                h('div', { key: 'l', style: { fontSize: '12px', fontWeight: 500, color: C.ink, marginBottom: '4px' } }, '追加最近会话摘要'),
                h('div', { key: 'h', style: { fontSize: '11px', color: C.muted, marginBottom: '8px' } }, '只读取已保存的简短摘要,不读取完整历史对话、工具参数或工具结果。'),
                h('div', { key: 'ctl', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
                  h('select', { key: 'limit', value: recentLimit, onChange: e => { setRecentLimit(e.target.value); setRecentPreview(null) }, style: { padding: '7px 9px', border: `1px solid ${C.line}`, borderRadius: '6px', fontSize: '12px' } }, [['0', '不追加'], ['1', '最近 1 个'], ['3', '最近 3 个'], ['5', '最近 5 个']].map(([value, label]) => h('option', { key: value, value }, label))),
                  h('button', { key: 'preview', disabled: recentLimit === '0', onClick: previewRecent, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '预览摘要')
                ]),
                recentPreview ? h('div', { key: 'preview', style: { marginTop: '10px', padding: '10px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.paper, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [
                  h('div', { key: 'text', style: { color: C.slate } }, recentPreview.summary || '未找到可追加的已保存会话摘要。'),
                  h('button', { key: 'apply', disabled: !recentPreview.summary, onClick: appendRecent, style: { ...workbenchStyle.action, marginTop: '8px' } }, `追加 ${recentPreview.count} 个摘要到事实`)
                ]) : null
              ]) : null,
              searchMemory ? h('div', { key: 'search', style: { paddingTop: '12px', borderTop: `1px solid ${C.divide}` } }, [
                h('div', { key: 'l', style: { fontSize: '12px', fontWeight: 500, color: C.ink, marginBottom: '4px' } }, '按自然语言搜索项目记忆'),
                h('div', { key: 'h', style: { fontSize: '11px', color: C.muted, marginBottom: '8px' } }, '用一句自然语言描述你要找的旧决策或证据;搜索范围由宿主注入的 searchMemory 决定。'),
                h('div', { key: 'ctl', style: { display: 'flex', gap: '8px' } }, [
                  h('input', { key: 'query', value: contextQuery, onChange: e => setContextQuery(e.target.value), placeholder: '例如:之前关于 Feign 兼容的决策', style: { ...workbenchStyle.input, fontSize: '12px' } }),
                  h('button', { key: 'go', disabled: !contextQuery.trim(), onClick: searchContext, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '搜索')
                ]),
                contextPreview ? h('div', { key: 'preview', style: { marginTop: '10px', padding: '10px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.paper, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [
                  h('div', { key: 'text', style: { color: C.slate } }, cleanContext(contextPreview) || '未找到可追加的项目记忆。'),
                  h('button', { key: 'apply', onClick: appendContext, style: { ...workbenchStyle.action, marginTop: '8px' } }, '追加到事实')
                ]) : null
              ]) : null,
              h('button', { key: 'compose', className: 'pk-action-primary', onClick: compose, style: { ...workbenchStyle.actionPrimary, display: 'inline-flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ic', name: 'sparkle', size: 14 }), h('span', { key: 't' }, '生成 Prompt 预览'), h('span', { key: 'kbd', style: { opacity: 0.65, fontSize: '11px', fontWeight: 600 } }, '⌘↵')]),
              previewPanel,
              historyList,
              message ? h('div', { key: 'message', style: { color: C.teal, fontSize: '13px', padding: '10px 14px', background: C.tealTint, borderRadius: '6px', border: `1px solid ${C.tealLine}` } }, message) : null,
            ]),
          ]),
        ])
      }

      function isFav(method, favorites) { return !!method && favorites.includes(method.id) }

      function stepPill(value, label) {
        return h('span', { key: label, style: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, border: `1px solid ${value ? 'var(--pk-teal-line-active)' : 'var(--pk-line)'}`, background: value ? 'var(--pk-teal-tint)' : 'transparent', color: value ? 'var(--pk-teal)' : 'var(--pk-muted)' } }, value ? `✓ ${label}` : label)
      }

      /* ================= dsh-promptkit 组件: ConversationQuickAction（快捷助手） ================= */
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
        const [contextLevel, setContextLevel] = React.useState('question')
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
        }, [msgs.length, selected.length, open, methods, selectedMethodId, requirement, contextLevel, mode])
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
        const selectedContextText = contextLevel === 'question' ? '' : contextText()
        const referencedFiles = fileMentions(draft)
        const autoMethods = recommendMethods(methods, [draft, requirement, selectedContextText].filter(Boolean).join('\n'))
        const matchedMethod = methods.find(method => method.id === enhancementMethodId) || autoMethods[0]
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
          const source = contextLevel === 'question' ? [] : activeMessages
          if (!canCompose) { setWarn('请输入本次要求或问题；也可以选择一条用户消息作为问题。'); return }
          setLoading(true)
          try {
            const conversationDraft = selectedConversationDraft(source)
            const explicitRequirement = requirement.trim()
            const question = explicitRequirement || conversationDraft.question
            let facts = [explicitRequirement && conversationDraft.question ? `对话中的原始问题：${conversationDraft.question}` : '', conversationDraft.facts].filter(Boolean).join('\n')
            if (contextLevel === 'memory' && searchMemory) {
              const remembered = cleanContext(await searchMemory(question) || '')
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
              if (contextLevel === 'memory' && searchMemory) {
                const remembered = cleanContext(await searchMemory(original) || '')
                if (remembered) extra = [extra, `项目记忆：${remembered}`].filter(Boolean).join('\n\n')
              }
              const template = matchedMethod ? await methodProvider.getTemplate(matchedMethod.id) : null
              const body = await enhancer.enhance({ draft: original, extra, lang: detectLanguage(original), kind: 'semantic', method: matchedMethod ? { title: matchedMethod.title, template: template.prompt } : undefined })
              const after = applyEnhanced(body.prompt)
              setUndoDraft({ before: selection?.draft || original, after })
              rememberMethod(matchedMethod, original)
              recordUsage({ kind: 'semantic', method: matchedMethod?.title })
              setLastEnhancement({ kind: 'semantic', method: matchedMethod?.title })
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
        const structurePreview = selectedMethod ? h('div', { style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `组装预览：问题 · ${contextLevel === 'question' ? '仅问题' : contextLevel === 'conversation' ? `已选对话 ${activeMessages.length} 条` : `已选对话 ${activeMessages.length} 条 + 项目记忆`} · ${selectedMethod.title} 的分析结构`) : null
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
        const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]
        const enhancerPanel = h('div', { key: 'enhancer', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '11px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '增强当前输入框提示词'), h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px', marginTop: '9px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? '把草稿交给模型独立改写；只发送当前草稿与补充要求，不读取对话参考。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。'), h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode), h('button', { key: 'enhance', className: 'pk-btn', disabled: !draft.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { width: '100%', marginTop: '10px', padding: '11px 14px', border: 0, borderRadius: '9px', background: draft.trim() && !loading ? C.actionBg : loading && enhancementKind === 'semantic' ? C.amber : C.tealLine, color: draft.trim() && !loading ? C.actionFg : loading && enhancementKind === 'semantic' ? C.onInk : C.muted, cursor: (draft.trim() && !loading) || (loading && enhancementKind === 'semantic') ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消增强' }) : loading ? h(Spinner, { key: 'spin', text: '正在增强…' }) : '应用增强到消息框')])
        const contextLevels = [['question', '仅草稿'], ...(msgs.length ? [['conversation', '加对话']] : []), ...(searchMemory ? [['memory', '加项目记忆']] : [])]
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
        const panelW = Math.min(440, vw - 32)
        const targetLeft = Math.max(8, Math.min(position.x + 52 - panelW, vw - 8 - panelW))
        const panelLeft = targetLeft - position.x
        const panel = open ? h('section', { className: 'pk-scroll', role: 'dialog', 'aria-label': '对话增强器', style: { position: 'absolute', left: panelLeft, ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: `${panelW}px`, maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px var(--pk-shadow-lg)', color: C.ink, zIndex: 30, animation: 'pk-pop .2s ease' } }, [
              h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, libraryOpen ? '从提示词库选择模板：可直接填入消息框，或基于当前草稿调用模型按该方法改造。' : mode === 'enhance' ? '把当前输入框提示词做增强或改写，只填入消息框，不会自动发送。' : '写问题即可直接处理；也可选择对话消息作为额外参考。生成内容只填入消息框，不会自动发送。')]), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))]),
              libraryOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '9px 10px', borderRadius: '9px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, [h('span', { key: 'count' }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '未选择对话 · 可直接写问题'), msgs.length ? h('button', { key: 'recent', onClick: () => setSelected(msgs.slice(0, 4).map(item => item.id)), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '选择最近 4 条') : null]),
              undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } clearOutcomeAt('undo'); composer?.write(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
              h('div', { key: 'mode', style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '10px' } }, [['enhance', '智能增强'], ['method', '手动选方法']].map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => { setMode(id); setLibraryOpen(false) }, style: { padding: '8px', border: `1px solid ${mode === id && !libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: mode === id && !libraryOpen ? C.tealTintDeep : C.surface, color: mode === id && !libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label)).concat(h('button', { key: 'library', className: 'pk-btn', onClick: () => { const next = !libraryOpen; setMode(next ? 'library' : 'method'); setLibraryOpen(next) }, style: { padding: '8px', border: `1px solid ${libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: libraryOpen ? C.tealTintDeep : C.surface, color: libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '方法库'))),
              libraryOpen ? h('div', { key: 'library-panel', style: { marginTop: '10px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('input', { key: 'search', value: librarySearch, onChange: event => setLibrarySearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }), libraryFavorites.length ? h('div', { key: 'favorites', style: { marginTop: '8px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '我的收藏：'), ' ', libraryFavorites.map(id => methods.find(method => method.id === id)).filter(Boolean).map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, method.title))]) : null, libraryHistory.length ? h('div', { key: 'history', style: { marginTop: '7px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '最近生成：'), ' ', libraryHistory.slice(0, 3).map(item => h('button', { key: `${item.id}:${item.at}`, className: 'pk-btn', onClick: () => { setSelectedMethodId(item.id); setMode('method'); if (item.question) setRequirement(item.question); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, item.title || '未命名方法'))]) : null, h('div', { key: 'matches', style: { display: 'grid', gap: '5px', maxHeight: '180px', overflowY: 'auto', marginTop: '8px' } }, libraryMatches.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '8px 9px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '11px' } }, [h('strong', { key: 'title' }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted } }, method.purpose || method.category)])))] ) : null,
              libraryOpen ? h('div', { key: 'library-actions', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [h('select', { key: 'select', value: selectedMethodId, onChange: event => setSelectedMethodId(event.target.value), style: { width: '100%', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, fontSize: '12px' } }, [h('option', { key: 'empty', value: '' }, '选择一个提示词…'), ...libraryMatches.map(method => h('option', { key: method.id, value: method.id }, method.title))]), libraryMethod ? h('div', { key: 'selected', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, `已选择「${libraryMethod.title}」：可直接填充模板，或基于当前草稿改造。`) : null, h('div', { key: 'buttons', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '9px' } }, [h('button', { key: 'fill', className: 'pk-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.action, opacity: libraryMethod ? 1 : .55 } }, '填充模板'), h('button', { key: 'adapt', className: 'pk-btn', disabled: !libraryMethod || !draft.trim() || loading || !enhancer, onClick: adaptLibraryDraft, style: { ...workbenchStyle.action, opacity: libraryMethod && draft.trim() && enhancer ? 1 : .55 } }, loading ? h(Spinner, { key: 'spin', text: '改造中…' }) : '基于草稿改造')]), h('details', { key: 'private', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, '导入我的 Obsidian Prompt 卡片'), h('div', { style: { marginTop: '7px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, '粘贴一张 Markdown 卡片即可，仅保存到当前浏览器；不会读取或上传你的笔记库。'), h('textarea', { value: privateMarkdown, onChange: event => setPrivateMarkdown(event.target.value), placeholder: '# 我的方法\n\n## Prompt\n```\n提示词正文\n```', style: { ...workbenchStyle.input, width: '100%', minHeight: '100px', marginTop: '7px', resize: 'vertical', fontSize: '11px' } }), h('button', { className: 'pk-btn', disabled: !privateMarkdown.trim(), onClick: importPrivateMethod, style: { ...workbenchStyle.action, marginTop: '7px', opacity: privateMarkdown.trim() ? 1 : .55 } }, '导入到我的私有方法'), privateNotice ? h('div', { style: { marginTop: '6px', color: C.teal, fontSize: '11px' } }, privateNotice) : null]), h('details', { key: 'signals', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, '本地使用信号（默认关闭）'), h('div', { style: { marginTop: '7px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, '只记录增强类型和方法名，不记录草稿、对话或模型内容，也不会联网。'), h('button', { className: 'pk-btn', onClick: toggleMetrics, style: { ...workbenchStyle.action, marginTop: '7px' } }, metricsEnabled ? '已开启本地计数' : '开启本地计数'), metricsEnabled ? h('div', { style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `轻量通用改写 ${Number(metrics.lightGeneric || 0)} 次 · 轻量方法 ${Number(metrics.lightMethod || 0)} 次 · 语义增强 ${Number(metrics.semantic || 0)} 次 · 反馈 ${feedback.length} 条`) : null, h('button', { className: 'pk-btn', onClick: clearLocalSignals, style: { marginTop: '7px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.surface, color: C.amber, cursor: 'pointer', padding: '7px 9px', fontSize: '11px', fontWeight: 800 } }, confirmClearMetrics ? '再次点击确认清空本地信号' : '清空本地信号')])]) : null,
              libraryOpen ? h('details', { key: 'private-manage', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [
                h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, '管理我的私有方法'),
                ...methods.filter(method => method.source === 'private').map(method => h('div', { key: method.id, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11px' } }, [h('span', { style: { color: C.slate } }, method.title), h('span', null, [h('button', { onClick: () => editPrivateMethod(method), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px' } }, '编辑'), h('button', { onClick: () => deletePrivateMethod(method.id), style: { marginLeft: '6px', border: 0, background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '11px' } }, confirmDeletePrivateId === method.id ? '再次点击删除' : '删除')])])),
              ]) : null,
              libraryOpen ? h('details', { key: 'private-backup', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [
                h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, '备份或恢复私有方法'),
                h('div', { style: { marginTop: '7px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, '导出 JSON 备份；恢复只会追加，不会删除当前私有方法。'),
                h('button', { className: 'pk-btn', onClick: exportPrivateMethods, style: { ...workbenchStyle.action, marginTop: '7px' } }, '导出私有方法'),
                h('textarea', { value: privateBackup, onChange: event => setPrivateBackup(event.target.value), placeholder: '粘贴此前导出的 JSON 备份', style: { ...workbenchStyle.input, width: '100%', minHeight: '74px', marginTop: '8px', resize: 'vertical', fontSize: '11px' } }),
                h('button', { className: 'pk-btn', disabled: !privateBackup.trim(), onClick: importPrivateBackup, style: { ...workbenchStyle.action, marginTop: '7px', opacity: privateBackup.trim() ? 1 : .55 } }, '恢复私有方法'),
              ]) : null,
              libraryOpen ? h('details', { key: 'metrics-entry', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [
                h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' } }, [h(Icon, { key: 'ic', name: 'history', size: 13 }), '用法统计（本地，可选）']),
                h('div', { style: { marginTop: '9px', fontSize: '12px', color: C.slate, lineHeight: 1.5 } }, [
                  h('label', { key: 'toggle', style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' } }, [h('input', { key: 'cb', type: 'checkbox', checked: metricsEnabled, onChange: toggleMetrics, style: { accentColor: C.teal } }), '记录本地用法（轻量 / 语义档次数，不上传）']),
                  metricsEnabled ? h('div', { key: 'nums', style: { marginTop: '9px', display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
                    h('span', { key: 't', style: workbenchStyle.badge(C.teal) }, `总计 ${metrics.total || 0}`),
                    h('span', { key: 'l', style: workbenchStyle.badge(C.blue) }, `轻量 ${metrics.light || 0}`),
                    h('span', { key: 's', style: workbenchStyle.badge(C.amber) }, `语义 ${metrics.semantic || 0}`),
                  ]) : null,
                  metricsEnabled ? h('div', { key: 'outcomes', style: { marginTop: '7px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: `1px dashed ${C.divide}`, paddingTop: '8px' } }, [
                    h('span', { key: 'lab', style: { fontSize: '11px', color: C.muted, alignSelf: 'center' } }, '结果去向：'),
                    h('span', { key: 'u', style: workbenchStyle.badge(C.red) }, `撤销 ${metrics.outcome?.undo || 0}`),
                    h('span', { key: 'e', style: workbenchStyle.badge(C.amber) }, `编辑 ${metrics.outcome?.edited || 0}`),
                    h('span', { key: 'k', style: workbenchStyle.badge(C.blue) }, `原样保留 ${metrics.outcome?.kept || 0}`),
                  ]) : null,
                  metricsEnabled && (metrics.total || 0) ? h('button', { key: 'clear', onClick: clearLocalSignals, style: { ...workbenchStyle.action, marginTop: '9px', background: C.surface, color: C.red } }, confirmClearMetrics ? '确认清空本地统计？' : '清空本地统计') : null,
                ]),
              ]) : null,
              h('div', { key: 'requirement', className: 'pk-field', style: { display: libraryOpen ? 'none' : 'block', marginTop: '10px', marginBottom: '9px' } }, [h('span', { key: 'label', className: 'pk-label pk-label--muted' }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), h('textarea', { key: 'input', value: requirement, onChange: event => setRequirement(event.target.value), placeholder: mode === 'enhance' ? '例如：使用简洁中文，先给结论，再列出实施步骤。' : '例如：请重点评估风险，并给出可执行的下一步。', style: { ...workbenchStyle.input, minHeight: '58px', resize: 'vertical', fontSize: '12px', lineHeight: 1.45 } })]),
              h('div', { key: 'context-level', style: { display: libraryOpen ? 'none' : 'grid', gridTemplateColumns: `repeat(${contextLevels.length},minmax(0,1fr))`, gap: '6px', marginBottom: '9px' } }, contextLevels.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setContextLevel(id), style: { padding: '7px 5px', border: `1px solid ${contextLevel === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: contextLevel === id ? C.tealTintDeep : C.surface, color: contextLevel === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))),
              msgs.length ? h('details', { key: 'context', style: { display: libraryOpen ? 'none' : 'block', marginTop: '8px', paddingTop: '9px', borderTop: `1px solid ${C.divide}` } }, [h('summary', { key: 'summary', style: { color: C.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer' } }, activeMessages.length ? `可选：调整已选的 ${activeMessages.length} 条对话参考` : '可选：选择对话作为参考'), activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, `自动归类：${selectedDraft.question ? '问题' : '—'} · ${selectedDraft.facts ? '事实' : '—'} · ${selectedDraft.constraints ? '约束' : '—'} · ${selectedDraft.options ? '方案' : '—'}`) : null, h('div', { key: 'privacy', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, '仅展示用户与助手文本；工具调用、工具结果和代码块不会进入此面板。'), h('div', { key: 'messages', style: { display: 'grid', gap: '6px', maxHeight: '210px', overflow: 'auto', paddingRight: '2px' } }, msgs.map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: '8px', padding: '8px', border: `1px solid ${selected.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '9px', background: selected.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { key: 'check', type: 'checkbox', checked: selected.includes(item.id), onChange: () => toggle(item.id), style: { marginTop: '2px', accentColor: C.teal } }), h('div', { key: 'text' }, [h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '11px', fontWeight: 800 } }, item.role === 'user' ? '你的消息' : '助手消息'), h('div', { key: 'body', style: { marginTop: '2px', color: C.slate, fontSize: '12px', lineHeight: 1.45 } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`)])])))]) : null,
              mode === 'enhance' ? enhancerPanel : null,
              lastEnhancement ? h('div', { key: 'feedback', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint, color: C.slate, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ck', name: 'check', size: 14, style: { color: C.teal } }), h('span', { key: 'label', style: { flex: 1 } }, '增强完成，可在此撤销或反馈'), h('button', { key: 'up', onClick: () => saveFeedback('up'), title: '有用', 'aria-label': '有用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-u', name: 'thumbsUp', size: 15 })), h('button', { key: 'down', onClick: () => saveFeedback('down'), title: '没用', 'aria-label': '没用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-d', name: 'thumbsDown', size: 15 }))]) : null,
              h('div', { key: 'methods', style: { display: mode === 'method' ? 'block' : 'none', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]), h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'), recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null, methodCards, structurePreview, methodFooter]),
              noticeState ? h('div', { key: 'notice', role: 'status', 'aria-live': 'polite', style: { marginTop: '10px', padding: '9px 11px', borderRadius: '8px', border: `1px solid ${noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amberLine : C.tealLine}`, background: noticeState.kind === 'error' ? C.redTint : noticeState.kind === 'warn' ? C.amberTint : C.tealTint, color: noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amber : C.teal, fontSize: '12px', lineHeight: 1.45 } }, noticeState.text) : null,
            ]) : null
        return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 30 } }, [h(GlobalStyle, { key: 'gcss' }), h('button', { key: 'launcher', type: 'button', className: 'pk-fab', onPointerDown: event => { suppressClick.current = false; drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y, moved: false } }, onClick: () => { if (suppressClick.current) { suppressClick.current = false; return } setMode('enhance'); setLibraryOpen(false); setOpen(true) }, style: buttonStyle, title: '智能增强（⌘K）', 'aria-label': '打开智能增强', onMouseEnter: event => { event.currentTarget.style.transform = 'scale(1.06)' }, onMouseLeave: event => { event.currentTarget.style.transform = 'scale(1)' } }, h(Icon, { key: 'ic', name: 'sparkles', size: 18 })), panel])
      }


/* ================= 独立插件 glue：DSH 插槽注册 + 默认 adapter 装配 ================= */
      // 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
      // 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
      //
      // 语义增强经 node 半区复用当前会话的模型路由；浏览器端不保存 API Key 或模型配置。

      const promptkitMethodProvider = new StaticMethodProvider()

      async function promptkitSearchMemory(sessionId, query) {
        const url = new URL('/memory-center/context-search', window.location.origin)
        url.searchParams.set('session_id', sessionId)
        url.searchParams.set('query', query)
        const response = await fetch(url)
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.next_action || '项目记忆服务不可用；请安装并启用 Memory Center DSH 插件。')
        return String(body.suggested_context || '')
      }

      class DshSessionEnhancer {
        constructor(getSessionId) { this.getSessionId = getSessionId; this.controller = null }
        get loading() { return !!this.controller }
        async enhance({ draft, extra, lang, method }) {
          this.controller?.abort()
          this.controller = new AbortController()
          try {
            const response = await fetch(`/dsh-promptkit/semantic-enhance?session_id=${encodeURIComponent(this.getSessionId())}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ draft, extra, lang, method }),
              signal: this.controller.signal,
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) {
              if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(body.next_action || body.error || '基于草稿改造失败')
            }
            return body
          } finally { this.controller = null }
        }
        cancel() { this.controller?.abort(); this.controller = null }
      }

      // 桥接 DSH 会话输入框（conversation.input.right 注入的 props）为 Composer 接口
      class DshDraftComposer {
        constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
        getDraft() { return this.input?.draft ?? '' }
        write(text) { this.inputActions?.setDraft(String(text ?? '')) }
        onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
        notify(draft) { for (const cb of this.listeners) cb(draft) }
      }

      // 快捷助手宿主：把 DSH 注入的 props 翻译为组件 deps
      function PromptkitQuickActionHost({ sessionId, useSession, inputActions, input }) {
        const snapshot = useSession(value => value)
        const messages = React.useMemo(() => conversationMessages(snapshot), [snapshot?.nodes])
        const composer = React.useMemo(() => new DshDraftComposer(input, inputActions), [input, inputActions])
        const enhancer = React.useMemo(() => new DshSessionEnhancer(() => sessionId), [sessionId])
        const searchMemory = React.useCallback(query => promptkitSearchMemory(sessionId, query), [sessionId])
        const [memoryAvailable, setMemoryAvailable] = React.useState(false)
        React.useEffect(() => {
          let alive = true
          const url = new URL('/memory-center/context-search', window.location.origin)
          url.searchParams.set('session_id', sessionId)
          url.searchParams.set('query', '__promptkit_probe__')
          fetch(url).then(response => { if (alive) setMemoryAvailable(response.ok) }).catch(() => { if (alive) setMemoryAvailable(false) })
          return () => { alive = false }
        }, [sessionId])
        React.useEffect(() => { composer.notify(input?.draft ?? '') }, [input?.draft, composer])
        return h(ConversationQuickAction, { methodProvider: promptkitMethodProvider, composer, enhancer, messages, ...(memoryAvailable ? { searchMemory } : {}) })
      }

      // 方法工坊宿主：conversation.view 视图，onSend 走当前会话
      function PromptkitStudioHost({ sessionId, onSend }) {
        return h(PromptStudio, { methodProvider: promptkitMethodProvider, onSend })
      }

      const promptkitApply = ctx => {
        const studio = [
          {
            name: 'conversation.view',
            id: 'dsh-promptkit-studio',
            order: 90,
            label: () => '高级方法工坊',
            inject: sessionId => {
              const session = ctx.sessions.binding(sessionId)?.session
              if (!session) throw new Error('dsh-promptkit: session unavailable')
              return { sessionId, onSend: text => session.prompt([{ type: 'text', text }], 'queue') }
            },
          },
          PromptkitStudioHost,
        ]
        const disposers = [
          // 两个 slot 的挂载时机互不依赖。不能把 input.right 注册嵌在
          // conversation.view 的 inject 回调里：部分 DSH 页面会先挂输入框而暂未创建 view。
          ctx.slots.inject('conversation.view', () => ctx.slots.register(studio[0], studio[1])),
          ctx.slots.inject('conversation.input.right', () =>
            ctx.slots.register({ name: 'conversation.input.right', id: 'dsh-promptkit-quick-action', order: 85, label: () => '快捷助手' }, PromptkitQuickActionHost)),
        ]
        return () => disposers.forEach(dispose => dispose?.())
      }
    return { inject: ['slots', 'sessions'], apply: promptkitApply }
  },
})
