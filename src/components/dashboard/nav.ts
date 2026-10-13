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
  {
    icon: Users, label: "Karyawan", path: "/karyawan",
    children: [
      { label: "Daftar Karyawan", path: "/karyawan/daftar" },
      { label: "Pengguna App Karyawan", path: "/karyawan/pengguna-app" },
      { label: "Karyawan Kerja di Beberapa Kantor", path: "/karyawan/beberapa-kantor" },
      { label: "Karyawan Kerja di Beberapa Kantor sebagai Admin Perangkat Absensi", path: "/karyawan/admin-perangkat" },
      { label: "Absensi Tidak Ditampilkan", path: "/karyawan/absensi-tidak-ditampilkan" },
      { label: "Karyawan Resign", path: "/karyawan/resign" },
    ],
  },
  { icon: MapPin, label: "Kantor", path: "/kantor" },
  { icon: Fingerprint, label: "Perangkat Absensi", path: "/perangkat-absensi" },
  { icon: CalendarCheck, label: "Absensi", path: "/absensi" },
  { icon: FileBarChart, label: "Laporan", path: "/laporan" },
  { icon: Download, label: "Unduh", path: "/unduh" },
  { icon: Settings, label: "Pengaturan", path: "/pengaturan" },
]

/** Rute di luar menu sidebar (diakses dari Topbar). */
export const extraRoutes: Record<string, string> = {
  "/karyawan/pengguna-app/gps": "Karyawan Absensi GPS",
  "/keranjang": "Keranjang",
  "/saldo": "Saldo",
  "/inbox": "Inbox",
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

/** Dua kelompok menu sidebar: pintasan utama (Dashboard, Pemberitahuan) dan menu utama. */
export const navTop = nav.filter((n) => n.path === "/" || n.path === "/pemberitahuan")
export const navMain = nav.filter((n) => !navTop.includes(n))
