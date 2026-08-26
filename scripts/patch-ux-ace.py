#!/usr/bin/env python3
"""
patch-ux-ace.py — 落地 A(双栏) + C(Stepper) + E(diff 预览) 到 src/ui/quick-enhancer.js

三项均纯前端，不改引擎：
  C · Stepper：顶部 3 步进度条（选方式 → 加要求 → 看预览）
  A · 双栏：panelW 440→640（桌面端），enhance 模式左栏配置 / 右栏决策摘要，窄屏单栏降级
  E · diff 预览：轻量档实时「原文 → 增强后」（本地 enhancementPlan.prompt 免费可算），
                 语义档给占位提示；外加成本摘要 + 识别信号折叠

用法：python3 patch-ux-ace.py [--dry-run | --apply]
"""
import re
import sys
from pathlib import Path

SRC = Path("/Users/cuijiaqi/Ai-common-skills/dsh-promptkit/src/ui/quick-enhancer.js")

# ---- 新节点定义（插在 enhancementKinds 之前） ----
NEW_NODES = r'''  const stepperSteps = [['选方式', '轻量或语义档'], ['加要求', '补充要求、对话或记忆'], ['看预览', '对比改前与改后']]
  const stepperStep = !draft.trim() ? 1 : (!requirement.trim() && !useConversationContext && !useMemoryContext) ? 2 : 3
  const stepperNode = h('div', { key: 'stepper', style: { display: 'flex', gap: '8px', marginTop: '12px' } }, stepperSteps.map((label, i) => { const n = i + 1; const done = n < stepperStep; const active = n === stepperStep; return h('div', { key: label, style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 1 } }, [h('span', { key: 'num', style: { width: '18px', height: '18px', flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: done || active ? C.teal : 'transparent', border: `1px solid ${done || active ? C.teal : C.tealLine}`, color: done || active ? C.surface : C.muted } }, n), h('span', { key: 'lbl', style: { fontSize: '11px', fontWeight: active ? 800 : 600, color: active ? C.teal : done ? C.slate : C.muted, whiteSpace: 'nowrap' } }, label), i < 2 ? h('span', { key: 'ln', style: { flex: 1, height: '1px', minWidth: '8px', background: done ? C.teal : C.divide } }, null) : null]) }))
  const methodSummaryNode = enhancementKind === 'light' && !enhancementPlan.tooShort ? h('div', { key: 'method-summary', style: { marginTop: '6px' } }, [h('div', { key: 'name', style: { fontSize: '12px', color: C.ink, fontWeight: 800 } }, enhancementPlan.label || '轻量整理'), enhancementPlan.reason ? h('div', { key: 'reason', style: { marginTop: '2px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, enhancementPlan.reason) : null]) : null
  const diffPreview = (() => { if (!draft.trim()) return null; if (enhancementKind === 'semantic') return h('div', { key: 'diff', style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '8px', background: C.surface, color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, '语义档由模型改写，点击「应用」后生成结果，此处不提供实时预览。'); if (enhancementPlan.tooShort) return null; const after = (enhancementPlan.prompt || '').trim(); const before = draft.trim(); if (!after || before === after) return null; return h('div', { key: 'diff', style: { marginTop: '9px', overflow: 'hidden', border: `1px solid ${C.tealLine}`, borderRadius: '8px' } }, [h('div', { key: 'before', style: { padding: '8px 10px', background: C.redTint, color: C.slate, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word' } }, [h('span', { key: 'tag', style: { display: 'block', color: C.red, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '原文'), before]), h('div', { key: 'after', style: { padding: '8px 10px', background: C.tealTintDeep, color: C.ink, fontSize: '11px', lineHeight: 1.5, wordBreak: 'break-word', borderTop: `1px solid ${C.tealLine}` } }, [h('span', { key: 'tag', style: { display: 'block', color: C.teal, fontSize: '10px', fontWeight: 800, marginBottom: '3px' } }, '增强后'), after])]) })()
  const costNode = enhancementKind === 'light' && draft.trim() && !enhancementPlan.tooShort ? h('div', { key: 'cost', style: { marginTop: '6px', display: 'flex', gap: '10px', color: C.muted, fontSize: '11px' } }, [h('span', { key: 'chars' }, `字符 ${draft.trim().length} → ${(enhancementPlan.prompt || '').trim().length}`), h('span', { key: 'token' }, 'Token 0'), h('span', { key: 'time' }, '本地 <1s')]) : null
  const signalsNode = enhancementKind === 'light' && enhancementPlan.signals?.length ? h('details', { key: 'signals', style: { marginTop: '6px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, `识别信号（${enhancementPlan.signals.length} 条）`), h('div', { style: { marginTop: '4px', color: C.muted, fontSize: '11px', lineHeight: 1.5 } }, enhancementPlan.signals.join('、'))]) : null
'''

# ---- enhanceBody（插在 vw 之前，引用 enhancerKindSection / enhancerPanel） ----
ENHANCE_BODY = r'''  const enhanceBody = h('div', { key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,.8fr) minmax(0,1.2fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start' } }, [h('div', { key: 'config', style: { minWidth: 0 } }, [enhancerKindSection, draftStatusNode, requirementNode, contextLevelNode, contextNode]), h('div', { key: 'preview', style: { minWidth: 0 } }, [enhancerPanel])])
'''


