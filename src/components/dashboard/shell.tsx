import {
  Building2, CalendarCheck, ChevronDown, FileBarChart, Fingerprint, LayoutGrid,
  LogOut, Megaphone, MapPin, Search, Settings, Users, Download, Bell, User,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger,
} from "@/components/ui/sidebar"

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

/** Sidebar resmi shadcn: otomatis menjadi Sheet di mobile dan bisa diciutkan ke ikon di desktop. */
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-[72px] justify-center border-b px-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground">f</span>
          <span className="text-xs font-bold tracking-[0.2em] group-data-[collapsible=icon]:hidden">DEMO ACCOUNT</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {nav.map(({ icon: Icon, label, active }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={label}
                    className="h-10 rounded-xl font-medium data-[active=true]:font-semibold"
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
  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center gap-3 border-b bg-card px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex flex-1 items-center gap-3 text-muted-foreground">
        <Search className="size-5 shrink-0 text-foreground" />
        <input
          placeholder="Cari karyawan, kantor, atau laporan…"
          className="w-full max-w-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <button aria-label="Notifikasi" className="relative grid size-10 place-items-center rounded-xl hover:bg-muted">
        <Bell className="size-5" />
        <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">4</span>
      </button>
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
