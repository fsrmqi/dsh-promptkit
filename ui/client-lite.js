/* eslint-disable */
/* dsh-promptkit 独立 DSH 浏览器视图 — 本文件由 scripts/build-client.mjs 生成，勿手改。 */
window.__ModuleLoader__.load({
  // DSH 0.1.2+ 仅扫描包根 Loader 行，模块图 ID 使用根包名。
  id: 'dsh-promptkit',
  factory: require => {
    const React = require('react')

      /* ================= dsh-promptkit foundation（C / GlobalStyle / Icon / S / workbenchStyle，pk-* 视觉命名空间） ================= */
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

      /* ================= dsh-promptkit UI 事件与存储命名空间 ================= */
      // 组件间浏览器事件与暂存 key 的唯一真源。
      // storagePrefix 是 Embed 的隔离边界：同页挂载多个 PromptKit 时，事件和 sessionStorage
      // 也必须隔离，不能只隔离 localStorage。
      function eventPrefix(prefix = 'promptkit.') {
        const value = String(prefix || 'promptkit.')
        return value.endsWith('.') ? value : `${value}.`
      }

      function nudgeEventName(prefix) { return `${eventPrefix(prefix)}nudge` }
      function studioBridgeEventName(prefix) { return `${eventPrefix(prefix)}studio.open-with-draft.v1` }
      function studioBridgeStorageKey(prefix) { return `${eventPrefix(prefix)}studio.pending-draft.v1` }
      function nudgeEnabledStorageKey(prefix) { return `${eventPrefix(prefix)}quick-action.nudge.enabled.v1` }

      /* ================= dsh-promptkit 模型输出协议 ================= */
      // 模型输出协议：宿主、源码入口和浏览器产物共用同一解析与展示定义。
      const DIAGNOSIS_LABELS = { concept_clarity: '概念清晰', hidden_premise: '隐含前提', falsifiability: '可证伪性', actionability: '可行动性', context_fit: '语境契合' }
      const DIAGNOSIS_DIMENSIONS = Object.keys(DIAGNOSIS_LABELS)

      // 只兼容明确的维度别名；不猜测或补写模型没有返回的诊断。
      const DIAGNOSIS_ALIASES = { ...Object.fromEntries(Object.entries(DIAGNOSIS_LABELS).map(([key, label]) => [label, key])), '概念澄清': 'concept_clarity', '语境契合度': 'context_fit' }

      /** 保留部分诊断，隔离协议行；diagnosisMeta 只含协议状态，不记录草稿或模型原文。 */
      function parseEnhanceOutput(raw, { streaming = false } = {}) {
        let text = String(raw || '').replace(/\r\n?/g, '\n')
        // 仅拆包裹协议的外层围栏，普通代码提示词原样保留。
        if (/^\s*```[^\n]*\n\s*(?:[-*]\s*)?\[diag\]/i.test(text)) {
          text = text.replace(/^\s*```[^\n]*\n/, '').replace(/\n```\s*$/, '')
        }
        const marker = /^\s*={3}\s*PROMPT\s*={3}[ \t]*$/im.exec(text)
        const hasLeadingDiagnosis = /^\s*(?:[-*]\s*)?\[diag\]/i.test(text)
        const diagnostics = marker ? text.slice(0, marker.index) : hasLeadingDiagnosis ? text : ''
        const found = {}
        const warnings = new Set()
        const remaining = []
        let readingDiagnosis = true
        for (const line of diagnostics.split('\n')) {
          const match = /^\s*(?:[-*]\s*)?\[diag\]\s*([^:：]+)[:：]\s*(.*)$/i.exec(line)
          if (match && readingDiagnosis) {
            const name = match[1].trim().replace(/\*\*/g, '')
            const normalized = name.toLowerCase().replace(/[ -]+/g, '_')
            const key = DIAGNOSIS_DIMENSIONS.includes(normalized) ? normalized : DIAGNOSIS_ALIASES[name]
            if (!key) warnings.add('unknown_dimension')
            else if (match[2].trim()) {
              if (found[key]) warnings.add('duplicate_dimension')
              found[key] = match[2].trim()
            }
            continue
          }
          if (!marker && line.trim() && !/^\s*\[diag\]/i.test(line)) readingDiagnosis = false
          // 不把无值或尚未传完的诊断行展示为改写正文。
          if (!/^\s*(?:[-*]\s*)?\[diag\]/i.test(line)) remaining.push(line)
        }
        let prompt = marker ? text.slice(marker.index + marker[0].length) : hasLeadingDiagnosis ? remaining.join('\n') : text
        if (streaming) {
          const lines = prompt.split('\n')
          const tail = lines.at(-1).trim().toUpperCase()
          if (tail && ('[DIAG]'.startsWith(tail) || /^\[DIAG\]/.test(tail) || '===PROMPT==='.startsWith(tail))) lines.pop()
          prompt = lines.join('\n')
        }
        const diagnosis = Object.fromEntries(DIAGNOSIS_DIMENSIONS.filter(key => found[key]).map(key => [key, found[key]]))
        const missingDimensions = DIAGNOSIS_DIMENSIONS.filter(key => !found[key])
        if (hasLeadingDiagnosis && !marker) warnings.add('missing_separator')
        return {
          diagnosis: Object.keys(diagnosis).length ? diagnosis : null,
          prompt: prompt.trim(),
          diagnosisMeta: { status: missingDimensions.length === 0 ? 'complete' : Object.keys(diagnosis).length ? 'partial' : 'missing', missingDimensions, warnings: [...warnings] },
        }
      }

      /* ================= dsh-promptkit 诊断缺口分类与完整草稿键 ================= */
      // 新协议明确区分检查通过与缺口；旧输出只过滤明确、完整的无问题表述。
      function diagnosisFinding(value, dimension) {
        const text = String(value || '').trim()
        if (!text || /^\[OK\]/i.test(text)) return null
        if (/^\[GAP\]/i.test(text)) return text.replace(/^\[GAP\]\s*/i, '').trim() || null
        const plain = text.replace(/[。.!！；;]+$/, '').trim()
        if (/^(?:无|没有|无问题|无明显问题|未发现问题|不适用|none|n\/a|no issues?)$/i.test(plain)) return null
        if (dimension === 'hidden_premise' && /^(?:(?:无|没有|不存在|未发现)(?:明显的?|额外的?)?(?:隐含前提|隐含假设|未言明的假设)|no (?:hidden|unstated) (?:assumptions|premises)(?: found)?)$/i.test(plain)) return null
        if (dimension === 'falsifiability' && /^(?:(?:所有|各项)?(?:要求|目标|验收条件|验收标准)?(?:均|都|已)?(?:可验证|可测试|可判定|可以验证|可以测试)|(?:all )?requirements are (?:testable|verifiable|falsifiable))$/i.test(plain)) return null
        return text
      }

      // 使用完整文本的可逆键，避免短前缀或哈希碰撞把不同任务合并。
      function diagnosisFingerprint(dimension, draft) {
        return `${dimension}:v2:${JSON.stringify(String(draft || '').trim())}`
      }

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

          // 模板变量：Vault 条目里的 {{name}} 占位符。返回去重后的变量名列表（保留首次出现顺序）。
          function templateVariables(body) {
            const seen = new Set()
            const names = []
            for (const match of String(body || '').matchAll(/\{\{\s*([A-Za-z_][\w-]*)\s*\}\}/g)) {
              if (seen.has(match[1])) continue
              seen.add(match[1])
              names.push(match[1])
            }
            return names
          }

          // 用 values 填充 {{name}}；未提供值的变量保留原样（用户可发送前手填）。
          // values 是 { name: value } 映射；未知变量一律不动，避免误伤普通花括号文本。
          function fillTemplateVariables(body, values = {}) {
            return String(body || '').replace(/\{\{\s*([A-Za-z_][\w-]*)\s*\}\}/g, (raw, name) => {
              const value = values[name]
              return value == null || String(value).trim() === '' ? raw : String(value)
            })
          }

          // 草稿里的 skill 引用记号：行首或空白后的 /tdd、/code-review 这类斜杠命令。
          // 排除 /pk（本插件自己的命名空间）和纯路径（含 . 或以字母数字段连接的文件名特征）。
          function skillMentions(draft) {
            const seen = new Set()
            const skills = []
            for (const match of String(draft || '').matchAll(/(?:^|\s)(\/[A-Za-z][\w-]{0,30})(?=\s|$)/g)) {
              const name = match[1]
              if (name.toLowerCase() === '/pk' || seen.has(name)) continue
              seen.add(name)
              skills.push(name)
            }
            return skills
          }

          // 改写后 skill 引用丢失检查：before 里有、after 里没有的引用，原样补到末尾。
          // 返回 null 表示无需修复（所有引用都保留了），调用方可据此跳过。
          function restoreLostSkillMentions(before, after) {
            const lost = skillMentions(before).filter(name => !skillMentions(after).includes(name))
            if (!lost.length) return null
            return `${String(after || '').trimEnd()}\n\n## 技能引用\n\n${lost.join('、')}（改写时请保留这些技能调用记号）`
          }

          // 语义增强输出的轻量分段：模型可能已经输出 Markdown 结构；这里只把无结构的
          // 连续文本按空行切段，供流式面板逐段上屏。有 Markdown 标题/列表的段落原样保留。
          function splitOutputSegments(text) {
            return String(text || '')
              .split(/\n{2,}/)
              .map(part => part.trim())
              .filter(Boolean)
          }

          // 自动增强的发送拦截判定：只在「普通 Enter、无修饰键、草稿非空、开关开启」时拦截。
          // Shift+Enter（换行）、⌘/Ctrl+Enter、IME 组合输入中的 Enter 一律放行，绝不吞发送。
          function shouldInterceptSend({ event, draft, enabled }) {
            if (!enabled) return false
            if (!event || event.key !== 'Enter' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false
            if (event.isComposing || event.keyCode === 229) return false
            return Boolean(String(draft || '').trim())
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

          // 轻量增强模板的语义展示名：内置模板是单轮整形，与多轮方法名实不符，
          // 展示用语义名（链路审查/排障收敛/开发收敛/决策权衡），内部仍按方法名联动推荐。
          const TEMPLATE_LABELS = {
            '第一性原理': '链路审查',
            '苏格拉底式提问': '排障收敛',
            '用最小实验替代空想': '开发收敛',
            '双向钢人论证': '决策权衡',
          }
          function buildSignatures(methods) {
            const signatures = {}
            for (const method of list(methods)) {
              const keywords = method?.triggerKeywords || method?.keywords
              if (method?.title && keywords?.length) signatures[method.title] = {
                triggers: keywords,
                strong: new Set(method?.strongTriggerKeywords || []),
              }
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
            for (const [title, signature] of Object.entries(signatures)) {
              // 统一计分制（P1-2，2026-08）：内置方法与场景卡方法使用同一套强/弱信号规则，
              // 不再"内置计分、扩展一命中即判"双轨。强命中 ≥1 或弱命中 ≥2 判定为候选；
              // 同一方法的候选命中按强→弱排序交由上层按命中顺序取主方法。
              const strong = signature.strong ? signature.triggers.filter(token => signature.strong.has(token) && source.includes(token)) : []
              const weak = signature.triggers.filter(token => !signature.strong?.has(token) && source.includes(token))
              if (strong.length >= 1 || weak.length >= 2 || (singleTriggerTitles.has(title) && weak.length >= 1)) hits.push({ title, signals: [...strong, ...weak], strongCount: strong.length })
            }
            // 多个候选时：唯一强命中者优先；否则按命中信号总数降序，作为主方法候选顺序。
            hits.sort((a, b) => {
              const sa = a.strongCount > 0 ? 1 : 0
              const sb = b.strongCount > 0 ? 1 : 0
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
            // 没有命中时不再用“苏格拉底式提问 / 第一性原理”兜底。兜底会让普通短问题
            // 被误包装成多轮问诊或深度审查，用户看到的是模板意图，不是可靠的判断。
            return []
          }

      // 宿主快照兼容层：旧宿主传 `{ nodes: [] }`，DSH 0.1.2+ 传
      // `{ order: [], nodes: MapLike }`。公共 utils 不能因宿主升级而静默丢失会话。
      function snapshotNodes(snapshot) {
        if (Array.isArray(snapshot?.legacy?.nodes)) return snapshot.legacy.nodes
        const rawNodes = snapshot?.nodes
        if (Array.isArray(snapshot?.order) && typeof rawNodes?.get === 'function') {
          return snapshot.order.map(key => rawNodes.get(key)).filter(Boolean)
        }
        return list(rawNodes)
      }

      function conversationDraft(snapshot) {
        const nodes = snapshotNodes(snapshot)
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
        const legacy = snapshot?.legacy ?? snapshot
        const keyed = Array.isArray(legacy?.order) && typeof legacy?.nodes?.get === 'function'
        const nodes = keyed ? legacy.order : snapshotNodes(legacy)
        const messages = []
        // The launcher only ever renders a small recent window. Scan backwards
        // and stop once it is full so a long-lived DSH session stays responsive.
        for (let index = nodes.length - 1; index >= 0 && messages.length < limit; index -= 1) {
          const node = keyed ? legacy.nodes.get(nodes[index]) : nodes[index]
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

      /* ================= dsh-promptkit core: AssetProvider ================= */
      // AssetProvider：可复用提示词、片段与结论的资产库抽象。
      // 它与 MethodProvider 并列，避免把方法定义、运行历史和用户沉淀混为一种数据。

      class AssetProvider {
        /** @returns {Promise<Array<{id:string,type:string,title:string,body:string,tags:string[],project?:string,parentId?:string,note?:string,createdAt:number,updatedAt:number,lastUsedAt?:number,favorite?:boolean,provenance?:object}>>} */
        async list() { throw new Error('AssetProvider.list() 未实现') }
        async getById(id) { return (await this.list()).find(item => item.id === id) || null }
        async search(query) {
          const q = String(query || '').trim().toLowerCase()
          const rows = await this.list()
          return !q ? rows : rows.filter(item => [item.title, item.body, item.note, ...(item.tags || [])].join('\n').toLowerCase().includes(q))
        }
        async save(asset) { throw new Error('AssetProvider.save() 未实现') }
        async remove(id) {}
        async toggleFavorite(id) { return null }
        async markUsed(id) { return null }
        async export() { return JSON.stringify({ version: 1, assets: await this.list() }, null, 2) }
        async import(raw) { throw new Error('AssetProvider.import() 未实现') }
        onChange(callback) { return () => {} }
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

        /** 自动增强仅拦截本输入框的发送键；宿主需显式识别目标节点。 */
        isInputTarget(target) { return false }

        /** 选区变化订阅（可选），让预览与执行使用同一个片段。 */
        onSelectionChange(cb) { return () => {} }

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
         * @param {{ draft:string, extra?:string, lang?:string, kind?:'light'|'semantic',
         *           strength?:'low'|'mid'|'high', hasContext?:boolean, method?:object }} input
         * @returns {Promise<{ prompt:string, model?:string, diagnosis?:object|null }>}
         */
        async enhance(input) { throw new Error('Enhancer.enhance() 未实现') }

        /**
         * 可选实现：流式增强。组件检测到此方法时走逐段上屏；
         * 仅抛出 fallback=true 且尚未输出时退回 enhance()；中途失败或取消不重复调用。
         * @param {typeof input & { onDelta?:(text:string)=>void }} input
         * @returns {Promise<{ prompt:string, model?:string, diagnosis?:object|null }>}
         */
        async enhanceStream(input) { throw Object.assign(new Error('Enhancer.enhanceStream() 未实现'), { fallback: true }) }

        /** 取消进行中的增强 */
        cancel() {}
      }

      /* ================= dsh-promptkit 内置方法库（12 个完整 Markdown 方法，构建时内联 JSON） ================= */
      // 完整方法库：从 methods/ 目录解析的 21 个 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
      // 在 DSH 插件形态中，build-client.mjs 会把 builtin.json 内联为常量注入（stripBuiltinJs），
      // 此时本文件的运行时加载分支不会执行。

      const _builtin = [{"id":"双向钢人论证","title":"双向钢人论证","category":"决策","purpose":"有答案但不知道选哪个时，做决策用","tags":["提示词","决策","双向钢人论证"],"triggerKeywords":["方案","选型","取舍","哪个好","是否","比较","对比","决策","选择","风险"],"strongTriggerKeywords":["选型","取舍","哪个好","对比","决策"],"prompt":"我需要做的决定是：【写清问题、两个选项、目标和现实约束】。\n\n先别急着回答，也别默认我已经把问题想清楚。请先做一次双向钢人论证：\n\n1. 用最完整、有力的方式，重述我真正需要做出的选择；\n2. 分别给出支持两个方向的最强理由、适用条件、最大收益、最大风险，以及最难回答的反对意见；\n3. 找出双方真正的分歧、最可能改变结论的关键变量，以及还需要补充的信息；\n4. 只问我一个最可能改变结论的问题。\n\n等我回答以后，再给出明确判断、理由、适用条件和下一步行动。","mode":"guided","outcome":"先问一个最可能改变结论的问题，回答后给出明确判断与下一步行动"},{"id":"用最小实验替代空想","title":"用最小实验替代空想","category":"决策","purpose":"用最小实验替代空想，迈出第一步，看现实反馈","tags":["提示词","决策","最小实验"],"triggerKeywords":["实现","开发","修改","重构","新增","优化"],"strongTriggerKeywords":[],"prompt":"我正在纠结的是：【填写你的选择或想法】。\n\n请先找出这个决定背后最需要验证的3个假设，再选出最可能改变最终结论的那一个。\n\n围绕这个假设，帮我设计一个低成本、可逆、能在【7天或你能接受的周期】内完成的最小实验。\n\n请写清：\n1. 具体要做什么；\n2. 需要投入多少时间和资源；\n3. 观察什么指标；\n4. 什么结果支持继续；\n5. 什么结果提醒我停止；\n6. 实验结束后能获得什么新信息。\n\n最后告诉我，明天就能开始的第一个动作是什么。","mode":"structured","outcome":"一个最小可行实验方案与验证标准"},{"id":"事实核查","title":"事实核查","category":"学习","purpose":"核查观点、结论、数据、方案的真假与逻辑漏洞","tags":["提示词","学习","事实核查"],"triggerKeywords":["核查","核实","证据","真伪","来源","数据验证"],"strongTriggerKeywords":["核查"],"prompt":"我要核查的说法是：【粘贴观点、结论、数据或方案】。\n\n请先把它拆成：\n1. 可以被外部验证的事实；\n2. 从事实推出的结论；\n3. 其中包含的价值判断。\n\n对于事实部分，请联网核查来源、样本、时间和完整上下文，并标记为：\n1. 已证实；\n2. 基本成立，但需要收窄；\n3. 存在争议；\n4. 证据不足；\n5. 明显错误。\n\n在假设相关事实成立的情况下，继续检查：\n1. 这些事实能否推出当前结论；\n2. 是否藏着未经验证的假设；\n3. 是否混淆相关性和因果关系；\n4. 是否遗漏了其他解释或关键信息；\n5. 结论在什么条件下成立或失效。\n\n最后请输出：\n1. 哪些事实可信，哪些需要修正；\n2. 推理链中最关键的漏洞；\n3. 补强后的最合理版本；\n4. 我目前可以相信到什么程度。","mode":"structured","outcome":"逐条核查结论：属实 / 存疑 / 不实，并给出依据"},{"id":"双层解释法","title":"双层解释法","category":"学习","purpose":"分小白/专业两层解释，避免停留在\"好像懂了\"阶段","tags":["提示词","学习","双层解释"],"triggerKeywords":["科普","讲给外行","通俗解释","小白版","入门实例"],"strongTriggerKeywords":["科普"],"prompt":"我想学习的是：【填写概念或问题】。\n\n请分两层解释：\n\n第一层，小白版。\n用生活化的语言和一个具体例子，让完全没有基础的人也能听懂。\n\n第二层，专业版。\n使用准确术语，讲清核心机制、适用边界和常见误解。\n\n最后请整理出：\n1. 列出小白说法与专业术语的对应关系；\n2. 我最容易理解错的地方；\n3. 3个用于检查我是否真正理解的问题。","mode":"structured","outcome":"小白版 + 专业版双层解释"},{"id":"反向拆解","title":"反向拆解","category":"学习","purpose":"拆解优秀成品，学习它为什么有效","tags":["提示词","学习","反向拆解"],"triggerKeywords":["逆向拆解","拆解案例","对标分析","为什么要写","复用思路"],"strongTriggerKeywords":["逆向拆解"],"prompt":"我想拆解的优秀范例是：【粘贴产品页面、网页、方案、流程说明、数据看板或其他成品】。\n我想学会的是：【填写你希望从中学会什么】。\n\n请先用一句话说明它解决了什么问题，再反向拆解它为什么有效。\n\n重点分析：\n1. 它服务谁，目标是什么；\n2. 它采用了什么结构或流程；\n3. 哪些关键选择拉开了质量差距；\n4. 它的完成标准是什么；\n5. 哪些规律可以迁移，哪些细节只适合这个案例。\n\n最后请给我：\n1. 提炼3到5条可复用规律；\n2. 一份可以照着执行的操作清单；\n3. 一个最值得先尝试的小练习。","mode":"structured","outcome":"成品为何有效的底层机制拆解清单"},{"id":"横纵分析法","title":"横纵分析法","category":"学习","purpose":"用横纵两条轴对陌生领域做深度研究，半小时建立框架","tags":["提示词","学习","横纵分析","深度研究"],"triggerKeywords":["横纵","纵向","横向","陌生领域","行业盘点","研究框架"],"strongTriggerKeywords":["横向","纵向"],"prompt":"研究对象是：【填写产品、公司、人物、技术、行业或事件】。\n\n请使用横纵分析法，对它完成一份可追溯的深度研究。研究截止时间为执行当天。\n\n纵向分析：\n1. 它在什么背景和需求下诞生，关键推动者是谁；\n2. 它经历了哪些重要转折、成功和失败；\n3. 哪些早期选择变成了今天的能力、路径依赖或包袱。\n   \n横向分析：\n1. 选择最值得比较的对象，并说明为什么选它们；\n2. 用统一维度比较各自的强项、短板和独特性；\n3. 解释用户、客户或市场为什么选择它，又为什么放弃它。\n\n把两条轴合起来，继续判断：\n1. 过去形成的能力、路径依赖和约束会怎样影响未来；\n2. 未来最可能出现哪3条路径；\n3. 每条路径出现的前提和预警信号是什么。\n\n请遵守这些证据规则：\n1. 优先使用官方资料、原始数据、论文、财报和访谈等一手来源；\n2. 重要结论就近标注来源与日期；\n3. 事实、推断和观点分开写；\n4. 遇到冲突信息时并列呈现，找不到证据时明确写\"暂未核实\"。\n\n最后按以下顺序输出：核心结论、关键时间线、横向对比表、详细分析、未来判断、仍待确认的问题。报告需要在10000～30000字之间，语言尽量通俗，不要堆砌资料。","mode":"structured","outcome":"陌生领域的纵横框架与研究地图"},{"id":"论文深度拆解","title":"论文深度拆解","category":"学习","purpose":"深度学习一篇论文，按研究问题/方法/实验/局限/可复现性拆成可执行要点","tags":["提示词","学习","论文拆解"],"triggerKeywords":["论文","文献","paper","期刊","精读","拆解论文","复现","审稿"],"strongTriggerKeywords":["论文","文献","精读"],"prompt":"请把这篇论文拆解成一份可复用的档案。信息如下：\n【粘贴论文标题、摘要、原文节选，或告诉我要拆解的论文】\n\n按这个顺序输出：\n\n1. 一句话贡献——这篇论文做了什么事，和已有方法比，真正的差异点是什么；\n2. 问题与研究线——它解决什么问题，为什么这是个真问题，跟主流方案的位置关系；\n3. 方法——把方法拆到\"能讲给别人听\"的粒度：模型/框架/关键公式/训练与推断流程；与标准方法的差异点；\n4. 实验与证据——数据集、基线、指标、消融实验；哪些证据强、哪些弱、是否有统计显著性说明；\n5. 局限与盲区——作者自承认的局限 + 你没看到验证的盲区 + 它没说清的假设；\n6. 可复现性评估——需要的依赖/超参/算力、原始数据可得性、复现最可能卡在哪；\n7. 我能怎么用——把论文对接成具体建议：可借用方法 / 可补的实验 / 可避免的坑，按重要度排序。\n\n规则：\n- 只基于我提供的论文内容与它的信息；你记忆中关于它的常识要用的时候标【常识】，不确定标【待确认】；\n- 事实、论文的声称、你自己的推断三者分开写；\n- 输出 400-800 字左右正文，最后给我\"下一步值得看的 3 篇或问题\"。","mode":"structured","outcome":"论文拆解档案（贡献/方法/证据强度/局限/可复现性）"},{"id":"代码评审","title":"代码评审","category":"技术开发","purpose":"对代码做一次系统化评审，按意图/正确性/安全/性能/可维护五层过一遍","tags":["提示词","技术开发","代码评审"],"triggerKeywords":["代码评审","代码审查","code review","评审代码","走查","PR 评审","review"],"strongTriggerKeywords":["代码评审","代码审查","code review"],"prompt":"请对下面的代码做一次系统评审：【粘贴代码；有上下文或依赖说明时也放进来】。\n\n按下面的顺序逐层检查，不要跳层：\n\n第一层：意图——这段代码要解决什么问题，输入输出是什么，是否达到了它的目的；\n第二层：正确性——逻辑漏洞、边界情况（空值、越界、超时、并发）、异常处理、off-by-one；\n第三层：安全——注入（SQL / XSS / 命令）、未验证的输入、敏感信息泄露、越权访问；\n第四层：性能与并发——复杂度、死锁、连接 / 内存泄漏、缓存一致性、不必要的 IO；\n第五层：可维护性——命名、重复代码、职责拆分、测试覆盖、注释与实际行为是否一致。\n\n输出：\n1. 按【阻断 / 高 / 中 / 低】分四档列出问题，每条给出：位置（行号或函数名）、为什么严重、具体的修改建议（含代码）；\n2. 已做对的、值得保留的部分简单列一下；\n3. 最后给出\"必须现在改\"和\"可以后面跟进\"的两个清单。\n\n规则：\n- 只基于给定的代码与上下文给出，资源/依赖未说明时标【待确认：…】，不要脑补架构；\n- 对每条建议给出修改后代码，别只说\"建议优化\"；\n- 结论放最前面。","mode":"structured","outcome":"按严重程度分档的代码评审报告"},{"id":"技术方案设计","title":"技术方案设计","category":"技术开发","purpose":"从需求到可落地的技术方案，明确边界、模块、接口、风险与验收","tags":["提示词","技术开发","技术方案"],"triggerKeywords":["技术方案","技术评审","接口设计","接口方案","接口评审","模块拆分","系统设计","落库设计","方案评审"],"strongTriggerKeywords":["技术方案","接口设计","接口方案","接口评审"],"prompt":"我要做一个技术方案，需求是这个：【写清目标、现状、约束条件】。\n\n请按下面顺序产出一份可以直接评审的技术方案：\n\n1. 目标与边界——我到底要解决什么；明确\"本期不做\"的事；\n2. 现状与约束——现有系统/技术栈/依赖、上线窗口、可用资源；\n3. 模块与职责——拆成哪几个模块，各自职责、相互依赖方向；\n4. 关键设计——数据模型 / 接口 / 状态机 / 并发与一致性，每个决策给理由；\n5. 风险与备选——每个关键决策列出备选方案、放弃它们的原因、剩余风险；\n6. 实施步骤——按依赖排序的增量步骤，每一步可验证的结果是什么。\n\n规则：\n- 已有确定性信息与\"需要验证的假设\"分开标注；不确定的写【待确认：…】，不要自行假设；\n- 关键决策必须给\"为什么选它、不选什么、什么时候它失效\"；\n- 最后单独给\"最值得先验证的 3 个点\"，不要塞进正文。","mode":"structured","outcome":"可评审的技术方案（目标/边界/模块/关键设计/风险/步骤）"},{"id":"接口文档生成","title":"接口文档生成","category":"技术开发","purpose":"从代码定义或口头需求生成可直接对接的接口文档（请求/响应/示例/边界）","tags":["提示词","技术开发","接口文档"],"triggerKeywords":["接口文档","API 文档","接口规范","API 接口","文档生成","接口对接"],"strongTriggerKeywords":["接口文档","API 文档"],"prompt":"根据下面的接口信息，生成一份可直接交接的接口文档：【粘贴接口签名、路由、Schema、已有注释，或直接描述接口需求】。\n\n文档包含：\n\n1. 请求总览——方法、路径、鉴权方式、Content-Type；\n2. 请求参数表——字段名 / 类型 / 必填 / 说明 / 默认值 / 枚举值，按 path / header / query / body 分组；\n3. 响应结构——成功响应体字段表 + 示例；错误码表（对应什么场景、调用方如何处理）；\n4. 完整示例——一个真实可用的请求示例 + 对应的成功响应 + 一个失败响应；\n5. 边界与约定——超时、幂等性、限流、分页、敏感字段的脱敏、空值行为。\n\n规则：\n- 只基于你拿到的接口信息书写，缺失字段标【待确认：…】，不要编造或脑补字段；\n- 字段表用 Markdown 表格，示例用代码块；\n- 字段说明要写\"为什么存在\"或\"什么场景使用\"，别只复制类型叫法。","mode":"structured","outcome":"含请求/响应/示例/边界的标准接口文档"},{"id":"数据分析","title":"数据分析","category":"数据分析","purpose":"对数据做体检/探索/结论/行动四段式分析，每个结论标注证据强度","tags":["提示词","数据分析","数据洞察","SQL"],"triggerKeywords":["数据分析","数据洞察","报表解读","相关性","数据可视化","数据清洗","EDA"],"strongTriggerKeywords":["数据分析","数据挖掘"],"prompt":"请对下面的数据/需求做一次完整的数据分析：\n【粘贴数据样例、字段说明、或直接描述你想分析的问题】\n\n按四个阶段输出：\n\n1. 数据体检——列出主要字段、类型、粒度、缺失情况、重复、明显异常；一句话总结这份数据\"能不能用、最要紧的坑在哪\"；\n2. 探索性分析——针对我的目标提出 3-5 个可检验的问题假设；用你能做的方式检查（分组、时间序列、相关性、分布、Top/Bottom）；每个发现写清楚\"你看到了什么\"；\n3. 验证与结论——逐条回答原始问题；每条结论标注证据强度：【数据支持 / 部分支持 / 证据不足 / 与直觉相反】；需要统计检验的地方说明该用什么检验；\n4. 行动建议——给 3 条可执行建议，标清楚每条依赖的数据和前提；缺什么补充数据、什么条件下结论会翻转。\n\n规则：\n- 关键数字注明出处；如果是我没提供的数据，你要么用【估算】标注、要么写\"需要你提供\"；\n- 无法判断的写\"无法判断\"，不要用相似数字补位；\n- 区分\"数据表现的\"与\"我的解释\"；\n- 最后单独给\"这份分析最不能确定的部分\"。","mode":"structured","outcome":"四段式分析报告（体检/探索/结论/行动）"},{"id":"专家会诊","title":"专家会诊","category":"解决问题","purpose":"让 AI 组一个真正互补的小型专家团，再让他们互相挑战","tags":["提示词","解决问题","专家会诊"],"triggerKeywords":["会诊","多方视角","专家团","互相质疑","不同视角"],"strongTriggerKeywords":["会诊"],"prompt":"我的问题是：【填写问题、已知事实、目标和现实约束】。\n\n先不要直接给方案。请为这个问题选择3种真正互补的专业视角，并说明每种视角为什么必要。\n\n让每种视角分别回答：\n1. 它怎样重新定义这个问题；\n2. 它最推荐的解决路径；\n3. 其他视角最容易忽略的风险；\n4. 什么新证据会让它改变判断。\n   \n然后让三种视角互相质疑，找出：\n1. 共同认可的事实；\n2. 真正的分歧；\n3. 分歧背后的不同假设。\n\n最后请综合输出：\n1. 综合后最推荐的方案；\n2. 适用条件；\n3. 最大风险；\n4. 退出条件；\n5. 第一步行动。\n\n不要选择三个高度相似的身份，也不要模仿或编造真实人物的观点。信息不足时，先只问我一个最关键的问题。","mode":"structured","outcome":"互补专家团的会诊意见与交锋结论"},{"id":"第一性原理","title":"第一性原理","category":"解决问题","purpose":"处理路径依赖，回归问题本质，推倒重来","tags":["提示词","解决问题","第一性原理"],"triggerKeywords":["全链路","链路","整体分析","本质","根因","拆解","架构","审查"],"strongTriggerKeywords":["全链路","链路","本质","根因"],"prompt":"我想解决的问题是：【填写你的问题】。\n\n请用第一性原理把它拆回最底层，区分：\n1. 已经确认、无法绕开的基本事实；\n2. 习惯性接受、却没有验证过的假设；\n3. 真正想实现的目标；\n4. 现实中的资源与约束。\n   \n暂时放下行业惯例和现成方案，只从基本事实、目标和约束出发，重新推导可行路径。\n   \n最后请输出：\n1. 原方案中只在修补表面的部分；\n2. 从基本事实重新推导出的新路径；\n3. 这条路径成立的前提；\n4. 验证它的第一步。","mode":"structured","outcome":"回归问题本质的重新推导与重构方案"},{"id":"跨领域借解","title":"跨领域借解","category":"解决问题","purpose":"从其他领域借解法，拓宽视角","tags":["提示词","解决问题","跨领域"],"triggerKeywords":["跨域迁移","跨界联想","借解","类比迁移","换个思路"],"strongTriggerKeywords":["跨域迁移"],"prompt":"我的困惑是：【说明背景、当前做法、现实约束和具体卡点】。\n\n请先剥掉行业术语，把它抽象成一个人类在其他领域也可能遇到的问题，并找出：\n1. 问题的底层结构；\n2. 真正的核心矛盾；\n3. 普通解法失效的原因。\n   \n然后从历史案例，以及至少3个彼此距离较远的领域中\n\n每个案例都要说明：\n1. 那个领域遇到了什么问题；\n2. 使用了什么解决机制；\n3. 与我的问题相似在哪里；\n4. 哪些部分可以迁移；\n5. 什么条件下会失效。\n\n最后请选出最值得借用的3种机制，把它们翻译成适合我当前处境的解决方案，再推荐一个最值得先试的低成本、可逆实验。","mode":"structured","outcome":"可迁移到当前问题的他领域解法清单"},{"id":"人生设计术","title":"人生设计术","category":"认识你自己","purpose":"基于斯坦福人生设计方法，规划未来，生成《个人人生设计蓝图》","tags":["提示词","认识自己","人生设计"],"triggerKeywords":["人生设计","职业生涯方向","五年","人生规划","奥德赛"],"strongTriggerKeywords":["人生设计"],"prompt":"# Role：人生设计师\n\n## 角色\n你是一位熟悉斯坦福人生设计方法、心流理论和积极心理学的资深人生设计师。你的任务是陪用户把当下的人生当成一个可以反复设计、低成本试错的项目，先看清位置，再找到方向，最后把可能的路真正试出来。\n\n## 目标\n通过多轮深度对话，帮助用户看清自己现在真实的位置，分清无法解决的重力问题与可以动手设计的真问题，最终生成三个完全不同、同样值得认真考虑的五年人生版本，以及马上可以开始的原型行动。最终产出一份极度详细、有温度也够犀利的《个人人生设计蓝图》。\n\n## 核心理念\n1. 人生是设计问题，没有唯一正解。它需要大量尝试、做原型、边走边看；\n2. 重新定义问题。很多人一直在解决一个问错了的问题，找到真问题比急着给答案更重要；\n3. 区分重力问题。年龄、自然规律、整个行业的现实等无法直接改变的事，需要先接受，再把注意力转向可设计的部分；\n4. 数量本身含有质量。好的选择来自足够多的选择；\n5. 激情经常是行动与反馈带来的结果。用户无需先找到命中注定的热爱，才有资格开始；\n6. 人生是一场无限游戏。任何原型都会留下信息，所以人可以对失败免疫。\n   \n## 对话规则\n1. 每轮只问一个问题，采用\"你问 → 用户答 → 你简短而走心地反馈 → 再问下一题\"的节奏；\n2. 使用苏格拉底式追问，多问具体事件、当时的感觉与行动，避免过早下结论；\n3. 保持温暖和接纳，同时敏锐指出用户的逻辑漏洞、自我设限，以及语言与实际行为之间的落差；\n4. 主动区分重力问题和可设计的真问题。承认现实不等于认输，看清边界本身就是设计的一部分；\n5. 不评判用户的选择，也不替用户做决定；\n6. 主问题总数控制在12个以内，可以根据回答灵活调整顺序和追问深度；每个阶段内保持\"1轮1问\"，信息足够就及时进入下一阶段，不要为了凑数硬问。\n   \n## 提问流程\n\n### 第一阶段：你在这里\n1. 请用户给健康、工作、娱乐、爱四个方面分别打0到10分，并说明哪一项亮了红灯。健康包含身体、情绪和心理，娱乐指纯粹为了快乐而做的事，爱强调双向关系；\n2. 问他现在最焦虑、最想解决的人生问题是什么。判断它属于可设计的真问题，还是无法改变的重力问题。如果属于后者，温和地点破，并引导他重新定义成可以行动的问题；\n3. 如果用户状态稳定，可以先征求同意，再邀请他做一次反向推演。让他想象未来五年什么都不改变时，一个普通的周二会怎样度过，再把这幅画面拉到十年后。帮助他看清维持现状的代价。察觉用户处于低谷或情绪脆弱时，跳过这一步。\n   \n### 第二阶段：你的指南针\n1. 询问他的工作观：为什么工作，工作与金钱、他人和世界是什么关系；\n2. 询问他的人生观：什么会让他觉得这一生没有白活，他想怎样与家人和更大的世界连接；\n3. 比较工作观与人生观是否一致，指出冲突、妥协和真正的正北方向。\n   \n### 第三阶段：寻路\n1. 请他回忆最近或过去的心流时刻，追问当时具体在做什么、和谁、处在什么环境；\n2. 区分让他回血的事情、抽干他的事情，以及\"擅长但不热爱\"的事情。\n   \n### 第四阶段：摆脱困境与创造可能\n1. 询问他是否有一个早已失效、却始终不愿放手的执念或方案。找到这个锚问题背后真正想守住的东西；\n2. 陪他生成三个完全不同的五年人生版本：\n   第一个是他已经在走，或者盘算很久的路；\n   第二个是假如第一条路明天彻底消失，他会选择的路；\n   第三个是假如不用考虑钱和他人的评价，他真正想过的生活。\n3. 三个版本都必须是用户真心愿意考虑的A计划，谁也不能成为凑数的备胎。\n   \n## 输出\n当素材足够丰富后，输出一份8000到12000字的《个人人生设计蓝图》，使用以下固定 Markdown 标题层级（小节缺失时跳过，不强行补齐）：\n## 你在这里 / ## 你的指南针 / ## 能量地图 / ## 三个五年版本 / ## 原型行动清单 / ## 失败免疫\n内容自然覆盖：\n1. \"你在这里\"：解读四个仪表盘，指出真正失衡和长期被忽略的部分；\n2. \"真问题\"：重新定义用户最初的困扰，分清重力问题与可设计问题；\n3. \"你的指南针\"：提炼工作观、人生观与两者之间的一致性；\n4. \"你的能量地图\"：总结心流、回血区、高消耗区和未来设计需要偏向的环境；\n5. \"三个奥德赛计划\"：每套配一个简短有力的标题、一条五年时间线、两到三个待验证问题，以及资源、喜欢程度、自信心、一致性四项评估；\n6. 如果用户已经明显倾向其中一个版本，继续把它拆成本季度要验证的核心问题、一个月内能做出的原型、每天可以推进的小动作，以及绝不愿牺牲的底线；\n7. \"原型行动清单\"：设计一次人生对谈、一天到一周的原型体验，以及本周可以迈出的第一小步；\n8. \"失败免疫\"：提醒用户，这三个版本都可以先试再调。原型即使走不通，也会为下一步留下有用信息。\n   \n## 开始\n请用温暖、专业、有共情力的语言开场。先解释这套方法的基本思路、预计需要的时间和希望帮用户达成的目标。告诉用户，他无需先想清楚自己热爱什么，我们会在行动、对话与反馈里慢慢把它找出来。然后进入第一个问题。","mode":"structured","outcome":"《个人人生设计蓝图》"},{"id":"挖掘隐藏天赋","title":"挖掘隐藏天赋","category":"认识你自己","purpose":"通过多轮深度对话，挖掘被忽视或压抑的天赋，生成《个人天赋使用说明书》","tags":["提示词","认识自己","天赋"],"triggerKeywords":["天赋","擅长","优势","自我剖析","性格特质"],"strongTriggerKeywords":["天赋"],"prompt":"# Role：深度天赋挖掘机\n\n## 角色\n你是一位熟悉盖洛普优势识别体系、心流理论与荣格心理学的资深生涯咨询师。你相信天赋是一种可以迁移的底层能力，它经常藏在一个人的怪癖、缺点、嫉妒、无意识胜任区和能量模式里。\n\n## 目标\n通过多轮深度对话，帮助用户找到被忽视或压抑的天赋，最终生成一份极度详细、专业且有共情力的《个人天赋使用说明书》。\n\n## 核心理念\n1. 反宿命论。天赋不等于某个固定技能，也不会因为年龄增长而过期；\n2. 能量审计。真正的天赋往往会让人回血。一个人单纯擅长、做完却极度消耗的事情，需要单独区分；\n3. 阴影即宝藏。那些从小反复被批评的缺点、难以改变的怪癖，以及对他人的嫉妒，可能是天赋被压抑后的背面。\n   \n## 对话规则\n1. 每次只问一个问题。必须采用\"你问 → 用户答 → 你简短反馈 → 再问下一题\"的节奏；\n2. 使用苏格拉底式追问。多问\"当时几岁\"\"具体发生了什么\"\"你是什么感觉\"\"为什么会这样做\"，避免根据一句话仓促贴标签；\n3. 保持温暖、共情和敏锐。发现矛盾、伪装或潜意识线索时，可以直接指出，但不要用空泛赞美安慰用户；\n4. 所有判断都要对应用户讲过的具体经历。证据不足时明确使用\"可能\"，并继续追问；\n5. 全程最多10个主问题，可以根据回答改变顺序或增加追问，但必须覆盖下面四条主线。\n   \n## 必须覆盖的主线\n1. 16岁以前，有哪些事情是没人要求也会废寝忘食去做的？有哪些从小反复被批评、一直改不掉的\"顽固缺点\"？\n2. 成年后的工作或生活中，哪些事情会让用户觉得\"这还需要学吗\"，周围人却普遍觉得困难？寻找他的无意识胜任区；\n3. 哪些事情做完以后，身体虽然累，精神却极度亢奋？哪些事情他做得很好，却会明显抽干能量？\n4. 用户曾经强烈嫉妒过谁，或者羡慕过哪种生活状态？继续追问他真正渴望的是对方身上的什么。\n   \n## 输出\n当信息足够丰富后，输出一份一万字左右的《个人天赋使用说明书》，建议使用以下 Markdown 标题层级（小节名可微调）：\n## 底层天赋 / ## 天赋的阴影面 / ## 能量地图 / ## 适合的环境 / ## 落地路径 / ## 30天实验清单\n结构可以根据用户的回答自由组织，但必须覆盖：\n1. 最有证据支撑的底层天赋，以及每一项天赋对应的经历链；\n2. 天赋的阴影面，它过去为什么会被误解成缺点；\n3. 用户的能量地图、无意识优势区和高消耗区；\n4. 这些天赋最容易发挥、最容易失效的环境；\n5. 适合他的工作方式、合作方式、职业方向和现实限制；\n6. 接下来30天可以尝试的低成本实验，用现实反馈继续验证这些判断。\n   \n## 开始\n请用温暖、专业、通俗的语言向用户说明接下来的流程、大概需要的时间和希望达成的目标。告诉他：\"天赋永远不会过期，我们只是要找到你的底层天赋。\"然后进入第一个问题。","mode":"guided","outcome":"《个人天赋使用说明书》"},{"id":"苏格拉底式提问","title":"苏格拉底式提问","category":"问清问题","purpose":"通过苏格拉底式追问，帮你找到真正值得回答的问题","tags":["提示词","问清问题","苏格拉底式提问"],"triggerKeywords":["报错","异常","失败","为什么","原因","排查"],"strongTriggerKeywords":["报错","异常","排查"],"prompt":"我的困惑是：【尽量具体地描述发生了什么、你怎么理解，以及你卡在哪里】。\n先不要给建议。请对我进行一次苏格拉底式问诊，通过最多6个问题，帮我找到真正值得回答的问题。\n\n请遵守这些规则：\n1. 每次只问一个问题，根据我的回答决定下一问，不要提前给我一整套问卷；\n2. 优先区分我说的是可验证的事实、对事实的解释、价值判断，还是我希望实现的目标；\n3. 检查关键词是否含糊、我默认了哪些前提、证据来自哪里、有没有相反解释，以及结论成立或不成立分别意味着什么；\n4. 每次提问前，用一句话说明上一条回答让你更新了什么判断；\n5. 只问可能改变结论的问题。信息足够时立刻停止，不必凑满6个。\n\n问诊结束后，请整理出：\n1. 我最开始问的问题；\n2. 我真正想解决的问题；\n3. 已经确认的事实；\n4. 仍未验证的假设；\n5. 最可能改变结论的关键变量；\n6. 一个准确、具体、可以继续行动的新问题。\n\n等我确认这个新问题以后，再给出你的判断、理由和下一步行动。","mode":"guided","outcome":"通过多轮追问澄清出真正值得回答的问题"},{"id":"需求分析","title":"需求分析","category":"需求分析","purpose":"把已听懂的需求加工成可评审的规格说明：功能清单、边界条件、业务规则与优先级","tags":["提示词","需求分析","需求规格化"],"triggerKeywords":["需求分析","需求规格","需求文档","写需求","业务需求","需求整理","需求梳理"],"strongTriggerKeywords":["需求分析","需求文档","需求规格","写需求"],"prompt":"下面这条需求我已经基本理解了：【粘贴原始需求，以及已有需求理解档案/澄清记录（如有）】。\n\n请完成一次需求分析，输出一份《规格摘要》。要求：所有判断区分「已确认事实」与「我的推断」，推断一律标注【推断：…】；残缺信息标【待确认：…】；不要编造。\n\n1. 功能点清单——把需求拆成相互独立、可单独验收的功能点，每项包含：名称 / 一句话描述 / 触发场景 / 明确产出；\n2. 边界条件——每个功能点的正常流程、边界值、无输入/非法输入/重复触发时的行为；\n3. 业务规则——把隐含在被忽视话里的规则显式化（例如定价、权限、时限、状态流转），按「若…则…否则…」描述；\n4. 非功能需求——性能、安全、合规、兼容、可用性等约束，没有就明确写\"暂无，需确认\"；\n5. 冲突与取舍——功能点之间或不同角色之间的冲突，标注冲突点、受影响的决策、可选的取舍方案；\n6. 优先级——用 MoSCoW 法（Must/Should/Could/Won't）给每个功能点定级并说明理由；\n7. 待确认项清单——按影响范围从大到小排出所有未定的决策点。\n\n规则：\n- 只做规格化，不写技术实现方案；\n- 区分\"用户事实\"与\"我方推断\"；\n- 一条需求若有多个合解读，列为两种然后让需求方拍板，而不是自己取一个。","mode":"structured","outcome":"可评审的需求规格摘要（功能点/边界/业务规则/优先级/待确认项）"},{"id":"需求拆解","title":"需求拆解","category":"需求分析","purpose":"把一条需求切成可开工的用户故事与验收标准，并拆出最小可交付切片","tags":["提示词","需求分析","需求拆解","用户故事"],"triggerKeywords":["需求拆解","需求拆分","用户故事","需求细化","任务拆分","验收标准"],"strongTriggerKeywords":["需求拆解","需求拆分","用户故事"],"prompt":"请把下面这条需求拆解成可开工的用户故事：【粘贴需求描述，或已写好的规格/需求理解档案】。\n\n拆解结果要求如下：\n\n1. 用户故事集——以「作为一个【角色】，我希望【功能】，以便【价值】」的格式输出，每个故事只包含一个可独立交付的价值点；价值相同只留一个，不重复拆分；\n2. 验收标准——每个故事配 2~4 条 Given / When / Then，额外描述该功能的：正常路径、边界值、异常输入、重复触发；\n3. 优先级切片——按依赖关系与价值给故事排序，标出：最先交付的最小切片（能形成最小闭环的一组故事）、后续增量；\n4. 依赖清单——故事之间谁阻塞谁，用「A 依赖 B」列出；\n5. 过细提醒——如果某个故事在拆分中失去独立价值，或拆出来的子项无法单独验收，指出并建议合并。\n\n规则：\n- 验收标准必须可以被测试用例直接翻译，避免\"系统正常工作\"这类不可验收的表述；\n- 优先考虑真实用户的角色，而不是内部模块；\n- 只拆解，不做技术方案设计。","mode":"structured","outcome":"用户故事集 + 验收标准（Given/When/Then）+ 最小可交付切片"},{"id":"需求理解","title":"需求理解","category":"需求分析","purpose":"把模糊、一句话的需求真正\"听懂\"：挖出隐含假设、真实诉求与约束","tags":["提示词","需求分析","需求理解"],"triggerKeywords":["需求理解","理解需求","需求背后","真正的需求","一句话需求","需求模糊"],"strongTriggerKeywords":["需求理解","理解需求","需求背后"],"prompt":"这个需求是这样描述的：【写下原始描述，越接近用户原话越好】。\n\n先不要写方案。你是一位资深需求分析师，请通过最多8轮追问，把这个需求真正听懂。每一轮遵守：\n\n1. 每次只问一个问题，根据上一条回答决定下一问，不要一次性抛出问卷；\n2. 优先梳理这四个层面：\n   - 真实诉求——用户最终想要的价值结果是什么，而不是他提的实现手段；\n   - 隐含假设——需求里默认了哪些前提、哪些你以为\"当然如此\"其实没验证；\n   - 利益相关方——谁会用、谁会买单、谁会被影响，各方的目标是否冲突；\n   - 现实约束——时间、成本、技术、合规、既有系统的不变量。\n3. 每问一次，用一句话说明你更新了对哪个层面的判断；\n4. 只问能改变结论的问题；信息足够立刻停止，不要凑满8轮。\n\n追问结束后输出一份\"需求理解档案\"：\n1. 我的原话（用户原始说法）；\n2. 真实诉求（一句话）；\n3. 已确认的前提；\n4. 仍待验证的假设；\n5. 利益相关方的目标冲突点（如有）；\n6. 最可能改变需求方向的一个未知项。\n\n档案确认后再进入下一步（方案设计/排期/评估）。","mode":"guided","outcome":"《需求理解档案》：真实诉求/已确认前提/待验证假设/冲突点/最可能改变方向的未知项"},{"id":"需求评审","title":"需求评审","category":"需求分析","purpose":"评审需求的可开工度：完整性、歧义、可测试性、一致性与范围蔓延","tags":["提示词","需求分析","需求评审"],"triggerKeywords":["需求评审","评审需求","需求检查","需求问题","需求审查","可测试性"],"strongTriggerKeywords":["需求评审","评审需求"],"prompt":"请评审下面这条需求的可开工度：【粘贴需求描述/用户故事/规格摘要】。\n\n请按五个维度评审，每个维度给出：评分（0-5，5=没有问题）、问题清单、修改建议：\n\n1. 完整性——是否有缺失的角色、场景或异常分支？是否有\"大家都懂但没写出来\"的默认前提？\n2. 无歧义性——同一概念是否被多种叫法/多种理解？数值、时间、许可、状态流转是否有明确口径？\n3. 可测试性——每一条能否直接翻译成测试用例？是否存在\"系统正常\"\"体验良好\"这类永远测不过的验收表述？\n4. 一致性——各功能点、各角色目标之间是否有冲突或互相推翻？与既有规则/系统是否一致？\n5. 优先级与范围——是否范围蔓延（Won't 混入 Must）？有没有未定义的优先级，或需要裁剪/合并的项？\n\n最后输出评审结论：\n1. 问题清单（按 严重 / 中等 / 轻微 分档，每项附：位置、为什么是问题、建议修改）；\n2. 最可能引发返工的前 3 个问题；\n3. 明确结论：这条需求是否已达到\"可开始开发\"，若未达到，列出必须先补的【待确认：…】项。\n\n规则：\n- 只评审需求文本本身，不臆测开发实现；\n- 每一条结论都要引述原文或原文缺失，便于对照；\n- 查不出来就写\"未见明显问题\"，不要凑数式提意见。","mode":"structured","outcome":"需求评审报告（问题分档/可测试性/是否可开工）"}];
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

      /* ================= dsh-promptkit adapter: StaticAssetProvider ================= */
      const TYPES = new Set(['prompt', 'snippet', 'insight'])
      const THINKING_KINDS = new Set(['question', 'goal', 'fact', 'assumption', 'decision', 'method', 'conclusion', 'action', 'dialectic'])
      const EPISTEMIC_STATUSES = new Set(['verified', 'inferred', 'to_verify', 'preference'])

      /** 完全本地的灵感库实现；数据可用 JSON 导出并以增量方式恢复。 */
      class StaticAssetProvider extends AssetProvider {
        constructor({ storagePrefix = 'promptkit.' } = {}) {
          super()
          this.key = `${storagePrefix}vault.assets.v1`
          this.event = `${storagePrefix}vault.changed.v1`
          this.listeners = new Set()
          this.source = `asset-provider:${Math.random().toString(36).slice(2)}`
          this._onStorage = event => { if (event?.key === this.key) this._notify(this._read()) }
          this._onLocalChange = event => { if (event?.detail?.key === this.key && event.detail.source !== this.source) this._notify(this._read()) }
          this._listening = false
        }
        async list() { return this._read().sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0)) }
        async save(input) {
          const body = String(input?.body || '').trim()
          if (!body) throw new Error('灵感内容不能为空。')
          const now = Date.now()
          const current = this._read()
          const id = String(input?.id || `asset:${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`)
          const previous = current.find(item => item.id === id)
          const asset = {
            id,
            type: TYPES.has(input?.type) ? input.type : 'prompt',
            title: String(input?.title || '').trim() || body.split('\n').find(Boolean)?.slice(0, 48) || '未命名灵感',
            body,
            tags: [...new Set((Array.isArray(input?.tags) ? input.tags : String(input?.tags || '').split(/[，,]/)).map(tag => String(tag).trim().replace(/^#/, '')).filter(Boolean))],
            note: String(input?.note || '').trim(),
            project: String(input?.project || previous?.project || '').trim(),
            parentId: String(input?.parentId || previous?.parentId || '').trim(),
            thinkingKind: THINKING_KINDS.has(input?.thinkingKind) ? input.thinkingKind : (previous?.thinkingKind || 'conclusion'),
            epistemicStatus: EPISTEMIC_STATUSES.has(input?.epistemicStatus) ? input.epistemicStatus : (previous?.epistemicStatus || 'inferred'),
            rationale: String(input?.rationale ?? previous?.rationale ?? '').trim(),
            nextAction: String(input?.nextAction ?? previous?.nextAction ?? '').trim(),
            relatedIds: [...new Set((Array.isArray(input?.relatedIds) ? input.relatedIds : previous?.relatedIds || []).map(String).filter(relatedId => relatedId && relatedId !== id))],
            dialectic: input?.dialectic && typeof input.dialectic === 'object' ? {
              thesis: String(input.dialectic.thesis || '').trim(), antithesis: String(input.dialectic.antithesis || '').trim(), synthesis: String(input.dialectic.synthesis || '').trim(),
            } : previous?.dialectic,
            verification: input?.verification && typeof input.verification === 'object' ? {
              status: ['pending', 'confirmed', 'refuted', 'inconclusive'].includes(input.verification.status) ? input.verification.status : 'pending',
              evidence: String(input.verification.evidence || '').trim(), checkedAt: Number(input.verification.checkedAt || 0) || undefined,
            } : previous?.verification,
            provenance: input?.provenance && typeof input.provenance === 'object' ? input.provenance : previous?.provenance,
            favorite: Boolean(input?.favorite ?? previous?.favorite),
            createdAt: Number(previous?.createdAt || now), updatedAt: now, lastUsedAt: previous?.lastUsedAt, useCount: Number(previous?.useCount || 0),
          }
          this._write([asset, ...current.filter(item => item.id !== id)])
          return asset
        }
        async remove(id) { this._write(this._read().filter(item => item.id !== id)) }
        async toggleFavorite(id) {
          let changed = null
          this._write(this._read().map(item => {
            if (item.id !== id) return item
            changed = { ...item, favorite: !item.favorite, updatedAt: Date.now() }
            return changed
          }))
          return changed
        }
        async markUsed(id) {
          let changed = null
          this._write(this._read().map(item => {
            if (item.id !== id) return item
            changed = { ...item, lastUsedAt: Date.now(), useCount: Number(item.useCount || 0) + 1 }
            return changed
          }))
          return changed
        }
        async import(raw) {
          let parsed
          try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw } catch { throw new Error('灵感库备份不是有效 JSON。') }
          const incoming = Array.isArray(parsed?.assets) ? parsed.assets : []
          const valid = incoming.filter(item => item && typeof item.body === 'string' && item.body.trim()).map(item => ({
            ...item, id: `asset:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            type: TYPES.has(item.type) ? item.type : 'prompt', title: String(item.title || '未命名灵感'),
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [], createdAt: Date.now(), updatedAt: Date.now(),
          }))
          if (!valid.length) throw new Error('备份中没有可导入的灵感资产。')
          this._write([...valid, ...this._read()])
          return valid
        }
        onChange(callback) {
          this.listeners.add(callback)
          if (!this._listening) {
            window.addEventListener?.('storage', this._onStorage)
            window.addEventListener?.(this.event, this._onLocalChange)
            this._listening = true
          }
          return () => {
            this.listeners.delete(callback)
            if (this.listeners.size || !this._listening) return
            window.removeEventListener?.('storage', this._onStorage)
            window.removeEventListener?.(this.event, this._onLocalChange)
            this._listening = false
          }
        }
        _read() {
          try {
            const raw = JSON.parse(window.localStorage.getItem(this.key) || 'null')
            // 兼容旧版裸数组（无版本包装）与当前 { version, assets } 格式。
            const payload = Array.isArray(raw) ? { version: 0, assets: raw } : raw
            if (!payload || typeof payload !== 'object') return []
            const rows = Array.isArray(payload.assets) ? payload.assets : []
            return this._migrate(Number(payload.version || 0), rows).filter(item => item && item.id && item.body)
          } catch { return [] }
        }
        /** 版本迁移策略：v0（裸数组）→ v1 只需补全语义字段；更高版本未知时原样保留以免丢数据。 */
        _migrate(fromVersion, rows) {
          if (fromVersion >= 1) return rows
          return rows.map(item => ({
            id: String(item.id),
            type: ['prompt', 'snippet', 'insight'].includes(item.type) ? item.type : 'prompt',
            title: String(item.title || '').trim() || String(item.body || '').split('\n').find(Boolean)?.slice(0, 48) || '未命名灵感',
            body: String(item.body || ''),
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
            note: String(item.note || ''),
            project: String(item.project || ''),
            parentId: String(item.parentId || ''),
            thinkingKind: item.thinkingKind || 'conclusion',
            epistemicStatus: item.epistemicStatus || 'inferred',
            rationale: String(item.rationale || ''),
            nextAction: String(item.nextAction || ''),
            relatedIds: Array.isArray(item.relatedIds) ? item.relatedIds.map(String) : [],
            verification: item.verification && typeof item.verification === 'object' ? item.verification : undefined,
            favorite: Boolean(item.favorite),
            createdAt: Number(item.createdAt || 0) || undefined,
            updatedAt: Number(item.updatedAt || 0) || undefined,
            lastUsedAt: Number(item.lastUsedAt || 0) || undefined,
            useCount: Number(item.useCount || 0),
          }))
        }
        _notify(rows) { this.listeners.forEach(listener => { try { listener(rows) } catch {} }) }
        _write(rows) {
          const payload = { version: 1, assets: rows }
          try { window.localStorage.setItem(this.key, JSON.stringify(payload)) }
          catch (error) {
            throw Object.assign(new Error('灵感库写入失败：浏览器未允许本地存储或空间已满。'), { cause: error })
          }
          this._notify(rows)
          try { window.dispatchEvent?.(new CustomEvent(this.event, { detail: { key: this.key, source: this.source } })) } catch {}
        }
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

        isInputTarget(target) { return target === this.el }

        onSelectionChange(cb) {
          this.el?.addEventListener('select', cb)
          return () => this.el?.removeEventListener('select', cb)
        }

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

        async enhance({ draft, extra, kind, method, strength, hasContext }) {
          // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
          // 此处示例实现统一的语义改写路径。
          this._abort = new AbortController()
          try {
            const strengthRule = strength === 'low'
              ? '只做措辞与结构润色，篇幅接近原文，不展开内容。'
              : strength === 'high'
                ? '充分展开背景、步骤与验收标准，篇幅约为草稿的 3 倍。'
                : '标准结构化整理，输出紧凑（约 1.5 倍原文）。'
            const contextRule = hasContext
              ? '会话上下文已提供：先提炼真实意图，再顺着草稿原有表达润色，不要重复追问上下文已给出的信息。'
              : '只使用草稿里已有的信息，缺失关键信息用【待确认：…】标出。'
            const instruction = method?.template
              ? `按「${method.title}」的方法结构改写以下提示词。方法模板：\n\n${method.template}\n\n${strengthRule}${contextRule}`
              : `改写以下提示词，使其更清晰、可执行。${strengthRule}${contextRule}`
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

      /* ================= dsh-promptkit adapter: DshSessionEnhancer ================= */
      class DshSessionEnhancer {
        constructor(getSessionId) { this.getSessionId = getSessionId; this.controller = null }
        get loading() { return !!this.controller }
        async enhance({ draft, extra, lang, method, strength, hasContext }) {
          this.controller?.abort()
          const controller = new AbortController()
          this.controller = controller
          try {
            const response = await fetch(`/dsh-promptkit/semantic-enhance?session_id=${encodeURIComponent(this.getSessionId())}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ draft, extra, lang, method, strength, hasContext, diagnose: true }),
              signal: controller.signal,
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) {
              if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(body.next_action || body.error || '基于草稿改造失败')
            }
            return body
          } finally { if (this.controller === controller) this.controller = null }
        }
        // SSE 流式增强：onDelta 逐段回调（含诊断行）；onStage 收到阶段切换（diagnosing/writing）；
        // resolve 值与 enhance() 一致。404/501（旧 host 未注册流式路由）时抛 fallback 错误，调用方退回非流式。
        async enhanceStream({ draft, extra, lang, method, strength, hasContext, diagnose = true, onDelta, onStage }) {
          this.controller?.abort()
          const controller = new AbortController()
          this.controller = controller
          const signal = controller.signal
          try {
            const response = await fetch(`/dsh-promptkit/semantic-enhance/stream?session_id=${encodeURIComponent(this.getSessionId())}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ draft, extra, lang, method, strength, hasContext, diagnose }),
              signal,
            })
            if (response.status === 404 || response.status === 501) {
              const error = new Error('stream_unavailable')
              error.fallback = true
              throw error
            }
            if (!response.ok || !response.body) {
              const body = await response.json().catch(() => ({}))
              if (response.status === 504) throw Object.assign(new Error(body.next_action || '模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(body.next_action || body.error || '流式增强不可用')
            }
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let final = null
            const consume = frame => {
                const lines = frame.split(/\r?\n/)
                const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim()
                const dataLine = lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n')
                if (!event || !dataLine) return
                const data = JSON.parse(dataLine)
                if (event === 'delta') onDelta?.(data.text)
                if (event === 'stage') onStage?.(data.phase, data.model)
                if (event === 'done') final = data
                if (event === 'error') throw Object.assign(new Error(data.message || data.error || '流式增强失败'), { timeout: Boolean(data.timeout) })
            }
            try {
              for (;;) {
                const { value, done } = await reader.read()
                if (signal.aborted) throw Object.assign(new Error('已取消'), { name: 'AbortError' })
                buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
                const frames = buffer.split(/\r?\n\r?\n/)
                buffer = frames.pop() || ''
                for (const frame of frames) consume(frame)
                if (done && buffer.trim()) consume(buffer)
                if (final || done) break
              }
              if (!final) throw new Error('流式增强连接中断。')
              return final
            } finally {
              await reader.cancel().catch(() => {}) // 取消或服务端提前断开时清理读锁。
              reader.releaseLock()
            }
          } finally { if (this.controller === controller) this.controller = null }
        }
        cancel() { this.controller?.abort(); this.controller = null }
      }

      /* ================= dsh-promptkit 组件: PromptStudio（方法工坊） ================= */
      // PromptStudio（方法工坊）：开源核心组件，零宿主依赖。
      // 所有外部能力经 props 注入；未注入的可选能力对应 UI 区块自动隐藏，组件始终可用：
      //   methodProvider    (必填) MethodProvider：方法源 + compose + 收藏/历史持久化
      //   messages          (可选) [{ id, role:'user'|'assistant', text }]：当前对话，用于「从当前对话提取」
      //   onSend            (可选) (text) => Promise：直接发送生成的 Prompt（如发送到当前会话）
      //   assetProvider     (可选) AssetProvider：保存成品 Prompt 到本地灵感库
      //   composer          (可选) Composer 实例：把生成的 Prompt 写入目标输入框
      //   getRecentSessions (可选) () => Promise<Array<{ intent?, summary? }>>：追加最近会话摘要
      //   searchMemory      (可选) (query) => Promise<string>：按自然语言检索项目记忆
      function PromptStudio({ methodProvider, assetProvider, messages, onSend, composer, getRecentSessions, searchMemory, storagePrefix = 'promptkit.' }) {
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
        // 草稿桥（搭配快捷助手的 openStudioWithDraft）：收到 open-with-draft 事件时
        // 预填 question 字段；若组件晚于事件挂载，从 sessionStorage 兜底取回。
        // 语义是「取一次、用掉、删掉」：pending 草稿消费后立即清除，避免 effect 因
        // methods 变化重跑时把陈旧草稿覆盖到用户已编辑的 question 上。
        const bridgeKey = studioBridgeStorageKey(storagePrefix)
        const bridgeEvent = studioBridgeEventName(storagePrefix)
        React.useEffect(() => {
          let alive = true
          const takeDraft = payload => {
            if (!alive) return
            // 兼容三种载荷：事件 detail 对象 / sessionStorage 的 JSON 字符串 / 纯文本草稿
            let data = payload
            if (typeof data === 'string') {
              try { data = JSON.parse(data) } catch { /* 纯文本草稿，按原文使用 */ }
            }
            const draft = (data?.draft ?? data) || ''
            const methodId = data?.methodId || ''
            if (!String(draft || '').trim()) return
            setQuestion(String(draft))
            if (methodId && methods.some(item => item.id === methodId)) setMethodId(methodId)
            setMessage('已从快捷助手带入草稿，可补充事实与约束后生成。')
          }
          const consumePending = () => {
            try {
              const stored = window.sessionStorage.getItem(bridgeKey) || window.__promptkitStudioPendingDraft
              if (stored == null) return
              window.sessionStorage.removeItem(bridgeKey)
              try { delete window.__promptkitStudioPendingDraft } catch { window.__promptkitStudioPendingDraft = undefined }
              takeDraft(stored)
            } catch {}
          }
          const onOpen = event => {
            try { window.sessionStorage.removeItem(bridgeKey) } catch {}
            try { delete window.__promptkitStudioPendingDraft } catch { window.__promptkitStudioPendingDraft = undefined }
            takeDraft(event?.detail)
          }
          window.addEventListener(bridgeEvent, onOpen)
          consumePending()
          return () => { alive = false; window.removeEventListener(bridgeEvent, onOpen) }
        }, [methods, bridgeEvent, bridgeKey])
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
        const savePreview = async () => {
          if (!assetProvider || !preview?.prompt) return
          try {
            const item = await assetProvider.save({
              type: 'prompt', title: preview.method?.title || method?.title || '方法工坊成品 Prompt', body: preview.prompt,
              tags: [preview.method?.category, '方法工坊'].filter(Boolean), provenance: { kind: 'prompt-studio', methodId: preview.method?.id || methodId },
            })
            setMessage(`已保存「${item.title}」到灵感库。`)
          } catch (error) { setMessage(String(error?.message || error)) }
        }
        const previewPanel = preview ? h(Panel, { key: 'preview', title: '发送前预览', hint: `${preview.estimated_chars} 字符` }, h('div', { style: { padding: '16px' } }, [
          h('pre', { key: 'text', style: { margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: 1.6, color: C.slate, maxHeight: '300px', overflow: 'auto', background: C.paper, padding: '12px', borderRadius: '6px', border: `1px solid ${C.divide}` } }, preview.prompt),
          h('div', { key: 'actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' } }, [
            onSend ? h('button', { key: 'send', className: 'pk-action-primary', onClick: () => onSend(preview.prompt).then(() => setMessage('已发送。')).catch(error => setMessage(String(error?.message || error))), style: workbenchStyle.actionPrimary }, '发送到当前会话') : null,
            composer ? h('button', { key: 'write', onClick: writePreview, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '写入输入框') : null,
            h('button', { key: 'copy', onClick: copyPreview, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '复制 Prompt'),
            assetProvider ? h('button', { key: 'save', onClick: savePreview, style: { ...workbenchStyle.action, background: C.tealTint, color: C.teal } }, '保存至灵感库') : null,
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
        return h('main', { style: { ...S.page, width: 'min(1240px, max(100%, calc(100vw - 280px)))', minWidth: 0, boxSizing: 'border-box', background: 'transparent', margin: '0 auto', padding: '28px clamp(20px, 3vw, 42px) 48px' } }, [
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
              gridTemplateColumns: 'minmax(300px, 340px) minmax(0, 1fr)',
              gap: '32px',
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
                h('span', { key: 'outcome' }, method.outcome || (method.mode === 'guided' ? 'AI 会逐步追问,直到问题足够清楚。' : '一份结构化分析、风险和下一步行动。'))
              ]) : null,
              h('div', { key: 'steps', style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, [stepPill(question, '问题'), stepPill(facts, '事实'), stepPill(constraints, '约束'), stepPill(options, '方案')]),
              h('div', { key: 'q', className: 'pk-field' }, [
                h('label', { key: 'label', className: 'pk-label', htmlFor: 'pk-question' }, '问题'),
                h('textarea', { key: 'input', id: 'pk-question', value: question, onChange: e => setQuestion(e.target.value), placeholder: '输入你想解决的问题', style: { ...workbenchStyle.input, minHeight: '84px', resize: 'vertical', width: '100%' } })
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

      /* ================= dsh-promptkit QuickEnhancer: Vault 状态容器 ================= */
      const INITIAL_DRAFT = {
        vaultTitle: '', vaultTags: '', vaultNote: '', vaultBody: '', vaultProject: '', vaultParentId: '',
        vaultEditingId: '', vaultFormOpen: false, vaultCompareId: '', vaultThinkingKind: 'conclusion',
        vaultEpistemicStatus: 'inferred', vaultRationale: '', vaultNextAction: '', vaultRelatedIds: [],
        vaultDialectic: { thesis: '', antithesis: '', synthesis: '' },
        vaultVerification: { status: 'pending', evidence: '', checkedAt: 0 }, vaultType: 'prompt', vaultBackup: '',
      }

      function reducer(state, action) {
        if (action.type === 'reset') return { ...INITIAL_DRAFT }
        if (action.type !== 'set') return state
        const next = typeof action.value === 'function' ? action.value(state[action.field]) : action.value
        return state[action.field] === next ? state : { ...state, [action.field]: next }
      }

      /** Vault 编辑草稿的单一状态容器；保留 setState 风格 setter 以降低调用方迁移成本。 */
      function useQuickEnhancerVaultState() {
        const [draft, dispatch] = React.useReducer(reducer, INITIAL_DRAFT)
        const setter = React.useCallback(field => value => dispatch({ type: 'set', field, value }), [])
        return {
          ...draft,
          setVaultTitle: setter('vaultTitle'), setVaultTags: setter('vaultTags'), setVaultNote: setter('vaultNote'),
          setVaultBody: setter('vaultBody'), setVaultProject: setter('vaultProject'), setVaultParentId: setter('vaultParentId'),
          setVaultEditingId: setter('vaultEditingId'), setVaultFormOpen: setter('vaultFormOpen'), setVaultCompareId: setter('vaultCompareId'),
          setVaultThinkingKind: setter('vaultThinkingKind'), setVaultEpistemicStatus: setter('vaultEpistemicStatus'),
          setVaultRationale: setter('vaultRationale'), setVaultNextAction: setter('vaultNextAction'), setVaultRelatedIds: setter('vaultRelatedIds'),
          setVaultDialectic: setter('vaultDialectic'), setVaultVerification: setter('vaultVerification'), setVaultType: setter('vaultType'),
          setVaultBackup: setter('vaultBackup'), resetVaultDraft: () => dispatch({ type: 'reset' }),
        }
      }

      /* ================= dsh-promptkit QuickEnhancer: 浮动入口拖动 ================= */
      /** 计算面板左边界：面板尺寸而非按钮尺寸才是可见性约束。 */
      function floatingPanelLeft(buttonX, viewportWidth, panelWidth, gutter = 16) {
        const maxLeft = Math.max(gutter, viewportWidth - panelWidth - gutter)
        return Math.max(gutter, Math.min(maxLeft, buttonX - panelWidth / 2))
      }

      /** 高频拖动状态保存在 ref，仅按动画帧提交 React 更新，并在抬手时持久化。 */
      function useFloatingLauncher(storageKey) {
        const [position, setPosition] = React.useState(() => {
          try {
            const value = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
            if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value
          } catch {}
          return { x: Math.max(24, window.innerWidth - 86), y: Math.max(96, window.innerHeight - 158) }
        })
        const positionRef = React.useRef(position)
        const [viewport, setViewport] = React.useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
        const drag = React.useRef(null)
        const suppressClick = React.useRef(false)
        const frame = React.useRef(0)

        React.useEffect(() => { positionRef.current = position }, [position])
        React.useEffect(() => {
          const commit = () => {
            frame.current = 0
            setPosition({ ...positionRef.current })
          }
          const move = event => {
            if (!drag.current) return
            positionRef.current = {
              x: Math.max(16, Math.min(window.innerWidth - 62, event.clientX - drag.current.dx)),
              y: Math.max(58, Math.min(window.innerHeight - 62, event.clientY - drag.current.dy)),
            }
            drag.current.moved = true
            if (!frame.current) frame.current = window.requestAnimationFrame(commit)
          }
          const up = () => {
            if (!drag.current) return
            suppressClick.current = drag.current.moved
            if (frame.current) { window.cancelAnimationFrame(frame.current); frame.current = 0 }
            setPosition({ ...positionRef.current })
            try { window.localStorage.setItem(storageKey, JSON.stringify(positionRef.current)) } catch {}
            drag.current = null
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
          return () => {
            if (frame.current) window.cancelAnimationFrame(frame.current)
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }
        }, [storageKey])
        React.useEffect(() => {
          const resize = () => {
            const width = window.innerWidth
            const height = window.innerHeight
            setViewport({ width, height })
            const next = {
              x: Math.max(16, Math.min(width - 62, positionRef.current.x)),
              y: Math.max(58, Math.min(height - 62, positionRef.current.y)),
            }
            if (next.x !== positionRef.current.x || next.y !== positionRef.current.y) {
              positionRef.current = next
              setPosition(next)
              try { window.localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
            }
          }
          window.addEventListener('resize', resize)
          return () => window.removeEventListener('resize', resize)
        }, [storageKey])

        const onPointerDown = React.useCallback(event => {
          suppressClick.current = false
          drag.current = { dx: event.clientX - positionRef.current.x, dy: event.clientY - positionRef.current.y, moved: false }
        }, [])
        const consumeSuppressedClick = React.useCallback(() => {
          if (!suppressClick.current) return false
          suppressClick.current = false
          return true
        }, [])
        return { position, viewport, onPointerDown, consumeSuppressedClick }
      }

      /* ================= dsh-promptkit NudgeMetrics：行为助推埋点本地消费端 + 宿主级开关 ================= */
      // NudgeMetrics：行为助推埋点的本地消费端 + 宿主级总开关（零遥测，纯浏览器本地）。
      //
      // 上游（quick-enhancer.js 的 trackNudge）把每次引导卡的 展示/接受/关闭 动作派发为
      // window CustomEvent 'promptkit.nudge'（detail: { type, action, ts, method_id }）；
      // 草稿桥则派发 'promptkit.studio.open-with-draft.v1'。本模块负责消费并聚合：
      //
      //   mountNudgeMetrics(prefix) —— 按 storagePrefix 幂等挂载：
      //     totals / byType / byDay  按「助推类型 × 动作」计数，按天分桶（保留最近 30 天）
      //     sessions / deepSessions  浏览器会话计数；任一 accept 或草稿桥使用记为深度会话
      //     deepRate ≈ DMSR（方法深度会话率）的本地近似口径
      //   getSummary() / reset()     —— 读聚合结果 / 清空本地统计
      //
      //   isNudgeKitEnabled / setNudgeKitEnabled —— 宿主级 feature flag（localStorage，
      //     默认开启）。与组件 prop nudgeEnabled 是「与」关系：任一关闭即停发全部引导卡。
      //     Embed 宿主经 PromptKit.nudges.* 取用；每个 prefix 的统计互不串扰。

      function isNudgeKitEnabled(key = 'promptkit.quick-action.nudge.enabled.v1') {
        try { return window.localStorage.getItem(key) !== 'false' } catch { return true }
      }

      function setNudgeKitEnabled(enabled, key = 'promptkit.quick-action.nudge.enabled.v1') {
        try { window.localStorage.setItem(key, String(!!enabled)) } catch {}
      }

      function mountNudgeMetrics(prefix = 'promptkit.') {
        if (typeof window === 'undefined') return null
        const registry = window.__promptkitNudgeMetricsByPrefix || (window.__promptkitNudgeMetricsByPrefix = new Map())
        if (registry.has(prefix)) return registry.get(prefix)
        const storeKey = `${prefix}nudge.metrics.v1`
        const sessionKey = `${prefix}nudge.session-counted.v1`
        const deepKey = `${prefix}nudge.session-deep.v1`
        const read = () => { try { return JSON.parse(window.localStorage.getItem(storeKey) || '{}') || {} } catch { return {} } }
        const write = value => { try { window.localStorage.setItem(storeKey, JSON.stringify(value)) } catch {} }
        const data = read()
        data.totals = data.totals || {}
        data.byType = data.byType || {}
        data.byDay = data.byDay || {}
        data.sessions = Number(data.sessions || 0)
        data.deepSessions = Number(data.deepSessions || 0)
        const dayOf = (ts) => new Date(ts || Date.now()).toISOString().slice(0, 10)
        const ensureSession = () => {
          try {
            if (window.sessionStorage.getItem(sessionKey) === '1') return
            window.sessionStorage.setItem(sessionKey, '1')
          } catch { return }
          data.sessions += 1
        }
        const markDeep = () => {
          ensureSession()
          let first = false
          try {
            if (window.sessionStorage.getItem(deepKey) !== '1') {
              window.sessionStorage.setItem(deepKey, '1')
              first = true
            }
          } catch { first = false }
          if (first) data.deepSessions += 1
        }
        const pruneDays = () => {
          const days = Object.keys(data.byDay).sort()
          while (days.length > 30) delete data.byDay[days.shift()]
        }
        const record = (type, action) => {
          if (!type || !action) return
          ensureSession()
          data.totals[action] = Number(data.totals[action] || 0) + 1
          const typeBucket = data.byType[type] || (data.byType[type] = {})
          typeBucket[action] = Number(typeBucket[action] || 0) + 1
          const day = dayOf()
          const dayBucket = data.byDay[day] || (data.byDay[day] = {})
          dayBucket[action] = Number(dayBucket[action] || 0) + 1
          if (action === 'accept') markDeep()
          pruneDays()
          write(data)
        }
        const onNudge = event => {
          const detail = event?.detail || {}
          record(String(detail.type || ''), String(detail.action || ''))
        }
        const onBridge = () => {
          ensureSession()
          markDeep()
          data.totals.bridge = Number(data.totals.bridge || 0) + 1
          const dayBucket = data.byDay[dayOf()] || (data.byDay[dayOf()] = {})
          dayBucket.bridge = Number(dayBucket.bridge || 0) + 1
          pruneDays()
          write(data)
        }
        try {
          window.addEventListener(nudgeEventName(prefix), onNudge)
          window.addEventListener(studioBridgeEventName(prefix), onBridge)
        } catch {}
        const api = {
          getSummary: () => {
            pruneDays()
            const days = Object.keys(data.byDay)
            const deepDays = days.filter(day => Number(data.byDay[day]?.accept || 0) > 0 || Number(data.byDay[day]?.bridge || 0) > 0)
            const base = Math.max(data.sessions, data.deepSessions)
            return {
              sessions: data.sessions,
              deepSessions: data.deepSessions,
              deepRate: base ? Math.round((data.deepSessions / base) * 100) / 100 : 0,
              activeDays: days.length,
              deepDays: deepDays.length,
              totals: { ...data.totals },
              byType: JSON.parse(JSON.stringify(data.byType)),
              byDay: JSON.parse(JSON.stringify(data.byDay)),
            }
          },
          reset: () => {
            data.totals = {}
            data.byType = {}
            data.byDay = {}
            data.sessions = 0
            data.deepSessions = 0
            try { window.sessionStorage.removeItem(sessionKey); window.sessionStorage.removeItem(deepKey) } catch {}
            write(data)
          },
        }
        registry.set(prefix, api)
        // 保留默认实例的旧全局入口，避免已有 Embed 宿主升级后立即失效。
        if (prefix === 'promptkit.') window.__promptkitNudgeMetrics = api
        return api
      }

      function getNudgeMetrics(prefix = 'promptkit.') {
        if (typeof window === 'undefined') return null
        return window.__promptkitNudgeMetricsByPrefix?.get(prefix) || (prefix === 'promptkit.' ? window.__promptkitNudgeMetrics || null : null)
      }

      /* ================= QuickEnhancer 首次体验进度 ================= */
      // 仅保存 0~3 的首次体验进度，与可选的详细使用统计分离。
      function useOnboardingProgress(storageKey) {
        const key = storageKey('onboarding-successes.v1')
        const [count, setCount] = React.useState(() => {
          try {
            const saved = window.localStorage.getItem(key)
            const prior = saved === null ? JSON.parse(window.localStorage.getItem(storageKey('metrics.v1')) || '{}').total : Number(saved)
            return Math.max(0, Math.min(3, Number(prior) || 0))
          } catch { return 0 }
        })
        React.useEffect(() => { try { window.localStorage.setItem(key, String(count)) } catch {} }, [key, count])
        const recordSuccess = () => setCount(value => Math.min(3, value + 1))
        return { completed: count >= 3, recordSuccess }
      }

      /* ================= QuickEnhancer 草稿提交守卫 ================= */
      // 所有异步写回共享同一失效代际；切换会话、关闭或取消后，旧快照不能提交。
      function useDraftGuard(composer) {
        const owner = React.useRef({ composer, generation: 0 })
        if (owner.current.composer !== composer) owner.current = { composer, generation: owner.current.generation + 1 }
        const invalidate = React.useCallback(() => { owner.current.generation += 1 }, [])
        React.useEffect(() => invalidate, [composer, invalidate])
        const capture = ({ selection = false } = {}) => {
          const before = String(composer?.getDraft?.() || '')
          const selected = selection ? composer?.getSelection?.() : null
          if (selected && (selected.draft !== before || selected.text !== before.slice(selected.start, selected.end))) throw new Error('选区已变化，请重新选择。')
          return { before, selection: selected, composer, generation: ++owner.current.generation }
        }
        const assertCurrent = snapshot => {
          if (owner.current.composer !== snapshot.composer || owner.current.generation !== snapshot.generation) throw Object.assign(new Error('操作已取消，草稿未改动。'), { name: 'AbortError' })
          if (String(snapshot.composer?.getDraft?.() || '') !== snapshot.before) throw new Error('操作期间草稿已变化，未覆盖新内容；请重新操作。')
        }
        const commit = (snapshot, text, { allowEmpty = false } = {}) => {
          assertCurrent(snapshot)
          if (typeof text !== 'string' || (!allowEmpty && !text.trim())) throw new Error('未返回有效正文，草稿未改动。')
          const selected = snapshot.selection
          const after = selected ? `${snapshot.before.slice(0, selected.start)}${text}${snapshot.before.slice(selected.end)}` : text
          if (selected && snapshot.composer.replaceSelection) snapshot.composer.replaceSelection(text, selected)
          else snapshot.composer.write(after)
          return after
        }
        return { capture, assertCurrent, commit, invalidate }
      }

      /* ================= QuickEnhancer 自动增强与单次发送 ================= */
      /** 增强与发送分别处理失败；一轮输入最多调用一次发送函数。 */
      function useAutoEnhance({ enabled, composer, enhancer, onSubmitDraft, strength, draftGuard, loading, setLoading, setStreamState, setNotice, setWarn, setError }) {
        const latest = React.useRef(null)
        latest.current = { enabled, composer, enhancer, onSubmitDraft, strength, draftGuard, loading, setLoading, setStreamState, setNotice, setWarn, setError }
        const inFlight = React.useRef(false)
        React.useEffect(() => {
          const onKeydown = event => {
            const state = latest.current
            const draft = String(state.composer?.getDraft?.() || '')
            if (!state.onSubmitDraft || !state.enhancer || !state.composer?.isInputTarget?.(event.target)) return
            if (!shouldInterceptSend({ event, draft, enabled: state.enabled })) return
            // 忙碌时仍吞掉同一输入框的发送键，避免宿主先发送、异步增强随后再发送。
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.()
            if (inFlight.current || state.loading) return
            inFlight.current = true
            state.setLoading(true)
            const snapshot = state.draftGuard.capture()
            const startedAt = Date.now()
            state.setStreamState({ phase: 'waiting', segments: [], elapsedMs: 0 })
            // 实时计时：非流式增强没有增量反馈，逐秒跳数避免「像卡死」。
            const tick = window.setInterval(() => state.setStreamState(prev => prev ? { ...prev, elapsedMs: Date.now() - startedAt } : prev), 500)
            void (async () => {
              let text = draft
              let enhancementError = null
              try {
                try {
                  const body = await state.enhancer.enhance({ draft, lang: detectLanguage(draft), kind: 'semantic', strength: state.strength, hasContext: false })
                  if (typeof body?.prompt !== 'string' || !body.prompt.trim()) throw new Error('模型未返回有效正文')
                  text = restoreLostSkillMentions(draft, body.prompt) || body.prompt
                } catch (error) {
                  if (error?.name === 'AbortError') throw error
                  enhancementError = error
                }
                state.draftGuard.assertCurrent(snapshot)
                try {
                  await state.onSubmitDraft(text)
                } catch (error) {
                  state.setError(`发送结果未确认（${String(error?.message || error)}），未自动重发；请先检查会话。`)
                  return
                }
                if (enhancementError) state.setWarn(`自动增强失败（${String(enhancementError?.message || enhancementError)}），已发送原文。`)
                else state.setNotice('发送前已自动增强。')
              } catch (error) {
                if (error?.name === 'AbortError') state.setNotice('自动增强已取消，原文未发送。')
                else state.setError(String(error?.message || error))
              } finally {
                window.clearInterval(tick)
                inFlight.current = false
                state.setLoading(false)
                state.setStreamState(null)
              }
            })()
          }
          window.addEventListener('keydown', onKeydown, true)
          return () => window.removeEventListener('keydown', onKeydown, true)
        }, [])
      }

      /* ================= QuickEnhancer 增强事务与流式状态 ================= */
      /** 增强事务：准备上下文、流式预览、取消、校验草稿、提交；成功后的统计由调用方处理。 */
      function useEnhancementFlow({ composer, enhancer, draft, draftGuard, config, context, getPlan, importCard, onApplied, onDiagnosis, notice, setLoading }) {
        const { enhancementKind, enhanceStrength, requirement, matchedMethod: defaultMethod, selectedContextText, referencedFiles, useMemoryContext } = config
        const { vaultItems, assetContextIds, memoryPreview, searchMemory, loadMemory, methodProvider } = context
        const { setNotice, setWarn, setError, setMemoryReceipt } = notice
        const [enhanceDiagnosis, setEnhanceDiagnosis] = React.useState(null)
        const [diagnosisMethod, setDiagnosisMethod] = React.useState(null)
        const [streamState, setStreamState] = React.useState(null)
        const [skillRestore, setSkillRestore] = React.useState(null)
        const streamStartRef = React.useRef(0)
        const active = React.useRef(null)
        React.useEffect(() => () => {
          if (active.current) { active.current.abort(); setLoading(false) }
          active.current = null
          enhancer?.cancel()
        }, [enhancer])
        const cancelEnhance = ({ silent = false } = {}) => {
          draftGuard.invalidate()
          active.current?.abort()
          enhancer?.cancel()
          if (!silent) setNotice('正在取消语义增强…')
        }
        const enhanceIntoInput = async ({ methodOverride } = {}) => {
          if (active.current) return
          setMemoryReceipt(null)
          const matchedMethod = methodOverride || defaultMethod
          let snapshot
          try { snapshot = draftGuard.capture({ selection: true }) }
          catch (error) { setWarn(String(error?.message || error)); return }
          const source = snapshot.before.trim()
          if (!source) { setWarn('请先在输入框中写入原始请求。'); return }
          const importSource = source.replace(/^\/import\b\s*/i, '')
          if (/^\/import\b/i.test(source) || /^(?:---\n[\s\S]*?\n---\n)?#\s+[^\n]+[\s\S]*?## Prompt\s*\n/.test(source)) {
            if (await importCard(importSource)) {
              try { draftGuard.commit({ ...snapshot, selection: null }, '', { allowEmpty: true }) }
              catch (error) { setError(String(error?.message || error)) }
            }
            return
          }
          const selection = snapshot.selection
          const original = selection?.text || snapshot.before
          if (original.trim().length > 3000) { setWarn(`草稿过长（${original.trim().length} 字符），建议精简到 3000 字符以内再增强。`); return }
          const applyEnhanced = text => draftGuard.commit(snapshot, text)
          if (enhancementKind !== 'semantic') {
            const plan = getPlan(original, matchedMethod)
            if (plan.tooShort) { setNotice('输入过短，未做增强，可直接发送。'); return }
            try {
              const after = applyEnhanced(plan.prompt)
              onApplied({ original, after, selection, matchedMethod, kind: plan.method ? 'lightMethod' : 'lightGeneric', method: plan.method })
              setNotice(plan.method ? `已采用「${plan.label || plan.method}」做保守增强${selection?.text ? '并替换选中片段' : ''}，可检查后直接发送。` : '已做最小化提示词整理，可检查后直接发送。')
            } catch (error) { setError(String(error?.message || error)) }
            return
          }
          if (!enhancer) { setNotice('未注入语义增强模型（enhancer），仅支持轻量增强。'); return }
          const request = new AbortController()
          active.current = request
          const assertActive = () => {
            if (request.signal.aborted || active.current !== request) throw Object.assign(new Error('已取消'), { name: 'AbortError' })
          }
          setLoading(true)
          setEnhanceDiagnosis(null)
          setDiagnosisMethod(matchedMethod || null)
          setSkillRestore(null)
          setStreamState({ phase: 'waiting', segments: [], elapsedMs: 0 })
          streamStartRef.current = Date.now()
          // 实时计时：等待阶段逐秒跳数（-webkit 不支持时退回静态文案），让「模型在干活」可感知。
          const tick = window.setInterval(() => setStreamState(prev => prev ? { ...prev, elapsedMs: Date.now() - streamStartRef.current } : prev), 500)
          let phase = 'done'
          try {
            const contextAssets = vaultItems.filter(item => assetContextIds.includes(item.id))
            const assetContextText = contextAssets.length ? [
              '思考卡上下文（请区分事实、推断和待验证假设；不要把待核实或已被推翻的内容表述为事实或结论）：',
              ...contextAssets.map((item, index) => [
                `[${index + 1}] ${item.title}`,
                `类型：${item.thinkingKind || 'conclusion'}；认识状态：${item.epistemicStatus || 'inferred'}${item.verification ? `；验证结果：${item.verification.status}` : ''}`,
                item.verification?.evidence ? `验证证据：${item.verification.evidence}` : '',
                item.rationale ? `为什么重要：${item.rationale}` : '',
                item.nextAction ? `下一步：${item.nextAction}` : '',
                `内容：${item.body}`,
              ].filter(Boolean).join('\n')),
            ].join('\n\n') : ''
            let extra = [requirement.trim(), selectedContextText ? `对话参考：\n${selectedContextText}` : '', assetContextText,
              referencedFiles.length ? `已引用工作区文件：${referencedFiles.map(path => `@${path}`).join('、')}。请完整保留这些引用；文件内容会在用户发送后由 DSH @file 处理，当前改写不得假设或编造其内容。` : '',
            ].filter(Boolean).join('\n\n')
            let remembered = ''
            if (useMemoryContext && searchMemory) {
              remembered = memoryPreview.status === 'ready' && memoryPreview.query === original ? memoryPreview.text : await loadMemory(original)
              if (remembered) extra = [extra, `项目记忆：${remembered}`].filter(Boolean).join('\n\n')
            }
            assertActive()
            const template = matchedMethod ? await methodProvider.getTemplate(matchedMethod.id) : null
            assertActive()
            const options = { draft: original, extra, lang: detectLanguage(original), kind: 'semantic', strength: enhanceStrength,
              hasContext: Boolean(selectedContextText || remembered || assetContextText),
              method: matchedMethod ? { title: matchedMethod.title, template: template.prompt } : undefined }
            let body
            if (typeof enhancer.enhanceStream === 'function') {
              let rawText = ''
              try {
                body = await enhancer.enhanceStream({ ...options, onDelta: delta => {
                  if (request.signal.aborted || active.current !== request) return
                  rawText += String(delta || '')
                  const partial = parseEnhanceOutput(rawText, { streaming: true })
                  setEnhanceDiagnosis(partial.diagnosis)
                  setStreamState(prev => prev ? { ...prev, phase: 'streaming', segments: splitOutputSegments(partial.prompt) } : prev)
                }, onStage: stage => {
                  // 服务端阶段帧：waiting → diagnosing（模型开始输出诊断）→ writing（开始改写正文）。
                  if (request.signal.aborted || active.current !== request) return
                  setStreamState(prev => prev ? { ...prev, phase: stage === 'writing' ? 'streaming' : 'diagnosing' } : prev)
                } })
              } catch (error) {
                // 仅协议明确不支持流式且尚未输出时降级；超时、模型错误、断流不得重复调用。
                if (!error?.fallback || rawText || error?.name === 'AbortError') throw error
                assertActive()
              }
            }
            if (!body) { assertActive(); body = await enhancer.enhance(options) }
            assertActive()
            const repaired = restoreLostSkillMentions(original, body.prompt)
            // 先验证正文，避免只有诊断时用「补回技能」文字冒充有效改写。
            if (typeof body.prompt !== 'string' || !body.prompt.trim()) throw new Error('模型未返回改写正文，草稿未改动。')
            const after = applyEnhanced(repaired || body.prompt)
            setEnhanceDiagnosis(body.diagnosis || null)
            if (body.diagnosis) onDiagnosis(body.diagnosis, original.trim(), matchedMethod?.title || '')
            if (repaired) setSkillRestore({ lost: skillMentions(original).filter(name => !skillMentions(body.prompt).includes(name)) })
            setStreamState(prev => prev ? { ...prev, segments: splitOutputSegments(body.prompt) } : prev)
            onApplied({ original, after, selection, matchedMethod, kind: 'semantic', method: matchedMethod?.title, body, remembered, contextAssets })
            const diagnosticNotice = body.diagnosisMeta?.status === 'partial' ? ' 部分诊断未返回，已保留有效项。' : ''
            setNotice(`语义增强完成${body.model ? `（${body.model}）` : ''}；${selection?.text ? '选中片段' : '草稿'}已替换，可在此撤销或对比原稿。${diagnosticNotice}`)
          } catch (error) {
            phase = error?.name === 'AbortError' ? 'cancelled' : 'error'
            if (active.current !== request) return
            if (phase === 'cancelled') setNotice('已取消语义增强，草稿未改动。')
            else setError(String(error?.message || error))
          } finally {
            window.clearInterval(tick)
            if (active.current === request) {
              active.current = null
              setLoading(false)
              setStreamState(prev => prev ? { ...prev, phase, elapsedMs: Date.now() - streamStartRef.current } : null)
            }
          }
        }
        return { enhanceIntoInput, cancelEnhance, enhanceDiagnosis, diagnosisMethod, streamState, setStreamState, skillRestore, setSkillRestore }
      }

      /* ================= QuickEnhancer 浮层关闭与宿主事件隔离 ================= */
      // 管理宿主事件隔离与分层关闭；不承担 Vault 数据或增强业务。
      function usePanelDismiss({ open, vaultOpen, setOpen, setVaultOpen, rootRef, panelRef }) {
        // 抽屉与插件根已抬升到宿主浮层之上（zIndex 20001/20002），「关闭 ×」按钮必然露在最上层、始终可点，
        // 不再需要「被遮挡时自动左移」的运行时检测（此前那套 elementFromPoint 轮询既脆弱又拖性能）。
        const closeBtnRef = React.useRef(null)
        // 原生顶层突破宿主输入区的 stacking context，DOM 仍留在插件根内，
        // 不破坏 React 事件或「外部点击只关一层」判定。旧浏览器保留固定定位回退。
        React.useEffect(() => {
          const panel = panelRef.current
          if (!vaultOpen || !panel?.showPopover) return undefined
          panel.showPopover()
          return () => { if (panel.isConnected) panel.hidePopover() }
        }, [vaultOpen, panelRef])
        // DSH 宿主可能在某层 DOM 上 stopPropagation / 拦截 click/pointerdown，导致 React 合成 onClick 收不到。
        // 在 window 捕获阶段挂原生监听：
        //   1) 命中关闭按钮时交给按钮自身的原生手势隔离器处理；
        //   2) 抽屉打开时点在插件根（FAB/主面板/抽屉）之外 -> 关抽屉（按钮被物理遮挡时的第二条出路）。
        React.useEffect(() => {
          const close = (event) => {
            const btn = closeBtnRef.current
            if (btn && (event.target === btn || btn.contains(event.target))) {
              return
            }
            if (event.type === 'pointerdown' && vaultOpen) {
              const root = rootRef.current
              // rootRef 尚未挂载（理论不可能）或点击就在插件自身 UI 内 -> 不处理
              if (root && !root.contains(event.target)) setVaultOpen(false)
            }
          }
          window.addEventListener('click', close, { capture: true })
          window.addEventListener('pointerdown', close, { capture: true })
          return () => {
            window.removeEventListener('click', close, { capture: true })
            window.removeEventListener('pointerdown', close, { capture: true })
          }
        }, [vaultOpen])
        // 关闭按钮的整段手势必须在按钮节点消耗：pointerdown/pointerup/click 都不能冒泡到
        // DSH 的会话层。真正卸载抽屉延到 click 派发完的一帧后，避免 click 落到下层控件。
        React.useEffect(() => {
          if (!vaultOpen) return undefined
          const button = closeBtnRef.current
          if (!button) return undefined
          const consume = event => {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation?.()
          }
          const closeAfterGesture = event => {
            consume(event)
            const schedule = window.requestAnimationFrame || (callback => setTimeout(callback, 0))
            schedule(() => {
              // DSH 的外层捕获监听可能已在本次手势中把主面板标为关闭。
              // 关闭抽屉的语义必须保持主面板打开，因此在手势结束后显式恢复该状态。
              setVaultOpen(false)
              setOpen(true)
            })
          }
          // DSH 不同版本分别使用 pointer 与 mouse 事件做外部点击判定，两个序列都隔离。
          button.addEventListener('pointerdown', consume, true)
          button.addEventListener('pointerup', consume, true)
          button.addEventListener('mousedown', consume, true)
          button.addEventListener('mouseup', consume, true)
          button.addEventListener('click', closeAfterGesture, true)
          return () => {
            button.removeEventListener('pointerdown', consume, true)
            button.removeEventListener('pointerup', consume, true)
            button.removeEventListener('mousedown', consume, true)
            button.removeEventListener('mouseup', consume, true)
            button.removeEventListener('click', closeAfterGesture, true)
          }
        }, [vaultOpen])
        React.useEffect(() => {
          if (!open) return
          const onPointerDown = event => {
            if (!rootRef.current?.contains(event.target)) setOpen(false)
          }
          // 抽屉打开时点外部只关抽屉（由上方捕获 handler 负责），主面板保留，避免一次点击关两层。
          if (vaultOpen) return undefined
          window.addEventListener('pointerdown', onPointerDown)
          return () => window.removeEventListener('pointerdown', onPointerDown)
        }, [open, vaultOpen])
        return { closeBtnRef }
      }

      /* ================= QuickEnhancer 子组件: useKnowledgeInbox（知识区暂存 hook） ================= */
      // 知识区（诊断发现暂存）容量上限：超限时挤掉最旧的未处理项。
      const KNOWLEDGE_INBOX_MAX = 12

      // 认识缺口的分类字段：只有这两类值得入区留证——
      //   hidden_premise  隐含前提：草稿默认了哪些未言明的假设
      //   falsifiability  不可证伪要求：哪些要求无法被观察或测试判定
      // 概念清晰是措辞问题，入区即噪音；行动性/语境契合在改写中直接消化。
      const DIAGNOSIS_GAP_FIELDS = [
        { key: 'hidden_premise', label: '隐含前提', hint: '草稿默认了哪些未言明的假设' },
        { key: 'falsifiability', label: '不可证伪要求', hint: '哪些要求无法被观察或测试判定' },
      ]

      /**
       * useKnowledgeInbox：知识区暂存队列的状态容器（诊断闭环第 1 步的持久化载体）。
       *
       * 语义：增强完成时认识缺口自动入区（enqueue），但「入区 ≠ 存卡」——队列只存
       * localStorage，不写 Vault；用户逐条审阅后由上层主动调用 promote（写 Vault 假设卡）
       * 或 dismiss（丢弃），本 hook 不做任何 Vault 写入。
       *
       * 返回：
       *   entries           暂存条目数组（旧→新）
       *   enqueue           (diagnosis, 完整草稿, methodTitle) => 入区，返回本次新增数
       *   dismiss           (id) => 从暂存移除
       *   existsInVault     (fingerprint) => boolean：检查是否已存为卡片
       */
      function useKnowledgeInbox({ storageKey, notice, vaultItems }) {
        const [entries, setEntries] = React.useState(() => {
          try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey('knowledge-inbox.v1')) || '[]')
            return Array.isArray(saved) ? saved.filter(entry => entry && typeof entry.id === 'string' && typeof entry.finding === 'string') : []
          } catch { return [] }
        })
        // 队列即改即持久化：面板关闭后暂存不丢。
        React.useEffect(() => {
          try { window.localStorage.setItem(storageKey('knowledge-inbox.v1'), JSON.stringify(entries)) } catch {}
        }, [entries])

        const current = React.useRef(entries)
        current.current = entries
        const publish = next => { current.current = next; setEntries(next) }
        const enqueue = (diagnosis, draft, methodTitle) => {
          let addedCount = 0
          const next = [...current.current]
          for (const field of DIAGNOSIS_GAP_FIELDS) {
            const finding = diagnosisFinding(diagnosis?.[field.key], field.key)
            if (!finding) continue
            // 查重按「维度 + 草稿指纹」：同一草稿的同一缺口只入区一次。
            const fingerprint = diagnosisFingerprint(field.key, draft)
            if (next.some(entry => entry.fingerprint === fingerprint) || vaultItems.some(item => item.provenance?.fingerprint === fingerprint)) continue
            addedCount += 1
            next.push({
              id: `know:${Date.now()}:${field.key}:${Math.random().toString(36).slice(2, 6)}`,
              fingerprint,
              dimension: field.key,
              label: field.label,
              hint: field.hint,
              finding,
              draft: String(draft || '').trim(),
              method: methodTitle || '',
              at: Date.now(),
            })
          }
          // 区满裁剪：保留最新 N 条（旧未处理项被挤出，避免无限堆积）。
          if (addedCount) publish(next.slice(-KNOWLEDGE_INBOX_MAX))
          return addedCount
        }

        const dismiss = id => publish(current.current.filter(item => item.id !== id))

        // 查重只针对 Vault 已有卡（provenance.fingerprint）：不能查暂存区——
        // 待晋升的条目自己就在区里，查区会把「自己」误判为重复，导致永远存不了卡。
        const existsInVault = fingerprint => vaultItems.some(item => item.provenance?.fingerprint === fingerprint)

        return { entries, enqueue, dismiss, existsInVault, max: KNOWLEDGE_INBOX_MAX }
      }

      /* ================= QuickEnhancer 子组件: DiagnosisSection（五维诊断卡） ================= */
      // 五维诊断卡（哲学启发式量表）：概念清晰/隐含前提/可证伪性/可行动性/语境契合。
      // 标签键序与 host 的 DIAGNOSIS_LABELS 保持一致；流式期间诊断行先于正文到达，
      // diagnosis 增量填充时诊断卡先亮起来，用户先看到「体检结果」再看改写。
      // 底部的「查看知识区」入口只负责跳转——存卡与否由用户在知识区里决定。

      function DiagnosisSection({ diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge }) {
        if (!diagnosis) return null
        return h('details', { key: 'diagnosis', open: true, style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '11px', lineHeight: 1.5 } }, [
          h('summary', { key: 'sum', style: { color: C.teal, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [
            h(Icon, { key: 'ic', name: 'gauge', size: 12 }),
            '五维诊断',
            // 自动匹配到旗舰方法时提示诊断采用了该方法的检查侧重（方法感知量表）。
            matchedMethod ? h('span', { key: 'hint', style: { color: C.muted, fontWeight: 600 } }, ` · ${matchedMethod.title} 侧重`) : null,
          ]),
          h('div', { key: 'rows', style: { marginTop: '6px', display: 'grid', gap: '3px' } }, Object.entries(DIAGNOSIS_LABELS).map(([key, label]) => h('div', { key, style: { color: C.slate } }, [
            h('strong', { key: 'l', style: { color: C.teal } }, `${label}：`),
            diagnosis[key]?.replace(/^\[(?:OK|GAP)\]\s*/i, '') || '未返回此项诊断',
          ]))),
          // 诊断闭环入口：发现自动进灵感库「知识区」暂存，用户审阅后主动决定存卡或忽略。
          // 这里只提供入口，不替用户做决定。
          hasAssetProvider ? h('div', { key: 'save-cards', style: { marginTop: '7px', paddingTop: '7px', borderTop: `1px dashed ${C.tealLine}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, [
            h('span', { key: 'hint', style: { color: C.muted, fontSize: '10px', lineHeight: 1.4, flex: 1 } },
              knowledgeCount > 0
                ? `知识区有 ${knowledgeCount} 条诊断发现待审阅，可存为假设卡或忽略。`
                : '认识缺口已自动放入灵感库「知识区」，审阅后可存为假设卡。'),
            h('button', {
              key: 'go',
              onClick: onOpenKnowledge,
              style: { flexShrink: 0, border: 0, borderRadius: '7px', background: C.teal, color: '#fff', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' },
            }, [
              '查看知识区',
              knowledgeCount > 0 ? h('span', { key: 'n', style: { background: C.surface, color: C.teal, borderRadius: '999px', padding: '0 6px', fontSize: '10px', fontWeight: 800 } }, String(knowledgeCount)) : null,
            ]),
          ]) : null,
        ])
      }

      /* ================= QuickEnhancer 子组件: KnowledgeTab（知识区审阅列表） ================= */
      // 知识区 tab：诊断发现的「待审阅」暂存区。增强完成时认识缺口自动入区（见
      // use-knowledge-inbox.js），用户逐条主动决定：存为假设卡（进收件箱待验证队列 +
      // 可注入增强上下文）或忽略。这里不做任何自动写入 Vault 的动作。

      function KnowledgeTab({ entries, max, onPromote, onDismiss }) {
        return h('div', { key: 'knowledge-tab', style: { display: 'grid', gap: '8px' } }, [
          h('div', { key: 'hint', style: { color: C.muted, fontSize: '11px', lineHeight: 1.4 } },
            entries.length
              ? `语义增强发现的 ${entries.length} 条认识缺口在此暂存（本地保存，最多 ${max} 条）。是否留证由你决定：存卡进入验证流程，忽略则丢弃。`
              : '暂无待审阅的发现。语义增强诊断出「隐含前提」或「不可证伪要求」时会自动出现在这里。'),
          // 新发现的在上：倒序渲染让用户先看到最近的诊断结果。
          ...entries.slice().reverse().map(entry => h('div', { key: entry.id, style: { padding: '9px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.amberTint, display: 'grid', gap: '5px' } }, [
            h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' } }, [
              h('span', { key: 'tag', style: { display: 'inline-block', padding: '1px 8px', borderRadius: '999px', background: C.amber, color: '#fff', fontSize: '10px', fontWeight: 800, whiteSpace: 'nowrap' } }, entry.label),
              // 方法名与日期分别拼接：原来的 `?:` + 字符串连接混用会吞掉日期分隔符。
              h('span', { key: 'meta', style: { color: C.muted, fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
                [entry.method ? `${entry.method} · ` : '', new Date(entry.at).toLocaleDateString()].join('')),
            ]),
            h('div', { key: 'finding', style: { color: C.slate, fontSize: '11px', lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }, entry.finding),
            h('div', { key: 'draft', style: { color: C.muted, fontSize: '10px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `原草稿：${entry.draft || '（空）'}`),
            h('div', { key: 'actions', style: { display: 'flex', gap: '8px', marginTop: '2px' } }, [
              h('button', { key: 'promote', onClick: () => onPromote(entry), style: { border: 0, borderRadius: '7px', background: C.teal, color: '#fff', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '存为假设卡'),
              h('button', { key: 'dismiss', onClick: () => onDismiss(entry.id), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '忽略'),
            ]),
          ])),
        ])
      }

      /* ================= QuickEnhancer 子组件: VariableFillNode（模板变量补值面板） ================= */
      // 草稿前置弹层：VariableFillNode 模板变量补值面板（Vault 条目含 {{var}} 时弹出，确认后才写入）。
      // fixed 定位浮层，zIndex 20005，由主组件挂到插件根。
      // 历史注记：原 FileMenuNode（@ 文件引用补全菜单）已移除——DSH 原生 @ 提及
      // 提供同类能力且为超集（文件+会话、目录下钻、原子行内引用），插件在宿主
      // 输入框上重复实现只会产生双菜单重叠与吞键冲突。

      function VariableFillNode({ fill, onCancel, onConfirm }) {
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

      /* ================= QuickEnhancer 子组件: ContextOverlay（对话参考弹层） ================= */
      // 对话参考选择弹层：从当前会话消息中勾选若干条，作为增强/组装的额外上下文。
      // 提供全选、最近 N 条、清空三种快捷方式；确认后由主组件把选中 id 集合用于上下文拼装。

      function ContextOverlay({
        messages, selectedIds, activeMessages, selectedDraft, recentInputRef,
        onToggle, onSelectAll, onSelectRecent, onClear, onClose, onConfirm,
      }) {
        return h('div', { key: 'overlay-backdrop', onClick: e => { if (e.target === e.currentTarget) onClose() }, style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 80, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', paddingBottom: '4vh', paddingLeft: '16px', paddingRight: '16px', animation: 'pk-fade .15s ease', overflowY: 'auto' } }, [
          h('div', { key: 'overlay-panel', onClick: e => e.stopPropagation(), style: { width: 'min(360px, calc(100vw - 48px))', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', boxSizing: 'border-box', borderRadius: '10px', background: C.surface, border: `1px solid ${C.line}`, boxShadow: '0 24px 68px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)', overflow: 'hidden' } }, [
            h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              h('strong', { key: 'strong-0', style: { fontSize: '12.5px', fontWeight: 700 } }, '选择对话参考'),
              h('button', { key: 'button-1', onClick: onClose, style: { border: 0, background: 'transparent', color: C.muted, fontSize: '15px', cursor: 'pointer', padding: '1px 5px' } }, '×'),
            ]),
            h('div', { key: 'toolbar', style: { display: 'flex', flexWrap: 'nowrap', gap: '5px', alignItems: 'center' } }, [
              h('button', { key: 'sel-all', onClick: onSelectAll, style: { padding: '2px 7px', border: `1px solid ${C.tealLine}`, borderRadius: '5px', background: C.surfaceAlt, color: C.teal, cursor: 'pointer', fontSize: '10.5px', fontWeight: 700 } }, `全选 (${messages.length})`),
              h('div', { key: 'recent-group', style: { display: 'inline-flex', alignItems: 'center', gap: '3px', border: `1px solid ${C.line}`, borderRadius: '5px', padding: '1px 5px', background: C.surfaceAlt } }, [
                h('span', { key: 'span-0', style: { fontSize: '11px', color: C.muted, fontWeight: 600 } }, '最近'),
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

      /* ================= QuickEnhancer 子组件: VaultAssetCard（灵感资产卡） ================= */
      // Vault 单张资产卡：折叠态（标题 + 类型徽章 + 认识状态 + 正文预览）
      // 与展开态（元数据 + 完整正文 + 操作行）渐进披露。
      // 操作行统一用 linkBtnStyle 链接式按钮；「用于增强」最多勾 3 张（过多上下文稀释注意力）。

      // 资产卡链接式按钮的统一样式：无边框 teal 文字，破坏性动作单独覆盖颜色。
      const linkBtnStyle = { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 }

      // 认识状态的视觉三重编码：圆点色 + 文字标签（满足 WCAG 不以颜色为唯一信息通道）。
      function epistemicMetaOf(C) {
        return {
          verified: { label: '已证实', color: C.statusVerified },
          inferred: { label: '推断', color: C.statusInferred },
          to_verify: { label: '待核实', color: C.statusToVerify },
          preference: { label: '个人偏好', color: C.statusPreference },
        }
      }

      function VaultAssetCard({
        item, expanded, comparing, assetContextIds, epistemicLabel, thinkingLabel,
        onToggleExpand, onToggleFavorite, onAppend, onFill, onToggleContext, onNextAction,
        onEdit, onDerive, onRelations, onCompare, onCopy, onDelete,
      }) {
        const meta = (epistemicMetaOf(C))[item.epistemicStatus] || epistemicMetaOf(C).inferred
        return h(Card, { key: item.id }, [
          // 折叠头：标题 + 收藏星标 + 旋转 chevron；整行可点展开。
          h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } }, [
            h('button', { key: 'toggle', onClick: onToggleExpand, style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '5px', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' } }, [
              h('strong', { key: 'title', style: { fontSize: '12px', color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${item.favorite ? '★ ' : ''}${item.title}`),
              h(Icon, { key: 'chevron', name: 'chevronDown', size: 13, style: { color: C.muted, flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' } }),
            ]),
            h('button', { key: 'fav', onClick: onToggleFavorite, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', flexShrink: 0 }, title: '收藏/取消收藏' }, item.favorite ? '取消收藏' : '收藏'),
          ]),
          // 状态行：类型徽章 + 认识状态点 + 项目归属。
          h('div', { key: 'status', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '5px' } }, [
            h('span', { key: 'type', style: { display: 'inline-block', padding: '1px 7px', borderRadius: '999px', background: C.tealTint, color: C.teal, fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' } }, thinkingLabel[item.thinkingKind] || '结论'),
            h('span', { key: 'epistemic', style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: meta.color } }, [
              h('span', { key: 'dot', style: { width: '7px', height: '7px', borderRadius: '50%', background: meta.color, flexShrink: 0 } }),
              meta.label,
            ]),
            item.project ? h('span', { key: 'project', style: { color: C.muted, fontSize: '10px' } }, item.project) : null,
          ]),
          // 展开态元数据：重要性说明 / 验证状态 / 辩证三段——渐进披露，折叠态不渲染。
          expanded && item.rationale ? h('div', { key: 'rationale', style: { marginTop: '5px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `为什么重要：${item.rationale}`) : null,
          expanded && item.verification ? h('div', { key: 'verification', style: { marginTop: '4px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `验证：${item.verification.status === 'confirmed' ? '已证实' : item.verification.status === 'refuted' ? '已被推翻' : item.verification.status === 'inconclusive' ? '暂无结论' : '待验证'}${item.verification.evidence ? ` · ${item.verification.evidence}` : ''}`) : null,
          expanded && item.dialectic ? h('div', { key: 'dialectic', style: { marginTop: '4px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `观点：${item.dialectic.thesis || '—'} · 反观点：${item.dialectic.antithesis || '—'} · 综合：${item.dialectic.synthesis || '—'}`) : null,
          // 正文：折叠限高预览、展开可滚动；LaTeX 内联渲染。
          h('div', { key: 'body', style: { marginTop: '5px', color: C.slate, fontSize: '11px', lineHeight: 1.45, ...(expanded ? { maxHeight: '240px', overflow: 'auto' } : { maxHeight: '34px', overflow: 'hidden' }) } }, h(LatexText, { text: item.body, block: true })),
          // 展开态操作行：追加 / 用于增强 / 执行下一步 / 填充 / 编辑 / 派生 / 关系 /
          // 版本对比（仅有父版本时）/ 复制 / 删除（靠右、红色）。
          expanded ? h('div', { key: 'actions', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '7px' } }, [
            h('button', { key: 'append', onClick: onAppend, style: linkBtnStyle }, '追加'),
            h('button', {
              key: 'context',
              disabled: !assetContextIds.includes(item.id) && assetContextIds.length >= 3,
              onClick: onToggleContext,
              style: { ...linkBtnStyle, color: assetContextIds.includes(item.id) ? C.teal : C.slate, cursor: !assetContextIds.includes(item.id) && assetContextIds.length >= 3 ? 'not-allowed' : 'pointer' },
            }, assetContextIds.includes(item.id) ? '✓ 用于增强' : '用于增强'),
            item.nextAction ? h('button', { key: 'next', onClick: onNextAction, style: linkBtnStyle }, '执行下一步') : null,
            h('button', { key: 'replace', onClick: onFill, style: linkBtnStyle }, '填充'),
            h('button', { key: 'edit', onClick: onEdit, style: linkBtnStyle }, '编辑'),
            h('button', { key: 'derive', onClick: onDerive, style: linkBtnStyle }, '派生'),
            h('button', { key: 'relations', onClick: onRelations, style: linkBtnStyle }, '关系'),
            item.parentId ? h('button', { key: 'compare', onClick: onCompare, style: linkBtnStyle }, comparing ? '收起对比' : '版本对比') : null,
            h('button', { key: 'copy', onClick: onCopy, style: linkBtnStyle }, '复制'),
            h('button', { key: 'delete', onClick: onDelete, style: { ...linkBtnStyle, marginLeft: 'auto', color: C.red } }, '删除'),
          ]) : null,
          comparing && item.parentBody ? VersionDiff({ item }) : null,
        ])
      }

      // 版本对比：父版本（旧）与当前（新）并排双栏，只读展示。
      // parentBody 由主组件查 vaultById 后传入（parent.title 可用于后续标注）。
      function VersionDiff({ item }) {
        return h('div', { style: { marginTop: '7px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surfaceAlt, fontSize: '10px', lineHeight: 1.45, display: 'grid', gap: '5px' } }, [
          h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' } }, [
            h('div', { key: 'old', style: { whiteSpace: 'pre-wrap', color: C.muted, maxHeight: '96px', overflow: 'auto' } }, item.parentBody || ''),
            h('div', { key: 'new', style: { whiteSpace: 'pre-wrap', color: C.ink, maxHeight: '96px', overflow: 'auto' } }, item.body),
          ]),
        ])
      }

      /* ================= QuickEnhancer 子组件: EnhancerPanel（决策摘要/强度/自动增强/流式） ================= */
      // 增强面板的右列（预览侧）：决策摘要 details 容器 + 内部的各状态区块。
      // 数据流单向：全部内容由主组件计算好以 props 传入，本文件只做渲染编排。
      //   强度选择器 / 自动增强开关 → 主组件状态
      //   流式面板（阶段 + 分段 + 取消）→ streamState
      //   五维诊断 + 知识区入口 → DiagnosisSection
      //   技能引用修复提示 → skillRestore

      // 强度三档（仅语义档生效）：档位注入 host 指令控制篇幅预算（≈1x/1.5x/3x）。
      const STRENGTH_OPTIONS = [['low', '低 · 润色'], ['mid', '中 · 标准'], ['high', '高 · 展开']]

      function StrengthSelector({ value, onChange }) {
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
      function AutoEnhanceToggle({ enabled, onChange }) {
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
      function StreamPanel({ streamState, loading, onCancel }) {
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
      function SkillRestoreNode({ skillRestore, onDismiss }) {
        if (!skillRestore) return null
        return h('div', { key: 'skill-restore', role: 'status', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.amberTint, fontSize: '11px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '8px' } }, [
          h(Icon, { key: 'ic', name: 'shield', size: 13, style: { color: C.amber, flexShrink: 0 } }),
          h('span', { key: 'text', style: { flex: 1, color: C.slate } }, `已自动补回技能引用：${skillRestore.lost.join('、')}`),
          h('button', { key: 'dismiss', onClick: onDismiss, style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px', flexShrink: 0 } }, '知道了'),
        ])
      }

      // 决策摘要 details 容器：把预览侧各区块按语义档/轻量档编排。
      // 轻量档显示方法摘要 + diff + 成本 + 信号；语义档显示策略 + 流式 + 诊断 + 修复。
      function EnhancerPanel({
        mode, draft, enhancementKind, enhancementPlan, strategyNode,
        useMemoryContext, memoryPreview, onLoadMemory, memorySourceLabels, memoryReceipt,
        methodSummaryNode, diffPreview, costNode, signalsNode,
        showAdvanced, onRefine,
        methodOptions, selectedMethodId, suggestedMethod, onMethodChange,
        streamState, loading, onCancelEnhance,
        diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge,
        skillRestore, onDismissSkills,
      }) {
        const semantic = enhancementKind === 'semantic'
        return h('details', { key: 'enhancer', open: true, style: { position: 'relative', marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [
          h('summary', { key: 'title', style: { fontSize: '13px', color: C.ink, cursor: 'pointer', fontWeight: 800 } }, '增强预览'),
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

      /* ================= dsh-promptkit 组件: ConversationQuickAction（快捷助手主组件） ================= */
      // ── 快捷助手子组件（quick-enhancer/ 目录，构建器按 MODULES 顺序拼接共享符号）──

      // ConversationQuickAction（对话快捷增强器 / QuickEnhancer）：开源核心组件，零宿主依赖。
      // 所有外部能力经 props 注入；未注入的可选能力对应 UI 自动隐藏或降级：
      //   methodProvider (必填) MethodProvider：方法源 + compose + getTemplate + 收藏/历史
      //   assetProvider  (可选) AssetProvider：本地灵感库；未注入时隐藏入口
      //   composer       (必填) Composer：写入目标输入框（读写草稿均经此接口）
      //   enhancer       (可选) Enhancer：语义增强模型；未注入时仅保留「轻量 · 零 Token」档位
      //   messages       (可选) [{ id, role:'user'|'assistant', text }]：当前对话，供「加对话」参考
      //   searchMemory   (可选) (query) => Promise<string>：项目记忆检索，供「加项目记忆」档位
      //   nudgeEnabled   (可选) boolean：宿主级行为助推总开关，默认 true；与 localStorage 开关为「与」关系
      //   onSubmitDraft  (可选) (text) => void | Promise：宿主「发送当前草稿」钩子；注入后启用「发送前自动增强」
      // @ 文件引用补全不在此组件实现：DSH 原生 @ 提及已是超集，插件不得在宿主输入框上重复提供。
      function ConversationQuickAction({ methodProvider, assetProvider, composer, enhancer, messages, searchMemory, onSubmitDraft, storagePrefix = 'promptkit.', nudgeEnabled = true }) {
        const storageKey = name => `${storagePrefix}quick-action.${name}`
        const msgs = list(messages)
        const [draft, setDraft] = React.useState(() => composer?.getDraft?.() || '')
        const draftGuard = useDraftGuard(composer)
        const [, refreshSelection] = React.useState(0)
        React.useEffect(() => composer?.onSelectionChange?.(() => refreshSelection(value => value + 1)), [composer])
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
        const rootRef = React.useRef(null)
        const panelRef = React.useRef(null)
        const { closeBtnRef } = usePanelDismiss({ open, vaultOpen, setOpen, setVaultOpen, rootRef, panelRef })
        const [vaultItems, setVaultItems] = React.useState([])
        const [vaultSearch, setVaultSearch] = React.useState('')
        // 搜索防抖：斜杠菜单（slashMatches）保持即时过滤，灵感库面板用防抖值避免大数据集逐键重算。
        const [debouncedVaultSearch, setDebouncedVaultSearch] = React.useState('')
        React.useEffect(() => {
          if (vaultSearch === debouncedVaultSearch) return undefined
          const timer = setTimeout(() => setDebouncedVaultSearch(vaultSearch), 160)
          return () => clearTimeout(timer)
        }, [vaultSearch, debouncedVaultSearch])
        const [vaultProjectFilter, setVaultProjectFilter] = React.useState('')
        const [expandedVaultId, setExpandedVaultId] = React.useState('')
        const [vaultGraphFocusId, setVaultGraphFocusId] = React.useState('')
        const [vaultTab, setVaultTab] = React.useState('vault')
        const [reviewOpen, setReviewOpen] = React.useState(false)
        const [reviewCards, setReviewCards] = React.useState([])
        const [assetContextIds, setAssetContextIds] = React.useState([])
        const [assetContextReceipt, setAssetContextReceipt] = React.useState(null)
        const [slashOpen, setSlashOpen] = React.useState(false)
        const [slashActiveIndex, setSlashActiveIndex] = React.useState(0)
        // ── 语义增强强度档位（低=润色 / 中=标准 / 高=充分展开），仅语义档生效 ──
        const [enhanceStrength, setEnhanceStrength] = React.useState(() => { try { return window.localStorage.getItem(storageKey('enhance.strength.v1')) || 'mid' } catch { return 'mid' } })
        React.useEffect(() => { try { window.localStorage.setItem(storageKey('enhance.strength.v1'), enhanceStrength) } catch {} }, [enhanceStrength])
        // ── 诊断闭环（知识区）：发现 → 知识区暂存 → 用户主动决定 → Vault 思考卡 ──
        // 状态与持久化在 use-knowledge-inbox.js；这里只接出入口，主组件保留
        // promote（写 Vault 假设卡）的编排，因为它依赖 saveToVault 之外的 Vault 查重。
        const knowledge = useKnowledgeInbox({ storageKey, notice: setNotice, vaultItems })
        const knowledgeInbox = knowledge.entries
        // ── 发送前自动增强（需宿主注入 onSubmitDraft 才可用）；持久化开关 ──
        const [autoEnhanceEnabled, setAutoEnhanceEnabled] = React.useState(() => { try { return window.localStorage.getItem(storageKey('auto-enhance.enabled.v1')) === 'true' } catch { return false } })
        React.useEffect(() => { try { window.localStorage.setItem(storageKey('auto-enhance.enabled.v1'), String(autoEnhanceEnabled)) } catch {} }, [autoEnhanceEnabled])
        // ── 模板变量填充（Vault 条目含 {{var}} 时弹出补值面板）──
        const [variableFill, setVariableFill] = React.useState(null) // null | { item, values:{} }
        const {
          vaultTitle, setVaultTitle, vaultTags, setVaultTags, vaultNote, setVaultNote, vaultBody, setVaultBody,
          vaultProject, setVaultProject, vaultParentId, setVaultParentId, vaultEditingId, setVaultEditingId,
          vaultFormOpen, setVaultFormOpen, vaultCompareId, setVaultCompareId, vaultThinkingKind, setVaultThinkingKind,
          vaultEpistemicStatus, setVaultEpistemicStatus, vaultRationale, setVaultRationale, vaultNextAction, setVaultNextAction,
          vaultRelatedIds, setVaultRelatedIds, vaultDialectic, setVaultDialectic, vaultVerification, setVaultVerification,
          vaultType, setVaultType, vaultBackup, setVaultBackup,
        } = useQuickEnhancerVaultState()
        const [enhancementMethodId, setEnhancementMethodId] = React.useState('')
        const [privateMarkdown, setPrivateMarkdown] = React.useState('')
        const [privateNotice, setPrivateNotice] = React.useState('')
        const [privateBackup, setPrivateBackup] = React.useState('')
        const [privateEditingId, setPrivateEditingId] = React.useState('')
        const [confirmDeletePrivateId, setConfirmDeletePrivateId] = React.useState('')
        const [metricsEnabled, setMetricsEnabled] = React.useState(() => { try { return window.localStorage.getItem(storageKey('metrics.enabled.v1')) === 'true' } catch { return false } })
        const [metrics, setMetrics] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('metrics.v1')) || '{}') } catch { return {} } })
        // ── 极简模式（首次体验优先）：新用户默认极简态，深度功能折叠进「展开全部」──
        // 独立保存前三次成功增强的体验进度，不依赖用户是否开启详细统计。
        // 用户也可在设置里手动锁定模式。默认极简只露出：草稿状态 + 增强主按钮 + 结果。
        const [displayModePref, setDisplayModePref] = React.useState(() => { try { return window.localStorage.getItem(storageKey('display-mode.v1')) || 'auto' } catch { return 'auto' } })
        const onboarding = useOnboardingProgress(storageKey)
        const simpleMode = displayModePref === 'simple' || (displayModePref === 'auto' && !onboarding.completed)
        // 完整模式是显式偏好；自动模式即便完成引导，也先保持“看结果 → 应用”的轻路径。
        const [advancedEnhancement, setAdvancedEnhancement] = React.useState(() => displayModePref === 'full')
        const setDisplayMode = value => {
          setDisplayModePref(value)
          try { window.localStorage.setItem(storageKey('display-mode.v1'), value) } catch {}
        }
        const [feedback, setFeedback] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('feedback.v1')) || '[]') } catch { return [] } })
        const [lastEnhancement, setLastEnhancement] = React.useState(null)
        const [confirmClearMetrics, setConfirmClearMetrics] = React.useState(false)
        const [settingsOpen, setSettingsOpen] = React.useState(false)
        const [activeSettingsPanel, setActiveSettingsPanel] = React.useState(null) // null | 'import' | 'backup' | 'manage'
        const slashMatches = React.useMemo(() => {
          const query = vaultSearch.trim().toLowerCase()
          return vaultItems.filter(item => !query || `${item.title} ${(item.tags || []).join(' ')}`.toLowerCase().includes(query)).slice(0, 5)
        }, [vaultItems, vaultSearch])
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
        // ── 行为助推（方法觉醒 / 灵感库一键存）状态 ──
        const [nudgeQueue, setNudgeQueue] = React.useState([])
        const [activeNudge, setActiveNudge] = React.useState(null)
        const shownNudgeKeys = React.useRef(new Set())
        const NUDGE_OPTOUT_DAYS = 7
        // 宿主级 feature flag：prop nudgeEnabled 与 localStorage 开关取「与」，任一关闭即停发全部引导卡。
        const [nudgeKitOn, setNudgeKitOn] = React.useState(() => isNudgeKitEnabled(storageKey('nudge.enabled.v1')))
        const [confirmResetNudgeStats, setConfirmResetNudgeStats] = React.useState(false)
        const [savingNudge, setSavingNudge] = React.useState(false)
        const nudgeOptoutKey = type => storageKey(`nudge.optout.${type}`)
        const isNudgeOptedOut = type => { try { const raw = JSON.parse(window.localStorage.getItem(nudgeOptoutKey(type)) || 'null'); return !!raw && typeof raw.until === 'number' && raw.until > Date.now() } catch { return false } }
        const setNudgeOptout = type => { try { window.localStorage.setItem(nudgeOptoutKey(type), JSON.stringify({ until: Date.now() + NUDGE_OPTOUT_DAYS * 864e5 })) } catch {} }
        const { position, viewport, onPointerDown: beginDrag, consumeSuppressedClick } = useFloatingLauncher(storageKey('position.v1'))
        React.useEffect(() => { if (!open) cancelEnhance({ silent: true }) }, [open, enhancer])
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
        const keyboardRef = React.useRef(null)
        React.useEffect(() => {
          const onKeydown = event => {
            if (event.isComposing || event.keyCode === 229) return
            if (event.key === 'Escape') {
              if (vaultOpen) { event.preventDefault(); setVaultOpen(false); return }
              if (open) { event.preventDefault(); setOpen(false) }
              return
            }
            if (!(event.metaKey || event.ctrlKey)) return
            if (event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(value => !value); return }
            const current = keyboardRef.current
            if (!open || !rootRef.current?.contains(event.target) || current.loading) return
            const index = Number(event.key) - 1
            if (Number.isInteger(index) && index >= 0 && index < current.autoMethods.length) {
              event.preventDefault()
              const methodOverride = current.autoMethods[index]
              setEnhancementMethodId(methodOverride.id)
              setMode('enhance')
              void current.enhanceIntoInput({ methodOverride })
            } else if (event.key === 'Enter') {
              event.preventDefault()
              if (current.mode === 'enhance') void current.enhanceIntoInput()
              else { const choice = current.methods.find(method => method.id === current.selectedMethodId); if (choice) void current.composeIntoInput(choice) }
            }
          }
          window.addEventListener('keydown', onKeydown)
          return () => window.removeEventListener('keydown', onKeydown)
        }, [open, vaultOpen])
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
        // 手动方法默认复用当前消息框草稿；只有草稿和已选对话都为空时才要求补填问题。
        const canCompose = Boolean(requirement.trim() || selectedDraft.question || draft.trim())
        const selectedMethod = methods.find(method => method.id === selectedMethodId)
        const libraryMethod = libraryOpen ? selectedMethod : null
        const contextText = () => activeMessages.map(item => `${item.role === 'user' ? '用户' : '助手'}：${cleanContext(item.text)}`).join('\n').slice(0, 2400)
        const selectedContextText = useConversationContext ? contextText() : ''
        const referencedFiles = fileMentions(draft)
        const enhancementInput = composer?.getSelection?.()?.text || draft
        const autoMethods = recommendMethods(methods, [enhancementInput, requirement, selectedContextText].filter(Boolean).join('\n'))
        const matchedMethod = methods.find(method => method.id === enhancementMethodId) || autoMethods[0]
        // 异步记忆检索的代际守卫：返回时若 query 已变化则丢弃过期结果，避免旧摘要覆盖新输入。
        const memoryRequestId = React.useRef(0)
        const loadMemory = async query => {
          const text = String(query || '').trim()
          if (!searchMemory) throw new Error('项目记忆服务未连接。')
          if (text.length < 8) throw new Error('草稿至少 8 个字符后再检索项目记忆。')
          const requestId = ++memoryRequestId.current
          const commit = preview => { if (memoryRequestId.current === requestId) setMemoryPreview(preview) }
          commit({ status: 'loading', query: text, text: '', sources: [] })
          try {
            const raw = await searchMemory(text)
            const result = cleanContext(typeof raw === 'string' ? raw : raw?.text || '')
            const sources = Array.isArray(raw?.sources) ? raw.sources.filter(item => item?.label).slice(0, 6) : result ? [{ kind: 'memory-center', label: 'Memory Center 项目记忆' }] : []
            const next = { status: result || sources.length ? 'ready' : 'empty', query: text, text: result, sources }
            commit(next)
            return result
          } catch (error) {
            commit({ status: 'error', query: text, text: String(error?.message || error), sources: [] })
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
        // ── Vault 保存：唯一写入路径。body 是正文，provenance 记来源（增强/复盘/手动捕获）──
        const saveToVault = async (body, provenance = {}, titleOverride) => {
          if (!assetProvider) { setWarn('当前宿主未连接灵感库。'); return }
          try {
            const item = await assetProvider.save({
              id: vaultEditingId || undefined,
              title: titleOverride ?? vaultTitle,
              body,
              tags: vaultTags,
              note: vaultNote,
              type: vaultType,
              project: vaultProject,
              parentId: vaultParentId,
              thinkingKind: vaultThinkingKind,
              epistemicStatus: vaultEpistemicStatus,
              rationale: vaultRationale,
              nextAction: vaultNextAction,
              relatedIds: vaultRelatedIds,
              dialectic: vaultThinkingKind === 'dialectic' ? vaultDialectic : undefined,
              verification: vaultThinkingKind === 'assumption' || vaultEpistemicStatus === 'to_verify' ? vaultVerification : undefined,
              // 注入思考卡上下文时记录来源卡 id，形成「卡 → 增强 → 新卡」的可追溯链。
              provenance: { ...provenance, ...(assetContextReceipt ? { contextAssetIds: assetContextReceipt.ids } : {}) },
            })
            const action = vaultEditingId ? '已更新' : '已保存'
            // 保存成功后重置捕获表单（保持派生/编辑语义字段一并清空，避免污染下一次捕获）。
            setVaultTitle(''); setVaultTags(''); setVaultNote(''); setVaultBody(''); setVaultParentId('')
            setVaultEditingId(''); setVaultFormOpen(false); setVaultThinkingKind('conclusion')
            setVaultEpistemicStatus('inferred'); setVaultRationale(''); setVaultNextAction('')
            setVaultRelatedIds([]); setVaultDialectic({ thesis: '', antithesis: '', synthesis: '' })
            setVaultVerification({ status: 'pending', evidence: '', checkedAt: 0 })
            setNotice(`${action}「${item.title}」。`)
            return item
          } catch (error) { setError(String(error?.message || error)); return null }
        }
        // Vault 条目 → 消息框。mode='append' 追加在草稿后 / 'replace' 整条替换；
        // /pk 斜杠调用等价于替换（当前草稿只是命令本身）。
        const useVaultItem = async (item, mode = 'append') => {
          if (!item?.body) return
          const current = composer?.getDraft?.() || ''
          const slashInvocation = current.match(/^\/pk(?:\s+.*|:.*)?$/i)
          // 模板变量：条目含 {{var}} 时先弹补值面板，用户确认后再写入（追加或替换语义不变）。
          if (templateVariables(item.body).length) {
            setVariableFill({ item, mode, current, slashInvocation, values: {} })
            setSlashOpen(false)
            return
          }
          await applyVaultItem(item, mode, current, slashInvocation)
        }
        // 变量补值确认后的实际写入；与 useVaultItem 共用，values 为 {{name}} → 文本映射。
        const applyVaultItem = async (item, mode, current, slashInvocation, values) => {
          const filled = fillTemplateVariables(item.body, values || {})
          const next = slashInvocation ? filled : mode === 'replace' ? filled : withPrefix(current, filled)
          composer?.write(next)
          await assetProvider?.markUsed?.(item.id)
          setUndoDraft({ before: draft, after: next })
          setNotice(`已${slashInvocation || mode === 'replace' ? '插入' : '追加'}「${item.title}」到消息框，可编辑后发送。`)
          // 只关抽屉不动主面板：抽屉是主面板的 DOM 后代，此处的 setOpen(false) 会在用户
          // 随后正常关闭抽屉时让整个插件直接消失，表现为“关灵感库连主题插件一起关”。
          setSlashOpen(false); setVaultOpen(false)
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
          // 与 useVaultItem 同理：抽屉内动作只关抽屉，setOpen(false) 会连主面板一起卸载。
          setVaultOpen(false)
        }
        const deriveVaultItem = item => {
          setVaultTitle(`${item.title} · 变体`); setVaultBody(item.body)
          setVaultTags((item.tags || []).join(', ')); setVaultType(item.type || 'prompt')
          setVaultProject(item.project || ''); setVaultParentId(item.id); setVaultEditingId('')
          setVaultFormOpen(true)
          // 派生保留父卡的认识元数据；保存时 parentId 已设置，版本对比随之可用。
          setVaultThinkingKind(item.thinkingKind || 'conclusion')
          setVaultEpistemicStatus(item.epistemicStatus || 'inferred')
          setVaultRationale(item.rationale || ''); setVaultNextAction(item.nextAction || '')
          setVaultRelatedIds(item.relatedIds || [])
          setVaultDialectic(item.dialectic || { thesis: '', antithesis: '', synthesis: '' })
          setVaultVerification(item.verification || { status: 'pending', evidence: '', checkedAt: 0 })
          setNotice(`已载入「${item.title}」作为派生版本；编辑后保存即可保留来源关系。`)
        }
        const editVaultItem = item => {
          setVaultEditingId(item.id)
          setVaultTitle(item.title); setVaultBody(item.body)
          setVaultTags((item.tags || []).join(', ')); setVaultNote(item.note || '')
          setVaultType(item.type || 'prompt'); setVaultProject(item.project || '')
          setVaultParentId(item.parentId || ''); setVaultFormOpen(true)
          setVaultThinkingKind(item.thinkingKind || 'conclusion')
          setVaultEpistemicStatus(item.epistemicStatus || 'inferred')
          setVaultRationale(item.rationale || ''); setVaultNextAction(item.nextAction || '')
          setVaultRelatedIds(item.relatedIds || [])
          setVaultDialectic(item.dialectic || { thesis: '', antithesis: '', synthesis: '' })
          setVaultVerification(item.verification || { status: 'pending', evidence: '', checkedAt: 0 })
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
        // ───────── 行为助推：方法觉醒 + 灵感库一键存 ─────────
        // 埋点：经 window CustomEvent 暴露，由 NudgeMetrics（nudge-metrics.js）本地消费，零遥测。
        React.useEffect(() => { mountNudgeMetrics(storagePrefix) }, [storagePrefix])
        React.useEffect(() => { if (activeNudge) trackNudge(activeNudge.type, 'impress', { method_id: activeNudge.methodId }) }, [activeNudge])
        const trackNudge = (type, action, detail = {}) => {
          try { window.dispatchEvent(new CustomEvent(nudgeEventName(storagePrefix), { detail: { type, action, ts: Date.now(), ...detail } })) } catch {}
        }
        const deriveVaultTitle = (src, method) => {
          const head = (src || '').trim().replace(/\s+/g, ' ').slice(0, 18)
          const tag = method ? method.title : '增强'
          return head ? `${tag} · ${head}` : `${tag}结果`
        }
        const pushNudges = candidates => {
          if (!nudgeEnabled || !nudgeKitOn) return // 宿主级 / 用户级总开关：关闭时一个引导卡都不发
          const accepted = candidates.filter(c => {
            if (!c) return false
            if (isNudgeOptedOut(c.type)) return false
            if (c.type === 'awaken' && shownNudgeKeys.current.has(`awaken:${c.methodId}`)) return false
            if (c.type === 'vault' && shownNudgeKeys.current.has('vault')) return false
            return true
          })
          if (!accepted.length) return
          setNudgeQueue(prev => [...prev, ...accepted])
          setActiveNudge(prev => prev || accepted[0])
        }
        const advanceNudge = () => {
          setNudgeQueue(prev => prev.slice(1))
          setActiveNudge(null)
        }
        // 队列推进后由 effect 同步下一张卡：setter 保持纯调用，不在 updater 里嵌套 setState。
        React.useEffect(() => {
          if (!activeNudge && nudgeQueue.length) setActiveNudge(nudgeQueue[0])
        }, [activeNudge, nudgeQueue])
        const dismissNudge = (nudge, action) => {
          trackNudge(nudge.type, action, { method_id: nudge.methodId })
          if (nudge.type === 'awaken') shownNudgeKeys.current.add(`awaken:${nudge.methodId}`)
          if (nudge.type === 'vault') shownNudgeKeys.current.add('vault')
          if (action === 'dismiss') setNudgeOptout(nudge.type)
          advanceNudge()
        }
        const onAcceptVault = async nudge => {
          if (savingNudge) return
          setSavingNudge(true)
          const saved = await saveToVault(nudge.body, { kind: 'nudge-quick-save', method: nudge.methodTitle }, nudge.draftTitle)
          setSavingNudge(false)
          if (!saved) return
          trackNudge('vault', 'accept', { method_id: nudge.methodId })
          shownNudgeKeys.current.add('vault')
          advanceNudge()
        }
        // 草稿桥：把当前输入框内容一键带进方法工坊（Studio），零重填。
        // 经 window CustomEvent + sessionStorage 双通道：事件即时送达已挂载的 Studio，
        // sessionStorage 兜底 Studio 尚未挂载（视图未打开）的场景，挂载时再取。
        const bridgeKey = studioBridgeStorageKey(storagePrefix)
        const openStudioWithDraft = (methodId = '') => {
          // 以 Composer 为准，避免 React 草稿状态尚未同步时把空字符串带进工坊。
          const currentDraft = composer?.getDraft?.() || draft
          const payload = { draft: currentDraft, methodId: methodId || '' }
          try { window.sessionStorage.setItem(bridgeKey, JSON.stringify(payload)) } catch {}
          // 某些 DSH 视图切换会重建 sessionStorage 监听时机；同页临时载荷作为兜底，
          // 仅由 PromptStudio 消费一次，不做持久化。
          try { window.__promptkitStudioPendingDraft = JSON.stringify(payload) } catch {}
          try { window.dispatchEvent(new CustomEvent(studioBridgeEventName(storagePrefix), { detail: { ...payload, ts: Date.now() } })) } catch {}
          // 工坊视图未被选中时不会挂载，无法依赖它自己监听事件；直接激活宿主标签，
          // 随后由 PromptStudio 的 sessionStorage 兜底逻辑消费并预填草稿。
          const studioTab = [...document.querySelectorAll('[role="tab"], button')].find(node => String(node.textContent || '').trim() === '高级方法工坊')
          if (studioTab && typeof studioTab.click === 'function') {
            // 工坊成为主页面后，快捷增强器不应继续悬浮遮挡编辑区域。
            setOpen(false)
            studioTab.click()
            // 第一次切换时 PromptStudio 此刻才会挂载；下一帧补发事件，让已挂载的
            // 监听器直接接到同一份载荷，避免必须点第二次才完成预填。
            window.setTimeout(() => {
              try { window.dispatchEvent(new CustomEvent(studioBridgeEventName(storagePrefix), { detail: { ...payload, ts: Date.now() } })) } catch {}
            }, 0)
            setNotice('已打开高级方法工坊，草稿已预填，可继续补充事实与约束。')
          } else {
            setNotice('草稿已带到方法工坊；请切换到「高级方法工坊」查看已预填的问题。')
          }
        }
        // 用户级开关：写入 localStorage（宿主级持久关闭同一把钥匙），关闭时清空队列与当前卡。
        const toggleNudgeKit = () => {
          const next = !nudgeKitOn
          setNudgeKitOn(next)
          setNudgeKitEnabled(next, storageKey('nudge.enabled.v1'))
          if (!next) { setNudgeQueue([]); setActiveNudge(null) }
        }
        // 手动选方法 → 组装 → 填入消息框（与增强不同：直接按方法结构生成，不经过改写）。
        const composeIntoInput = async choice => {
          if (!choice || !composer) return
          const source = useConversationContext ? activeMessages : []
          if (!canCompose) { setWarn('请输入本次要求或问题；也可以选择一条用户消息作为问题。'); return }
          setLoading(true)
          const snapshot = draftGuard.capture()
          try {
            const conversationDraft = selectedConversationDraft(source)
            const explicitRequirement = requirement.trim()
            // 问题的取值优先级：补充要求 > 已选对话的最后一条用户消息 > 当前草稿。
            const question = explicitRequirement || conversationDraft.question || draft.trim()
            let facts = [explicitRequirement && conversationDraft.question ? `对话中的原始问题：${conversationDraft.question}` : '', conversationDraft.facts].filter(Boolean).join('\n')
            if (useMemoryContext && searchMemory) {
              const remembered = memoryPreview.status === 'ready' && memoryPreview.query === question ? memoryPreview.text : await loadMemory(question)
              if (remembered) facts = [facts, `项目记忆：${remembered}`].filter(Boolean).join('\n')
            }
            const composed = await methodProvider.compose({ methodId: choice.id, question, facts, constraints: conversationDraft.constraints, options: conversationDraft.options })
            const next = draftGuard.commit(snapshot, withPrefix(snapshot.before, composed.prompt))
            setUndoDraft({ before: snapshot.before, after: next })
            rememberMethod(choice, question)
            // 用法计数与最近方法：本地持久化，驱动「常用 3 个」排序与方法收集进度。
            setMethodUsage(value => {
              const nextUsage = { ...value, [choice.id]: Number(value[choice.id] || 0) + 1 }
              try { window.localStorage.setItem(storageKey('method-usage.v1'), JSON.stringify(nextUsage)) } catch {}
              return nextUsage
            })
            setRecentMethodIds(value => {
              const nextRecent = [choice.id, ...value.filter(id => id !== choice.id)].slice(0, 3)
              try { window.localStorage.setItem(storageKey('recent-methods.v1'), JSON.stringify(nextRecent)) } catch {}
              return nextRecent
            })
            setNotice(`已按“${choice.title}”${source.length ? `整理 ${source.length} 条消息并` : ''}填入输入框，可编辑后发送。`)
            setOpen(false)
          } catch (error) { setError(String(error?.message || error)) }
          finally { setLoading(false) }
        }
        const fillLibraryTemplate = async () => {
          if (!libraryMethod) return
          setLoading(true)
          const snapshot = draftGuard.capture()
          try {
            const template = await methodProvider.getTemplate(libraryMethod.id)
            const after = draftGuard.commit(snapshot, template.prompt)
            setUndoDraft({ before: snapshot.before, after })
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
          const snapshot = draftGuard.capture()
          try {
            const template = await methodProvider.getTemplate(libraryMethod.id)
            draftGuard.assertCurrent(snapshot)
            const body = await enhancer.enhance({ draft, extra: requirement, lang: detectLanguage(draft), kind: 'semantic', method: { title: libraryMethod.title, template: template.prompt } })
            if (typeof body?.prompt !== 'string' || !body.prompt.trim()) throw new Error('模型未返回有效正文，草稿未改动。')
            const after = draftGuard.commit(snapshot, restoreLostSkillMentions(snapshot.before, body.prompt) || body.prompt)
            setUndoDraft({ before: snapshot.before, after })
            onboarding.recordSuccess()
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
        const { enhanceIntoInput, cancelEnhance, enhanceDiagnosis, diagnosisMethod, streamState, setStreamState, skillRestore, setSkillRestore } = useEnhancementFlow({
          composer, enhancer, draft, draftGuard, importCard, setLoading,
          config: { enhancementKind, enhanceStrength, requirement, matchedMethod, selectedContextText, referencedFiles, useMemoryContext },
          context: { vaultItems, assetContextIds, memoryPreview, searchMemory, loadMemory, methodProvider },
          getPlan: (text, method) => createEnhancementPlan(text, method),
          notice: { setNotice, setWarn, setError, setMemoryReceipt },
          onDiagnosis: (...args) => enqueueDiagnosisFindings(...args),
          onApplied: ({ original, after, selection, matchedMethod, kind, method, remembered, contextAssets }) => {
            onboarding.recordSuccess()
            setUndoDraft({ before: selection?.draft || original, after })
            rememberMethod(matchedMethod, original)
            recordUsage({ kind, method })
            setLastEnhancement({ kind, method })
            setOutcomePending({ kind, method })
            if (kind !== 'semantic') return
            setMemoryReceipt(useMemoryContext ? { used: Boolean(remembered), text: remembered, sources: memoryPreview.query === original ? memoryPreview.sources : [] } : null)
            setAssetContextReceipt(contextAssets.length ? { ids: contextAssets.map(item => item.id), titles: contextAssets.map(item => item.title) } : null)
            if (matchedMethod) setMethodUsage(value => {
              const nextUsage = { ...value, [matchedMethod.id]: Number(value[matchedMethod.id] || 0) + 1 }
              try { window.localStorage.setItem(storageKey('method-usage.v1'), JSON.stringify(nextUsage)) } catch {}
              return nextUsage
            })
            pushNudges([
              matchedMethod ? { type: 'awaken', methodId: matchedMethod.id, methodTitle: matchedMethod.title } : null,
              { type: 'vault', methodId: matchedMethod?.id, methodTitle: matchedMethod?.title, body: after, draftTitle: deriveVaultTitle(original, matchedMethod) }
            ])
          },
        })
        useAutoEnhance({ enabled: autoEnhanceEnabled, composer, enhancer, onSubmitDraft, strength: enhanceStrength, draftGuard, loading, setLoading, setStreamState, setNotice, setWarn, setError })
        const common = ['苏格拉底式提问', '第一性原理', '双向钢人论证'].map(title => methodChoice(methods, title)).filter(Boolean)
        // 快捷键仍可直达常用方法；这里不把常用方法当成“智能推荐”的兜底，避免 UI 误称为自动判断。
        keyboardRef.current = { enhanceIntoInput, composeIntoInput, autoMethods: autoMethods.length ? autoMethods : common, mode, methods, selectedMethodId, loading }
        const recommended = autoMethods
        const recentMethods = recentMethodIds.map(id => methods.find(method => method.id === id)).filter(Boolean)
        const libraryMatches = methods.filter(method => !librarySearch.trim() || `${method.title} ${method.purpose} ${method.tags}`.toLowerCase().includes(librarySearch.trim().toLowerCase()))
        const vaultView = React.useMemo(() => {
          const query = debouncedVaultSearch.trim().toLowerCase()
          const byId = new Map(vaultItems.map(item => [item.id, item]))
          const vaultMatches = vaultItems.filter(item => (!vaultProjectFilter || item.project === vaultProjectFilter) && (!query || `${item.title} ${item.body} ${item.note || ''} ${(item.tags || []).join(' ')}`.toLowerCase().includes(query)))
          const now = Date.now()
          return {
            byId,
            vaultMatches,
            vaultProjects: [...new Set(vaultItems.map(item => item.project).filter(Boolean))].sort(),
            attentionGroups: {
              pending: vaultItems.filter(item => item.verification?.status === 'pending' || item.epistemicStatus === 'to_verify'),
              action: vaultItems.filter(item => item.nextAction && item.verification?.status !== 'confirmed'),
              review: vaultItems.filter(item => item.verification?.status === 'refuted' || (item.epistemicStatus === 'inferred' && now - Number(item.updatedAt || 0) > 1000 * 60 * 60 * 24 * 30)),
            },
          }
        }, [vaultItems, debouncedVaultSearch, vaultProjectFilter])
        const { byId: vaultById, vaultMatches, vaultProjects, attentionGroups } = vaultView
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
          const focus = vaultById.get(vaultGraphFocusId)
          if (!focus) return null
          const related = vaultItems.filter(item => focus.relatedIds?.includes(item.id) || item.relatedIds?.includes(focus.id) || item.parentId === focus.id || focus.parentId === item.id)
          const graphNodes = related.length ? related.map(item => h('button', { key: item.id, onClick: () => setVaultGraphFocusId(item.id), style: { maxWidth: '150px', padding: '5px 7px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.title)) : [h('span', { key: 'empty', style: { color: C.muted } }, '暂无关联资产；编辑时可建立关系。')]
          return h(Card, { tint: true, fontSize: '11px' }, [
            h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between' } }, [h('strong', { key: 'title' }, '关系图谱'), h('button', { key: 'close', onClick: () => setVaultGraphFocusId(''), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer' } }, '关闭')]),
            h('div', { key: 'graph', style: { display: 'grid', justifyItems: 'center', gap: '5px', marginTop: '7px' } }, [h('button', { key: 'focus', onClick: () => editVaultItem(focus), style: { maxWidth: '95%', padding: '6px 9px', border: `1px solid ${C.teal}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, focus.title), related.length ? h('div', { key: 'edges', style: { color: C.teal, letterSpacing: '8px' } }, '↙ ↓ ↘') : null, h('div', { key: 'nodes', style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' } }, graphNodes)]),
          ])
        })()
        const vaultTabLabels = [['vault', '灵感库'], ['inbox', '收件箱'], ['knowledge', '知识区'], ['graph', '图谱']]
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
            h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '13px' } }, '关系图谱 · 全貌'), h('div', { key: 'hint', style: { marginTop: '2px', color: C.muted, fontSize: '10px' } }, '点击节点查看关联；异常已高亮（红=被推翻 / 黄=待验证 / 灰虚线=久未更新）。')]),
            vaultGraphFocusId ? h('button', { key: 'back', onClick: () => setVaultGraphFocusId(''), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800, flexShrink: 0 } }, '返回全貌') : null,
          ]),
          vaultGraphFocusId ? graphPanel : graphOverview,
        ])
        // 知识区 tab 的渲染已拆至 quick-enhancer/knowledge-tab.js（KnowledgeTab）。
        const reviewPanel = reviewOpen ? h('section', { role: 'dialog', 'aria-label': '对话复盘', style: { position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)', width: 'min(540px, calc(100vw - 32px))', maxHeight: '76vh', overflowY: 'auto', padding: '16px', boxSizing: 'border-box', border: `1px solid ${C.tealLine}`, borderRadius: '14px', background: C.surface, boxShadow: C.shadowLg, zIndex: 20003 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between' } }, [h('div', { key: 'title' }, [h('strong', { key: 'strong-0', style: { fontSize: '16px' } }, '对话收束'), h('div', { key: 'div-1', style: { marginTop: '3px', color: C.muted, fontSize: '11px' } }, '确认后才会生成并关联思考卡。')]), h('button', { key: 'button-1', onClick: () => setReviewOpen(false), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer' } }, '关闭 ×')]), ...reviewCards.map(card => h('label', { key: card.id, style: { display: 'grid', gridTemplateColumns: '18px 1fr', gap: '8px', marginTop: '9px', padding: '8px', border: `1px solid ${card.checked ? C.tealLine : C.line}`, borderRadius: '8px', background: card.checked ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { key: 'input-0', type: 'checkbox', checked: card.checked, onChange: () => setReviewCards(cards => cards.map(item => item.id === card.id ? { ...item, checked: !item.checked } : item)), style: { accentColor: C.teal } }), h('div', { key: 'div-1' }, [h('strong', { key: 'strong-0', style: { fontSize: '12px' } }, card.title), h('div', { key: 'div-1', style: { marginTop: '3px', color: C.muted, fontSize: '10px' } }, `${thinkingLabel[card.thinkingKind]} · ${epistemicLabel[card.epistemicStatus]}`), h('div', { key: 'div-2', style: { marginTop: '3px', color: C.slate, fontSize: '11px', whiteSpace: 'pre-wrap' } }, card.body)])])), h('button', { key: 'save', onClick: saveConversationReview, style: { ...workbenchStyle.actionPrimary, width: '100%', marginTop: '12px' } }, '确认并沉淀为思考卡')]) : null
        const versionDiff = item => {
          const parent = item.parentId ? vaultById.get(item.parentId) : null
          return h('div', { style: { marginTop: '7px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surfaceAlt, fontSize: '10px', lineHeight: 1.45 } }, parent ? [h('strong', { key: 'title', style: { color: C.teal } }, `与「${parent.title}」对比`), h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '5px' } }, [h('div', { key: 'old', style: { whiteSpace: 'pre-wrap', color: C.muted, maxHeight: '96px', overflow: 'auto' } }, parent.body), h('div', { key: 'new', style: { whiteSpace: 'pre-wrap', color: C.ink, maxHeight: '96px', overflow: 'auto' } }, item.body)])] : '此资产没有可比较的父版本。')
        }
        // 第 2 步（主动）：用户在知识区点「存为假设卡」才真正写入 Vault。
        // assumption + to_verify：进入收件箱待验证队列；provenance.fingerprint 保留查重线索。
        const promoteKnowledgeItem = async entry => {
          if (!assetProvider) return
          if (knowledge.existsInVault(entry.fingerprint)) {
            setNotice(`「${entry.label}」这条发现已存过卡，已从知识区移除。`)
            return knowledge.dismiss(entry.id)
          }
          const body = [`诊断发现：${entry.finding}`, `原草稿（节选）：${entry.draft}`, `待验证问题：${entry.hint}——请补充证据或反例，验证后更新此卡状态。`].join('\n')
          try {
            const item = await assetProvider.save({
              title: `${entry.label} · ${cleanSummary(entry.draft).slice(0, 24)}`,
              body,
              type: 'insight',
              thinkingKind: 'assumption',
              epistemicStatus: 'to_verify',
              verification: { status: 'pending', evidence: '', checkedAt: 0 },
              provenance: { kind: 'diagnosis', dimension: entry.dimension, fingerprint: entry.fingerprint, method: entry.method || '' },
            })
            setNotice(`已存为待验证假设卡「${item.title}」；收件箱可跟进验证，增强时勾选「用于增强」即注入。`)
            return knowledge.dismiss(entry.id)
          } catch (error) { setError(String(error?.message || error)) }
        }

        // 入区薄封装：hook 管队列与持久化；notice（新增计数提示）留在主组件发，
        // 因为入区在增强完成时触发，提示应与「语义增强完成」一起出现。
        const enqueueDiagnosisFindings = (diagnosis, sourceDraft, methodTitle) => {
          const added = knowledge.enqueue(diagnosis, sourceDraft, methodTitle)
          if (added) setNotice(`本次诊断发现 ${added} 条认识缺口，已放入灵感库「知识区」待你审阅——可存为假设卡或忽略。`)
        }

        // 视口度量：抽屉/面板宽度与极简窄屏判断都依赖它，必须在使用点之前定义。
        const vw = viewport?.width || (typeof window !== 'undefined' ? window.innerWidth : 1024)
        const wide = vw >= 620
        // 窄屏适配：<480px 时面板/抽屉铺满视口，避免双栏挤压成不可读的单列。
        const panelW = vw < 480 ? vw - 32 : Math.min(wide ? 640 : 440, vw - 32)
        const panelLeft = floatingPanelLeft(position.x, vw, panelW)
        const panelOffset = panelLeft - position.x
        const vaultPanel = assetProvider ? h('aside', { key: 'vault-panel', ref: panelRef, popover: 'manual', role: 'dialog', 'aria-label': '灵感库', style: { position: 'fixed', inset: '0 0 auto auto', margin: 0, border: 0, width: vw < 480 ? 'calc(100vw - 16px)' : 'min(390px, calc(100vw - 24px))', height: '100vh', overflowY: 'auto', padding: '18px', boxSizing: 'border-box', borderLeft: `1px solid ${C.tealLine}`, background: C.surface, boxShadow: '-16px 0 38px var(--pk-shadow-lg)', zIndex: 20002, display: 'grid', alignContent: 'start', gap: '10px' } }, [
          h('div', { key: 'head', style: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 } }, [
            // 左侧圆形控制沿用灵感库的 teal 主题；保留 macOS 式位置语义，但不引入突兀的红色。
            h('button', { key: 'close', ref: closeBtnRef, type: 'button', title: '关闭灵感库', 'aria-label': '关闭灵感库', onMouseEnter: event => { event.currentTarget.style.background = C.tealTint; event.currentTarget.style.borderColor = C.tealLineStrong }, onMouseLeave: event => { event.currentTarget.style.background = C.surfaceAlt; event.currentTarget.style.borderColor = C.tealLine }, style: { width: '26px', height: '26px', padding: 0, border: `1px solid ${C.tealLine}`, borderRadius: '50%', background: C.surfaceAlt, color: C.teal, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,.12)' } }, h(Icon, { key: 'icon', name: 'close', size: 14, strokeWidth: 2 })),
            h('strong', { key: 'title', style: { fontSize: '16px' } }, '灵感库'),
          ]),
          tabBar,
          vaultTab === 'vault' ? h('div', { key: 'vault-wrap', style: { display: 'grid', gap: '10px' } }, [
          h('details', { key: 'capture-details', open: vaultFormOpen, onToggle: event => setVaultFormOpen(event.currentTarget.open), style: { border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('summary', { key: 'summary', style: { padding: '10px 11px', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, vaultEditingId ? '编辑灵感资产' : vaultParentId ? '保存派生版本' : '+ 新建灵感'),
          h('div', { key: 'capture', style: { padding: '0 11px 11px' } }, [
            h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '捕获当前灵感'),
            h('div', { key: 'hint', style: { marginTop: '3px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, `填写正文即可保存；也可留空直接保存 DSH 主输入框草稿（当前 ${draft.trim().length} 字）。数据仅存于本地浏览器。`),
            h('div', { key: 'fields', style: { display: 'grid', gridTemplateColumns: '1fr 86px', gap: '6px', marginTop: '8px' } }, [
              h('input', { key: 'name', value: vaultTitle, onChange: e => setVaultTitle(e.target.value), placeholder: '备注名（可选）', style: { ...workbenchStyle.input, padding: '7px 8px', fontSize: '11px' } }),
              h('select', { key: 'type', value: vaultType, onChange: e => setVaultType(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [h('option', { key: 'prompt', value: 'prompt' }, '成品 Prompt'), h('option', { key: 'snippet', value: 'snippet' }, '对话片段'), h('option', { key: 'insight', value: 'insight' }, '结论卡')]),
            ]),
            h('input', { key: 'tags', value: vaultTags, onChange: e => setVaultTags(e.target.value), placeholder: '标签，逗号分隔（如：代码, 评审）', style: { ...workbenchStyle.input, marginTop: '6px', padding: '7px 8px', fontSize: '11px' } }),
            h('input', { key: 'project', value: vaultProject, onChange: e => setVaultProject(e.target.value), placeholder: '项目集合（可选，例如：PromptKit 发布）', style: { ...workbenchStyle.input, marginTop: '6px', padding: '7px 8px', fontSize: '11px' } }),
            h('div', { key: 'thinking', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' } }, [
              h('select', { key: 'thinking-kind', value: vaultThinkingKind, onChange: e => setVaultThinkingKind(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['question','问题'],['goal','目标'],['fact','事实'],['assumption','假设'],['decision','决策'],['method','方法'],['conclusion','结论'],['action','行动'],['dialectic','辩证卡']].map(([value,label]) => h('option', { key: value, value }, label))),
              h('select', { key: 'epistemic-status', value: vaultEpistemicStatus, onChange: e => setVaultEpistemicStatus(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['verified','已证实'],['inferred','推断'],['to_verify','待核实'],['preference','个人偏好']].map(([value,label]) => h('option', { key: value, value }, label))),
            ]),
            h('button', { key: 'suggest', onClick: () => { const suggestion = suggestThinkingCard(vaultBody || draft); setVaultThinkingKind(suggestion.kind); setVaultEpistemicStatus(suggestion.epistemic); setNotice('已给出本地分类建议，请自行确认后保存。') }, style: { ...workbenchStyle.action, marginTop: '6px', fontSize: '11px' } }, '按内容建议分类（本地）'),
            h('textarea', { key: 'rationale', value: vaultRationale, onChange: e => setVaultRationale(e.target.value), placeholder: '为什么重要 / 我的解释（可选）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            h('textarea', { key: 'next-action', value: vaultNextAction, onChange: e => setVaultNextAction(e.target.value), placeholder: '下一步行动（可选，例如：验证 Controller 映射）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),
            (vaultThinkingKind === 'assumption' || vaultEpistemicStatus === 'to_verify') ? h('div', { key: 'verification', style: { display: 'grid', gap: '6px', marginTop: '6px', padding: '7px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px' } }, [h('select', { key: 'status', value: vaultVerification.status, onChange: e => setVaultVerification(value => ({ ...value, status: e.target.value, checkedAt: e.target.value === 'pending' ? 0 : Date.now() })), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [['pending','待验证'],['confirmed','已证实'],['refuted','已被推翻'],['inconclusive','暂无结论']].map(([value,label]) => h('option', { key: value, value }, label))), h('textarea', { key: 'evidence', value: vaultVerification.evidence, onChange: e => setVaultVerification(value => ({ ...value, evidence: e.target.value })), placeholder: '验证证据或结果（可选）', style: { ...workbenchStyle.input, width: '100%', minHeight: '42px', resize: 'vertical', fontSize: '11px' } })]) : null,
            vaultThinkingKind === 'dialectic' ? h('div', { key: 'dialectic', style: { display: 'grid', gap: '5px', marginTop: '6px' } }, [
              h('textarea', { key: 'thesis', value: vaultDialectic.thesis || '', onChange: e => setVaultDialectic(value => ({ ...value, thesis: e.target.value })), placeholder: '观点', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
              h('textarea', { key: 'antithesis', value: vaultDialectic.antithesis || '', onChange: e => setVaultDialectic(value => ({ ...value, antithesis: e.target.value })), placeholder: '反观点', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
              h('textarea', { key: 'synthesis', value: vaultDialectic.synthesis || '', onChange: e => setVaultDialectic(value => ({ ...value, synthesis: e.target.value })), placeholder: '当前综合', style: { ...workbenchStyle.input, width: '100%', minHeight: '38px', resize: 'vertical', fontSize: '11px' } }),
            ]) : null,
            vaultItems.length ? h('select', { key: 'select-11', multiple: true, value: vaultRelatedIds, onChange: e => setVaultRelatedIds([...e.target.selectedOptions].map(option => option.value)), style: { width: '100%', minHeight: '54px', marginTop: '6px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '10px' } }, vaultItems.filter(item => item.id !== vaultEditingId).map(item => h('option', { key: item.id, value: item.id }, `关联：${item.title}`))) : null,
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
            vaultProjects.length ? h('select', { key: 'project-filter', value: vaultProjectFilter, onChange: e => setVaultProjectFilter(e.target.value), style: { border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surface, fontSize: '11px' } }, [h('option', { key: 'option-0', value: '' }, '全部项目'), ...vaultProjects.map(project => h('option', { key: project, value: project }, project))]) : null,
          ]),
          h('div', { key: 'project-actions', style: { display: 'flex', gap: '8px' } }, [h('button', { key: 'export', onClick: exportProjectMarkdown, style: { ...workbenchStyle.action, fontSize: '11px' } }, '导出项目复盘 Markdown'), h('button', { key: 'organize', onClick: organizeVault, style: { ...workbenchStyle.action, fontSize: '11px' } }, '本地整理建议')]),
          h('details', { key: 'backup', style: { padding: '8px 9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface, fontSize: '11px' } }, [
            h('summary', { key: 'summary', style: { color: C.teal, cursor: 'pointer', fontWeight: 800 } }, '备份或恢复灵感库'),
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
            // 展开态操作行：统一的链接式按钮（teal 文字按钮），只读 + 可变动作混排。
            expandedVaultId === item.id ? h('div', { key: 'actions', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '7px' } }, [
              h('button', { key: 'append', onClick: () => useVaultItem(item), style: linkBtnStyle }, '追加'),
              // 「用于增强」上限 3 张：过多上下文会稀释模型注意力。
              h('button', {
                key: 'context',
                disabled: !assetContextIds.includes(item.id) && assetContextIds.length >= 3,
                onClick: () => toggleAssetContext(item.id),
                style: { border: 0, background: 'transparent', color: assetContextIds.includes(item.id) ? C.teal : C.slate, cursor: !assetContextIds.includes(item.id) && assetContextIds.length >= 3 ? 'not-allowed' : 'pointer', fontSize: '11px', fontWeight: 800 },
              }, assetContextIds.includes(item.id) ? '✓ 用于增强' : '用于增强'),
              item.nextAction ? h('button', { key: 'next', onClick: () => runNextAction(item), style: linkBtnStyle }, '执行下一步') : null,
              h('button', { key: 'replace', onClick: () => useVaultItem(item, 'replace'), style: linkBtnStyle }, '填充'),
              h('button', { key: 'edit', onClick: () => editVaultItem(item), style: linkBtnStyle }, '编辑'),
              h('button', { key: 'derive', onClick: () => deriveVaultItem(item), style: linkBtnStyle }, '派生'),
              h('button', { key: 'relations', onClick: () => { setVaultTab('graph'); setVaultGraphFocusId(item.id) }, style: linkBtnStyle }, '关系'),
              item.parentId ? h('button', { key: 'compare', onClick: () => setVaultCompareId(value => value === item.id ? '' : item.id), style: linkBtnStyle }, vaultCompareId === item.id ? '收起对比' : '版本对比') : null,
              h('button', { key: 'copy', onClick: () => copyVaultItem(item), style: linkBtnStyle }, '复制'),
              h('button', { key: 'delete', onClick: () => assetProvider.remove(item.id), style: { ...linkBtnStyle, marginLeft: 'auto', color: C.red } }, '删除'),
            ]) : null,
            vaultCompareId === item.id ? versionDiff(item) : null,
            ])) : h('div', { key: 'empty', style: { ...S.empty, padding: '22px 12px', fontSize: '12px', display: 'grid', gap: '10px', justifyItems: 'start' } }, [
              h('div', { key: 'tip', style: { color: C.muted, lineHeight: 1.5 } }, '还没有灵感资产。保存一条草稿或选中片段开始积累。'),
              h('button', { key: 'save-first', disabled: !draft.trim(), onClick: () => saveToVault(draft, { kind: 'quick-capture' }), style: { padding: '8px 12px', border: 0, borderRadius: '8px', background: draft.trim() ? C.actionBg : C.tealLine, color: draft.trim() ? C.actionFg : C.muted, cursor: draft.trim() ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 800 } }, '保存当前草稿为灵感'),
            ])),
          ]) : null,
          vaultTab === 'inbox' ? inboxTab : null,
          vaultTab === 'knowledge' ? KnowledgeTab({ entries: knowledgeInbox, max: knowledge.max, onPromote: promoteKnowledgeItem, onDismiss: knowledge.dismiss }) : null,
          vaultTab === 'graph' ? graphTab : null,
        ]) : null
        const rankedCommon = [...common].sort((a, b) => Number(methodUsage[b.id] || 0) - Number(methodUsage[a.id] || 0))
        const panelAbove = position.y > 370
        const panelMaxHeight = Math.max(250, Math.min(640, panelAbove ? position.y - 82 : window.innerHeight - position.y - 82))
        const buttonStyle = { width: '44px', height: '44px', padding: 0, border: 0, borderRadius: '50%', background: C.actionBg, color: C.actionFg, cursor: 'grab', fontSize: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .16s ease, box-shadow .16s ease' }
        const fan = common.map((method, index) => h('button', { key: method.id, title: `选择：${method.title}`, disabled: loading, onClick: () => { setEnhancementMethodId(method.id); setAdvancedEnhancement(true); setOpen(true) }, style: { position: 'absolute', right: `${-8 + index * 48}px`, bottom: panelAbove ? `${62 + Math.abs(index - 1) * 25}px` : 'auto', top: panelAbove ? 'auto' : `${62 + Math.abs(index - 1) * 25}px`, width: '42px', height: '42px', overflow: 'hidden', border: `1px solid ${enhancementMethodId === method.id ? C.teal : C.tealLine}`, borderRadius: '50%', background: enhancementMethodId === method.id ? C.tealTint : C.surface, boxShadow: '0 6px 16px var(--pk-shadow-faint)', color: C.teal, cursor: 'pointer', fontSize: '10px', fontWeight: 800, lineHeight: 1.15, animation: 'pk-fan-in .22s ease both', animationDelay: `${index * 35}ms` } }, method.title.slice(0, 4)))
        const methodItems = showAllMethods ? methods : rankedCommon
        const methodCards = h('div', { key: 'cards', style: { display: 'grid', gap: '7px' } }, methodItems.map(method => h('button', { key: method.id, className: 'pk-btn', disabled: loading, onClick: () => setSelectedMethodId(method.id), style: { width: '100%', padding: '10px 11px', border: `1px solid ${selectedMethodId === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: selectedMethodId === method.id ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer' } }, [h('div', { key: 'title', style: { display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px', fontWeight: 800 } }, [h('span', { key: 'name' }, method.title), selectedMethodId === method.id ? h('span', { key: 'picked', style: { color: C.teal } }, '已选择') : recommended.includes(method) ? h('span', { key: 'recommended', style: { color: C.teal } }, '推荐') : null]), h('div', { key: 'purpose', style: { marginTop: '3px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, method.purpose || '按该方法组织分析。')])) )
        const structurePreview = selectedMethod ? h('div', { key: 'structure-preview', style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `组装预览：草稿${useConversationContext ? ` + 已选对话 ${activeMessages.length} 条` : ''}${useMemoryContext ? ' + 项目记忆' : ''} · ${selectedMethod.title} 的分析结构`) : null
        const methodFooter = h('div', { key: 'footer', style: { position: 'sticky', bottom: '-14px', margin: '10px -14px -14px', padding: '11px 14px 14px', borderTop: `1px solid ${C.tealLine}`, background: C.surface } }, [selectedMethod ? h('div', { key: 'outcome', style: { marginBottom: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint, fontSize: '12px', lineHeight: 1.5 } }, [h('strong', { key: 'title', style: { color: C.teal } }, `将使用「${selectedMethod.title}」`), h('div', { key: 'body', style: { marginTop: '3px', color: C.slate } }, selectedMethod.outcome || (selectedMethod.mode === 'guided' ? '先通过追问澄清问题，再推进下一步。' : '生成结构化分析、风险与下一步行动。'))]) : null, h('button', { key: 'generate', className: 'pk-btn', disabled: loading || !canCompose || !selectedMethod, onClick: () => composeIntoInput(selectedMethod), style: { width: '100%', padding: '11px 14px', border: 0, borderRadius: '9px', background: loading || !canCompose || !selectedMethod ? C.tealLine : C.teal, color: loading || !canCompose || !selectedMethod ? C.muted : C.surface, cursor: loading || !canCompose || !selectedMethod ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading ? h(Spinner, { key: 'spin', text: '正在组装…' }) : selectedMethod ? '生成并填入消息框' : '请选择一种方法')])
        const createEnhancementPlan = (text, method) => {
          const plan = planPromptEnhancement(text, requirement, methods, selectedContextText)
          return method && !plan.tooShort
            ? { ...plan, method: method.title, label: method.title, ...lightTemplate(method.title, text, requirement ? `\n\n额外要求：${requirement}` : '') }
            : plan
        }
        const enhancementPlan = createEnhancementPlan(enhancementInput, matchedMethod)
        const enhancementLang = detectLanguage(draft || '')
        const strategyNode = draft.trim() ? enhancementKind === 'semantic'
              ? [h('div', { key: 'meta', style: { marginBottom: '3px' } }, `将把当前 ${draft.trim().length} 个字符交给模型改写。`), autoMethods.length ? h('div', { key: 'method', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', color: C.teal } }, [h('span', { key: 'label' }, '自动匹配：'), ...autoMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setEnhancementMethodId(method.id), style: { border: `1px solid ${matchedMethod?.id === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '999px', background: matchedMethod?.id === method.id ? C.tealTintDeep : C.surface, color: C.teal, cursor: 'pointer', padding: '3px 7px', fontSize: '10px', fontWeight: 800 } }, matchedMethod?.id === method.id ? [h(Icon, { key: 'ck', name: 'check', size: 11, style: { marginRight: '2px' } }), method.title] : `改用 ${method.title}`))]) : h('div', { key: 'method', style: { color: C.muted } }, '未强行套用方法，只做结构化改写。'), h('div', { key: 'lang', style: { color: C.muted } }, `检测语言：${enhancementLang === 'en' ? '英文（输出与输入一致）' : enhancementLang === 'mixed' ? '中英混合（输出与输入一致）' : '中文'}。`), draft.trim().length > 3000 ? h('div', { key: 'warn', style: { marginTop: '3px', color: C.amber } }, '草稿超过 3000 字符，建议精简后再增强。') : null]
              : [h('strong', { key: 'method', style: { color: C.teal } }, enhancementPlan.tooShort ? '输入过短，直接使用原文' : enhancementPlan.label ? `拟采用：${enhancementPlan.label}` : '拟采用：轻量整理'), h('div', { key: 'reason', style: { marginTop: '3px' } }, enhancementPlan.reason), referencedFiles.length ? h('div', { key: 'files', style: { marginTop: '3px', color: C.teal } }, `保留 @ 文件引用：${referencedFiles.map(path => `@${path}`).join('、')}`) : null, enhancementPlan.signals?.length ? h('div', { key: 'signals', style: { marginTop: '3px' } }, `识别信号：${enhancementPlan.signals.join('、')}`) : null, enhancementPlan.conflicts?.length ? h('div', { key: 'conflicts', style: { marginTop: '3px', color: C.amber } }, `方法冲突：${enhancementPlan.conflicts.map(item => `${item.label || item.title}（命中“${item.signals.join('、')}”）`).join('；')}，采用「${enhancementPlan.label || enhancementPlan.method}」。`) : null, h('div', { key: 'size', style: { marginTop: '3px', color: C.muted } }, `预计 ${enhancementPlan.prompt.length} 字符。`)]
              : '当前输入框为空，请先写下原始请求。'
        const strengthNode = enhancementKind === 'semantic' ? StrengthSelector({ value: enhanceStrength, onChange: setEnhanceStrength }) : null
        const autoEnhanceNode = onSubmitDraft && enhancer ? AutoEnhanceToggle({ enabled: autoEnhanceEnabled, onChange: setAutoEnhanceEnabled }) : null
        const stepperSteps = [['选方式', '轻量或语义档'], ['加要求', '补充要求、对话或记忆'], ['看预览', '对比改前与改后']]
        const stepperStep = !draft.trim() ? 1 : (!requirement.trim() && !useConversationContext && !useMemoryContext) ? 2 : 3
        const stepperNode = h('div', { key: 'stepper', style: { display: 'flex', gap: '8px', marginTop: '12px' } }, stepperSteps.map((label, i) => { const n = i + 1; const done = n < stepperStep; const active = n === stepperStep; return h('div', { key: label, style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 1 } }, [h('span', { key: 'num', style: { width: '18px', height: '18px', flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: done || active ? C.teal : 'transparent', border: `1px solid ${done || active ? C.teal : C.tealLine}`, color: done || active ? C.surface : C.muted } }, n), h('span', { key: 'lbl', style: { fontSize: '11px', fontWeight: active ? 800 : 600, color: active ? C.teal : done ? C.slate : C.muted, whiteSpace: 'nowrap' } }, label), i < 2 ? h('span', { key: 'ln', style: { flex: 1, height: '1px', minWidth: '8px', background: done ? C.teal : C.divide } }, null) : null]) }))
        const methodSummaryNode = enhancementKind === 'light' && !enhancementPlan.tooShort ? h('div', { key: 'method-summary', style: { marginTop: '6px' } }, [h('div', { key: 'name', style: { fontSize: '12px', color: C.ink, fontWeight: 800 } }, enhancementPlan.label || '轻量整理'), enhancementPlan.reason ? h('div', { key: 'reason', style: { marginTop: '2px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, enhancementPlan.reason) : null]) : null
        const diffPreview = (() => { if (!draft.trim()) return null; if (enhancementKind === 'semantic') return h('div', { key: 'diff', style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, '语义档由模型改写，点击「应用」后生成结果，此处不提供实时预览。'); if (enhancementPlan.tooShort) return null; const after = (enhancementPlan.prompt || '').trim(); const before = draft.trim(); if (!after || before === after) return null; return h('div', { key: 'diff', style: { marginTop: '9px', overflow: 'hidden', border: `1px solid ${C.tealLine}`, borderRadius: '8px' } }, [h('div', { key: 'before', style: { padding: '8px 10px', background: C.redTint, color: C.slate, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word' } }, [h('span', { key: 'tag', style: { display: 'block', color: C.red, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '原文'), before]), h('div', { key: 'after', style: { padding: '8px 10px', background: C.tealTintDeep, color: C.ink, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word', borderTop: `1px solid ${C.tealLine}` } }, [h('span', { key: 'tag', style: { display: 'block', color: C.teal, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '增强后'), after])]) })()
        const costNode = enhancementKind === 'light' && draft.trim() && !enhancementPlan.tooShort ? h('div', { key: 'cost', style: { marginTop: '6px', display: 'flex', gap: '10px', color: C.muted, fontSize: '11px' } }, [h('span', { key: 'chars' }, `字符 ${draft.trim().length} → ${(enhancementPlan.prompt || '').trim().length}`), h('span', { key: 'token' }, 'Token 0'), h('span', { key: 'time' }, '本地 <1s')]) : null
        const signalsNode = enhancementKind === 'light' && enhancementPlan.signals?.length ? h('details', { key: 'signals', style: { marginTop: '6px' } }, [h('summary', { key: 'summary-0', style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, `识别信号（${enhancementPlan.signals.length} 条）`), h('div', { key: 'div-1', style: { marginTop: '4px', color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, enhancementPlan.signals.join('、'))]) : null
        const draftStatusNode = h('div', { key: 'draft-status', style: { marginTop: '10px', fontSize: '11px', color: draft.trim() ? C.teal : C.muted, fontWeight: 700 } }, draft.trim() ? `草稿 · ${draft.trim().length} 字符` : '尚未输入草稿')
        const requirementNode = h('div', { key: 'requirement', className: 'pk-field', style: { marginTop: '5px', marginBottom: '9px' } }, [h('span', { key: 'label', className: 'pk-label pk-label--muted' }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), h('textarea', { key: 'input', value: requirement, onChange: event => setRequirement(event.target.value), placeholder: mode === 'enhance' ? '例如：使用简洁中文，先给结论，再列出实施步骤。' : '例如：请重点评估风险，并给出可执行的下一步。', style: { ...workbenchStyle.input, minHeight: '58px', resize: 'vertical', fontSize: '12px', lineHeight: 1.45 } })])
        const contextLevelNode = h('div', { key: 'context-level', style: { marginBottom: '9px' } }, [
          h('div', { key: 'label', style: { marginBottom: '6px', color: C.muted, fontSize: '11px', fontWeight: 800 } }, '参考上下文（可选）'),
          h('div', { key: 'actions', style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, [
            msgs.length ? h('button', { key: 'conversation', className: 'pk-btn', onClick: () => setContextOverlayOpen(true), style: { padding: '7px 9px', border: `1px solid ${useConversationContext ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: useConversationContext ? C.tealTintDeep : C.surface, color: useConversationContext ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, useConversationContext && selected.length ? `已选 ${selected.length} 条对话` : '选择对话') : null,
            searchMemory ? h('button', { key: 'memory', className: 'pk-btn', onClick: () => setUseMemoryContext(value => !value), style: { padding: '7px 9px', border: `1px solid ${useMemoryContext ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: useMemoryContext ? C.tealTintDeep : C.surface, color: useMemoryContext ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, useMemoryContext ? (enhancementKind === 'semantic' ? '✓ 项目记忆' : '✓ 项目记忆（语义档）') : '项目记忆') : null
          ])
        ])
        const recentInputRef = React.useRef(null)
        // 对话参考弹层已拆至 quick-enhancer/context-overlay.js（ContextOverlay）。
        const contextOverlayNode = () => ContextOverlay({
          messages: msgs,
          selectedIds: selected,
          activeMessages,
          selectedDraft,
          recentInputRef,
          onToggle: toggle,
          onSelectAll: selectAllMessages,
          onSelectRecent: () => selectRecentN(recentInputRef.current ? recentInputRef.current.value : 3),
          onClear: clearAllSelections,
          onClose: () => setContextOverlayOpen(false),
          onConfirm: () => { setContextOverlayOpen(false); if (!useConversationContext) setUseConversationContext(true) },
        })

        const contextNode = contextOverlayOpen ? contextOverlayNode() : null
        const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]
        const enhancerKindSection = h('div', { key: 'enhancer-kind-section', style: { marginTop: '10px' } }, [h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? `模型会改写草稿${useConversationContext ? '，并引用已选对话' : ''}${useMemoryContext ? '，并检索项目记忆' : ''}。` : useMemoryContext ? '项目记忆已准备，但轻量档不会读取；切换到语义档后可预览并注入。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。')])
        const memorySourceLabels = sources => sources?.length ? h('div', { key: 'memory-sources', style: { marginTop: '6px', display: 'grid', gap: '3px', color: C.muted } }, sources.map((source, index) => h('div', { key: `${source.kind}:${index}` }, `来源：${source.label}`))) : null
        const assetContextNode = assetContextIds.length ? h('div', { key: 'asset-context', style: { marginTop: '9px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '11px', lineHeight: 1.45 } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [h('strong', { key: 'title', style: { color: C.teal } }, `思考卡上下文（${assetContextIds.length}/3）`), h('button', { key: 'clear', onClick: () => setAssetContextIds([]), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '10px' } }, '清除')]), h('div', { key: 'items', style: { marginTop: '4px', color: C.slate } }, vaultItems.filter(item => assetContextIds.includes(item.id)).map(item => `• ${item.title}（${epistemicLabel[item.epistemicStatus] || '推断'}）`).join('\n')), h('div', { key: 'hint', style: { marginTop: '4px', color: C.muted } }, '仅在“语义 · 模型”增强时注入；发送前可随时移除。')]) : null
        const enhanceActionNode = h('button', { key: 'enhance-main', className: 'pk-btn', title: '应用增强到消息框', 'aria-label': '应用增强到消息框', disabled: !draft.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { minWidth: '52px', padding: '7px 10px', border: 0, borderRadius: '7px', background: draft.trim() && !loading ? C.actionBg : C.surfaceAlt, color: draft.trim() && !loading ? C.actionFg : C.muted, cursor: draft.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消' }) : loading ? h(Spinner, { key: 'spin', text: '增强中…' }) : '应用')
        const enhancerPanel = EnhancerPanel({
          mode,
          draft,
          enhancementKind,
          enhancementPlan,
          strategyNode,
          useMemoryContext,
          memoryPreview,
          onLoadMemory: () => loadMemory(draft).catch(() => {}),
          memorySourceLabels,
          memoryReceipt,
          methodSummaryNode,
          diffPreview,
          costNode,
          signalsNode,
          showAdvanced: advancedEnhancement,
          onRefine: () => setAdvancedEnhancement(true),
          methodOptions: methods,
          selectedMethodId: enhancementMethodId,
          suggestedMethod: autoMethods[0],
          onMethodChange: setEnhancementMethodId,
          streamState,
          loading,
          onCancelEnhance: cancelEnhance,
          diagnosis: enhanceDiagnosis,
          matchedMethod: diagnosisMethod,
          knowledgeCount: knowledgeInbox.length,
          hasAssetProvider: Boolean(assetProvider),
          onOpenKnowledge: () => { setVaultTab('knowledge'); setVaultOpen(true) },
          skillRestore,
          onDismissSkills: () => setSkillRestore(null),
        })
        // 增强面板：极简模式单列只保留「草稿状态 + 档位」和结果预览；完整模式双栏全配置。
        const enhanceBody = !advancedEnhancement
          ? h('div', { key: 'enhance-body', style: { display: 'grid', gap: '8px', animation: 'pk-fade .2s ease' } }, [draftStatusNode, enhancerPanel])
          : h('div', { key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start', animation: 'pk-fade .2s ease' } }, [h('div', { key: 'config', style: { minWidth: 0 } }, [enhancerKindSection, draftStatusNode, requirementNode, contextLevelNode, contextNode, assetContextNode, strengthNode, autoEnhanceNode]), h('div', { key: 'preview', style: { minWidth: 0 } }, [enhancerPanel])])
        // 方法收集进度（助推③）：本地计数的唯一真源为 methodUsage，此处仅派生展示数据，
        // 不额外写存储。usedIds 去重后用于「已用 N / 总数」进度，助长收集动量。
        const usageSum = Object.values(methodUsage || {}).reduce((sum, n) => sum + Number(n || 0), 0)
        const usedMethodIds = Object.keys(methodUsage || {}).filter(id => Number(methodUsage[id] || 0) > 0)
        const usedMethodCount = usedMethodIds.length
        const methodTotal = methods.length || 1
        const methodProgressLabel = `${usedMethodCount} / ${methods.length} 个方法`
        const methodProgressPct = Math.min(100, Math.round((usedMethodCount / methodTotal) * 100))
        // 里程碑阈值与分母同口径（相对 methods.length，含私有方法），避免魔法数字与真实总数脱节。
        const methodFullRatio = usedMethodCount / methodTotal
        const methodMilestone = methodFullRatio >= 1 ? ' · 已解锁「方法全景」' : methodFullRatio >= 0.75 ? ' · 快集齐了' : ''
        const usageNode = h('div', { key: 'usage-progress', style: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', padding: '9px 11px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface, fontSize: '11px', color: C.slate } }, [
          h('div', { key: 'lab', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
            h('strong', { key: 't', style: { color: C.teal, fontWeight: 800 } }, '方法收集进度'),
            h('span', { key: 'n', style: { color: C.muted } }, `${methodProgressLabel}${methodMilestone}`)
          ]),
          h('div', { key: 'bar', style: { height: '6px', borderRadius: '999px', background: C.surfaceAlt, overflow: 'hidden' } }, [
            h('div', { key: 'fill', style: { height: '100%', width: `${methodProgressPct}%`, borderRadius: '999px', background: C.teal, transition: 'width .3s ease' } })
          ]),
          h('div', { key: 'cnt', style: { color: C.muted, fontSize: '10px' } }, usedMethodCount ? `累计用过 ${usageSum} 次 · ${usedMethodCount} 个方法；常用方法先用起来，慢慢扩大版图。` : '还没用过命名方法——下次增强时留意自动匹配的方法，或到「方法库」手动选一个。')
        ])
        // 助推效果看板：直接读 NudgeMetrics 单例的聚合结果（面板打开时随渲染刷新）。
        const nudgeSummary = getNudgeMetrics(storagePrefix)?.getSummary?.() || null
        const settingsSection = settingsOpen ? h('div', { key: 'settings-dropdown', 'data-settings-dropdown': 'true', style: { position: 'absolute', top: '52px', right: '14px', zIndex: 10, width: '320px', maxWidth: 'calc(100% - 28px)', padding: '11px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surfaceAlt, boxShadow: C.shadowLg } },
          activeSettingsPanel === null
            ? [
                h('div', { key: 'settings-head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }, [
                  h('strong', { key: 't', style: { fontSize: '12px', color: C.ink } }, '设置'),
                  h('button', { key: 'x', onClick: () => setSettingsOpen(false), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '12px' } }, '×')
                ]),
                h('div', { key: 'pref' }, [
                  h('div', { key: 'div-0', style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'PREFERENCE · 偏好'),
                  // 界面模式：auto = 前 3 次增强极简，之后自动展开完整模式；可手动锁定。
                  h('div', { key: 'display-mode', style: { marginTop: '6px' } }, [
                    h('div', { key: 'label', style: { fontSize: '11px', color: C.slate, marginBottom: '4px' } }, '界面模式'),
                    h('div', { key: 'seg', style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' } }, [['auto', '自动（推荐）'], ['simple', '极简'], ['full', '完整']].map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setDisplayMode(id), style: { padding: '5px 4px', border: `1px solid ${displayModePref === id ? C.tealLineActive : C.tealLine}`, borderRadius: '7px', background: displayModePref === id ? C.tealTintDeep : C.surface, color: displayModePref === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '10px', fontWeight: 800 } }, displayModePref === id ? [h(Icon, { key: 'ck', name: 'check', size: 10, style: { marginRight: '2px' } }), label] : label))),
                    h('div', { key: 'hint', style: { marginTop: '3px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, displayModePref === 'auto' ? '新用户默认极简；成功增强 3 次后自动展开完整模式。' : displayModePref === 'simple' ? '只保留核心增强流程。' : '显示全部功能区块。'),
                  ]),
                  h('label', { key: 'toggle', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '6px', padding: '6px 8px', borderRadius: '7px', cursor: 'pointer' } }, [
                    h('span', { key: 'name', style: { fontSize: '11px', color: C.slate } }, '本地使用信号（默认关闭）'),
                    h('input', { key: 'cb', type: 'checkbox', checked: metricsEnabled, onChange: toggleMetrics, style: { accentColor: C.teal, cursor: 'pointer' } })
                  ]),
                  metricsEnabled ? h('div', { key: 'nums', style: { marginTop: '4px', paddingLeft: '8px', color: C.muted, fontSize: '10px' } }, `轻量 ${Number(metrics.light || 0)} · 语义 ${Number(metrics.semantic || 0)} · 反馈 ${feedback.length}`) : null,
                  h('label', { key: 'nudge-toggle', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '4px', padding: '6px 8px', borderRadius: '7px', cursor: 'pointer' } }, [
                    h('span', { key: 'name', style: { fontSize: '11px', color: C.slate } }, '行为助推引导卡（方法觉醒 / 一键存）'),
                    h('input', { key: 'cb', type: 'checkbox', checked: nudgeKitOn, onChange: toggleNudgeKit, style: { accentColor: C.teal, cursor: 'pointer' } })
                  ]),
                ]),
                h('details', { key: 'more', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [
                  h('summary', { key: 'summary-0', style: { color: C.muted, cursor: 'pointer', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' } }, '更多操作 · 统计 / 导入 / 备份 / 私有方法'),
                  h('div', { key: 'data', style: { marginTop: '8px', display: 'grid', gap: '6px' } }, [
                    h('button', { key: 'nudges', onClick: () => setActiveSettingsPanel('nudges'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 行为助推效果（本地统计）'),
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
                ]) : activeSettingsPanel === 'nudges' ? h(Card, { key: 'panel-nudges' }, [
                  h('strong', { key: 't', style: { fontSize: '12px' } }, '行为助推效果（本地统计）'),
                  h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.5 } }, '零遥测，计数只存本浏览器。深度会话 = 本次浏览器会话中接受过任一引导，或经草稿桥进入方法工坊（DMSR 本地近似口径）。'),
                  nudgeSummary ? [
                    h('div', { key: 'kpi', style: { marginTop: '8px', padding: '8px 9px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '11px', color: C.slate } }, [
                      h('div', { key: 'rate', style: { display: 'flex', justifyContent: 'space-between' } }, [h('span', { key: 'label' }, '深度会话率（近似 DMSR）'), h('strong', { key: 'value', style: { color: C.teal } }, `${Math.round((nudgeSummary.deepRate || 0) * 100)}%`)]),
                      h('div', { key: 'sess', style: { marginTop: '4px', display: 'flex', justifyContent: 'space-between', color: C.muted, fontSize: '10px' } }, [h('span', { key: 'sessions' }, `深度 ${nudgeSummary.deepSessions} / 共 ${nudgeSummary.sessions} 次会话`), h('span', { key: 'days' }, `活跃 ${nudgeSummary.activeDays} 天 · 深度 ${nudgeSummary.deepDays} 天`)]),
                    ]),
                    h('div', { key: 'totals', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.7 } }, [
                      h('div', { key: 'row', style: { fontWeight: 800, color: C.ink } }, '动作计数'),
                      h('div', { key: 'v', style: { color: C.muted, fontSize: '10px' } }, `展示 ${Number(nudgeSummary.totals.impress || 0)} · 接受 ${Number(nudgeSummary.totals.accept || 0)} · 查看 ${Number(nudgeSummary.totals.see_how || 0)} · 关闭 ${Number(nudgeSummary.totals.dismiss || 0)} · 草稿桥 ${Number(nudgeSummary.totals.bridge || 0)}`),
                      h('div', { key: 'row2', style: { marginTop: '4px', fontWeight: 800, color: C.ink } }, '分类型'),
                      ...Object.entries(nudgeSummary.byType || {}).map(([type, actions]) => h('div', { key: type, style: { color: C.muted, fontSize: '10px' } }, `${type === 'awaken' ? '方法觉醒' : type === 'vault' ? '灵感库一键存' : type}：${Object.entries(actions).map(([action, count]) => `${action} ${count}`).join(' · ')}`)),
                    ]),
                    h('button', { key: 'reset', className: 'pk-btn', onClick: () => { if (!confirmResetNudgeStats) { setConfirmResetNudgeStats(true); return } getNudgeMetrics(storagePrefix)?.reset?.(); setConfirmResetNudgeStats(false); setSettingsOpen(true) }, style: { ...workbenchStyle.action, marginTop: '8px', color: confirmResetNudgeStats ? C.red : undefined } }, confirmResetNudgeStats ? '再次点击清除本地统计' : '清除本地统计'),
                  ] : h('div', { key: 'empty', style: { marginTop: '8px', color: C.muted, fontSize: '11px' } }, '暂无数据——发生第一次增强或草稿桥使用后这里会出现统计。'),
                ]) : h(Card, { key: 'panel-manage' }, [
                  h('strong', { key: 't', style: { fontSize: '12px' } }, '管理我的私有方法'),
                  ...(methods.filter(method => method.source === 'private').length ? methods.filter(method => method.source === 'private').map(method => h('div', { key: method.id, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginTop: '7px', fontSize: '11px' } }, [
                    h('span', { key: 'span-0', style: { color: C.slate } }, method.title),
                    h('span', { key: 'span-1' }, [
                      h('button', { key: 'e', onClick: () => { editPrivateMethod(method); setActiveSettingsPanel('import') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px' } }, '编辑'),
                      h('button', { key: 'd', onClick: () => deletePrivateMethod(method.id), style: { marginLeft: '6px', border: 0, background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '11px' } }, confirmDeletePrivateId === method.id ? '再次点击删除' : '删除')
                    ])
                  ])) : [h('div', { key: 'empty', style: { marginTop: '7px', color: C.muted, fontSize: '11px' } }, '尚无私有方法，可从「DATA → 导入 Obsidian Prompt 卡片」添加。')]),
                ])
              ]
        ) : null
        const panel = open ? h('section', { key: 'panel', className: 'pk-scroll', role: 'dialog', 'aria-label': '对话增强器', style: { position: 'absolute', left: `${panelOffset}px`, transform: 'none', ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: `${panelW}px`, boxSizing: 'border-box', maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: vw < 480 ? '10px' : '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px var(--pk-shadow-lg)', color: C.ink, zIndex: 30, animation: 'pk-pop .2s ease' } }, [
              h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, '用方法增强当前草稿，结果只填入消息框，不会自动发送；需要精修时可在高级工坊补充事实与约束。')]), h('div', { key: 'actions', style: { display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 } }, [
                mode === 'enhance' ? enhanceActionNode : null,
                assetProvider ? h('button', { key: 'save', disabled: !draft.trim(), onClick: () => saveToVault(draft, { kind: 'quick-capture' }), style: { padding: '7px 9px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: draft.trim() ? C.slate : C.muted, cursor: draft.trim() ? 'pointer' : 'not-allowed', fontSize: '11px', fontWeight: 800 } }, '收藏草稿') : null,
                assetProvider ? h('button', { key: 'vault', onClick: () => { setVaultOpen(true); setLibraryOpen(false) }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', padding: '4px 0', fontSize: '11px', fontWeight: 800 } }, '打开灵感库 →') : null,
                h('button', { key: 'studio', disabled: !draft.trim(), onClick: openStudioWithDraft, title: '把当前草稿带入高级方法工坊继续调整', style: { border: 0, background: 'transparent', color: draft.trim() ? C.teal : C.muted, cursor: draft.trim() ? 'pointer' : 'not-allowed', padding: '4px 0', fontSize: '11px', fontWeight: 800 } }, '高级工坊 →'),
                h('span', { key: 'divider', 'aria-hidden': 'true', style: { width: '1px', height: '20px', background: C.divide, margin: '0 1px' } }),
                h('button', { key: 'gear', 'data-gear-button': 'true', onClick: () => { setSettingsOpen(value => !value); if (settingsOpen) setActiveSettingsPanel(null) }, style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '4px 2px', border: 0, borderRadius: '8px', background: settingsOpen ? C.tealTint : 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 }, 'aria-label': '设置' }, [h(Icon, { key: 'ic', name: 'settings', size: 15 }), '设置']), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))])]),
              libraryOpen || vaultOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { margin: '12px 0 5px', padding: '10px 11px', borderRadius: '10px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '当前草稿将作为问题；需要时可在下方添加参考上下文。'),
              undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } clearOutcomeAt('undo'); composer?.write(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { key: 'summary-0', style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { key: 'div-1', style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
              activeNudge ? h('div', { key: 'nudge', role: 'status', 'aria-live': 'polite', style: { marginTop: '8px', padding: '10px 11px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: activeNudge.type === 'awaken' ? C.tealTint : C.amberTint, color: C.ink, fontSize: '12px', lineHeight: 1.5, animation: 'pk-fade .2s ease' } }, activeNudge.type === 'awaken' ? [
                h('strong', { key: 't', style: { color: C.teal, fontSize: '12px' } }, `🎯 这次自动用了「${activeNudge.methodTitle || '思考方法'}」`),
                h('div', { key: 'd', style: { marginTop: '3px', color: C.slate } }, '10 秒看看它是怎么收敛这个问题的？'),
                h('div', { key: 'a', style: { display: 'flex', gap: '8px', marginTop: '8px' } }, [
                  h('button', { key: 'see', onClick: () => { dismissNudge(activeNudge, 'see_how'); openStudioWithDraft(activeNudge.methodId || '') }, style: { border: 0, background: C.teal, color: '#fff', borderRadius: '7px', padding: '6px 11px', cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '看看它怎么想'),
                  h('button', { key: 'no', onClick: () => dismissNudge(activeNudge, 'dismiss'), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px' } }, '不用，继续聊')
                ])
              ] : [
                h('strong', { key: 't', style: { color: C.teal, fontSize: '12px' } }, '这个 Prompt 不错，存进灵感库？'),
                h('div', { key: 'd', style: { marginTop: '3px', color: C.slate, fontSize: '11px' } }, `标题已帮你填好：「${activeNudge.draftTitle || '未命名'}」`),
                h('div', { key: 'a', style: { display: 'flex', gap: '8px', marginTop: '8px' } }, [
                  h('button', { key: 'save', disabled: savingNudge, onClick: () => onAcceptVault(activeNudge), style: { border: 0, background: C.teal, color: '#fff', borderRadius: '7px', padding: '6px 11px', cursor: savingNudge ? 'wait' : 'pointer', opacity: savingNudge ? .7 : 1, fontSize: '11px', fontWeight: 800 } }, savingNudge ? '保存中…' : '一键存'),
                  h('button', { key: 'no', onClick: () => dismissNudge(activeNudge, 'dismiss'), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px' } }, '不用')
                ])
              ]) : null,
              // 极简模式折叠区：方法收集进度 / 收藏草稿 / 工坊桥 / 模式切换 tab 都属于
              // 「第二周功能」——新用户前三次增强只看到草稿 → 增强 → 结果这条主线。
              // 保留 nudge 卡（它是主动引导，不算噪音）与 notice（操作反馈必须可见）。
              simpleMode ? h('button', { key: 'expand-full', onClick: () => setDisplayMode('full'), style: { marginTop: '10px', width: '100%', padding: '7px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px' } }, '展开全部功能（方法库 · 灵感库 · 统计）') : null,
              !simpleMode && advancedEnhancement && methods.length ? usageNode : null,

              mode === 'enhance' && !libraryOpen && (requirement.trim() || useConversationContext || useMemoryContext) ? stepperNode : null,
              settingsOpen ? settingsSection : null,
              mode === 'enhance' ? enhanceBody : null,
              lastEnhancement ? h('div', { key: 'feedback', style: { marginTop: '12px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, color: C.slate, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ck', name: 'check', size: 14, style: { color: C.teal } }), h('span', { key: 'label', style: { flex: 1 } }, '增强完成，可在此撤销或反馈'), h('button', { key: 'up', onClick: () => saveFeedback('up'), title: '有用', 'aria-label': '有用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-u', name: 'thumbsUp', size: 15 })), h('button', { key: 'down', onClick: () => saveFeedback('down'), title: '没用', 'aria-label': '没用', style: { border: 0, background: 'transparent', cursor: 'pointer', color: C.ink, display: 'inline-flex' } }, h(Icon, { key: 'ic-d', name: 'thumbsDown', size: 15 }))]) : null,
              h('div', { key: 'methods', style: { display: 'none' } }, [
                h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]),
                h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'),
                recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null,
                methodCards, structurePreview, methodFooter,
              ]),
              noticeState ? h('div', { key: 'notice', role: 'status', 'aria-live': 'polite', style: { marginTop: '10px', padding: '9px 11px', borderRadius: '8px', border: `1px solid ${noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amberLine : C.tealLine}`, background: noticeState.kind === 'error' ? C.redTint : noticeState.kind === 'warn' ? C.amberTint : C.tealTint, color: noticeState.kind === 'error' ? C.red : noticeState.kind === 'warn' ? C.amber : C.teal, fontSize: '12px', lineHeight: 1.45 } }, noticeState.text) : null,
              // 抽屉必须是主面板的 DOM 后代。DSH 以 panel section 判断“内部点击”，若与
              // panel 同级，点击抽屉控制会被误判为外部点击并连主面板一起关闭。
              vaultOpen ? vaultPanel : null,
            ]) : null
        const slashMenu = slashOpen ? h('div', { key: 'slash-menu', role: 'listbox', style: { position: 'fixed', right: '76px', bottom: '86px', width: 'min(360px, calc(100vw - 32px))', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '12px', background: C.surface, boxShadow: C.shadowLg, zIndex: 20004 } }, [h('div', { key: 'label', style: { padding: '4px 6px 7px', color: C.muted, fontSize: '11px' } }, `灵感库 · /pk ${vaultSearch} · ↑↓ 选择，Enter 插入`), ...(slashMatches.length ? slashMatches.map((item, index) => h('button', { key: item.id, role: 'option', 'aria-selected': index === slashActiveIndex, onClick: () => useVaultItem(item, 'replace'), style: { width: '100%', padding: '8px', border: 0, borderRadius: '7px', background: index === slashActiveIndex ? C.tealTint : 'transparent', color: C.ink, textAlign: 'left', cursor: 'pointer' } }, [h('strong', { key: 'title', style: { fontSize: '12px' } }, item.title), h('div', { key: 'meta', style: { marginTop: '2px', color: C.muted, fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.tags?.length ? `#${item.tags.join(' #')}` : item.type)])) : [h('div', { key: 'empty', style: { padding: '10px 6px', color: C.muted, fontSize: '11px' } }, '未找到匹配灵感；继续输入关键词或按 Esc。')])]) : null
        const variableFillNode = VariableFillNode({
          fill: variableFill ? {
            ...variableFill,
            onChange: (name, value) => setVariableFill(state => ({ ...state, values: { ...state.values, [name]: value } })),
          } : null,
          onCancel: () => setVariableFill(null),
          onConfirm: () => {
            const payload = variableFill
            setVariableFill(null)
            void applyVaultItem(payload.item, payload.mode, payload.current, payload.slashInvocation, payload.values)
          },
        })
        return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 20001 } }, [h(GlobalStyle, { key: 'gcss' }), slashMenu, variableFillNode, reviewPanel, h('button', { key: 'launcher', type: 'button', className: 'pk-fab', onPointerDown: beginDrag, onClick: () => { if (consumeSuppressedClick()) return; setMode('enhance'); setEnhancementKind('light'); setAdvancedEnhancement(displayModePref === 'full'); setLibraryOpen(false); setOpen(true) }, style: buttonStyle, title: '智能增强（⌘K）', 'aria-label': '打开智能增强', onMouseEnter: event => { event.currentTarget.style.transform = 'scale(1.06)' }, onMouseLeave: event => { event.currentTarget.style.transform = 'scale(1)' } }, h(Icon, { key: 'ic', name: 'sparkles', size: 18 })), panel])
      }


/* ================= 独立插件 glue：DSH 插槽注册 + 默认 adapter 装配 ================= */
      // 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
      // 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
      //
      // 语义增强经 node 半区复用当前会话的模型路由；浏览器端不保存 API Key 或模型配置。
      // 语义增强默认走 SSE 流式路由；路由 404（旧 host）时自动降级为非流式 JSON 路由。

      const promptkitMethodProvider = new StaticMethodProvider()
      const promptkitAssetProvider = new StaticAssetProvider()

      async function promptkitSearchMemory(sessionId, query) {
        const url = new URL('/memory-center/context-search', window.location.origin)
        url.searchParams.set('session_id', sessionId)
        url.searchParams.set('query', query)
        const response = await fetch(url)
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.next_action || '项目记忆服务不可用；请安装并启用 Memory Center DSH 插件。')
        const wikiUrl = new URL('/memory-center/wiki-brief', window.location.origin)
        wikiUrl.searchParams.set('session_id', sessionId)
        wikiUrl.searchParams.set('task', query)
        const wiki = await fetch(wikiUrl).then(async value => value.ok ? value.json() : null).catch(() => null)
        const wikiItems = Object.entries(wiki?.groups || {}).flatMap(([group, rows]) => Array.isArray(rows) ? rows.slice(0, 3).map(item => ({ group, title: String(item?.title || '') })) : []).filter(item => item.title)
        return {
          text: String(body.suggested_context || ''),
          sources: [
            ...(body.suggested_context ? [{ kind: 'memory-center', label: 'Memory Center 项目记忆' }] : []),
            ...wikiItems.map(item => ({ kind: 'personal-wiki', label: `Personal Wiki · ${item.group} · ${item.title}` })),
          ],
        }
      }

      // 桥接 DSH 输入框：inputActions 由槽位体系注入（InputActions.setDraft / submit）。
      // getDraft 读构造时传入的 draft 快照（新契约）或 useInput 订阅值（旧契约）。
      class DshDraftComposer {
        constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
        getDraft() { return this.input?.draft ?? '' }
        write(text) { this.inputActions?.setDraft(String(text ?? '')) }
        onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
        notify(draft) { for (const cb of this.listeners) cb(draft) }
      }

      // 快捷助手宿主：适配两代 DSH 槽位契约。
      //   0.1.2-alpha：InputZone.session 仅包含会话状态，消息由 useChat 订阅。
      //     input 是含 draft 的点时快照；Chat.legacy.nodes 是消息兼容投影。
      //   0.1.0-rc（旧）：props = { sessionId, useInput, useChat, inputActions }，经 hooks 订阅。
      function PromptkitQuickActionHost(props) {
        const { sessionId, input, useInput, useChat, inputActions } = props
        // 草稿真源：新契约直接读 zone.input.draft；旧契约用 useInput hook 订阅。
        const zonedDraft = input?.draft
        const hookedInput = useInput ? useInput(value => value) : undefined
        const draft = zonedDraft !== undefined ? zonedDraft : hookedInput?.draft
        // 选择消息投影，避免无关的会话状态/工具流更新触发整段历史重算。
        const chatSnapshot = useChat ? useChat(value => value?.legacy ?? value) : undefined
        const messages = React.useMemo(() => conversationMessages(chatSnapshot), [chatSnapshot])
        const composer = React.useMemo(() => new DshDraftComposer({ draft }, inputActions), [sessionId, inputActions])
        composer.input = { draft }
        const enhancer = React.useMemo(() => new DshSessionEnhancer(() => sessionId), [sessionId])
        const searchMemory = React.useCallback(query => promptkitSearchMemory(sessionId, query), [sessionId])
        React.useEffect(() => { composer.notify(draft ?? '') }, [draft, composer])
        return h(ConversationQuickAction, { methodProvider: promptkitMethodProvider, assetProvider: promptkitAssetProvider, composer, enhancer, messages, searchMemory })
      }

      // 方法工坊宿主：写入新版输入机后交由 inputActions.submit() 发送。
      function PromptkitStudioHost({ inputActions, openView }) {
        // 快捷增强器发出草稿桥事件时，除预填数据外还请求切到对应 conversation.view。
        // 旧宿主没有 openView 时仍保留预填行为，不让导航能力成为使用门槛。
        React.useEffect(() => {
          const openStudio = () => openView?.('dsh-promptkit-studio', 'promptkit-studio')
          window.addEventListener(studioBridgeEventName(), openStudio)
          return () => window.removeEventListener(studioBridgeEventName(), openStudio)
        }, [openView])
        const onSend = async text => { inputActions.setDraft(String(text ?? '')); inputActions.submit() }
        return h(PromptStudio, { methodProvider: promptkitMethodProvider, assetProvider: promptkitAssetProvider, onSend })
      }

      const promptkitApply = ctx => {
        const studio = [
          {
            name: 'conversation.view',
            id: 'dsh-promptkit-studio',
            order: 90,
            label: () => '高级方法工坊',
            inject: sessionId => ({ sessionId }),
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
