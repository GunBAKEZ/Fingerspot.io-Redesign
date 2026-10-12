import { ChevronLeft, ChevronRight } from "lucide-react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination"

/** Nomor halaman yang ditampilkan: pertama, terakhir, dan sekitar halaman aktif; sisanya "…". */
function pageWindow(page: number, pages: number): (number | "…")[] {
  const keep = new Set([0, pages - 1, page - 1, page, page + 1].filter((n) => n >= 0 && n < pages))
  const sorted = [...keep].sort((a, b) => a - b)
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["…" as const, n] : [n]))
}

/** Paginasi shadcn dengan ellipsis. `page` berbasis 0. */
export function ListPagination({
  page, pages, onChange, className,
}: { page: number; pages: number; onChange: (page: number) => void; className?: string }) {
  const go = (n: number) => (e: React.MouseEvent) => { e.preventDefault(); onChange(Math.min(pages - 1, Math.max(0, n))) }
  const off = (disabled: boolean) => (disabled ? "pointer-events-none opacity-40" : "")
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#" size="icon-sm" aria-label="Sebelumnya" aria-disabled={page === 0} className={off(page === 0)} onClick={go(page - 1)}><ChevronLeft /></PaginationLink>
        </PaginationItem>
        {pageWindow(page, pages).map((n, i) => (
          <PaginationItem key={`${n}-${i}`}>
            {n === "…" ? <PaginationEllipsis /> : <PaginationLink href="#" size="icon-sm" isActive={n === page} onClick={go(n)}>{n + 1}</PaginationLink>}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink href="#" size="icon-sm" aria-label="Berikutnya" aria-disabled={page >= pages - 1} className={off(page >= pages - 1)} onClick={go(page + 1)}><ChevronRight /></PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
