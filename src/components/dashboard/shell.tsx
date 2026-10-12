import {
  Building2, CalendarCheck, ChevronDown, FileBarChart, Fingerprint, LayoutGrid,
  LogOut, Megaphone, MapPin, Search, Settings, Users, Download, Bell, User, Moon, Sun,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const nav = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: Megaphone, label: "Pemberitahuan" },
  { icon: Building2, label: "Organisasi" },
  { icon: Users, label: "Karyawan" },
  { icon: MapPin, label: "Kantor" },
  { icon: Fingerprint, label: "Perangkat Absensi" },
  { icon: CalendarCheck, label: "Absensi" },
  { icon: FileBarChart, label: "Laporan" },
  { icon: Download, label: "Unduh" },
  { icon: Settings, label: "Pengaturan" },
]

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

/** Sidebar resmi shadcn: otomatis menjadi Sheet di mobile dan bisa diciutkan ke ikon di desktop. */
export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const collapsed = !isMobile && state === "collapsed"
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-[72px] justify-center border-b px-4 group-data-[collapsible=icon]:px-0">
        {collapsed ? (
          <SidebarToggle className="mx-auto size-10" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">f</span>
            <span className="text-xs font-bold tracking-[0.2em]">DEMO ACCOUNT</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {nav.map(({ icon: Icon, label, active }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={label}
                    className="h-10 rounded-xl font-medium data-[active=true]:font-semibold [&>svg]:size-5 group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
                  >
                    <Icon /> <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export function Topbar() {
  const { theme, toggle } = useTheme()
  const { state, isMobile } = useSidebar()
  const collapsed = !isMobile && state === "collapsed" // tombol sudah pindah ke header sidebar
  return (
    <header className={cn("sticky top-0 z-10 flex h-[72px] items-center gap-3 border-b bg-card pr-4 md:pr-6", collapsed && "pl-4 md:pl-6")}>
      {!collapsed && (
        <>
          <SidebarToggle className="ml-[11px] mr-0 size-8" />
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-full" />
        </>
      )}
      <InputGroup className={cn("h-10 max-w-md flex-1 rounded-xl bg-background", !collapsed && "ml-1")}>
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Cari karyawan, kantor, atau laporan…" />
      </InputGroup>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" aria-label="Ganti tema" onClick={toggle}>
        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifikasi" className="relative">
        <Bell className="size-5" />
        <Badge className="absolute -right-0.5 -top-0.5 size-4 justify-center rounded-full p-0 text-[10px]">4</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 border-l pl-4 outline-none">
          <Avatar><AvatarFallback>DA</AvatarFallback></Avatar>
          <span className="hidden text-sm font-semibold sm:block">Demo Admin</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuLabel>Akun saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User /> Profil</DropdownMenuItem>
          <DropdownMenuItem><Settings /> Pengaturan</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"><LogOut /> Keluar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
