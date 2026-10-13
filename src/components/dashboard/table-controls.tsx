import { ArrowDown, ArrowUp, ArrowUpDown, Search, SearchX, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { initials } from "@/data/employees"
import type { Platform } from "@/data/app-users"

/** Baris atas tabel (dipakai semua halaman daftar): "Tampilkan N data" + filter di kiri, pencarian + aksi ikon di kanan. */
export function TableToolbar({ pageSize, onPageSize, query, onQuery, placeholder = "Cari…", filters, actions }: {
  pageSize: number; onPageSize: (n: number) => void; query: string; onQuery: (q: string) => void; placeholder?: string
  filters?: React.ReactNode; actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span>Tampilkan</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSize(Number(v))}>
          <SelectTrigger size="sm" aria-label="Jumlah data per halaman" className="w-20 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
        </Select>
        <span>data</span>
      </div>
      {filters}
      <div className="flex flex-1 items-center justify-end gap-2 max-sm:w-full max-sm:flex-none">
        <InputGroup className="h-10 w-full max-w-xs rounded-xl bg-background">
          <InputGroupAddon><Search /></InputGroupAddon>
          <InputGroupInput placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} />
        </InputGroup>
        {actions}
      </div>
    </div>
  )
}

/** Tombol ikon bertooltip untuk toolbar (impor/ekspor). */
export function IconAction({ label, icon: Icon, onClick }: { label: string; icon: LucideIcon; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline" size="icon" aria-label={label} onClick={onClick}><Icon /></Button></TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/** Bar aksi massal saat ada baris terpilih. */
export function SelectionBar({ count, noun, onClear, children }: { count: number; noun: string; onClear: () => void; children: React.ReactNode }) {
  if (count === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary-soft px-4 py-2 text-sm">
      <span className="font-semibold text-primary">{count} {noun} dipilih</span>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onClear}>Batal pilih</Button>
        {children}
      </div>
    </div>
  )
}

/** Avatar + nama (kolom Nama di semua tabel orang). */
export function PersonCell({ name, photo }: { name: string; photo?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>{photo && <AvatarImage src={photo} alt="" />}<AvatarFallback>{initials(name)}</AvatarFallback></Avatar>
      <span className="font-medium">{name}</span>
    </div>
  )
}

/** Kelas kartu baris di mobile (sama di semua halaman daftar). */
export const mobileCardClass = "rounded-xl border p-3"

/** Baris bawah tabel: ringkasan + paginasi. */
export function TableFooter({ from, to, total, page, pages, onPage }: { from: number; to: number; total: number; page: number; pages: number; onPage: (p: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
      <span>Menampilkan {from}–{to} dari {total} data</span>
      <ListPagination className="mx-0 w-auto" page={page} pages={pages} onChange={onPage} />
    </div>
  )
}

/** Tombol judul kolom yang bisa diurutkan. */
export function SortButton({ label, active, asc, onClick }: { label: string; active: boolean; asc: boolean; onClick: () => void }) {
  const Icon = !active ? ArrowUpDown : asc ? ArrowUp : ArrowDown
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-8 items-center gap-1.5 self-start text-left text-xs font-bold uppercase tracking-wide">
      {label} <Icon className="size-3.5 text-muted-foreground" />
    </button>
  )
}

export function PlatformCell({ platform }: { platform: Platform }) {
  return platform === "N/A"
    ? <span className="text-muted-foreground">N/A</span>
    : <span className="inline-flex items-center gap-1.5"><Smartphone className="size-4 text-muted-foreground" />{platform}</span>
}

/** Chip yang bisa dihapus (mis. kantor lain tempat karyawan bekerja). */
export function RemovableChips({ items, label, onRemove }: { items: string[]; label: (item: string) => string; onRemove: (item: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((o) => (
        <li key={o}>
          <Badge variant="soft" className="h-auto gap-1 whitespace-normal rounded-md py-1 pr-1 text-left">
            {o}
            <button type="button" aria-label={label(o)} onClick={() => onRemove(o)} className="grid size-5 shrink-0 place-items-center rounded hover:bg-primary/15 pointer-coarse:size-6"><X className="size-3" /></button>
          </Badge>
        </li>
      ))}
    </ul>
  )
}

/** Kotak pesan kosong seragam untuk tabel. */
export function EmptyRows({ empty, emptyText, query }: { empty: boolean; emptyText: string; query: string }) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
        <EmptyTitle>{empty ? "Belum ada data" : "Tidak ada hasil"}</EmptyTitle>
        <EmptyDescription>{empty ? emptyText : `Tidak ada data yang cocok dengan “${query}”.`}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
