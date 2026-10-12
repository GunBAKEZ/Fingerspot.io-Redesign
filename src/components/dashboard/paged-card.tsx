import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** Kartu dengan daftar berhalaman — dipakai Indisipliner & Data Belum Lengkap. */
export function PagedCard<T>({
  title, titleRest, action, items, pageSize = 5, render,
}: {
  title: string
  titleRest: string
  action?: React.ReactNode
  items: T[]
  pageSize?: number
  render: (item: T) => React.ReactNode
}) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const slice = items.slice(page * pageSize, page * pageSize + pageSize)
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title} <span>{titleRest}</span></CardTitle>
        {action}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <ul className="divide-y">{slice.map((it, i) => <li key={i} className="py-3">{render(it)}</li>)}</ul>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Halaman {page + 1} dari {pages}</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Sebelumnya" className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary disabled:opacity-40"><ChevronLeft className="size-4" /></button>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Berikutnya" className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary disabled:opacity-40"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
