import {
  Building2, CalendarCheck, ChevronDown, FileBarChart, Fingerprint, LayoutGrid,
  LogOut, Megaphone, MapPin, Search, Settings, Users, Download, Bell, User, Moon, Sun,
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
      <SidebarHeader className="h-[72px] justify-center border-b px-4 group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">f</span>
          <span className="text-xs font-bold tracking-[0.2em] group-data-[collapsible=icon]:hidden">DEMO ACCOUNT</span>
        </div>
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
  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center gap-3 border-b bg-card px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <InputGroup className="max-w-md flex-1 border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <InputGroupAddon><Search className="text-foreground" /></InputGroupAddon>
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
