import {
  Building2, CalendarCheck, Download, FileBarChart, Fingerprint, LayoutGrid,
  MapPin, Megaphone, Settings, Users, type LucideIcon,
} from "lucide-react"

export type NavItem = { icon: LucideIcon; label: string; path: string }

/** Menu sidebar. `path` = rute hash (`#/…`). */
export const nav: NavItem[] = [
  { icon: LayoutGrid, label: "Dashboard", path: "/" },
  { icon: Megaphone, label: "Pemberitahuan", path: "/pemberitahuan" },
  { icon: Building2, label: "Organisasi", path: "/organisasi" },
  { icon: Users, label: "Karyawan", path: "/karyawan" },
  { icon: MapPin, label: "Kantor", path: "/kantor" },
  { icon: Fingerprint, label: "Perangkat Absensi", path: "/perangkat-absensi" },
  { icon: CalendarCheck, label: "Absensi", path: "/absensi" },
  { icon: FileBarChart, label: "Laporan", path: "/laporan" },
  { icon: Download, label: "Unduh", path: "/unduh" },
  { icon: Settings, label: "Pengaturan", path: "/pengaturan" },
]
