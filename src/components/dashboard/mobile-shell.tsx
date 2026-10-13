import { useState } from "react"
import {
  Bell, ChevronRight, LayoutGrid, LogOut, Megaphone, Menu, Moon, Search, Settings, ShoppingCart, Inbox, Sun, Users, CalendarCheck, Wallet, User,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { nav, type NavItem } from "@/components/dashboard/nav"
import { TasksMenu } from "@/components/dashboard/shell"
import { useUnreadCount } from "@/hooks/use-read-announcements"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

/** Topbar mobile: logo + nama akun di kiri; cari dan tugas di kanan. Menu lain ada di tab "Menu". */
export function MobileTopbar() {
  const [searching, setSearching] = useState(false)
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground">f</span>
      <span className="min-w-0 flex-1 truncate text-xs font-bold tracking-[0.12em]">DEMO ACCOUNT</span>
      <Button variant="ghost" size="icon" aria-label="Cari" onClick={() => setSearching(true)}><Search className="size-5" /></Button>
      <TasksMenu />
      <Sheet open={searching} onOpenChange={setSearching}>
        <SheetContent side="top" className="gap-3 rounded-b-2xl p-4">
          <SheetHeader className="p-0"><SheetTitle>Cari</SheetTitle><SheetDescription className="sr-only">Cari karyawan, kantor, atau laporan</SheetDescription></SheetHeader>
          <InputGroup className="h-11 rounded-xl bg-background">
            <InputGroupAddon><Search /></InputGroupAddon>
            <InputGroupInput autoFocus placeholder="Cari karyawan, kantor, atau laporan…" />
          </InputGroup>
        </SheetContent>
      </Sheet>
    </header>
  )
}

const tabs = [
  { icon: LayoutGrid, label: "Dashboard", path: "/", match: (p: string) => p === "/" },
  { icon: Users, label: "Karyawan", path: "/karyawan/daftar", match: (p: string) => p.startsWith("/karyawan") },
  { icon: CalendarCheck, label: "Absensi", path: "/absensi", match: (p: string) => p.startsWith("/absensi") },
  { icon: Megaphone, label: "Info", path: "/pemberitahuan", match: (p: string) => p.startsWith("/pemberitahuan") },
]

/** Navigasi bawah (tab bar) khas aplikasi mobile; tab terakhir membuka lembar "Menu". */
export function BottomNav({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const unread = useUnreadCount()
  const tabCls = "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground outline-none transition-colors focus-visible:text-foreground"
  const pill = (active: boolean) => cn("grid h-8 w-14 place-items-center rounded-full transition-colors", active && "bg-primary-soft text-primary")
  return (
    <>
      <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ icon: Icon, label, path: to, match }) => {
          const active = match(path)
          return (
            <a key={label} href={`#${to}`} aria-current={active ? "page" : undefined} className={cn(tabCls, active && "font-semibold text-primary")}>
              <span className={pill(active)}><Icon className="size-5" /></span>
              {label}
              {label === "Info" && unread > 0 && <Badge className="absolute left-[calc(50%+6px)] top-1.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">{unread}</Badge>}
            </a>
          )
        })}
        <button type="button" onClick={() => setOpen(true)} className={tabCls} aria-haspopup="dialog">
          <span className={pill(open)}><Menu className="size-5" /></span>
          Menu
        </button>
      </nav>
      <MenuSheet open={open} onOpenChange={setOpen} path={path} />
    </>
  )
}

const quick = [
  { icon: Wallet, label: "Saldo", sub: "Rp 0", href: "#/saldo" },
  { icon: ShoppingCart, label: "Keranjang", sub: "0 item", href: "#/keranjang" },
  { icon: Inbox, label: "Inbox", sub: "Pesan", href: "#/inbox" },
]

function MenuSheet({ open, onOpenChange, path }: { open: boolean; onOpenChange: (o: boolean) => void; path: string }) {
  const { theme, toggle } = useTheme()
  const [lang, setLang] = useState("id")
  const close = () => onOpenChange(false)
  const row = "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const active = item.path === "/" ? path === "/" : path === item.path || path.startsWith(item.path + "/")
    if (!item.children) {
      return (
        <a key={item.label} href={`#${item.path}`} onClick={close} className={cn(row, active && "bg-primary-soft font-semibold text-primary")}>
          <Icon className="size-5" /> {item.label}
        </a>
      )
    }
    return (
      <Collapsible key={item.label} defaultOpen={active}>
        <CollapsibleTrigger className={cn(row, "group/c", active && "font-semibold text-primary")}>
          <Icon className="size-5" /> <span className="flex-1">{item.label}</span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-data-[state=open]/c:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-5 border-l pl-3">
            {item.children.map((c) => (
              <a key={c.path} href={`#${c.path}`} onClick={close} className={cn("flex min-h-11 items-center rounded-lg px-3 py-2 text-sm leading-snug hover:bg-muted", (c.path === path || (c.path === item.children![0].path && path === item.path)) && "bg-primary-soft font-semibold text-primary")}>
                {c.label}
              </a>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[88dvh] gap-0 overflow-y-auto rounded-t-2xl p-0 pb-[env(safe-area-inset-bottom)]">
        <div aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted-foreground/30" />
        <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle><SheetDescription>Semua menu aplikasi</SheetDescription></SheetHeader>

        <div className="flex items-center gap-3 p-4">
          <Avatar className="size-11"><AvatarFallback>DA</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Demo Admin</p>
            <p className="truncate text-xs text-muted-foreground">admin@demo.id</p>
          </div>
          <Button variant="outline" size="icon" aria-label="Profil"><User /></Button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4">
          {quick.map(({ icon: Icon, label, sub, href }) => (
            <a key={label} href={href} onClick={close} className="flex flex-col items-center gap-1 rounded-xl bg-muted p-3 text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Icon className="size-5 text-primary" />
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-[11px] text-muted-foreground">{sub}</span>
            </a>
          ))}
        </div>

        <nav aria-label="Semua menu" className="space-y-1 p-4">{nav.map(renderItem)}</nav>

        <div className="space-y-2 border-t p-4">
          <button type="button" onClick={toggle} className={row}>
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            <span className="flex-1">{theme === "dark" ? "Mode terang" : "Mode gelap"}</span>
          </button>
          <div className="flex min-h-12 items-center gap-3 px-3 text-sm font-medium">
            <Bell className="size-5 opacity-0" aria-hidden /><span className="flex-1">Bahasa</span>
            <ToggleGroup type="single" variant="outline" size="sm" value={lang} onValueChange={(v) => v && setLang(v)}>
              <ToggleGroupItem value="id">ID</ToggleGroupItem>
              <ToggleGroupItem value="en">EN</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <a href="#/pengaturan" onClick={close} className={row}><Settings className="size-5" /> Pengaturan</a>
          <button type="button" className={cn(row, "text-destructive hover:bg-destructive/10")}><LogOut className="size-5" /> Keluar</button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
