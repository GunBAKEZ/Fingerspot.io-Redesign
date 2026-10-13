import { useMemo, useState } from "react"
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Clock, Download, Eye, Info, ListChecks, ScanFace, ServerCog, MoreVertical, Pencil, Search, SearchX, Trash2, Upload, UserPlus, X,
} from "lucide-react"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { IconAction, SelectionBar, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmployeeDetailSheet } from "@/components/employees/employee-detail-sheet"
import { EmployeeFormDialog, type EmployeeValues } from "@/components/employees/employee-form-dialog"
import { EmployeeImportDialog } from "@/components/employees/employee-import-dialog"
import { StatusBadge } from "@/components/employees/status-badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { employeeOffices, initialEmployees, initials, schedules, scheduleLabel, type Employee, type EmployeeStatus } from "@/data/employees"
import { format } from "date-fns"
import { downloadCsv } from "@/lib/csv"
import { csvHeader, employeeToRow } from "@/lib/employee-csv"

type ColKey = "pin" | "name" | "office" | "position" | "access" | "schedule"
const cols: { key: ColKey; label: string; title?: string; width: string }[] = [
  { key: "pin", label: "ID / NIK", width: "w-28 min-w-28" },
  { key: "name", label: "Nama", width: "min-w-40" },
  { key: "office", label: "Kantor", width: "min-w-36" },
  { key: "position", label: "Jabatan", width: "min-w-28" },
  { key: "access", label: "Hak akses", title: "Hak akses perangkat absensi", width: "w-28 min-w-28" },
  { key: "schedule", label: "Jadwal", width: "min-w-36" },
]
type SortKey = ColKey | "status"

const cellText = (e: Employee, k: ColKey) => (k === "pin" ? `${e.pin} ${e.nik}` : k === "schedule" ? e.schedule || "N/A" : e[k])

function Schedule({ name }: { name: string }) {
  if (!name) return <span className="text-muted-foreground">N/A</span>
  return (
    <div>
      <p className="font-medium text-primary">{name}</p>
      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" /> Jam Kerja · Tetap</p>
    </div>
  )
}

const PinBadges = ({ e }: { e: Employee }) => (
  <div className="flex flex-col items-start gap-1">
    <Badge variant="success" className="rounded-md font-mono">{e.pin}</Badge>
    <Badge variant="info" className="rounded-md font-mono">{e.nik}</Badge>
  </div>
)

