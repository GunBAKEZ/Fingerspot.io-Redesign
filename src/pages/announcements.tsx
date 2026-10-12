import { useMemo, useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { BellOff, CheckCheck, ChevronRight, Mail, MailOpen } from "lucide-react"
import { ListPagination } from "@/components/dashboard/list-pagination"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { announcements, type Announcement } from "@/data/announcements"
import { useFakeLoading } from "@/hooks/use-fake-loading"
import { markRead, useReadSet } from "@/hooks/use-read-announcements"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10
const fmt = (iso: string) => format(new Date(iso), "EEEE, dd MMM yyyy • HH:mm 'WIB'", { locale: id })

type Category = Announcement["category"]

export default function Announcements() {
  const loading = useFakeLoading(600)
  const [tab, setTab] = useState<Category>("umum")
  const [page, setPage] = useState(0)
  const read = useReadSet()
  const [open, setOpen] = useState<Announcement | null>(null)

  const unreadIn = (c: Category) => announcements.filter((a) => a.category === c && !read.has(a.id)).length
  const items = useMemo(
    () => announcements.filter((a) => a.category === tab).sort((a, b) => b.date.localeCompare(a.date)),
    [tab]
  )
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const slice = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const show = (a: Announcement) => { setOpen(a); markRead([a.id]) }
  const markAll = () => markRead(items.map((a) => a.id))

  return (
    <>
      <PageHeader crumbs={[{ label: "Pemberitahuan" }]}>Pemberitahuan</PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="whitespace-nowrap">Kotak <span>pemberitahuan</span></CardTitle>
          <CardAction>
            <Button variant="soft" size="sm" onClick={markAll} disabled={unreadIn(tab) === 0} aria-label="Tandai semua dibaca" className="max-sm:min-w-10">
              <CheckCheck /> <span className="hidden sm:inline">Tandai semua dibaca</span>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as Category); setPage(0) }}>
            <TabsList className="rounded-xl group-data-[orientation=horizontal]/tabs:h-10 pointer-coarse:group-data-[orientation=horizontal]/tabs:h-12">
              <TabsTrigger value="umum" className="gap-2 rounded-lg px-4">
                Umum {unreadIn("umum") > 0 && <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">{unreadIn("umum")}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="layanan" className="gap-2 rounded-lg px-4">
                Layanan Saya {unreadIn("layanan") > 0 && <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">{unreadIn("layanan")}</Badge>}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="space-y-4 pt-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/4" /></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon"><BellOff /></EmptyMedia>
                <EmptyTitle>Belum ada pemberitahuan</EmptyTitle>
                <EmptyDescription>Pemberitahuan baru akan muncul di sini.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup>
              {slice.map((a, i) => {
                const unread = !read.has(a.id)
                return (
                  <div key={a.id}>
                    {i > 0 && <ItemSeparator />}
                    <Item asChild className="cursor-pointer gap-3 rounded-xl px-1 transition-colors hover:bg-muted/60 sm:gap-4 sm:px-3">
                      <button type="button" onClick={() => show(a)} className="w-full text-left">
                        <ItemMedia variant="icon" className={cn("size-10 rounded-xl border-0", unread ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground")}>
                          {unread ? <Mail /> : <MailOpen />}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className={cn("text-sm sm:text-base", unread ? "font-bold" : "font-normal")}>{a.title}</ItemTitle>
                          <ItemDescription>{fmt(a.date)}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          {unread && <Badge variant="soft" dot className="hidden sm:inline-flex">Baru</Badge>}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </ItemActions>
                      </button>
                    </Item>
                  </div>
                )
              })}
            </ItemGroup>
          )}
        </CardContent>

        {!loading && items.length > PAGE_SIZE && (
          <CardContent className="flex items-center justify-between border-t pt-6 text-xs text-muted-foreground">
            <span>Menampilkan {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, items.length)} dari {items.length}</span>
            <ListPagination className="mx-0 w-auto" page={page} pages={pages} onChange={setPage} />
          </CardContent>
        )}
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="pr-6 text-lg leading-snug">{open?.title}</DialogTitle>
            <DialogDescription>{open && fmt(open.date)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed">
            {open?.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <DialogFooter>
            <Button variant="soft" onClick={() => setOpen(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
