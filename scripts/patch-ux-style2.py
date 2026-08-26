#!/usr/bin/env python3
"""
patch-ux-style2.py — 第二轮样式统一：方法卡片/底部 CTA/区块标题

统一点：
  1. libraryMatches 按钮 → 与 methodCards 风格一致（padding 10x11、圆角 10px、字号 12px）
  2. method「常用思考方法」「全部方法(21)」→ 13px（与决策摘要 13px 对齐）
  3. library「最近生成：」「我的收藏：」→ 13px
  4. library「填充模板」改 teal 实心（主 CTA），与 enhance/method 底部主 CTA 风格统一
     「基于草稿改造」保持 teal 描边（次 CTA，依赖草稿+enhancer，启用条件更严）
  5. summary 横幅（method 模式）borderRadius 9→10、padding 9→10，与卡片圆角体系统一
"""
import sys
from pathlib import Path

SRC = Path("/Users/cuijiaqi/Ai-common-skills/dsh-promptkit/src/ui/quick-enhancer.js")


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

    # 1. libraryMatches 按钮 → 与 methodCards 一致
    rep(
        "libraryMatches.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '8px 9px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '11px' } }, [h('strong', { key: 'title' }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted } }, method.purpose || method.category)]))",
        "libraryMatches.map(method => h('button', { key: method.id, className: 'pk-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '10px 11px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: method.id === selectedMethodId ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '12px' } }, [h('strong', { key: 'title', style: { fontSize: '12px', fontWeight: 800 } }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted, fontSize: '11px' } }, method.purpose || method.category)]))",
        "libraryMatches 按钮 → 与 methodCards 一致（圆角/内边距/字号）",
    )

    # 2. method「常用思考方法」「全部方法(21)」→ 13px
    rep(
        "h('div', { key: 'label', style: { color: C.muted, fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)",
        "h('div', { key: 'label', style: { color: C.muted, fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '13px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)",
        "method 区块标题 11→13",
    )

    # 3. library「最近生成：」「我的收藏：」→ 13px
    rep(
        "h('strong', { key: 'label', style: { color: C.teal } }, '我的收藏：')",
        "h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '我的收藏：')",
        "library 我的收藏 标签字号",
    )
    rep(
        "h('strong', { key: 'label', style: { color: C.teal } }, '最近生成：')",
        "h('strong', { key: 'label', style: { color: C.teal, fontSize: '13px', fontWeight: 800 } }, '最近生成：')",
        "library 最近生成 标签字号",
    )

    # 4. library「填充模板」改 teal 实心（workbenchStyle.action → actionPrimary）
    #    「基于草稿改造」保持 workbenchStyle.action（teal 描边，次 CTA）
    rep(
        "h('button', { key: 'fill', className: 'pk-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.action, opacity: libraryMethod ? 1 : .55 } }, '填充模板')",
        "h('button', { key: 'fill', className: 'pk-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.actionPrimary, opacity: libraryMethod ? 1 : .5 } }, '填充模板')",
        "library「填充模板」改 teal 实心（主 CTA）",
    )

    # 5. method summary 条 borderRadius 9→10、padding 9px 10px → 10px
    rep(
        "key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '9px 10px', borderRadius: '9px', background: selectedChars > 1600 ? C.amberTint : C.tealTint",
        "key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '10px 11px', borderRadius: '10px', background: selectedChars > 1600 ? C.amberTint : C.tealTint",
        "method summary 横幅圆角/内边距",
    )

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