import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Fragment } from "react"

/** Nomor halaman yang ditampilkan: pertama, terakhir, dan sekitar halaman aktif; sisanya "…". */
function pageWindow(page: number, pages: number): (number | "…")[] {
  const keep = new Set([0, pages - 1, page - 1, page, page + 1].filter((n) => n >= 0 && n < pages))
  const sorted = [...keep].sort((a, b) => a - b)
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["…" as const, n] : [n]))
}

/** Kartu dengan daftar berhalaman — dipakai Indisipliner & Data Belum Lengkap. `render` mengembalikan <Item>. */
export function PagedCard<T>({
  title, titleRest, action, items, pageSize = 5, render, empty, toolbar,
}: {
  title: string
  titleRest: string
  action?: React.ReactNode
  items: T[]
  pageSize?: number
  render: (item: T) => React.ReactNode
  empty?: React.ReactNode
  /** Elemen di atas daftar (mis. filter tanggal). */
  toolbar?: React.ReactNode
}) {
  const [rawPage, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(rawPage, pages - 1)
  const slice = items.slice(page * pageSize, page * pageSize + pageSize)
  const go = (n: number) => (e: React.MouseEvent) => { e.preventDefault(); setPage(Math.min(pages - 1, Math.max(0, n))) }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} <span>{titleRest}</span></CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        {toolbar}
        {items.length === 0 && empty}
        <ItemGroup>
          {slice.map((it, i) => (
            <Fragment key={i}>
              {i > 0 && <ItemSeparator />}
              {render(it)}
            </Fragment>
          ))}
        </ItemGroup>
        {items.length > 0 && <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Halaman {page + 1} dari {pages}</span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href="#" size="icon-sm" aria-label="Sebelumnya" aria-disabled={page === 0} className={page === 0 ? "pointer-events-none opacity-40" : ""} onClick={go(page - 1)}><ChevronLeft /></PaginationLink>
              </PaginationItem>
              {pageWindow(page, pages).map((n, i) => (
                <PaginationItem key={`${n}-${i}`}>
                  {n === "…" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink href="#" size="icon-sm" isActive={n === page} onClick={go(n)}>{n + 1}</PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationLink href="#" size="icon-sm" aria-label="Berikutnya" aria-disabled={page >= pages - 1} className={page >= pages - 1 ? "pointer-events-none opacity-40" : ""} onClick={go(page + 1)}><ChevronRight /></PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>}
      </CardContent>
    </Card>
  )
}
