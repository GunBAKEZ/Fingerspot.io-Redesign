import { useMemo, useState } from "react"
import { SearchX } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { PlatformCell, SortButton, TableFooter, TableToolbar } from "@/components/dashboard/table-controls"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { gpsEmployees, type GpsEmployee } from "@/data/app-users"

type SortKey = "pin" | "name" | "office" | "position" | "platform"
const cols: { key: SortKey; label: string }[] = [
  { key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "office", label: "Kantor" },
  { key: "position", label: "Jabatan" }, { key: "platform", label: "Platform" },
]
const statusBadge = (r: GpsEmployee) => <Badge variant={r.registered ? "success" : "warning"} dot>{r.registered ? "Sudah Registrasi" : "Belum Registrasi"}</Badge>

export default function GpsEmployees() {
  const [tab, setTab] = useState<"belum" | "sudah">("belum")
  const [query, setQuery] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean } | null>(null)

  const count = { belum: gpsEmployees.filter((r) => !r.registered).length, sudah: gpsEmployees.filter((r) => r.registered).length }
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = gpsEmployees.filter((r) => r.registered === (tab === "sudah") && (!q || [r.pin, r.name, r.office, r.position, r.platform].some((v) => v.toLowerCase().includes(q))))
    if (sort) list = [...list].sort((a, b) => a[sort.key].localeCompare(b[sort.key], "id", { numeric: true }) * (sort.asc ? 1 : -1))
    return list
  }, [tab, q, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize)
  const from = filtered.length ? cur * pageSize + 1 : 0
  const to = Math.min((cur + 1) * pageSize, filtered.length)
  const toggleSort = (key: SortKey) => setSort((s) => (!s || s.key !== key ? { key, asc: true } : s.asc ? { key, asc: false } : null))

  return (
    <>
      <PageHeader crumbs={[{ label: "Karyawan" }, { label: "Pengguna App Karyawan", href: "#/karyawan/pengguna-app" }, { label: "Karyawan Absensi GPS" }]}>
        Karyawan Absensi GPS
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "belum" | "sudah"); setPage(0) }}>
            <TabsList className="h-auto w-full items-stretch rounded-xl sm:w-fit">
              {([["belum", "Belum Registrasi"], ["sudah", "Sudah Registrasi"]] as const).map(([v, label]) => (
                <TabsTrigger key={v} value={v} className="h-auto min-w-0 gap-1.5 rounded-lg px-2 py-2 text-[13px] pointer-coarse:py-2.5 sm:gap-2 sm:px-4 sm:text-sm">
                  {label} <Badge variant={tab === v ? "default" : "muted"} className="px-1.5">{count[v]}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <TableToolbar pageSize={pageSize} onPageSize={(n) => { setPageSize(n); setPage(0) }} query={query} onQuery={(v) => { setQuery(v); setPage(0) }} placeholder="Cari karyawan…" />

          {filtered.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>Tidak ada hasil</EmptyTitle>
                <EmptyDescription>{q ? `Tidak ada karyawan yang cocok dengan “${query}”.` : "Belum ada karyawan pada daftar ini."}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {cols.map((c) => (
                        <TableHead key={c.key} aria-sort={sort?.key !== c.key ? "none" : sort.asc ? "ascending" : "descending"}>
                          <SortButton label={c.label} active={sort?.key === c.key} asc={!!sort?.asc} onClick={() => toggleSort(c.key)} />
                        </TableHead>
                      ))}
                      <TableHead className="text-xs font-bold uppercase tracking-wide">Status Registrasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slice.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="tabular-nums">{r.pin}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="max-w-56 whitespace-normal">{r.office}</TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell><PlatformCell platform={r.platform} /></TableCell>
                        <TableCell>{statusBadge(r)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="space-y-3 md:hidden">
                {slice.map((r) => (
                  <li key={r.id} className="rounded-2xl border p-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.position} · {r.office}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="tabular-nums text-muted-foreground">ID {r.pin}</span>
                      <PlatformCell platform={r.platform} />
                      {statusBadge(r)}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <TableFooter from={from} to={to} total={filtered.length} page={cur} pages={pages} onPage={setPage} />
        </CardContent>
      </Card>
    </>
  )
}
