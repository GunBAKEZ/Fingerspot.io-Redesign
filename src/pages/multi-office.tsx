import { useMemo, useState } from "react"
import { ChevronDown, SearchX, Trash2, Upload, UserPlus, X } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { IconAction, PersonCell, SelectionBar, SortButton, TableFooter, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { initialEmployees, initials } from "@/data/employees"
import { allOffices, initialMultiOffice, type MultiOfficeEmployee } from "@/data/multi-office"
import { downloadCsv } from "@/lib/csv"

type SortKey = "pin" | "name" | "position" | "home"
const cols: { key: SortKey; label: string }[] = [
  { key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "position", label: "Jabatan" }, { key: "home", label: "Kantor Asal" },
]

/** Chip kantor dengan tombol hapus (mencabut akses kantor tersebut). */
function OfficeChips({ row, onRemove }: { row: MultiOfficeEmployee; onRemove: (office: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {row.others.map((o) => (
        <li key={o}>
          <Badge variant="soft" className="h-auto gap-1 whitespace-normal rounded-md py-1 pr-1 text-left">
            {o}
            <button type="button" aria-label={`Hapus ${o} dari ${row.name}`} onClick={() => onRemove(o)} className="grid size-5 shrink-0 place-items-center rounded hover:bg-primary/15 pointer-coarse:size-6"><X className="size-3" /></button>
          </Badge>
        </li>
      ))}
    </ul>
  )
}

export default function MultiOffice() {
  const [rows, setRows] = useState<MultiOfficeEmployee[]>(initialMultiOffice)
  const [query, setQuery] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean } | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<MultiOfficeEmployee[] | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = rows.filter((r) => !q || [r.pin, r.name, r.position, r.home, ...r.others].some((v) => v.toLowerCase().includes(q)))
    if (sort) list = [...list].sort((a, b) => a[sort.key].localeCompare(b[sort.key], "id", { numeric: true }) * (sort.asc ? 1 : -1))
    return list
  }, [rows, q, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize)
  const from = filtered.length ? cur * pageSize + 1 : 0
  const to = Math.min((cur + 1) * pageSize, filtered.length)
  const allOnPage = slice.length > 0 && slice.every((r) => selected.has(r.id))
  const someOnPage = slice.some((r) => selected.has(r.id))

  const toggleSort = (key: SortKey) => setSort((s) => (!s || s.key !== key ? { key, asc: true } : s.asc ? { key, asc: false } : null))
  const toggleRow = (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const togglePage = () => setSelected((s) => { const n = new Set(s); slice.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id))); return n })
  // Mencabut kantor terakhir sekaligus mengeluarkan karyawan dari daftar.
  const removeOffice = (id: number, office: string) =>
    setRows((r) => r.flatMap((x) => (x.id !== id ? [x] : x.others.length > 1 ? [{ ...x, others: x.others.filter((o) => o !== office) }] : [])))
  const confirmDelete = () => {
    if (!deleting) return
    const ids = new Set(deleting.map((r) => r.id))
    setRows((r) => r.filter((x) => !ids.has(x.id)))
    setSelected((s) => new Set([...s].filter((id) => !ids.has(id))))
    setDeleting(null)
  }
  const exportCsv = () => downloadCsv("karyawan-beberapa-kantor.csv", [
    ["ID", "Nama", "Jabatan", "Kantor Asal", "Kantor Lainnya"],
    ...filtered.map((r) => [r.pin, r.name, r.position, r.home, r.others.join("; ")]),
  ])
  const add = (pin: string, offices: string[]) => {
    const emp = initialEmployees.find((e) => e.pin === pin)
    if (!emp) return
    setRows((r) => {
      const ex = r.find((x) => x.pin === pin)
      if (ex) return r.map((x) => (x.pin === pin ? { ...x, others: [...new Set([...x.others, ...offices])] } : x))
      return [{ id: Math.max(0, ...r.map((x) => x.id)) + 1, pin, name: emp.name, position: emp.position, home: emp.office, others: offices }, ...r]
    })
    setAdding(false)
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Karyawan" }, { label: "Karyawan Kerja di Beberapa Kantor" }]}
        actions={<Button className="min-w-0 max-sm:basis-full" onClick={() => setAdding(true)}><UserPlus /> <span>Tambah Karyawan Kerja di Banyak Kantor</span></Button>}
      >
        Karyawan Kerja di Beberapa Kantor
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <TableToolbar
            pageSize={pageSize} onPageSize={(n) => { setPageSize(n); setPage(0) }}
            query={query} onQuery={(v) => { setQuery(v); setPage(0) }} placeholder="Cari karyawan…"
            actions={<IconAction label={`Ekspor CSV (${filtered.length} data)`} icon={Upload} onClick={exportCsv} />}
          />

          <SelectionBar count={selected.size} noun="karyawan" onClear={() => setSelected(new Set())}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm">Aksi untuk terpilih <ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(rows.filter((r) => selected.has(r.id)))}><Trash2 /> Hapus dari daftar beberapa kantor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SelectionBar>

          {filtered.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>{rows.length === 0 ? "Belum ada karyawan di beberapa kantor" : "Tidak ada hasil"}</EmptyTitle>
                <EmptyDescription>{rows.length === 0 ? "Klik “Tambah Karyawan Kerja di Banyak Kantor” untuk menambahkan." : `Tidak ada karyawan yang cocok dengan “${query}”.`}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"><Checkbox aria-label="Pilih semua di halaman" checked={allOnPage ? true : someOnPage ? "indeterminate" : false} onCheckedChange={togglePage} /></TableHead>
                      {cols.map((c) => (
                        <TableHead key={c.key} aria-sort={sort?.key !== c.key ? "none" : sort.asc ? "ascending" : "descending"}>
                          <SortButton label={c.label} active={sort?.key === c.key} asc={!!sort?.asc} onClick={() => toggleSort(c.key)} />
                        </TableHead>
                      ))}
                      <TableHead className="text-xs font-bold uppercase tracking-wide">Kantor Lainnya</TableHead>
                      <TableHead className="w-[1%] whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slice.map((r) => (
                      <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined} className="align-top">
                        <TableCell><Checkbox aria-label={`Pilih ${r.name}`} checked={selected.has(r.id)} onCheckedChange={() => toggleRow(r.id)} /></TableCell>
                        <TableCell><Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge></TableCell>
                        <TableCell><PersonCell name={r.name} /></TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell className="max-w-48 whitespace-normal">{r.home}</TableCell>
                        <TableCell className="min-w-64 whitespace-normal"><OfficeChips row={r} onRemove={(o) => removeOffice(r.id, o)} /></TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button></TooltipTrigger><TooltipContent>Hapus dari daftar</TooltipContent></Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <ul className="space-y-3 md:hidden">
                {slice.map((r) => (
                  <li key={r.id} className={mobileCardClass}>
                    <div className="flex items-start gap-3">
                      <label className="-ml-2 -mt-0.5 grid size-10 shrink-0 cursor-pointer place-items-center"><Checkbox aria-label={`Pilih ${r.name}`} checked={selected.has(r.id)} onCheckedChange={() => toggleRow(r.id)} /></label>
                      <Avatar><AvatarFallback>{initials(r.name)}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.position} · {r.home}</p>
                      </div>
                      <Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button>
                    </div>
                    <div className="mt-3 space-y-2 pl-[3.25rem]">
                      <Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kantor lainnya</p>
                      <OfficeChips row={r} onRemove={(o) => removeOffice(r.id, o)} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <TableFooter from={from} to={to} total={filtered.length} page={cur} pages={pages} onPage={setPage} />
        </CardContent>
      </Card>

      <AddDialog open={adding} existing={rows} onClose={() => setAdding(false)} onAdd={add} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{deleting && deleting.length > 1 ? `Hapus ${deleting.length} karyawan dari daftar?` : `Hapus “${deleting?.[0]?.name}” dari daftar?`}</AlertDialogTitle>
            <AlertDialogDescription>Karyawan hanya akan terdaftar di kantor asalnya. Data karyawan tidak ikut terhapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function AddDialog({ open, existing, onClose, onAdd }: { open: boolean; existing: MultiOfficeEmployee[]; onClose: () => void; onAdd: (pin: string, offices: string[]) => void }) {
  const [pin, setPin] = useState("")
  const [offices, setOffices] = useState<Set<string>>(new Set())
  const emp = initialEmployees.find((e) => e.pin === pin)
  const current = existing.find((x) => x.pin === pin)
  const options = allOffices.filter((o) => o !== emp?.office && !current?.others.includes(o))
  const reset = () => { setPin(""); setOffices(new Set()) }
  const close = () => { reset(); onClose() }
  const toggle = (o: string) => setOffices((s) => { const n = new Set(s); n.has(o) ? n.delete(o) : n.add(o); return n })
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <form onSubmit={(e) => { e.preventDefault(); if (pin && offices.size) { onAdd(pin, [...offices]); reset() } }} className="space-y-5">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl text-primary">Tambah Karyawan Kerja di Banyak Kantor</DialogTitle>
            <DialogDescription>Pilih karyawan, lalu kantor lain tempat karyawan tersebut juga bekerja.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="mo-emp">Pilih karyawan <span className="text-danger" aria-hidden>*</span></Label>
            <Select value={pin} onValueChange={(v) => { setPin(v); setOffices(new Set()) }}>
              <SelectTrigger id="mo-emp" className="w-full rounded-xl"><SelectValue placeholder="-- Pilih karyawan --" /></SelectTrigger>
              <SelectContent>{initialEmployees.filter((e) => e.status === "Aktif").map((e) => <SelectItem key={e.pin} value={e.pin}>{e.name} ({e.pin})</SelectItem>)}</SelectContent>
            </Select>
            {emp && <p className="text-xs text-muted-foreground">Kantor asal: {emp.office}</p>}
          </div>

          <fieldset className="space-y-2" disabled={!emp}>
            <legend className="mb-2 text-sm font-medium">Kantor lainnya <span className="text-danger" aria-hidden>*</span></legend>
            <ul className="max-h-60 space-y-1 overflow-y-auto rounded-xl border p-2">
              {options.length === 0 && <li className="px-2 py-3 text-sm text-muted-foreground">{emp ? "Semua kantor sudah ditambahkan." : "Pilih karyawan terlebih dahulu."}</li>}
              {options.map((o) => (
                <li key={o}>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted">
                    <Checkbox checked={offices.has(o)} onCheckedChange={() => toggle(o)} /> {o}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <DialogFooter className="border-t pt-4 max-sm:flex-col-reverse">
            <Button type="button" variant="ghost" onClick={close}>Batal</Button>
            <Button type="submit" disabled={!pin || offices.size === 0}>Tambah{offices.size > 0 ? ` (${offices.size} kantor)` : ""}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
