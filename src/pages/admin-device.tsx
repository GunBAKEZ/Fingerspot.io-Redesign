import { useState } from "react"
import { ChevronDown, Trash2, Upload } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { IconAction, PersonCell, EmptyRows, RemovableChips, SelectionBar, SortButton, TableFooter, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { initialAdminDevice, type AdminDevice } from "@/data/employee-lists"
import { initials } from "@/data/employees"
import { useListTable } from "@/hooks/use-list-table"
import { downloadCsv } from "@/lib/csv"

const cols = [{ key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "position", label: "Jabatan" }, { key: "home", label: "Kantor Asal" }] as const

export default function AdminDevice() {
  const [rows, setRows] = useState<AdminDevice[]>(initialAdminDevice)
  const [deleting, setDeleting] = useState<AdminDevice[] | null>(null)
  const t = useListTable(rows, { search: (r) => [r.pin, r.name, r.position, r.home, ...r.offices], sortValue: (r, k) => String(r[k as keyof AdminDevice]) })

  // Mencabut kantor terakhir sekaligus mengeluarkan karyawan dari daftar.
  const removeOffice = (id: number, office: string) =>
    setRows((r) => r.flatMap((x) => (x.id !== id ? [x] : x.offices.length > 1 ? [{ ...x, offices: x.offices.filter((o) => o !== office) }] : [])))
  const confirmDelete = () => {
    if (!deleting) return
    const ids = new Set(deleting.map((r) => r.id))
    setRows((r) => r.filter((x) => !ids.has(x.id))); t.drop(ids); setDeleting(null)
  }
  const exportCsv = () => downloadCsv("admin-perangkat-absensi.csv", [["ID", "Nama", "Jabatan", "Kantor Asal", "Admin Perangkat Absensi di Kantor"], ...t.filtered.map((r) => [r.pin, r.name, r.position, r.home, r.offices.join("; ")])])

  return (
    <>
      <PageHeader crumbs={[{ label: "Karyawan" }, { label: "Karyawan Kerja di Beberapa Kantor sebagai Admin Perangkat Absensi" }]}>
        Admin Perangkat Absensi
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">Karyawan yang bekerja di beberapa kantor dan dapat mengelola perangkat absensi di kantor-kantor tersebut.</p>
          <TableToolbar pageSize={t.pageSize} onPageSize={t.setPageSize} query={t.query} onQuery={t.setQuery} placeholder="Cari karyawan…"
            actions={<IconAction label={`Ekspor CSV (${t.filtered.length} data)`} icon={Upload} onClick={exportCsv} />} />

          <SelectionBar count={t.selected.size} noun="karyawan" onClear={t.clear}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm">Aksi untuk terpilih <ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(rows.filter((r) => t.selected.has(r.id)))}><Trash2 /> Cabut sebagai admin perangkat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SelectionBar>

          {t.filtered.length === 0 ? <EmptyRows empty={rows.length === 0} emptyText="Belum ada karyawan yang menjadi admin perangkat absensi." query={t.query} /> : (
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
                      <TableHead className="text-xs font-bold uppercase tracking-wide">Admin Perangkat Absensi di Kantor</TableHead>
                      <TableHead className="w-[1%] whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {t.slice.map((r) => (
                      <TableRow key={r.id} data-state={t.selected.has(r.id) ? "selected" : undefined} className="align-top">
                        <TableCell><Checkbox aria-label={`Pilih ${r.name}`} checked={t.selected.has(r.id)} onCheckedChange={() => t.toggleRow(r.id)} /></TableCell>
                        <TableCell><Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge></TableCell>
                        <TableCell><PersonCell name={r.name} /></TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell className="max-w-48 whitespace-normal">{r.home}</TableCell>
                        <TableCell className="min-w-64 whitespace-normal"><RemovableChips items={r.offices} label={(o) => `Hapus ${o} dari ${r.name}`} onRemove={(o) => removeOffice(r.id, o)} /></TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button></TooltipTrigger><TooltipContent>Cabut sebagai admin perangkat</TooltipContent></Tooltip>
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
                      <div className="min-w-0 flex-1"><p className="truncate font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.position} · {r.home}</p></div>
                      <Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button>
                    </div>
                    <div className="mt-3 space-y-2 pl-[3.25rem]">
                      <Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin di kantor</p>
                      <RemovableChips items={r.offices} label={(o) => `Hapus ${o} dari ${r.name}`} onRemove={(o) => removeOffice(r.id, o)} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <TableFooter from={t.from} to={t.to} total={t.filtered.length} page={t.page} pages={t.pages} onPage={t.setPage} />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{deleting && deleting.length > 1 ? `Cabut ${deleting.length} karyawan sebagai admin?` : `Cabut “${deleting?.[0]?.name}” sebagai admin?`}</AlertDialogTitle>
            <AlertDialogDescription>Karyawan tidak lagi dapat mengelola perangkat absensi di kantor lain. Data karyawan tidak ikut terhapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={confirmDelete}>Cabut</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
