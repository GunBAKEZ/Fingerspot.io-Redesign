# Fingerspot Design System (v0.1)

Stack: React 18 · Vite · Tailwind CSS v4 · shadcn/ui (style `new-york`, CSS variables).
Demo: `npm run dev` → dashboard di `/`, showcase design system di `/#/design-system`.

## Prinsip
1. **Tenang & lapang** – kanvas `background`, konten di kartu putih `rounded-2xl` dengan `shadow-card`; hindari border tebal.
2. **Satu warna aksi** – `primary` (teal). Warna lain hanya untuk *makna* (status) atau kartu pastel.
3. **Warna status konsisten** di grafik, badge, dan dot: info = Tepat waktu, danger = Tidak hadir/Alpha, warning = Terlambat, success = Izin/Hadir.
4. **Data dulu** – angka besar & tebal (`font-extrabold`), label kecil `muted-foreground`.

## Token
Semua di `src/index.css` (`:root` dan `.dark`), otomatis jadi utility Tailwind.

| Kategori | Token |
|---|---|
| Surface | `background #F6F7FB`, `card #FFF`, `muted #F0F2F8`, `border #E8EAF3` |
| Teks | `foreground #1B2559`, `muted-foreground #8790AD` |
| Brand | `primary #167A65`, `primary-soft #E3F1EE` |
| Status | `info #3B5BDB`, `success #1F9D6B`, `warning #F59F00`, `danger #E5484D` |
| Pastel | `tint-mint / lilac / peach / sky / rose / cream` |
| Chart | `chart-1…5` (kuning, biru, teal, merah, ungu) |

**Tipografi** – Plus Jakarta Sans. Display 28/800, Section title 18/700 (`.section-title`, kata pertama bold + `<span>` regular), Body 14 default, Caption 12.
**Radius** – kartu `2xl` (16px+8), kontrol `xl` (12px), badge `full`. **Shadow** – `shadow-card`, `shadow-pop` (overlay/popover).
**Spacing** – skala 4px; padding kartu `p-6`, jarak antar kartu `gap-4`/`gap-6`.

## Komponen
| Komponen | File | Catatan |
|---|---|---|
| Button (default, soft, secondary, outline, ghost, destructive) | `ui/button.tsx` | Tinggi 40px, sm 32px |
| Card, CardHeader, CardTitle | `ui/card.tsx` | |
| Badge (+dot) | `ui/badge.tsx` | Varian status |
| Input, Progress, Avatar | `ui/*` | |
| Sidebar, Topbar | `dashboard/shell.tsx` | Item aktif: `sidebar-accent` |
| QuotaCard, HeroStatCard, StatTile | `dashboard/stat-card.tsx` | Pengganti kartu kuota & ringkasan |

Komponen shadcn lain (Table, Select, Dialog, Calendar, Tabs, Dropdown): `npx shadcn@latest add <nama>` — otomatis memakai token ini.

## Pemetaan dashboard lama → baru
- Sidebar panjang → sidebar putih, ikon + label, aktif berwarna teal-soft.
- Performa Kehadiran → `Card` + area chart `chart-*`, filter bulan sebagai tombol `soft`.
- Daily Monitoring (donut) → `HeroStatCard`/`StatTile` dengan dot status.
- Detail Kuota → `QuotaCard` pastel (lilac / mint / peach).
- Kalender, Karyawan Indisipliner, Data Belum Lengkap → `Card` + `Avatar`, `Badge`, `Progress`.

## Langkah berikut
Halaman nyata (Dashboard, tabel Karyawan, Absensi), kalender agenda ala referensi, responsive sidebar (Sheet), dan i18n.
