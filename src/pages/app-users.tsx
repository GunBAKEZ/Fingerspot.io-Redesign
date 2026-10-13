import { useMemo, useState } from "react"
import { MapPin, SearchX, Trash2, Upload, UserPlus } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { IconAction, PersonCell, PlatformCell, SelectionBar, SortButton, TableFooter, TableToolbar, mobileCardClass } from "@/components/dashboard/table-controls"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/data/employees"
import { initialAppUsers, type AppUser, type InviteStatus } from "@/data/app-users"
import { initialEmployees } from "@/data/employees"
import { downloadCsv } from "@/lib/csv"

type SortKey = "pin" | "name" | "office" | "position" | "platform" | "invite"
const inviteVariant: Record<InviteStatus, "success" | "warning" | "danger"> = { "Sudah Diterima": "success", Menunggu: "warning", Ditolak: "danger" }
const cols: { key: SortKey; label: string }[] = [
  { key: "pin", label: "ID" }, { key: "name", label: "Nama" }, { key: "office", label: "Kantor" },
  { key: "position", label: "Jabatan" }, { key: "platform", label: "Platform" }, { key: "invite", label: "Status Undangan" },
]

export default function AppUsers() {
  const [rows, setRows] = useState<AppUser[]>(initialAppUsers)
  const [query, setQuery] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean } | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<AppUser[] | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = rows.filter((r) => !q || [r.pin, r.name, r.office, r.position, r.platform, r.invite].some((v) => v.toLowerCase().includes(q)))
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
  const confirmDelete = () => {
    if (!deleting) return
    const ids = new Set(deleting.map((r) => r.id))
    setRows((r) => r.filter((x) => !ids.has(x.id)))
    setSelected((s) => new Set([...s].filter((id) => !ids.has(id))))
    setDeleting(null)
  }
  const exportCsv = () => downloadCsv("pengguna-app-karyawan.csv", [
    ["ID", "Nama", "Kantor", "Jabatan", "Platform", "Status Undangan"],
    ...filtered.map((r) => [r.pin, r.name, r.office, r.position, r.platform, r.invite]),
  ])
  const onBulk = (v: string) => { if (v === "hapus") setDeleting(rows.filter((r) => selected.has(r.id))) }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Karyawan" }, { label: "Pengguna App Karyawan" }]}
        actions={<>
          <Button variant="outline" asChild className="max-sm:basis-full"><a href="#/karyawan/pengguna-app/gps"><MapPin /> <span>Lihat Karyawan Absensi GPS</span></a></Button>
          <Button className="min-w-0 max-sm:basis-full" onClick={() => setAdding(true)}><UserPlus /> <span>Tambah Pengguna App<span className="max-sm:hidden"> Karyawan</span></span></Button>
        </>}
      >
        Pengguna App Karyawan
      </PageHeader>

      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Dapatkan App fingerspot.io pada Google Play Store atau App Store untuk dapat menggunakan berbagai fitur unggulan kami. Kolom platform N/A berarti karyawan tersebut sedang tidak login.
          </p>

          <TableToolbar
            pageSize={pageSize} onPageSize={(n) => { setPageSize(n); setPage(0) }}
            query={query} onQuery={(v) => { setQuery(v); setPage(0) }} placeholder="Cari pengguna…"
            actions={<IconAction label={`Ekspor CSV (${filtered.length} data)`} icon={Upload} onClick={exportCsv} />}
          />

          <SelectionBar count={selected.size} noun="pengguna" onClear={() => setSelected(new Set())}>
            <Button size="sm" variant="destructive" onClick={() => setDeleting(rows.filter((r) => selected.has(r.id)))}><Trash2 /> Hapus terpilih</Button>
          </SelectionBar>

          {filtered.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
                <EmptyTitle>{rows.length === 0 ? "Belum ada pengguna app" : "Tidak ada hasil"}</EmptyTitle>
                <EmptyDescription>{rows.length === 0 ? "Klik “Tambah Pengguna App Karyawan” untuk mengundang karyawan." : `Tidak ada pengguna yang cocok dengan “${query}”.`}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Desktop: tabel */}
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
                      <TableHead className="w-[1%] whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slice.map((r) => (
                      <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                        <TableCell><Checkbox aria-label={`Pilih ${r.name}`} checked={selected.has(r.id)} onCheckedChange={() => toggleRow(r.id)} /></TableCell>
                        <TableCell><Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge></TableCell>
                        <TableCell><PersonCell name={r.name} /></TableCell>
                        <TableCell className="max-w-56 whitespace-normal">{r.office}</TableCell>
                        <TableCell className="whitespace-normal">{r.position}</TableCell>
                        <TableCell><PlatformCell platform={r.platform} /></TableCell>
                        <TableCell><Badge variant={inviteVariant[r.invite]} dot>{r.invite}</Badge></TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button></TooltipTrigger><TooltipContent>Hapus pengguna app</TooltipContent></Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: kartu */}
              <ul className="space-y-3 md:hidden">
                {slice.map((r) => (
                  <li key={r.id} className={mobileCardClass}>
                    <div className="flex items-start gap-3">
                      <label className="-ml-2 -mt-0.5 grid size-10 shrink-0 cursor-pointer place-items-center"><Checkbox aria-label={`Pilih ${r.name}`} checked={selected.has(r.id)} onCheckedChange={() => toggleRow(r.id)} /></label>
                      <Avatar><AvatarFallback>{initials(r.name)}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.position} · {r.office}</p>
                      </div>
                      <Button size="icon-sm" variant="outline" className="text-danger hover:text-danger" aria-label={`Hapus ${r.name}`} onClick={() => setDeleting([r])}><Trash2 /></Button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 pl-[3.25rem]">
                      <Badge variant="success" className="rounded-md font-mono">{r.pin}</Badge>
                      <PlatformCell platform={r.platform} />
                      <Badge variant={inviteVariant[r.invite]} dot>{r.invite}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <TableFooter from={from} to={to} total={filtered.length} page={cur} pages={pages} onPage={setPage} />
        </CardContent>
      </Card>

      <AddDialog open={adding} existing={rows.map((r) => r.pin)} onClose={() => setAdding(false)}
        onAdd={(u) => { setRows((r) => [{ ...u, id: Math.max(0, ...r.map((x) => x.id)) + 1 }, ...r]); setAdding(false) }} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{deleting && deleting.length > 1 ? `Hapus ${deleting.length} pengguna app?` : `Hapus pengguna app “${deleting?.[0]?.name}”?`}</AlertDialogTitle>
            <AlertDialogDescription>Karyawan tidak lagi dapat masuk ke App fingerspot.io. Data karyawan tidak ikut terhapus.</AlertDialogDescription>
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

function IdFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 shrink-0 rounded-[3px] ring-1 ring-border" aria-hidden>
      <rect width="20" height="7" fill="#e70011" /><rect y="7" width="20" height="7" fill="#fff" />
    </svg>
  )
}

