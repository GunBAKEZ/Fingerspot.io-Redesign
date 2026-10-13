import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone } from "lucide-react"
import type { Platform } from "@/data/app-users"

/** Baris atas tabel: "Tampilkan N data" + pencarian. */
export function TableToolbar({ pageSize, onPageSize, query, onQuery, placeholder = "Cari…" }: {
  pageSize: number; onPageSize: (n: number) => void; query: string; onQuery: (q: string) => void; placeholder?: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span>Tampilkan</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSize(Number(v))}>
          <SelectTrigger size="sm" aria-label="Jumlah data per halaman" className="w-20 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
        </Select>
        <span>data</span>
      </div>
      <InputGroup className="h-10 w-full max-w-xs rounded-xl bg-background sm:w-64">
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} />
      </InputGroup>
    </div>
  )
}

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
    <button type="button" onClick={onClick} className="-my-2 inline-flex min-h-10 items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
      {label} <Icon className="size-3.5 text-muted-foreground" />
    </button>
  )
}

export function PlatformCell({ platform }: { platform: Platform }) {
  return platform === "N/A"
    ? <span className="text-muted-foreground">N/A</span>
    : <span className="inline-flex items-center gap-1.5"><Smartphone className="size-4 text-muted-foreground" />{platform}</span>
}
