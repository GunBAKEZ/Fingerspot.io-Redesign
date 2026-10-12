import { useState } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemGroup, ItemSeparator } from "@/components/ui/item"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { Fragment } from "react"

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
          <ListPagination className="mx-0 w-auto" page={page} pages={pages} onChange={setPage} />
        </div>}
      </CardContent>
    </Card>
  )
}
