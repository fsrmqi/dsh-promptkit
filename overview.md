# Behavioral Nudge + Vault Close — Delivery Overview (2026-08-28)

## What happened this turn
Two follow-on items from the earlier behavioral-nudge implementation, plus a live bug investigation.

### Nudge completion: "埋点消费端" (local SRSR) + host-level feature flag
- New module `src/ui/nudge-metrics.js`: idempotent singleton (`mountNudgeMetrics(prefix)`) that consumes `promptkit.nudge` (and bridge) `CustomEvent`s and aggregates locally — by-type / by-day (30-day rollup) / sessions / "deep sessions". `deepRate` approximates the earlier-defined **DMSR北海指标** in a private, zero-telemetry way.
- Host-level feature flag: `isNudgeKitEnabled` / `setNudgeKitEnabled` (key `promptkit.quick-action.nudge.enabled.v1`, default ON), exposed through the Embed namespace as `PromptKit.nudges.{isEnabled,setEnabled,mount,summary,reset}`, a component prop `nudgeEnabled`, and (via same key) a UI toggle in settings.
- The missing denominator ("impress") action is now recorded when a nudge becomes active; previously only accept/dismiss existed.
- Verification: `npm run check` 17/17 files; `node --check ui/client.js | ui/embed.js | ui/client-lite.js` all green; `npm test` 34/34.

### Live bug: "灵感库没法关闭" — proved the code is NOT the problem
Instead of editing blind, I wrote a repro harness (`src/../.` was unavailable → kept the jsdom repro as `.repro.mjs`) using the **real React 19 `createRoot` driving the real built artifact `ui/embed.js`**, then ran six scenarios that confirm the close-trip is sound:

| Scenario | Result |
|---|---|
| A clean point | ✅ |
| B host intercepts `stopPropagation` at `body` (real DSH wrapping) | ✅ — the existing window **capture** `close` handler wins |
| C only `dispatchEvent('click')` | ✅ |
| D right-corner button covered by an external pill → auto-left-swap → tap the moved button | ✅ |
| E tap any non-drawer area (with host interception) | ✅ |
| F `Escape` | ✅ |

Conclusion: this isn't a code defect in "clicking Close". It is a **design fragility** — the auto-left-swap branch had only ONE escape route and no second way out once the rescue position was itself blocked.

### Hardening applied (does NOT touch the existing Close button or auto-swap; both keep working)
1. Pointing anywhere outside the drawer now closes it too (capture-path `pointerdown`), fixing the case where the button physically can't be tapped.
2. `Escape` key now closes the vault (capture-keydown keyed on `vaultOpen`).
3. Repro re-ran after the change: six scenarios still ✅; `npm test` 34/34.

### Still open (needs the user)
Consider replacing the auto-left-swap detection with a generic full-screen backdrop modal ("click outside → close") instead of the fragile element-from-point swap. (Exposed as `6.3` in the plan doc; the assertive reads on that.")