function AddDialog({ open, existing, onClose, onAdd }: { open: boolean; existing: string[]; onClose: () => void; onAdd: (u: Omit<AppUser, "id">) => void }) {
  const [pin, setPin] = useState("")
  const [by, setBy] = useState<"phone" | "email">("phone")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const candidates = initialEmployees.filter((e) => e.status === "Aktif" && !existing.includes(e.pin))
  const reset = () => { setPin(""); setBy("phone"); setPhone(""); setEmail("") }
  const phoneOk = /^\d{8,13}$/.test(phone)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const valid = !!pin && (by === "phone" ? phoneOk : emailOk)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = candidates.find((c) => c.pin === pin)
    if (!valid || !emp) return
    onAdd({ pin: emp.pin, name: emp.name, office: emp.office, position: emp.position, platform: "N/A", invite: "Menunggu", contact: by === "phone" ? `+62${phone}` : email })
    reset()
  }
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose() } }}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl text-primary">Tambah Pengguna App</DialogTitle>
            <DialogDescription>Undang karyawan menggunakan App fingerspot.io lewat nomor telepon atau email.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="au-emp">Pilih karyawan <span className="text-danger" aria-hidden>*</span></Label>
            <Select value={pin} onValueChange={setPin}>
              <SelectTrigger id="au-emp" className="w-full rounded-xl"><SelectValue placeholder="-- Pilih karyawan --" /></SelectTrigger>
              <SelectContent>
                {candidates.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Semua karyawan aktif sudah menjadi pengguna app.</div>}
                {candidates.map((c) => <SelectItem key={c.pin} value={c.pin}>{c.name} ({c.pin})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label id="au-by">Cari Berdasarkan <span className="text-danger" aria-hidden>*</span></Label>
            <RadioGroup value={by} onValueChange={(v) => setBy(v as "phone" | "email")} aria-labelledby="au-by" className="gap-3">
              <div className="flex items-center gap-2"><RadioGroupItem id="au-phone" value="phone" /><Label htmlFor="au-phone" className="font-normal">No telepon</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem id="au-email" value="email" /><Label htmlFor="au-email" className="font-normal">Email</Label></div>
            </RadioGroup>
          </div>

          {by === "phone" ? (
            <div className="space-y-2">
              <Label htmlFor="au-phone-in">No telepon</Label>
              <InputGroup className="h-10 rounded-xl">
                <InputGroupAddon><IdFlag /><InputGroupText className="font-medium text-foreground">+62</InputGroupText></InputGroupAddon>
                <InputGroupInput id="au-phone-in" inputMode="numeric" placeholder="81234567890" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").replace(/^0+/, ""))} aria-invalid={phone !== "" && !phoneOk} />
              </InputGroup>
              {phone !== "" && !phoneOk && <p className="text-xs text-danger">Masukkan 8–13 digit tanpa angka 0 di depan.</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="au-email-in">Email</Label>
              <Input id="au-email-in" type="email" placeholder="nama@perusahaan.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={email !== "" && !emailOk} />
              {email !== "" && !emailOk && <p className="text-xs text-danger">Format email tidak valid.</p>}
            </div>
          )}

          <DialogFooter className="border-t pt-4 max-sm:flex-col-reverse">
            <Button type="button" variant="ghost" onClick={() => { reset(); onClose() }}>Batal</Button>
            <Button type="submit" disabled={!valid}>Tambah Pengguna App Karyawan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
