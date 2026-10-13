import { useState } from "react"
import { Trash2, UserPlus } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyRows, PersonCell, SelectionBar, SortButton, TableFooter, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { initialHidden, type HiddenEmployee } from "@/data/employee-lists"
import { initialEmployees, initials } from "@/data/employees"
import { useListTable } from "@/hooks/use-list-table"
import { Search } from "lucide-react"

const cols = [{ key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "office", label: "Kantor" }, { key: "position", label: "Jabatan" }] as const

export default function HiddenAttendance() {
  const [rows, setRows] = useState<HiddenEmployee[]>(initialHidden)
  const [adding, setAdding] = useState(false)
  const t = useListTable(rows, { search: (r) => [r.pin, r.name, r.office, r.position], sortValue: (r, k) => String(r[k as keyof HiddenEmployee]) })
  const remove = (ids: Set<number>) => { setRows((r) => r.filter((x) => !ids.has(x.id))); t.drop(ids) }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Karyawan" }, { label: "Absensi Tidak Ditampilkan" }]}
        actions={<Button className="max-sm:basis-full" onClick={() => setAdding(true)}><UserPlus /> Tambah karyawan</Button>}
      >
        Absensi Tidak Ditampilkan
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Halaman ini digunakan untuk mengatur karyawan agar tidak ditampilkan data absensinya pada Laporan Kehadiran dan Laporan Detail Kehadiran. Klik tombol “Tambah karyawan” untuk memilih karyawan yang tidak ditampilkan pada laporan.
          </p>
          <TableToolbar pageSize={t.pageSize} onPageSize={t.setPageSize} query={t.query} onQuery={t.setQuery} placeholder="Cari karyawan…" />

          <SelectionBar count={t.selected.size} noun="karyawan" onClear={t.clear}>
            <Button size="sm" variant="destructive" onClick={() => remove(new Set(t.selected))}><Trash2 /> Hapus terpilih</Button>
          </SelectionBar>

          {t.filtered.length === 0 ? <EmptyRows empty={rows.length === 0} emptyText="Belum ada karyawan yang disembunyikan dari laporan." query={t.query} /> : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"><Checkbox aria-label="Pilih semua di halaman" checked={t.allOnPage ? true : t.someOnPage ? "indeterminate" : false} onCheckedChange={t.togglePage} /></TableHead>
                      {cols.map((c) => (
                        <TableHead key={c.key} aria-sort={t.sort?.key !== c.key ? "none" : t.sort.asc ? "ascending" : "descending"}>
                          <SortButton label={c.label} active={t.sort?.key === c.key} asc={!!t.sort?.asc} onClick={() => t.toggleSort(c.key)} />
                        </TableHead>
                      ))}
                      <TableHead className="w-[1%] whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {t.slice.map((r) => (
                      <TableRow key={r.id} data-state={t.selected.has(r.id) ? "selected" : undefined}>
                        <TableCell><Checkbox aria-label={`Pilih ${r.name}`} checked={t.selected.has(r.id)} onCheckedChange={() => t.toggleRow(r.id)} /></TableCell>
                        <TableCell><Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge></TableCell>
                        <TableCell><PersonCell name={r.name} /></TableCell>
                        <TableCell className="max-w-56 whitespace-normal">{r.office}</TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => remove(new Set([r.id]))}><Trash2 /></Button></TooltipTrigger><TooltipContent>Tampilkan lagi di laporan</TooltipContent></Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="space-y-3 md:hidden">
                {t.slice.map((r) => (
                  <li key={r.id} className={mobileCardClass}>
                    <div className="flex items-start gap-3">
                      <label className="-ml-2 -mt-0.5 grid size-10 shrink-0 cursor-pointer place-items-center"><Checkbox aria-label={`Pilih ${r.name}`} checked={t.selected.has(r.id)} onCheckedChange={() => t.toggleRow(r.id)} /></label>
                      <Avatar><AvatarFallback>{initials(r.name)}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1"><p className="truncate font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.position} · {r.office}</p></div>
                      <Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => remove(new Set([r.id]))}><Trash2 /></Button>
                    </div>
                    <div className="mt-3 pl-[3.25rem]"><Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge></div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <TableFooter from={t.from} to={t.to} total={t.filtered.length} page={t.page} pages={t.pages} onPage={t.setPage} />
        </CardContent>
      </Card>

      <PickDialog open={adding} taken={rows.map((r) => r.pin)} onClose={() => setAdding(false)}
        onAdd={(picked) => { setRows((r) => { let id = Math.max(0, ...r.map((x) => x.id)); return [...picked.map((e) => ({ id: ++id, pin: e.pin, name: e.name, office: e.office, position: e.position })), ...r] }); setAdding(false) }} />
    </>
  )
}

function PickDialog({ open, taken, onClose, onAdd }: { open: boolean; taken: string[]; onClose: () => void; onAdd: (list: typeof initialEmployees) => void }) {
  const [q, setQ] = useState("")
  const [sel, setSel] = useState<Set<string>>(new Set())
  const list = initialEmployees.filter((e) => e.status === "Aktif" && !taken.includes(e.pin) && (!q || `${e.name} ${e.pin} ${e.office}`.toLowerCase().includes(q.toLowerCase())))
  const close = () => { setQ(""); setSel(new Set()); onClose() }
  const toggle = (pin: string) => setSel((s) => { const n = new Set(s); n.has(pin) ? n.delete(pin) : n.add(pin); return n })
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onAdd(initialEmployees.filter((x) => sel.has(x.pin))); setQ(""); setSel(new Set()) }}>
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl text-primary">Pilih Karyawan</DialogTitle>
            <DialogDescription>Pilih karyawan yang absensinya tidak ditampilkan pada laporan.</DialogDescription>
          </DialogHeader>
          <InputGroup className="h-10 rounded-xl"><InputGroupAddon><Search /></InputGroupAddon><InputGroupInput placeholder="Cari karyawan…" aria-label="Cari karyawan" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup>
          <ul className="max-h-64 space-y-1 overflow-y-auto rounded-xl border p-2">
            {list.length === 0 && <li className="px-2 py-3 text-sm text-muted-foreground">Tidak ada karyawan yang dapat dipilih.</li>}
            {list.map((e) => (
              <li key={e.pin}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted">
                  <Checkbox checked={sel.has(e.pin)} onCheckedChange={() => toggle(e.pin)} />
                  <span className="min-w-0 flex-1"><span className="block truncate font-medium">{e.name}</span><span className="block truncate text-xs text-muted-foreground">{e.pin} · {e.office}</span></span>
                </label>
              </li>
            ))}
          </ul>
          <DialogFooter className="border-t pt-4 max-sm:flex-col-reverse">
            <Button type="button" variant="ghost" onClick={close}>Batal</Button>
            <Button type="submit" disabled={sel.size === 0}>Tambah{sel.size ? ` (${sel.size})` : ""}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