export default function Employees() {
  const [rows, setRows] = useState<Employee[]>(initialEmployees)
  const [query, setQuery] = useState("")
  const [colFilter, setColFilter] = useState<Partial<Record<ColKey, string>>>({})
  const [status, setStatus] = useState<"all" | EmployeeStatus>("Aktif")
  const [office, setOffice] = useState("all")
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean } | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [form, setForm] = useState<{ employee: Employee | null; key: number } | null>(null)
  const [importing, setImporting] = useState(false)
  const [detail, setDetail] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState<Employee[] | null>(null)
  const [notice, setNotice] = useState<{ title: string; text: string } | null>(null)
  const [bulkSchedule, setBulkSchedule] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = rows.filter((e) =>
      (status === "all" || e.status === status) &&
      (office === "all" || e.office === office) &&
      (!q || [e.name, e.pin, e.nik, e.office, e.position].some((v) => v.toLowerCase().includes(q))) &&
      cols.every((c) => !colFilter[c.key]?.trim() || cellText(e, c.key).toLowerCase().includes(colFilter[c.key]!.trim().toLowerCase()))
    )
    if (sort) {
      const val = (e: Employee) => (sort.key === "schedule" ? e.schedule || "￿" : String(e[sort.key]))
      list = [...list].sort((a, b) => val(a).localeCompare(val(b), "id", { numeric: true }) * (sort.asc ? 1 : -1))
    }
    return list
  }, [rows, q, colFilter, status, office, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize)
  const from = filtered.length ? cur * pageSize + 1 : 0
  const to = Math.min((cur + 1) * pageSize, filtered.length)
  const allOnPage = slice.length > 0 && slice.every((e) => selected.has(e.id))
  const someOnPage = slice.some((e) => selected.has(e.id))
  const hasFilters = !!q || office !== "all" || status !== "Aktif" || Object.values(colFilter).some(Boolean)

  const reset = () => setPage(0)
  const toggleSort = (key: SortKey) => setSort((s) => (!s || s.key !== key ? { key, asc: true } : s.asc ? { key, asc: false } : null))
  const toggleRow = (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const togglePage = () => setSelected((s) => { const n = new Set(s); slice.forEach((e) => (allOnPage ? n.delete(e.id) : n.add(e.id))); return n })
  const setStatusOf = (e: Employee, st: EmployeeStatus) => setRows((r) => r.map((x) => (x.id === e.id ? { ...x, status: st } : x)))
  const clearFilters = () => { setQuery(""); setColFilter({}); setStatus("Aktif"); setOffice("all"); reset() }

  // ID default = bilangan bulat positif terkecil yang belum dipakai (mis. 1, lalu 2, ...)
  const nextId = useMemo(() => { const used = new Set(rows.map((r) => r.pin)); let n = 1; while (used.has(String(n))) n++; return String(n) }, [rows])
  const nextRowId = () => Math.max(0, ...rows.map((x) => x.id)) + 1
  const stamp = () => format(new Date(), "yyyy-MM-dd HH:mm:ss")
  const save = (v: EmployeeValues, again: boolean) => {
    if (form?.employee) { setRows((r) => r.map((x) => (x.id === form.employee!.id ? { ...x, ...v, updatedAt: stamp() } : x))); setForm(null); return }
    setRows((r) => [{ ...v, id: nextRowId(), createdAt: stamp(), updatedAt: stamp() }, ...r])
    setForm(again ? { employee: null, key: (form?.key ?? 0) + 1 } : null)
  }
  const importRows = (list: Omit<Employee, "id">[]) => {
    setRows((r) => { let id = Math.max(0, ...r.map((x) => x.id)); return [...list.map((v) => ({ ...v, id: ++id })), ...r] })
    setStatus("all"); setOffice("all"); setQuery(""); setColFilter({}); reset()
  }
  const resignDeleting = () => {
    if (!deleting) return
    const ids = new Set(deleting.map((e) => e.id))
    setRows((r) => r.map((x) => (ids.has(x.id) ? { ...x, status: "Resign", updatedAt: stamp() } : x)))
    setSelected((s) => new Set([...s].filter((id) => !ids.has(id))))
    setDeleting(null)
  }
  const pushToDevice = (list: Employee[]) =>
    setNotice({ title: "Turunkan data ke perangkat absensi", text: list.length > 1 ? `Data ${list.length} karyawan dikirim ke perangkat absensi.` : `Data ${list[0].name} dikirim ke perangkat absensi.` })
  const selectedRows = () => rows.filter((e) => selected.has(e.id))
  const applySchedule = () => {
    if (!bulkSchedule) return
    const ids = selected
    setRows((r) => r.map((x) => (ids.has(x.id) ? { ...x, schedule: bulkSchedule, updatedAt: stamp() } : x)))
    setBulkSchedule(null)
  }
  const confirmDelete = () => {
    if (!deleting) return
    const ids = new Set(deleting.map((e) => e.id))
    setRows((r) => r.filter((x) => !ids.has(x.id)))
    setSelected((s) => new Set([...s].filter((id) => !ids.has(id))))
    setDeleting(null)
  }
  const exportCsv = () => downloadCsv("karyawan.csv", [csvHeader, ...filtered.map(employeeToRow)])

  /** Menu aksi tambahan (⋮); di mobile berisi semua aksi. */
  const RowMenu = ({ e, all = false }: { e: Employee; all?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Aksi lain untuk ${e.name}`}><MoreVertical /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {all && (<>
          <DropdownMenuItem onSelect={() => setDetail(e)}><Eye /> Lihat detail</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setForm({ employee: e, key: 0 })}><Pencil /> Ubah</DropdownMenuItem>
          <DropdownMenuSeparator />
        </>)}
        <DropdownMenuItem onSelect={() => setDetail(e)}><Info /> Info Umum</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => pushToDevice([e])}><ServerCog /> Turunkan data ke perangkat absensi</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setForm({ employee: e, key: 0 })}><ScanFace /> Tambah Verifikasi</DropdownMenuItem>
        {all && (<><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onSelect={() => setDeleting([e])}><Trash2 /> Hapus</DropdownMenuItem></>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const SortHead = ({ k, label }: { k: SortKey; label: string }) => {
    const Icon = sort?.key !== k ? ArrowUpDown : sort.asc ? ArrowUp : ArrowDown
    return (
      <button type="button" onClick={() => toggleSort(k)} className="inline-flex min-h-8 items-center gap-1.5 self-start text-left text-xs font-bold uppercase tracking-wide">
        {label} <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      </button>
    )
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Karyawan" }, { label: "Daftar Karyawan" }]}
        actions={<Button className="max-md:hidden" onClick={() => setForm({ employee: null, key: 0 })}><UserPlus /> Tambah Karyawan</Button>}
      >
        Daftar Karyawan
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <TableToolbar
            pageSize={pageSize} onPageSize={(n) => { setPageSize(n); reset() }}
            query={query} onQuery={(v) => { setQuery(v); reset() }} placeholder="Cari karyawan…"
            filters={<>
              <Select value={office} onValueChange={(v) => { setOffice(v); reset() }}>
                <SelectTrigger size="sm" aria-label="Kantor" className="w-full rounded-xl sm:w-56"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">Semua Kantor</SelectItem>{employeeOffices.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); reset() }}>
                <SelectTrigger size="sm" aria-label="Status" className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  {(["Aktif", "Nonaktif", "Resign"] as const).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </>}
            actions={<>
              <IconAction label="Impor CSV" icon={Download} onClick={() => setImporting(true)} />
              <IconAction label={`Ekspor CSV (${filtered.length} data)`} icon={Upload} onClick={exportCsv} />
            </>}
          />

          {hasFilters && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Filter aktif.</span>
              <Button variant="link" size="sm" className="h-auto px-0" onClick={clearFilters}><X /> Reset filter</Button>
            </div>
          )}

          {/* Aksi massal */}
          <SelectionBar count={selected.size} noun="karyawan" onClear={() => setSelected(new Set())}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm">Aksi untuk terpilih <ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem onSelect={() => pushToDevice(selectedRows())}><ServerCog /> Turunkan data ke perangkat absensi</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { setRows((r) => r.map((x) => (selected.has(x.id) ? { ...x, status: "Resign", updatedAt: stamp() } : x))); setSelected(new Set()) }}><Clock /> Resign</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setBulkSchedule(schedules[0])}><ListChecks /> Ubah Jadwal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="destructive" onClick={() => setDeleting(rows.filter((e) => selected.has(e.id)))}><Trash2 /> Hapus terpilih</Button>
          </SelectionBar>

          {filtered.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>Tidak ada karyawan</EmptyTitle>
                <EmptyDescription>{hasFilters ? "Tidak ada data yang cocok dengan filter." : "Belum ada karyawan."}</EmptyDescription>
              </EmptyHeader>
              {hasFilters && <Button variant="soft" size="sm" onClick={clearFilters}>Reset filter</Button>}
            </Empty>
          ) : (
            <>
              {/* Desktop: tabel */}
              <div className="hidden md:block">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 align-top">
                        {/* struktur sama dengan kolom lain (baris judul + baris filter) agar kotak sejajar dengan kotak filter */}
                        <div className="flex flex-col gap-1.5 py-1">
                          <div className="min-h-8" />
                          <div className="flex h-8 items-center"><Checkbox aria-label="Pilih semua di halaman" checked={allOnPage ? true : someOnPage ? "indeterminate" : false} onCheckedChange={togglePage} /></div>
                        </div>
                      </TableHead>
                      {cols.map((c) => (
                        <TableHead key={c.key} className={`align-top ${c.width}`} title={c.title}>
                          <div className="flex flex-col gap-1.5 py-1">
                            <SortHead k={c.key} label={c.label} />
                            <Input aria-label={`Filter ${c.title ?? c.label}`} placeholder="Cari…" value={colFilter[c.key] ?? ""} className="h-8 w-full min-w-0 rounded-lg px-2 text-xs font-normal normal-case"
                              onChange={(e) => { setColFilter((f) => ({ ...f, [c.key]: e.target.value })); reset() }} />
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="align-top"><div className="py-1"><SortHead k="status" label="Status" /></div></TableHead>
                      <TableHead className="text-right align-top text-xs font-bold uppercase tracking-wide"><div className="py-2">Aksi</div></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slice.map((e) => (
                      <TableRow key={e.id} data-state={selected.has(e.id) ? "selected" : undefined}>
                        <TableCell><Checkbox aria-label={`Pilih ${e.name}`} checked={selected.has(e.id)} onCheckedChange={() => toggleRow(e.id)} /></TableCell>
                        <TableCell><PinBadges e={e} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>{e.photo && <AvatarImage src={e.photo} alt="" />}<AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar>
                            <span className="font-medium">{e.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-48 whitespace-normal">{e.office}</TableCell>
                        <TableCell className="whitespace-normal">{e.position}</TableCell>
                        <TableCell>{e.access}</TableCell>
                        <TableCell><Schedule name={e.schedule} /></TableCell>
                        <TableCell><StatusBadge status={e.status} /></TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="soft" aria-label={`Lihat ${e.name}`} onClick={() => setDetail(e)}><Eye /></Button></TooltipTrigger><TooltipContent>Lihat detail</TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" aria-label={`Ubah ${e.name}`} onClick={() => setForm({ employee: e, key: 0 })}><Pencil /></Button></TooltipTrigger><TooltipContent>Ubah</TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${e.name}`} onClick={() => setDeleting([e])}><Trash2 /></Button></TooltipTrigger><TooltipContent>Hapus</TooltipContent></Tooltip>
                            <RowMenu e={e} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: kartu */}
              <ul className="space-y-3 md:hidden">
                {slice.map((e) => (
                  <li key={e.id} className={mobileCardClass}>
                    <div className="flex items-start gap-3">
                      <label className="-ml-2 -mt-0.5 grid size-10 shrink-0 cursor-pointer place-items-center"><Checkbox aria-label={`Pilih ${e.name}`} checked={selected.has(e.id)} onCheckedChange={() => toggleRow(e.id)} /></label>
                      <Avatar>{e.photo && <AvatarImage src={e.photo} alt="" />}<AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.position} · {e.office}</p>
                      </div>
                      <RowMenu e={e} all />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 pl-[3.25rem]">
                      <Badge variant="success" className="rounded-md font-mono">{e.pin}</Badge>
                      <Badge variant="info" className="rounded-md font-mono">{e.nik}</Badge>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 pl-[3.25rem] text-xs">
                      <div><p className="text-muted-foreground">Hak akses</p><p className="font-medium">{e.access}</p></div>
                      <div><p className="text-muted-foreground">Jadwal</p><Schedule name={e.schedule} /></div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
                <span>Menampilkan {from}–{to} dari {filtered.length} data</span>
                <ListPagination className="mx-0 w-auto" page={cur} pages={pages} onChange={setPage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button size="lg" aria-label="Tambah Karyawan" className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 size-14 rounded-full shadow-lg md:hidden" onClick={() => setForm({ employee: null, key: 0 })}><UserPlus className="size-6" /></Button>

      <EmployeeFormDialog open={!!form} employee={form?.employee ?? null} existingPins={rows.map((r) => r.pin)} people={rows} nextId={nextId} formKey={form?.key} onClose={() => setForm(null)} onSubmit={save} />
      <EmployeeImportDialog open={importing} existingPins={rows.map((r) => r.pin)} onClose={() => setImporting(false)} onImport={importRows} />
      <EmployeeDetailSheet employee={detail} people={rows} onClose={() => setDetail(null)} onEdit={(e) => { setDetail(null); setForm({ employee: e, key: 0 }) }} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl text-center sm:max-w-md">
          <AlertDialogHeader className="items-center text-center">
            <AlertDialogTitle className="text-xl text-primary">Hapus Karyawan</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && deleting.length > 1 ? `Apakah Anda ingin memindahkan ${deleting.length} karyawan ini` : `Apakah Anda ingin memindahkan karyawan ini${deleting?.[0] ? ` (${deleting[0].name})` : ""}`} ke halaman resign atau menghapus secara permanen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:justify-center">
            <AlertDialogAction className="w-full" onClick={resignDeleting}>Resign</AlertDialogAction>
            <AlertDialogAction variant="destructive" className="w-full" onClick={confirmDelete}>Hapus permanen</AlertDialogAction>
            <AlertDialogCancel className="w-full">Batal</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!notice} onOpenChange={(o) => !o && setNotice(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{notice?.title}</AlertDialogTitle>
            <AlertDialogDescription>{notice?.text}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!bulkSchedule} onOpenChange={(o) => !o && setBulkSchedule(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Ubah Jadwal</AlertDialogTitle>
            <AlertDialogDescription>Pilih jadwal baru untuk {selected.size} karyawan terpilih.</AlertDialogDescription>
          </AlertDialogHeader>
          <Select value={bulkSchedule ?? undefined} onValueChange={setBulkSchedule}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{schedules.map((n) => <SelectItem key={n} value={n}>{scheduleLabel(n)}</SelectItem>)}</SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={applySchedule}>Simpan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
