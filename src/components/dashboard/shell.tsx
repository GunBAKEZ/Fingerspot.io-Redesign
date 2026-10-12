import { useState } from "react"
import {
  Building2, CalendarCheck, ChevronDown, FileBarChart, Fingerprint, LayoutGrid,
  LogOut, Megaphone, MapPin, Search, Settings, Users, Download, Bell, User, Moon, Sun,
  PanelLeftClose, PanelLeftOpen, ChevronRight, ClipboardCheck, Inbox, Languages, ShoppingCart, UserPlus, Wallet,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { isActive, nav, type NavItem } from "@/components/dashboard/nav"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useUnreadCount } from "@/hooks/use-read-announcements"


/** Tombol collapse/expand: ikon berganti sesuai kondisi sidebar (tutup saat terbuka, buka saat ciut). */
function SidebarToggle({ className }: { className?: string }) {
  const { state, isMobile, toggleSidebar } = useSidebar()
  const expanded = !isMobile && state === "expanded"
  const label = expanded ? "Ciutkan sidebar" : "Buka sidebar"
  return (
    <Button
      variant="ghost" size="icon" title={label} aria-label={label}
      data-sidebar="trigger" data-slot="sidebar-trigger"
      onClick={toggleSidebar} className={cn("shrink-0", className)}
    >
      {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  )
}

const menuButton =
  "h-10 rounded-xl font-medium data-[active=true]:font-semibold [&>svg]:size-5 group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"

/** Menu bersubmenu: Collapsible saat sidebar terbuka; dropdown (flyout) saat sidebar ciut. */
function NavGroup({ item, path, collapsed, onNavigate }: { item: NavItem; path: string; collapsed: boolean; onNavigate: () => void }) {
  const active = isActive(item, path)
  const Icon = item.icon

  if (collapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton isActive={active} tooltip={item.label} className={menuButton}>
              <Icon /> <span>{item.label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56 rounded-xl">
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            {item.children!.map((c) => (
              <DropdownMenuItem key={c.path} asChild className={cn("cursor-pointer rounded-lg", c.path === path && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground")}>
                <a href={`#${c.path}`}>{c.label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible defaultOpen={active} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={active} tooltip={item.label} className={menuButton}>
            <Icon /> <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-[17px] mr-px">
            {item.children!.map((c) => (
              <SidebarMenuSubItem key={c.path}>
                <SidebarMenuSubButton asChild isActive={c.path === path || (c.path === item.children![0].path && path === item.path)} className="h-9 rounded-lg">
                  <a href={`#${c.path}`} onClick={onNavigate}>{c.label}</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

/** Jumlah pengumuman belum dibaca, ditampilkan di menu Pemberitahuan. */
function UnreadMenuBadge() {
  const unread = useUnreadCount()
  if (unread === 0) return null
  return <SidebarMenuBadge className="right-2 top-2.5 peer-data-[size=default]/menu-button:top-2.5 rounded-full bg-primary px-1.5 text-primary-foreground peer-data-[active=true]/menu-button:text-primary-foreground">{unread}</SidebarMenuBadge>
}

/** Tombol ikon dengan tooltip (Topbar). */
function IconTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/** Sidebar resmi shadcn: otomatis menjadi Sheet di mobile dan bisa diciutkan ke ikon di desktop. */
export function AppSidebar({ path }: { path: string }) {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const collapsed = !isMobile && state === "collapsed"
  const closeSheet = () => { if (isMobile) setOpenMobile(false) }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-[72px] justify-center border-b px-4 group-data-[collapsible=icon]:px-0">
        {collapsed ? (
          <SidebarToggle className="mx-auto size-10" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">f</span>
            <span className="min-w-0 flex-1 truncate text-xs font-bold tracking-[0.12em]">DEMO ACCOUNT</span>
            {!isMobile && <SidebarToggle className="size-8" />}
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {nav.map((item) =>
                item.children ? (
                  <NavGroup key={item.label} item={item} path={path} collapsed={collapsed} onNavigate={closeSheet} />
                ) : (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={item.path === path} tooltip={item.label} className={menuButton}>
                      <a href={`#${item.path}`} onClick={closeSheet}>
                        <item.icon /> <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.path === "/pemberitahuan" && <UnreadMenuBadge />}
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

/** Lencana angka kecil di pojok tombol ikon. */
function CountBadge({ count, variant = "default" }: { count: number; variant?: "default" | "danger" }) {
  if (count <= 0) return null
  return (
    <Badge variant={variant === "danger" ? "destructive" : "default"} className="absolute -right-1.5 -top-1.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
      {count > 99 ? "99+" : count}
    </Badge>
  )
}

const tasks = [
  { icon: UserPlus, title: "Karyawan Baru", source: "Dari Perangkat Absensi", count: 309, tone: "bg-tint-sky text-info", href: "#/karyawan" },
  { icon: ClipboardCheck, title: "Persetujuan Karyawan", source: "Dari Perangkat Absensi", count: 73, tone: "bg-tint-peach text-warning", href: "#/karyawan" },
]

/** Dropdown tugas yang menunggu tindakan (Karyawan Baru, Persetujuan Karyawan). */
function TasksMenu() {
  const total = tasks.reduce((n, t) => n + t.count, 0)
  return (
    <DropdownMenu>
      <IconTip label="Perlu tindakan">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Tugas menunggu (${total})`} className="relative">
            <Bell className="size-5" />
            <CountBadge count={total} variant="danger" />
          </Button>
        </DropdownMenuTrigger>
      </IconTip>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Perlu tindakan</DropdownMenuLabel>
        {tasks.map(({ icon: Icon, title, source, count, tone, href }) => (
          <DropdownMenuItem key={title} asChild className="cursor-pointer gap-3 rounded-xl p-3">
            <a href={href}>
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tone)}><Icon className="size-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{source}</span>
              </span>
              <Badge variant="danger">{count}</Badge>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Pilihan bahasa (tampilan saja; i18n belum dipasang). */
function LanguageMenu() {
  const [lang, setLang] = useState("id")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Bahasa" className="gap-1.5 px-2.5">
          <Languages className="size-5" /> <span className="text-xs font-bold uppercase">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl">
        <DropdownMenuLabel>Bahasa</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
          <DropdownMenuRadioItem value="id">Indonesia</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Topbar() {
  const { theme, toggle } = useTheme()
  const { isMobile } = useSidebar()
  return (
    <header className={cn("sticky top-0 z-10 flex h-[72px] items-center gap-2 border-b bg-card pr-4 md:gap-3 md:pr-6", !isMobile && "pl-4 md:pl-6")}>
      {/* Desktop: tombol collapse/expand ada di header sidebar. Mobile: sidebar berupa Sheet, jadi tombol di sini. */}
      {isMobile && (
        <>
          <SidebarToggle className="ml-[11px] mr-0 size-8" />
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-full" />
        </>
      )}
      <InputGroup className={cn("h-10 max-w-md flex-1 rounded-xl bg-background", isMobile && "ml-1 min-w-0")}>
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Cari karyawan, kantor, atau laporan…" />
      </InputGroup>
      <div className="hidden flex-1 md:block" />

      {/* Saldo, keranjang, bahasa: hanya di layar lebar */}
      <Button asChild variant="outline" size="sm" className="hidden rounded-full lg:inline-flex">
        <a href="#/saldo"><Wallet /> Rp 0</a>
      </Button>
      <IconTip label="Keranjang">
        <Button asChild variant="ghost" size="icon" aria-label="Keranjang" className="hidden md:inline-flex">
          <a href="#/keranjang"><ShoppingCart className="size-5" /></a>
        </Button>
      </IconTip>
      <div className="hidden md:block"><LanguageMenu /></div>

      <TasksMenu />
      <IconTip label="Inbox">
        <Button asChild variant="ghost" size="icon" aria-label="Inbox" className="hidden md:inline-flex">
          <a href="#/inbox"><Inbox className="size-5" /></a>
        </Button>
      </IconTip>
      <IconTip label={theme === "dark" ? "Mode terang" : "Mode gelap"}>
        <Button variant="ghost" size="icon" aria-label="Ganti tema" onClick={toggle}>
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
      </IconTip>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 border-l pl-3 outline-none md:pl-4">
          <Avatar><AvatarFallback>DA</AvatarFallback></Avatar>
          <span className="hidden text-sm font-semibold sm:block">Demo Admin</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuLabel>Akun saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User /> Profil</DropdownMenuItem>
          <DropdownMenuItem asChild><a href="#/pengaturan"><Settings /> Pengaturan</a></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"><LogOut /> Keluar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
