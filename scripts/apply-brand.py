#!/usr/bin/env python3
"""Pasang kembali kustomisasi proyek di atas komponen shadcn resmi (preset b5JNeciq8).

Jalankan setelah `npx shadcn@latest add <komponen> -o` atau `shadcn apply` (yang
menimpa file di src/components/ui). Aman dijalankan berulang kali (idempoten).
Hanya menambah hal yang tidak ada di preset; tampilan dasar tetap milik preset.
"""
import pathlib
ui = pathlib.Path("src/components/ui")

def edit(name, fn):
    p = ui / name
    s = p.read_text(); n = fn(s)
    if n != s: p.write_text(n)

# 1. impor `cn` yang salah dari CLI -> helper project (lalu `npm uninstall cn`)
for p in ui.glob("*.tsx"):
    s = p.read_text()
    if 'from "cn"' in s: p.write_text(s.replace('from "cn"', 'from "@/lib/utils"'))

# 2. Button: varian `soft` + target sentuh 40px di layar sentuh
def button(s):
    if "soft:" not in s:
        s = s.replace('        link: "text-primary', '        soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",\n        link: "text-primary', 1)
    for a, b in [('default:\n          "h-9 ', 'default:\n          "h-9 pointer-coarse:h-10 '),
                 ('sm: "h-8 ', 'sm: "h-8 pointer-coarse:h-10 '),
                 ('icon: "size-9"', 'icon: "size-9 pointer-coarse:size-10"'),
                 ('"icon-sm":\n          "size-8 ', '"icon-sm":\n          "size-8 pointer-coarse:size-10 ')]:
        if b not in s: s = s.replace(a, b, 1)
    return s
edit("button.tsx", button)

# 3. Badge: varian status (success/info/warning/danger/muted/soft) + prop `dot`
def badge(s):
    if "success:" not in s:
        s = s.replace('        link: "text-primary underline-offset-4 hover:underline",\n      },', '''        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary-soft text-primary",
        success: "bg-success/12 text-success",
        info: "bg-info/12 text-info",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/12 text-danger",
        muted: "bg-muted text-muted-foreground",
      },''', 1)
    if "dot" not in s:
        s = s.replace('  asChild = false,\n  ...props\n}: React.ComponentProps<"span"> &\n  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {',
                      '  asChild = false,\n  dot = false,\n  children,\n  ...props\n}: React.ComponentProps<"span"> &\n  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean }) {', 1)
        s = s.replace('      {...props}\n    />\n  )\n}\n\nexport { Badge',
                      '      {...props}\n    >\n      {dot && <span className="size-1.5 rounded-full bg-current" />}\n      {children}\n    </Comp>\n  )\n}\n\nexport { Badge', 1)
    return s
edit("badge.tsx", badge)

# 4. Input: tinggi 40px di layar sentuh; tombol "Browse" bergaya soft (inset merata 4px, jarak 12px ke nama berkas)
def file_input(s):
    s = s.replace("file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                  "file:mr-3 file:inline-flex file:h-7 file:cursor-pointer file:items-center file:rounded-sm file:border-0 file:bg-primary-soft file:px-3 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary-soft/70 [&[type=file]]:py-0 [&[type=file]]:pr-3 [&[type=file]]:pl-[3px]")
    if "pointer-coarse:h-10" not in s:
        s = s.replace('"h-9 w-full', '"h-9 pointer-coarse:h-10 w-full', 1)
    return s
edit("input.tsx", file_input)

# 5. Select: tinggi 40px di layar sentuh
def select(s):
    if "pointer-coarse:data-[size=default]" not in s:
        s = s.replace("data-[size=default]:h-9", "data-[size=default]:h-9 pointer-coarse:data-[size=default]:h-10", 1)
    if "pointer-coarse:data-[size=sm]" not in s:
        s = s.replace("data-[size=sm]:h-8", "data-[size=sm]:h-8 pointer-coarse:data-[size=sm]:h-10", 1)
    return s
edit("select.tsx", select)

# 6. Toggle: 40px di layar sentuh
def toggle(s):
    if "pointer-coarse" not in s:
        s = s.replace('"h-9 min-w-9 ', '"h-9 min-w-9 pointer-coarse:h-10 pointer-coarse:min-w-10 ', 1)
        s = s.replace('sm: "h-8 min-w-8 ', 'sm: "h-8 min-w-8 pointer-coarse:h-10 pointer-coarse:min-w-10 ', 1)
    return s
edit("toggle.tsx", toggle)