def make_var(name: str, line: str) -> str:
    s = line.strip().rstrip(",")
    s = re.sub(r"display: libraryOpen \? 'none' : '[a-z]+', ", "", s)
    return f"  const {name} = {s}"


def apply(src: str) -> tuple[bool, list[str], str]:
    notes: list[str] = []
    ok = True

    def rep(a, b, label):
        nonlocal src, ok
        if a in src:
            src = src.replace(a, b, 1)
            notes.append(f"✅ {label}")
        else:
            notes.append(f"❌ {label} 锚点缺失")
            ok = False

    # 1. panelW 加宽 + wide
    rep("  const panelW = Math.min(440, vw - 32)",
        "  const wide = vw >= 620\n  const panelW = Math.min(wide ? 640 : 440, vw - 32)",
        "panelW 加宽 + wide 标志")

    # 2. enhancerPanel 标题 + strategy 条件渲染
    rep("}, '增强预览'), useMemoryContext",
        "}, '决策摘要'), useMemoryContext",
        "enhancerPanel 标题→决策摘要")
    rep("h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode)",
        "enhancementKind === 'light' ? h('div', { key: 'summary', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, [methodSummaryNode, diffPreview, costNode, signalsNode]) : h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode)",
        "strategy → 轻量档新节点 / 语义档保留")

    # 3. 定位并提取 4 个配置节点行
    lines = src.split("\n")
    try:
        draft_i = next(i for i, l in enumerate(lines) if l.strip().startswith("h('div', { key: 'draft-status'"))
    except StopIteration:
        notes.append("❌ draft-status 行未找到")
        ok = False
        return ok, notes, src

    draft_line = lines[draft_i]
    req_line = lines[draft_i + 1]
    ctx_line = lines[draft_i + 2]
    context_line = lines[draft_i + 3]
    enh_line = lines[draft_i + 4]

    if "mode === 'enhance' ? enhancerPanel : null" not in enh_line:
        notes.append("❌ enhancerPanel 渲染行未在预期位置")
        ok = False
        return ok, notes, src

    draft_var = make_var("draftStatusNode", draft_line)
    req_var = make_var("requirementNode", req_line)
    ctx_var = make_var("contextLevelNode", ctx_line)
    context_var = make_var("contextNode", context_line)
    vars_block = draft_var + "\n" + req_var + "\n" + ctx_var + "\n" + context_var
    notes.append("✅ 提取 4 个配置节点为变量")

    # 4. 删除这 5 行，替换为 enhanceBody 渲染 + method 分支
    replacement = [
        "        mode === 'enhance' ? enhanceBody : null,",
        "        mode === 'method' ? h('div', { key: 'method-config' }, [draftStatusNode, requirementNode, contextLevelNode, contextNode]) : null,",
    ]
    lines = lines[:draft_i] + replacement + lines[draft_i + 5:]
    src = "\n".join(lines)
    notes.append("✅ panel 重组：删 5 行 + 插 enhanceBody / method 分支")

    # 5. 插入 stepper + method/diff/cost/signals 节点定义（在 enhancementKinds 前）
    kind_anchor = "  const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]"
    if kind_anchor in src:
        src = src.replace(kind_anchor, NEW_NODES + kind_anchor, 1)
        notes.append("✅ 插入 stepper + diff/cost/signals 节点定义")
    else:
        notes.append("❌ enhancementKinds 锚点缺失")
        ok = False

    # 6. 插入 4 节点变量定义（紧跟新节点定义之后，插在 enhancementKinds 前同一块之后）
    #    —— 通过再替换一次 kind_anchor，把 vars_block 追加到 NEW_NODES 之后
    if kind_anchor in src:
        src = src.replace(kind_anchor, vars_block + "\n" + kind_anchor, 1)
        notes.append("✅ 插入 4 节点变量定义")
    else:
        notes.append("❌ 二次插入 enhancementKinds 锚点缺失")
        ok = False

    # 7. 插入 enhanceBody 定义（在 vw 之前）
    vw_anchor = "  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024"
    if vw_anchor in src:
        src = src.replace(vw_anchor, ENHANCE_BODY + vw_anchor, 1)
        notes.append("✅ 插入 enhanceBody 定义")
    else:
        notes.append("❌ vw 锚点缺失")
        ok = False

    # 8. enhancerKindSection 渲染行 → stepperNode
    rep("        mode === 'enhance' && !libraryOpen ? enhancerKindSection : null,",
        "        mode === 'enhance' && !libraryOpen ? stepperNode : null,",
        "enhancerKindSection 渲染行 → stepperNode")

    return ok, notes, src


def main() -> int:
    dry = "--apply" not in sys.argv
    src = SRC.read_text(encoding="utf-8")
    ok, notes, new_src = apply(src)
    for line in notes:
        print("  " + line)
    print(f"\nOVERALL: {'PASS' if ok else 'FAIL'}")
    if ok and not dry:
        SRC.write_text(new_src, encoding="utf-8")
        print("  ✅ applied")
    elif dry:
        print("  (dry-run，未写文件)")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
