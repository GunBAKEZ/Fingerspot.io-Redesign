/** Ubah baris menjadi teks CSV (dengan BOM agar terbuka benar di Excel). */
export function toCsv(rows: string[][]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  return "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n")
}

/** Parser CSV sederhana: kutip ganda, koma/baris-baru di dalam kutip, CRLF, BOM. */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "")
  const rows: string[][] = []
  let row: string[] = [], cell = "", quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ",") { row.push(cell); cell = "" }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell); cell = ""
      rows.push(row); row = []
    } else cell += c
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((v) => v.trim() !== ""))
}

export function downloadCsv(filename: string, rows: string[][]) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" })), download: filename })
  a.click()
  URL.revokeObjectURL(a.href)
}
