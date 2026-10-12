import {
  Bell, Building2, CalendarCheck, ChevronDown, FileBarChart, Fingerprint,
  LayoutGrid, Megaphone, Search, Settings, Users, MapPin, Download,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

/** Sidebar ikon + label; state aktif memakai primary-soft + teks primary. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar p-4 lg:flex">
      <div className="flex h-12 items-center gap-3 px-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground">f</span>
        <span className="text-xs font-bold tracking-[0.2em]">DEMO ACCOUNT</span>
      </div>
      <nav className="mt-6 space-y-1">
        {nav.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
              active && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold hover:bg-sidebar-accent"
            )}
          >
            <Icon className="size-[18px]" /> {label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export function Topbar() {
  return (
    <header className="flex h-[72px] items-center gap-4 border-b bg-card px-6">
      <div className="flex flex-1 items-center gap-3 text-muted-foreground">
        <Search className="size-5 text-foreground" />
        <input
          placeholder="Cari karyawan, kantor, atau laporan…"
          className="w-full max-w-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <button className="relative grid size-10 place-items-center rounded-xl hover:bg-muted">
        <Bell className="size-5" />
        <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">4</span>
      </button>
      <div className="flex items-center gap-3 border-l pl-4">
        <Avatar><AvatarFallback>DA</AvatarFallback></Avatar>
        <span className="hidden text-sm font-semibold sm:block">Demo Admin</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </div>
    </header>
  )
}
