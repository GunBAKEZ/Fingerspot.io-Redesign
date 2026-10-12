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
print("brand customizations applied")
