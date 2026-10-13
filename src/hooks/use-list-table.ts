import { useMemo, useState } from "react"

/** State tabel daftar yang seragam: cari, urut, halaman, dan pilih baris. */
export function useListTable<T extends { id: number }>(rows: T[], opts: { search: (r: T) => string[]; sortValue: (r: T, key: string) => string; pageSize?: number }) {
  const [query, setQuery] = useState("")
  const [pageSize, setPageSizeState] = useState(opts.pageSize ?? 10)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; asc: boolean } | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = rows.filter((r) => !q || opts.search(r).some((v) => v.toLowerCase().includes(q)))
    if (sort) list = [...list].sort((a, b) => opts.sortValue(a, sort.key).localeCompare(opts.sortValue(b, sort.key), "id", { numeric: true }) * (sort.asc ? 1 : -1))
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize)
  const allOnPage = slice.length > 0 && slice.every((r) => selected.has(r.id))
  const someOnPage = slice.some((r) => selected.has(r.id))

  return {
    query, setQuery: (v: string) => { setQuery(v); setPage(0) },
    pageSize, setPageSize: (n: number) => { setPageSizeState(n); setPage(0) },
    page: cur, setPage, pages, sort, filtered, slice,
    from: filtered.length ? cur * pageSize + 1 : 0, to: Math.min((cur + 1) * pageSize, filtered.length),
    toggleSort: (key: string) => setSort((s) => (!s || s.key !== key ? { key, asc: true } : s.asc ? { key, asc: false } : null)),
    selected, clear: () => setSelected(new Set()),
    drop: (ids: Set<number>) => setSelected((s) => new Set([...s].filter((id) => !ids.has(id)))),
    toggleRow: (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n }),
    togglePage: () => setSelected((s) => { const n = new Set(s); slice.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id))); return n }),
    allOnPage, someOnPage,
  }
}
