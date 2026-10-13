import { useState } from "react"
import { format, parseISO } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { ChevronDown, RotateCcw, Trash2, Upload } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { EmptyRows, IconAction, PersonCell, SelectionBar, SortButton, TableFooter, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { initialResigned, type ResignedEmployee } from "@/data/employee-lists"
import { initials } from "@/data/employees"
import { useListTable } from "@/hooks/use-list-table"
import { downloadCsv } from "@/lib/csv"

const cols = [{ key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "office", label: "Kantor" }, { key: "position", label: "Jabatan" }, { key: "resignDate", label: "Tanggal Resign" }, { key: "processedAt", label: "Diproses Pada" }] as const
const date = (iso: string) => format(parseISO(iso), "dd MMM yyyy", { locale: idLocale })
const dateTime = (iso: string) => format(parseISO(iso.replace(" ", "T")), "dd MMM yyyy HH:mm:ss", { locale: idLocale })

export default function Resigned() {
  const [rows, setRows] = useState<ResignedEmployee[]>(initialResigned)
  const [action, setAction] = useState<{ kind: "restore" | "delete"; list: ResignedEmployee[] } | null>(null)
  const t = useListTable(rows, { search: (r) => [r.pin, r.name, r.office, r.position, date(r.resignDate)], sortValue: (r, k) => String(r[k as keyof ResignedEmployee]) })

  const confirm = () => {
    if (!action) return
    const ids = new Set(action.list.map((r) => r.id))
    setRows((r) => r.filter((x) => !ids.has(x.id))); t.drop(ids); setAction(null)
  }
  const exportCsv = () => downloadCsv("karyawan-resign.csv", [["ID", "Nama", "Kantor", "Jabatan", "Tanggal Resign", "Diproses Pada"], ...t.filtered.map((r) => [r.pin, r.name, r.office, r.position, r.resignDate, r.processedAt])])
  const picked = () => rows.filter((r) => t.selected.has(r.id))
  const restore = action?.kind === "restore"
  const n = action?.list.length ?? 0

  const Actions = ({ r }: { r: ResignedEmployee }) => (
    <div className="flex justify-end gap-1">
      <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="soft" aria-label={`Aktifkan kembali ${r.name}`} onClick={() => setAction({ kind: "restore", list: [r] })}><RotateCcw /></Button></TooltipTrigger><TooltipContent>Aktifkan kembali</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setAction({ kind: "delete", list: [r] })}><Trash2 /></Button></TooltipTrigger><TooltipContent>Hapus permanen</TooltipContent></Tooltip>
    </div>
  )

  return (
    <>
      <PageHeader crumbs={[{ label: "Karyawan" }, { label: "Karyawan Resign" }]}>Karyawan Resign</PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <TableToolbar pageSize={t.pageSize} onPageSize={t.setPageSize} query={t.query} onQuery={t.setQuery} placeholder="Cari karyawan…"
            actions={<IconAction label={`Ekspor CSV (${t.filtered.length} data)`} icon={Upload} onClick={exportCsv} />} />

          <SelectionBar count={t.selected.size} noun="karyawan" onClear={t.clear}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm">Aksi untuk terpilih <ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem onSelect={() => setAction({ kind: "restore", list: picked() })}><RotateCcw /> Aktifkan kembali</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => setAction({ kind: "delete", list: picked() })}><Trash2 /> Hapus permanen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SelectionBar>

          {t.filtered.length === 0 ? <EmptyRows empty={rows.length === 0} emptyText="Belum ada karyawan yang resign." query={t.query} /> : (
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
                        <TableCell className="max-w-48 whitespace-normal">{r.office}</TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell className="whitespace-nowrap">{date(r.resignDate)}</TableCell>
                        <TableCell className="whitespace-normal tabular-nums">{dateTime(r.processedAt)}</TableCell>
                        <TableCell><Actions r={r} /></TableCell>
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
                      <Actions r={r} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pl-[3.25rem] text-xs text-muted-foreground">
                      <Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge>
                      <span>Resign {date(r.resignDate)}</span>
                      <span>Diproses {dateTime(r.processedAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <TableFooter from={t.from} to={t.to} total={t.filtered.length} page={t.page} pages={t.pages} onPage={t.setPage} />
        </CardContent>
      </Card>

      <AlertDialog open={!!action} onOpenChange={(o) => !o && setAction(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{restore ? (n > 1 ? `Aktifkan kembali ${n} karyawan?` : `Aktifkan kembali “${action?.list[0]?.name}”?`) : (n > 1 ? `Hapus permanen ${n} karyawan?` : `Hapus permanen “${action?.list[0]?.name}”?`)}</AlertDialogTitle>
            <AlertDialogDescription>{restore ? "Karyawan akan kembali ke Daftar Karyawan dengan status Aktif." : "Data karyawan akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant={restore ? "default" : "destructive"} onClick={confirm}>{restore ? "Aktifkan" : "Hapus"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
