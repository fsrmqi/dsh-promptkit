#!/usr/bin/env python3
"""
patch-ux-style.py — 统一三个模块（智能增强 / 手动选方法 / 方法库）的视觉样式。

统一规范（8px 基线）：
  圆角：卡片 10px（enhancerPanel 11→10、feedback 9→10）
  间距：模块间 marginTop 12px（library-panel 10→12、mode tabs 10→12、feedback 9→12），
        模块内次级 8px（library-actions 9→8）
  内边距：卡片 12px（library-panel / library-actions 10→12）
  动效：三个模块内容区加 pk-fade 淡入（切换 tab 时平滑过渡）

用法：python3 patch-ux-style.py [--apply]
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

    # 1. enhancerPanel 圆角 11→10
    rep("borderRadius: '11px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '决策摘要')",
        "borderRadius: '10px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '决策摘要')",
        "enhancerPanel 圆角 11→10")

    # 2. library-panel 间距 10→12 + 内边距 10→12 + 淡入
    rep("key: 'library-panel', style: { marginTop: '10px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint }",
        "key: 'library-panel', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint, animation: 'pk-fade .2s ease' }",
        "library-panel 间距/内边距/淡入")

    # 3. library-actions 间距 9→8 + 内边距 10→12 + 淡入
    rep("key: 'library-actions', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface }",
        "key: 'library-actions', style: { marginTop: '8px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface, animation: 'pk-fade .2s ease' }",
        "library-actions 间距/内边距/淡入")

    # 4. feedback 间距 9→12 + 圆角 9→10
    rep("key: 'feedback', style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint",
        "key: 'feedback', style: { marginTop: '12px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint",
        "feedback 间距/圆角")

    # 5. mode tabs 间距 10→12
    rep("gap: '6px', marginTop: '10px' } }, [['enhance', '智能增强']",
        "gap: '6px', marginTop: '12px' } }, [['enhance', '智能增强']",
        "mode tabs 间距 10→12")

    # 6. enhanceBody 加淡入
    rep("key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,.8fr) minmax(0,1.2fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start' }",
        "key: 'enhance-body', style: { display: 'grid', gridTemplateColumns: wide ? 'minmax(0,.8fr) minmax(0,1.2fr)' : 'minmax(0,1fr)', gap: '10px', alignItems: 'start', animation: 'pk-fade .2s ease' }",
        "enhanceBody 加淡入")

    # 7. method-config 加淡入
    rep("mode === 'method' ? h('div', { key: 'method-config' }, [draftStatusNode",
        "mode === 'method' ? h('div', { key: 'method-config', style: { animation: 'pk-fade .2s ease' } }, [draftStatusNode",
        "method-config 加淡入")

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
