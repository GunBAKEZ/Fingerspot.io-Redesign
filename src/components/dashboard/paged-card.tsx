import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Fragment } from "react"

/** Kartu dengan daftar berhalaman — dipakai Indisipliner & Data Belum Lengkap. `render` mengembalikan <Item>. */
export function PagedCard<T>({
  title, titleRest, action, items, pageSize = 5, render, empty,
}: {
  title: string
  titleRest: string
  action?: React.ReactNode
  items: T[]
  pageSize?: number
  render: (item: T) => React.ReactNode
  empty?: React.ReactNode
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
              {Array.from({ length: pages }, (_, n) => (
                <PaginationItem key={n}>
                  <PaginationLink href="#" size="icon-sm" isActive={n === page} onClick={go(n)}>{n + 1}</PaginationLink>
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
