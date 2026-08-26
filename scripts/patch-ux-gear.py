#!/usr/bin/env python3
"""
patch-ux-gear.py - 方案 A：标题栏 ⚙ dropdown + 方法库 tab 净化

按用户决策：
- q-0: 方案 A · 标题栏 ⚙ + dropdown
- q-1: 点击动作后弹 mini-modal（dropdown 自身承担 modal 角色）
- q-2: 立刻出 patch 脚本
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path("/Users/cuijiaqi/Ai-common-skills/dsh-promptkit")
FILES = [REPO / "src" / "ui" / "quick-enhancer.js"]


def find_top_indent(src: str) -> str:
    m = re.search(r"^( +)const \[libraryOpen,", src, flags=re.MULTILINE)
    if not m:
        raise RuntimeError("libraryOpen state not found")
    return m.group(1)


def build_settings_section(top: str) -> str:
    """构造 settingsSection const（独立 const，定义在 panel 之前）。"""
    p = top
    lines: list[str] = []
    lines.append(p + "const settingsSection = settingsOpen ? h('div', { key: 'settings-dropdown', style: { marginTop: '9px', padding: '11px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surfaceAlt } },")
    lines.append(p + "  activeSettingsPanel === null")
    lines.append(p + "    ? [")
    lines.append(p + "        h('div', { key: 'settings-head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }, [")
    lines.append(p + "          h('strong', { key: 't', style: { fontSize: '12px', color: C.ink } }, '设置'),")
    lines.append(p + "          h('button', { key: 'x', onClick: () => setSettingsOpen(false), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '12px' } }, '×')")
    lines.append(p + "        ]),")
    lines.append(p + "        h('div', { key: 'pref' }, [")
    lines.append(p + "          h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'PREFERENCE · 偏好'),")
    lines.append(p + "          h('label', { key: 'toggle', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '6px', padding: '6px 8px', borderRadius: '7px', cursor: 'pointer' } }, [")
    lines.append(p + "            h('span', { key: 'name', style: { fontSize: '11px', color: C.slate } }, '本地使用信号（默认关闭）'),")
    lines.append(p + "            h('input', { key: 'cb', type: 'checkbox', checked: metricsEnabled, onChange: toggleMetrics, style: { accentColor: C.teal, cursor: 'pointer' } })")
    lines.append(p + "          ]),")
    lines.append(p + "          metricsEnabled ? h('div', { key: 'nums', style: { marginTop: '4px', paddingLeft: '8px', color: C.muted, fontSize: '10px' } }, `轻量 ${Number(metrics.light || 0)} · 语义 ${Number(metrics.semantic || 0)} · 反馈 ${feedback.length}`) : null")
    lines.append(p + "        ]),")
    lines.append(p + "        h('div', { key: 'data', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [")
    lines.append(p + "          h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'DATA · 导入 / 备份'),")
    lines.append(p + "          h('button', { key: 'import', onClick: () => setActiveSettingsPanel('import'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 导入 Obsidian Prompt 卡片'),")
    lines.append(p + "          h('button', { key: 'backup', onClick: () => setActiveSettingsPanel('backup'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 备份或恢复私有方法')")
    lines.append(p + "        ]),")
    lines.append(p + "        h('div', { key: 'priv', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, [")
    lines.append(p + "          h('div', { style: { fontSize: '10px', color: C.muted, fontWeight: 800, letterSpacing: '0.5px' } }, 'PRIVATE · 私有方法'),")
    lines.append(p + "          h('button', { key: 'manage', onClick: () => setActiveSettingsPanel('manage'), style: { width: '100%', textAlign: 'left', padding: '7px 8px', marginTop: '6px', border: `1px solid ${C.tealLine}`, borderRadius: '7px', background: C.surface, color: C.slate, cursor: 'pointer', fontSize: '11px' } }, '→ 管理我的私有方法')")
    lines.append(p + "        ]),")
    lines.append(p + "      ]")
    lines.append(p + "    : [")
    lines.append(p + "        h('button', { key: 'back', onClick: () => setActiveSettingsPanel(null), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800, marginBottom: '7px' } }, '← 返回'),")
    lines.append(p + "        activeSettingsPanel === 'import' ? h('div', { key: 'panel-import', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [")
    lines.append(p + "          h('strong', { key: 't', style: { fontSize: '12px' } }, '导入 Obsidian Prompt 卡片'),")
    lines.append(p + "          h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '粘贴一张 Markdown 卡片即可，仅保存到当前浏览器；不会读取或上传你的笔记库。'),")
    lines.append(p + "          h('textarea', { key: 'md', value: privateMarkdown, onChange: event => setPrivateMarkdown(event.target.value), placeholder: '# 我的方法\\n\\n## Prompt\\n```\\n提示词正文\\n```', style: { ...workbenchStyle.input, width: '100%', minHeight: '90px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),")
    lines.append(p + "          h('button', { key: 'go', className: 'pk-btn', disabled: !privateMarkdown.trim(), onClick: importPrivateMethod, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateMarkdown.trim() ? 1 : .55 } }, privateEditingId ? '保存修改' : '导入到我的私有方法'),")
    lines.append(p + "          privateNotice ? h('div', { key: 'nt', style: { marginTop: '5px', color: C.teal, fontSize: '10px' } }, privateNotice) : null")
    lines.append(p + "        ]) : activeSettingsPanel === 'backup' ? h('div', { key: 'panel-backup', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [")
    lines.append(p + "          h('strong', { key: 't', style: { fontSize: '12px' } }, '备份或恢复私有方法'),")
    lines.append(p + "          h('div', { key: 'desc', style: { marginTop: '4px', color: C.muted, fontSize: '10px', lineHeight: 1.4 } }, '导出 JSON 备份；恢复只会追加，不会删除当前私有方法。'),")
    lines.append(p + "          h('button', { key: 'exp', className: 'pk-btn', onClick: exportPrivateMethods, style: { ...workbenchStyle.action, marginTop: '6px' } }, '导出私有方法'),")
    lines.append(p + "          h('textarea', { key: 'bk', value: privateBackup, onChange: event => setPrivateBackup(event.target.value), placeholder: '粘贴此前导出的 JSON 备份', style: { ...workbenchStyle.input, width: '100%', minHeight: '64px', marginTop: '6px', resize: 'vertical', fontSize: '11px' } }),")
    lines.append(p + "          h('button', { key: 'imp', className: 'pk-btn', disabled: !privateBackup.trim(), onClick: importPrivateBackup, style: { ...workbenchStyle.action, marginTop: '6px', opacity: privateBackup.trim() ? 1 : .55 } }, '恢复私有方法'),")
    lines.append(p + "        ]) : h('div', { key: 'panel-manage', style: { padding: '9px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.surface } }, [")
    lines.append(p + "          h('strong', { key: 't', style: { fontSize: '12px' } }, '管理我的私有方法'),")
    lines.append(p + "          ...(methods.filter(method => method.source === 'private').length ? methods.filter(method => method.source === 'private').map(method => h('div', { key: method.id, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginTop: '7px', fontSize: '11px' } }, [")
    lines.append(p + "            h('span', { style: { color: C.slate } }, method.title),")
    lines.append(p + "            h('span', null, [")
    lines.append(p + "              h('button', { key: 'e', onClick: () => { editPrivateMethod(method); setActiveSettingsPanel('import') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px' } }, '编辑'),")
    lines.append(p + "              h('button', { key: 'd', onClick: () => deletePrivateMethod(method.id), style: { marginLeft: '6px', border: 0, background: 'transparent', color: C.red, cursor: 'pointer', fontSize: '11px' } }, confirmDeletePrivateId === method.id ? '再次点击删除' : '删除')")
    lines.append(p + "            ])")
    lines.append(p + "          ])) : [h('div', { key: 'empty', style: { marginTop: '7px', color: C.muted, fontSize: '11px' } }, '尚无私有方法，可从「DATA → 导入 Obsidian Prompt 卡片」添加。')]),")
    lines.append(p + "        ])")
    lines.append(p + "      ]")
    lines.append(p + ") : null")
    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    if not args.dry_run and not args.apply:
        args.dry_run = True

    overall_ok = True
    for path in FILES:
        src = path.read_text(encoding="utf-8")
        top = find_top_indent(src)
        panel_child = top + "      "
        ok, notes, new_src = apply_to_one(src, top, panel_child)
        overall_ok = overall_ok and ok
        print(f"\n== {path.relative_to(REPO)} ==")
        for line in notes:
            print(f"  {line}")
        if args.apply:
            path.write_text(new_src, encoding="utf-8")
            print("  ✅ applied")
    print(f"\nOVERALL: {'PASS' if overall_ok else 'FAIL'}")
    return 0 if overall_ok else 1


def apply_to_one(src: str, top: str, panel: str) -> tuple[bool, list[str], str]:
    notes: list[str] = []
    ok = True

    # === 1. 注入 settingsOpen / activeSettingsPanel state ===
    state_anchor = top + "const [confirmClearMetrics, setConfirmClearMetrics] = React.useState(false)"
    if state_anchor in src:
        inject = (
            "\n"
            + top + "const [settingsOpen, setSettingsOpen] = React.useState(false)\n"
            + top + "const [activeSettingsPanel, setActiveSettingsPanel] = React.useState(null) // null | 'import' | 'backup' | 'manage'\n"
        )
        src = src.replace(state_anchor, state_anchor + inject, 1)
        notes.append("✅ inject settingsOpen + activeSettingsPanel state")
    else:
        notes.append("❌ state anchor missing (confirmClearMetrics)")
        ok = False

    # === 2. 标题栏 close 按钮前插入 ⚙ 按钮（inline 方式：close button 替换为 close + gear）===
    # close button 是内嵌在 head array 里，inline 在一个长行里
    # 用 close button 唯一子串作为锚点，注入 gear + close
    close_anchor = (
        "h('button', { key: 'close', onClick: () => setOpen(false), "
        "style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', "
        "width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', "
        "background: 'transparent', color: C.muted, cursor: 'pointer' }, "
        "'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))"
    )
    gear_btn = (
        "h('button', { key: 'gear', onClick: () => { setSettingsOpen(value => !value); if (settingsOpen) setActiveSettingsPanel(null) }, "
        "style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', "
        "width: '26px', height: '26px', padding: 0, border: 0, marginRight: '4px', "
        "borderRadius: '8px', background: settingsOpen ? C.tealTint : 'transparent', "
        "color: settingsOpen ? C.teal : C.muted, cursor: 'pointer' }, "
        "'aria-label': '设置' }, h(Icon, { key: 'ic', name: 'settings', size: 16 })), "
        + close_anchor
    )
    if close_anchor in src:
        src = src.replace(close_anchor, gear_btn, 1)
        notes.append("✅ inject ⚙ button before close (inline)")
    else:
        notes.append("❌ close button anchor missing")
        ok = False

    # === 3. 删除方法库 tab 内的 details ===
    # 3a. library-actions 内 'private' details（导入 Obsidian，全部 inline 在一行）
    private_inline = (
        ", h('details', { key: 'private', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, "
        "[h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, "
        "'导入我的 Obsidian Prompt 卡片'), "
        "h('div', { style: { marginTop: '7px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, "
        "'粘贴一张 Markdown 卡片即可，仅保存到当前浏览器；不会读取或上传你的笔记库。'), "
        "h('textarea', { value: privateMarkdown, onChange: event => setPrivateMarkdown(event.target.value), "
        "placeholder: '# 我的方法\\n\\n## Prompt\\n```\\n提示词正文\\n```', "
        "style: { ...workbenchStyle.input, width: '100%', minHeight: '100px', marginTop: '7px', resize: 'vertical', fontSize: '11px' } }), "
        "h('button', { className: 'pk-btn', disabled: !privateMarkdown.trim(), onClick: importPrivateMethod, "
        "style: { ...workbenchStyle.action, marginTop: '7px', opacity: privateMarkdown.trim() ? 1 : .55 } }, "
        "'导入到我的私有方法'), "
        "privateNotice ? h('div', { style: { marginTop: '6px', color: C.teal, fontSize: '11px' } }, privateNotice) : null])"
    )
    if private_inline in src:
        src = src.replace(private_inline, "", 1)
        notes.append("✅ remove 'private' details (inline in library-actions)")
    else:
        notes.append("❌ 'private' anchor missing")
        ok = False

    # 3b. library-actions 内 'signals' details（本地使用信号）
    signals_inline = (
        ", h('details', { key: 'signals', style: { marginTop: '10px', borderTop: `1px solid ${C.divide}`, paddingTop: '9px' } }, "
        "[h('summary', { style: { cursor: 'pointer', color: C.teal, fontSize: '12px', fontWeight: 800 } }, "
        "'本地使用信号（默认关闭）'), "
        "h('div', { style: { marginTop: '7px', color: C.muted, fontSize: '11px', lineHeight: 1.45 } }, "
        "'只记录增强类型和方法名，不记录草稿、对话或模型内容，也不会联网。'), "
        "h('button', { className: 'pk-btn', onClick: toggleMetrics, style: { ...workbenchStyle.action, marginTop: '7px' } }, "
        "metricsEnabled ? '已开启本地计数' : '开启本地计数'), "
        "metricsEnabled ? h('div', { style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, "
        "`轻量通用改写 ${Number(metrics.lightGeneric || 0)} 次 · 轻量方法 ${Number(metrics.lightMethod || 0)} 次 · 语义增强 ${Number(metrics.semantic || 0)} 次 · 反馈 ${feedback.length} 条`) : null, "
        "h('button', { className: 'pk-btn', onClick: clearLocalSignals, "
        "style: { marginTop: '7px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.surface, color: C.amber, cursor: 'pointer', padding: '7px 9px', fontSize: '11px', fontWeight: 800 } }, "
        "confirmClearMetrics ? '再次点击确认清空本地信号' : '清空本地信号')])"
    )
    if signals_inline in src:
        src = src.replace(signals_inline, "", 1)
        notes.append("✅ remove 'signals' details (inline in library-actions)")
    else:
        notes.append("❌ 'signals' anchor missing")
        ok = False

    # 3c/3d/3e: 三个独立 details block（跨多行）— 用 start_line 到 next_start_line 删整段
    multi_blocks = [
        ("private-manage", "private-backup"),
        ("private-backup", "metrics-entry"),
        ("metrics-entry", "requirement"),
    ]
    for start_key, end_key in multi_blocks:
        start_marker = "\n" + panel + "libraryOpen ? h('details', { key: '" + start_key + "'"
        if start_marker not in src:
            notes.append(f"❌ '{start_key}' start line missing")
            ok = False
            continue
        start_idx = src.find(start_marker) + 1  # +1 to keep the \n at the end (chomp trailing)
        end_marker = "\n" + panel + "libraryOpen ? h('details', { key: '" + end_key + "'"
        if end_marker not in src:
            if start_key == "metrics-entry":
                end_marker = "\n" + panel + "h('div', { key: 'requirement'"
            else:
                notes.append(f"❌ '{start_key}' end boundary ({end_key}) missing")
                ok = False
                continue
        end_idx = src.find(end_marker, start_idx) + 1  # +1 to chomp the \n
        if end_idx <= start_idx:
            notes.append(f"❌ '{start_key}' end boundary not found after start")
            ok = False
            continue
        # 确保删除时不残留尾部 \n 字符
        src = src[:start_idx] + src[end_idx:]
        notes.append(f"✅ remove '{start_key}' details block")

    # === 4. 注入 const settingsSection 之前在 panel const 之前 ===
    panel_const_anchor = top + "const panel = open ? h('section'"
    if panel_const_anchor in src:
        settings_const = build_settings_section(top)
        src = src.replace(panel_const_anchor, settings_const + panel_const_anchor, 1)
        notes.append("✅ inject `const settingsSection = ...` before `const panel`")
    else:
        notes.append("❌ panel const anchor missing")
        ok = False

    # === 5. panel 数组中插入 `settingsOpen ? settingsSection : null,` ===
    # Anchor: 紧跟 mode tabs 末尾的 `\n        libraryOpen ` 之前
    mode_end_anchor = ", '方法库'))),\n" + panel + "libraryOpen"
    if mode_end_anchor in src:
        inject_line = panel + "settingsOpen ? settingsSection : null,\n"
        replacement = ", '方法库'))),\n" + panel + "settingsOpen ? settingsSection : null,\n" + panel + "libraryOpen"
        src = src.replace(mode_end_anchor, replacement, 1)
        notes.append("✅ inject settingsOpen ? settingsSection into panel after mode tabs")
    else:
        notes.append("❌ mode tabs end anchor missing")
        ok = False

    return ok, notes, src


if __name__ == "__main__":
    sys.exit(main())
