import {
  Building2, CalendarCheck, Download, FileBarChart, Fingerprint, LayoutGrid,
  MapPin, Megaphone, Settings, Users, type LucideIcon,
} from "lucide-react"

export type NavChild = { label: string; path: string }
export type NavItem = { icon: LucideIcon; label: string; path: string; children?: NavChild[] }

/** Menu sidebar. `path` = rute hash (`#/…`). */
export const nav: NavItem[] = [
  { icon: LayoutGrid, label: "Dashboard", path: "/" },
  { icon: Megaphone, label: "Pemberitahuan", path: "/pemberitahuan" },
  {
    icon: Building2, label: "Organisasi", path: "/organisasi",
    children: [
      { label: "Struktur Organisasi", path: "/organisasi/struktur" },
      { label: "Jabatan Fungsional", path: "/organisasi/jabatan" },
    ],
  },
  { icon: Users, label: "Karyawan", path: "/karyawan" },
  { icon: MapPin, label: "Kantor", path: "/kantor" },
  { icon: Fingerprint, label: "Perangkat Absensi", path: "/perangkat-absensi" },
  { icon: CalendarCheck, label: "Absensi", path: "/absensi" },
  { icon: FileBarChart, label: "Laporan", path: "/laporan" },
  { icon: Download, label: "Unduh", path: "/unduh" },
  { icon: Settings, label: "Pengaturan", path: "/pengaturan" },
]

/** Rute di luar menu sidebar (diakses dari Topbar). */
export const extraRoutes: Record<string, string> = {
  "/keranjang": "Keranjang",
  "/saldo": "Saldo",
}

/** Judul halaman dari rute (menu, submenu, atau rute tambahan). */
export function titleFor(path: string): string | undefined {
  for (const n of nav) {
    if (n.path === path) return n.label
    const c = n.children?.find((c) => c.path === path)
    if (c) return c.label
  }
  return extraRoutes[path]
}

/** Menu induk aktif jika rute saat ini adalah induk atau salah satu anaknya. */
export const isActive = (item: NavItem, path: string) =>
  item.path === "/" ? path === "/" : path === item.path || path.startsWith(item.path + "/")
