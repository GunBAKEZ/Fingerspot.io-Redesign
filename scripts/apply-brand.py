#!/usr/bin/env python3
"""Pasang kembali kustomisasi merek Fingerspot di atas komponen shadcn resmi.

Jalankan setelah `npx shadcn@latest add <komponen> -o` (yang menimpa file di
src/components/ui). Aman dijalankan berulang kali (idempoten).
"""
import re, pathlib
ui = pathlib.Path("src/components/ui")

def edit(name, fn):
    p = ui / name
    s = p.read_text(); n = fn(s)
    if n != s: p.write_text(n)

# 1. import `cn` yang salah dari CLI -> helper project
for p in ui.glob("*.tsx"):
    s = p.read_text()
    if 'from "cn"' in s: p.write_text(s.replace('from "cn"', 'from "@/lib/utils"'))

# 2. Button: rounded-xl, tinggi 40px, varian soft
def button(s):
    s = s.replace("rounded-md text-sm font-medium", "rounded-xl text-sm font-semibold", 1)
    s = s.replace('default: "h-9 px-4', 'default: "h-10 px-4')
    if "soft:" not in s:
        s = s.replace('        link: "text-primary', '        soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",\n        link: "text-primary', 1)
    return s
edit("button.tsx", button)

# 3. Card: tanpa border, shadow lembut, judul section-title
def card(s):
    s = s.replace("rounded-xl border bg-card py-6 text-card-foreground shadow-sm", "rounded-2xl bg-card py-6 text-card-foreground shadow-card")
    return s.replace("leading-none font-semibold", "section-title")
edit("card.tsx", card)

# 4. Input: rounded-xl, tinggi 40px
edit("input.tsx", lambda s: s.replace("h-9 w-full min-w-0 rounded-md", "h-10 w-full min-w-0 rounded-xl"))
# 5. Progress / Avatar fallback
edit("progress.tsx", lambda s: s.replace("bg-primary/20", "bg-muted"))
edit("avatar.tsx", lambda s: s.replace("rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs", "rounded-full bg-primary-soft text-sm font-bold text-primary group-data-[size=sm]/avatar:text-xs"))
# 6. Dropdown & Select: kotak rounded-2xl p-2 (jarak hover ke tepi 8px), baris rounded-lg px-3 py-2
def dropdown(s):
    s = s.replace("rounded-md border bg-popover p-1", "rounded-2xl border bg-popover p-2")
    s = s.replace("gap-2 rounded-sm px-2 py-1.5", "gap-2.5 rounded-lg px-3 py-2")
    s = s.replace("rounded-sm px-2 py-1.5", "rounded-lg px-3 py-2")
    s = s.replace("gap-2 rounded-sm py-1.5 pr-2 pl-8", "gap-2.5 rounded-lg py-2 pr-3 pl-9")
    s = s.replace("absolute left-2 flex size-3.5", "absolute left-3 flex size-3.5")
    s = s.replace("px-2 py-1.5 text-sm font-medium", "px-3 py-1.5 text-sm font-medium")
    return s.replace("-mx-1 my-1", "-mx-2 my-1.5")
edit("dropdown-menu.tsx", dropdown)

def select(s):
    s = s.replace("rounded-md border bg-popover", "rounded-2xl border bg-popover")
    s = s.replace('"p-1",', '"p-2",')
    s = s.replace("gap-2 rounded-sm py-1.5 pr-8 pl-2", "gap-2.5 rounded-lg py-2 pr-9 pl-3")
    s = s.replace("absolute right-2 flex size-3.5", "absolute right-3 flex size-3.5")
    return s.replace("-mx-1 my-1", "-mx-2 my-1.5")
edit("select.tsx", select)
print("brand customizations applied")
