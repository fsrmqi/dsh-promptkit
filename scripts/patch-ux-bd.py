#!/usr/bin/env python3
"""
最小 diff patch：落地 UX 优化的 B + D 两个想法。

B：chip 分组——"草稿"从动作 chip 行抽离，独立成状态指示行；
   "加对话"/"加项目记忆"成为纯动作 chip 行。
D：模式（轻量·零Token / 语义·模型）前提化——从 enhancerPanel 内部
   抽出来，放到 mode tab（智能增强/手动/方法库）之后，作为独立的
   模式选择 + 说明卡片。enhancerPanel 内部只保留预览 + CTA。

两个目标文件同构但缩进不同：
  embed.js  → 2 空格缩进
  client.js → 8 空格缩进

策略：先做"前缀锚定 + 字符串精确匹配"的替换，每个替换都用足够长的
context 保证唯一性，跑完用 node --test 验证不破坏既有用例。
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UI = ROOT / "ui"


def patch_file(path: Path, indent: str) -> None:
    src = path.read_text(encoding="utf-8")
    # panel 数组子项缩进 = 顶层 indent + 6 空格
    # embed.js: 2+6=8, client.js: 8+6=14
    panel_child = indent + "      "

    # ---------------------------------------------------------------
    # D-1. 在 const enhancementKinds 之后追加 enhancerKindSection
    # ---------------------------------------------------------------
    anchor1 = (
        f"{indent}const enhancementKinds = enhancer ? "
        "[['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : "
        "[['light', '轻量 · 零 Token']]\n"
    )
    if anchor1 not in src:
        raise SystemExit(f"[{path.name}] D-1 anchor not found")
    insert1 = (
        anchor1
        + f"{indent}const enhancerKindSection = h('div', {{ key: 'enhancer-kind-section', style: {{ marginTop: '10px' }} }}, [h('div', {{ key: 'kind', style: {{ display: 'grid', gridTemplateColumns: `repeat(${{enhancementKinds.length}},minmax(0,1fr))`, gap: '6px' }} }}, enhancementKinds.map(([id, label]) => h('button', {{ key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: {{ padding: '7px', border: `1px solid ${{enhancementKind === id ? C.tealLineActive : C.tealLine}}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 }} }}, label))), h('div', {{ key: 'description', style: {{ marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 }} }}, enhancementKind === 'semantic' ? `模型会改写草稿${{useConversationContext ? '，并引用已选对话' : ''}}${{useMemoryContext ? '，并检索项目记忆' : ''}}。` : useMemoryContext ? '项目记忆已准备，但轻量档不会读取；切换到语义档后可预览并注入。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。')])\n"
    )
    src = src.replace(anchor1, insert1, 1)

    # ---------------------------------------------------------------
    # D-2. enhancerPanel 内部：删 kind + description，title 改"增强预览"
    # ---------------------------------------------------------------
    # 匹配 enhancerPanel 开头到 description 结束这一整段
    old_panel_head = (
        f"{indent}const enhancerPanel = h('div', {{ key: 'enhancer', style: {{ marginTop: '12px', padding: '12px', border: `1px solid ${{C.tealLine}}`, borderRadius: '11px', background: C.tealTint }} }}, "
        "[h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '增强当前输入框提示词'), "
        "h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px', marginTop: '9px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'pk-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), "
        "h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? `模型会改写草稿${useConversationContext ? '，并引用已选对话' : ''}${useMemoryContext ? '，并检索项目记忆' : ''}。` : useMemoryContext ? '项目记忆已准备，但轻量档不会读取；切换到语义档后可预览并注入。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。'), "
    )
    new_panel_head = (
        f"{indent}const enhancerPanel = h('div', {{ key: 'enhancer', style: {{ marginTop: '12px', padding: '12px', border: `1px solid ${{C.tealLine}}`, borderRadius: '11px', background: C.tealTint }} }}, "
        "[h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '增强预览'), "
    )
    if old_panel_head not in src:
        raise SystemExit(f"[{path.name}] D-2 anchor not found")
    src = src.replace(old_panel_head, new_panel_head, 1)

    # ---------------------------------------------------------------
    # D-3. panel 数组里：mode tab 之后插入 enhancerKindSection 渲染节点
    # ---------------------------------------------------------------
    # mode tab 那一行末尾的 `}, '方法库'))),` 是独特锚点
    # 注意 embed.js / client.js 这行内容相同（只是行号差 2）
    anchor3 = "}, '方法库'))),\n"
    if anchor3 not in src:
        raise SystemExit(f"[{path.name}] D-3 anchor not found")
    insert3 = (
        anchor3
        + f"{panel_child}mode === 'enhance' && !libraryOpen ? enhancerKindSection : null,\n"
    )
    src = src.replace(anchor3, insert3, 1)

    # ---------------------------------------------------------------
    # B-1. 删除 context-level 行里的"草稿"chip
    # ---------------------------------------------------------------
    old_ctx = (
        "h('div', { key: 'context-level', style: { display: libraryOpen ? 'none' : 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '9px' } }, "
        "[h('span', { key: 'draft', style: { padding: '7px 9px', border: `1px solid ${C.tealLineActive}`, borderRadius: '8px', background: C.tealTintDeep, color: C.teal, fontSize: '11px', fontWeight: 800 } }, '草稿'), "
    )
    new_ctx = (
        "h('div', { key: 'context-level', style: { display: libraryOpen ? 'none' : 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '9px' } }, ["
    )
    if old_ctx not in src:
        raise SystemExit(f"[{path.name}] B-1 anchor not found")
    src = src.replace(old_ctx, new_ctx, 1)

    # ---------------------------------------------------------------
    # B-2. 在 requirement 区块前插入"草稿状态"独立行
    # ---------------------------------------------------------------
    # 用 requirement 区块的 className 锚定
    old_req = (
        f"{panel_child}h('div', {{ key: 'requirement', className: 'pk-field', style: {{ display: libraryOpen ? 'none' : 'block', marginTop: '10px', marginBottom: '9px' }} }}, "
        "[h('span', { key: 'label', className: 'pk-label pk-label--muted' }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), "
    )
    new_req = (
        f"{panel_child}h('div', {{ key: 'draft-status', style: {{ display: libraryOpen ? 'none' : 'block', marginTop: '10px', fontSize: '11px', color: draft.trim() ? C.teal : C.muted, fontWeight: 700 }} }}, draft.trim() ? `草稿 · ${{draft.trim().length}} 字符` : '尚未输入草稿'),\n"
        f"{panel_child}h('div', {{ key: 'requirement', className: 'pk-field', style: {{ display: libraryOpen ? 'none' : 'block', marginTop: '5px', marginBottom: '9px' }} }}, "
        "[h('span', { key: 'label', className: 'pk-label pk-label--muted' }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), "
    )
    if old_req not in src:
        raise SystemExit(f"[{path.name}] B-2 anchor not found")
    src = src.replace(old_req, new_req, 1)

    path.write_text(src, encoding="utf-8")
    print(f"[{path.name}] patched OK")


def main() -> int:
    quick = ROOT / "src" / "ui" / "quick-enhancer.js"
    if not quick.is_file():
        print("src/ui/quick-enhancer.js not found", file=sys.stderr)
        return 2
    patch_file(quick, indent="  ")
    return 0


if __name__ == "__main__":
    sys.exit(main())
