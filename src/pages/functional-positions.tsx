import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Search, SearchX, Trash2, UserPlus } from "lucide-react"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { PageHeader } from "@/components/dashboard/page-header"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Position = { id: number; name: string }
const seed: Position[] = [{ id: 1, name: "Internship" }, { id: 2, name: "Siswa kelas XA" }]

export default function FunctionalPositions() {
  const [rows, setRows] = useState<Position[]>(seed)
  const [query, setQuery] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [asc, setAsc] = useState<boolean | null>(null) // null = urutan asli
  const [form, setForm] = useState<{ mode: "add" } | { mode: "edit"; row: Position } | null>(null)
  const [name, setName] = useState("")
  const [deleting, setDeleting] = useState<Position | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    const list = rows.filter((r) => r.name.toLowerCase().includes(q))
    return asc === null ? list : [...list].sort((a, b) => a.name.localeCompare(b.name, "id") * (asc ? 1 : -1))
  }, [rows, q, asc])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const cur = Math.min(page, pages - 1)
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize)
  const from = filtered.length === 0 ? 0 : cur * pageSize + 1
  const to = Math.min((cur + 1) * pageSize, filtered.length)

  const duplicate = name.trim() !== "" && rows.some((r) => r.name.toLowerCase() === name.trim().toLowerCase() && (form?.mode !== "edit" || r.id !== form.row.id))
  const valid = name.trim() !== "" && !duplicate

  const openForm = (f: typeof form) => { setForm(f); setName(f?.mode === "edit" ? f.row.name : "") }
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || !form) return
    if (form.mode === "add") setRows((r) => [...r, { id: Math.max(0, ...r.map((x) => x.id)) + 1, name: name.trim() }])
    else setRows((r) => r.map((x) => (x.id === form.row.id ? { ...x, name: name.trim() } : x)))
    setForm(null)
  }
  const SortIcon = asc === null ? ArrowUpDown : asc ? ArrowUp : ArrowDown

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Organisasi" }, { label: "Jabatan Fungsional" }]}
        actions={<Button onClick={() => openForm({ mode: "add" })}><UserPlus /> Tambah Jabatan Fungsional</Button>}
      >
        Jabatan Fungsional
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span>Tampilkan</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0) }}>
                <SelectTrigger size="sm" aria-label="Jumlah data per halaman" className="w-20 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
              </Select>
              <span>data</span>
            </div>
            <InputGroup className="h-10 w-full max-w-xs rounded-xl bg-background sm:w-64">
              <InputGroupAddon><Search /></InputGroupAddon>
              <InputGroupInput placeholder="Cari jabatan…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} />
            </InputGroup>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead aria-sort={asc === null ? "none" : asc ? "ascending" : "descending"}>
                  <button type="button" onClick={() => setAsc((a) => (a === null ? true : a ? false : null))} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                    Nama Jabatan <SortIcon className="size-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Empty className="py-12">
                      <EmptyHeader>
                        <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                        <EmptyTitle>{rows.length === 0 ? "Belum ada jabatan fungsional" : "Tidak ada hasil"}</EmptyTitle>
                        <EmptyDescription>{rows.length === 0 ? "Klik “Tambah Jabatan Fungsional” untuk membuat yang pertama." : `Tidak ada jabatan yang cocok dengan “${query}”.`}</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                slice.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="py-4 font-medium">{r.name}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="soft" onClick={() => openForm({ mode: "edit", row: r })}><Pencil /> Ubah</Button>
                        <Button size="sm" variant="outline" className="text-danger hover:text-danger" onClick={() => setDeleting(r)}><Trash2 /> Hapus</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>Menampilkan {from}–{to} dari {filtered.length} data</span>
            <ListPagination className="mx-0 w-auto" page={cur} pages={pages} onChange={setPage} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <form onSubmit={save} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{form?.mode === "edit" ? "Ubah Jabatan Fungsional" : "Tambah Jabatan Fungsional"}</DialogTitle>
              <DialogDescription>Nama jabatan fungsional harus unik.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="pos-name">Nama Jabatan</Label>
              <Input id="pos-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Magang" aria-invalid={duplicate} />
              {duplicate && <p className="text-xs text-danger">Jabatan dengan nama ini sudah ada.</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setForm(null)}>Batal</Button>
              <Button type="submit" disabled={!valid}>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => { if (deleting) setRows((r) => r.filter((x) => x.id !== deleting.id)); setDeleting(null) }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
