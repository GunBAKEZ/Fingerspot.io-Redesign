# Fingerspot Design System (v0.1)

Stack: React 18 · Vite · Tailwind CSS v4 · shadcn/ui (preset `b5JNeciq8` = `radix-vega`, base `neutral`; CSS variables).
Demo: `npm run dev` → dashboard di `/`, showcase design system di `/#/design-system`.

## Prinsip
1. **Tenang & lapang** – kanvas `background` netral, konten di kartu bawaan preset; hindari border tebal.
2. **Satu warna aksi** – `primary` (sky), dipakai hanya pada komponen (tombol, state aktif, fokus, grafik); latar halaman tetap netral. Hijau hanya untuk makna sukses. Warna lain hanya untuk *makna* (status) atau kartu pastel.
3. **Warna status konsisten** di grafik, badge, dan dot: info = Tepat waktu, danger = Tidak hadir/Alpha, warning = Terlambat, success = Izin/Hadir.
4. **Data dulu** – angka besar & tebal (`font-extrabold`), label kecil `muted-foreground`.

## Token
Semua di `src/index.css` (`:root` dan `.dark`), otomatis jadi utility Tailwind.

| Kategori | Token |
|---|---|
| Surface | `background` putih, `card` putih, `muted`/`border` netral (`oklch`), sidebar `0.985` |
| Teks | `foreground oklch(0.145 0 0)`, `muted-foreground oklch(0.556 0 0)` |
| Brand | `primary` sky-700 (terang) / sky-500 (gelap), `primary-soft` sky-100 / sky-900 |
| Status | `info #3B5BDB`, `success #1F9D6B`, `warning #F59F00`, `danger #E5484D` |
| Pastel | `tint-cyan / lilac / peach / sky / rose / cream` |
| Chart | `chart-1…5` skala sky (dark: dinaikkan agar kontras) |

**Menu (Dropdown/Select)** — memakai bentuk bawaan preset; jangan beri override `rounded-*` per menu.

**Tabel data padat (mis. Daftar Karyawan)** — kolom diberi lebar eksplisit (`min-w-*`) dan tabel `min-w` tertentu agar menggulir di dalam kartu, bukan melebarkan halaman (area utama `min-w-0`). Header kolom disusun vertikal (judul/urut di atas, filter di bawah). Di mobile tabel diganti kartu (`md:hidden`).

**Halaman daftar (pola baku)** — semua halaman daftar memakai komponen bersama di `components/dashboard/table-controls.tsx`: `TableToolbar` (Tampilkan N data + filter di kiri; pencarian + `IconAction` impor/ekspor di kanan), `SelectionBar` (bar `primary-soft`; 1–2 aksi tampil langsung sebagai tombol, mis. “Hapus terpilih”; menu “Aksi untuk terpilih” hanya bila 3+ aksi), `PersonCell` (avatar + nama), `SortButton`, `TableFooter`, dan `mobileCardClass` (kartu mobile `rounded-xl border p-3`, avatar + chip ID hijau + aksi ikon). Header halaman hanya berisi aksi utama; ID selalu berupa chip hijau mono; aksi baris berupa tombol ikon (hapus = outline merah).

**Kontrol pilihan** — Checkbox dan RadioGroup memakai garis tepi `muted-foreground` (kontras ≥ 3:1) karena `--input` terlalu pucat untuk kontrol yang harus terlihat saat belum dipilih.

**Mobile & sentuh** — halaman tidak boleh overflow horizontal di 360–390px (grid memakai `grid-cols-1` + `min-w-0` pada item). Pada perangkat sentuh (`pointer-coarse:`) kontrol minimal 40px: Button `default`/`sm`/`icon`/`icon-sm`, Input, Select, dan Toggle diperbesar otomatis (diatur di `scripts/apply-brand.py`); di desktop tetap padat. Aksi tabel dilipat jadi ikon (`max-sm:`), aksi pohon jadi menu “⋯”.

**Shell mobile** — di bawah 768px sidebar tidak dipakai. `AppLayout` memilih `MobileTopbar` (h-14) + `BottomNav` (5 tab, h-16 + safe-area; tab aktif berpil `primary-soft`) + lembar Menu. Dialog menjadi bottom sheet (`max-sm:` di `dialog.tsx`, dipasang `apply-brand.py`), form besar layar penuh, aksi utama halaman berupa FAB di atas tab bar. Konten diberi `pb` 6rem agar tidak tertutup tab bar.

**Sidebar** — lebar ciut 3.5rem; ikon **tidak pernah berpindah** saat animasi collapse (tombol tidak dipusatkan ulang, label memudar dan terpotong oleh lebar yang menyempit). Tanpa scroll horizontal; scrollbar vertikal disembunyikan.

**Mode gelap** — permukaan, teks, dan garis memakai palet netral bawaan shadcn/ui (`oklch`, hampir hitam: `background` 0.145, `card` 0.205, `border` putih 10%). Aksen sky (`primary` sky-500 — preset memakai sky-800 yang terlalu redup untuk teks — dan `primary-soft` sky-900). Token ada di blok `.dark` di `src/index.css`.

**Tipografi** – Inter Variable. Display 28/800, Section title 18/700 (`.section-title`, kata pertama bold + `<span>` regular), Body 14 default, Caption 12.
**Radius** – `--radius: 0.625rem` (preset); badge `full`.
**Spacing** – skala 4px; padding kartu `p-6`, jarak antar kartu `gap-4`/`gap-6`.

## Komponen
Semua komponen berasal dari **registry resmi shadcn/ui** (`npx shadcn@latest add …`, preset `b5JNeciq8`, base `radix`, React 19). Komponen kustom di `components/dashboard/` hanya **komposisi** dari komponen shadcn (tidak ada elemen HTML mentah untuk input/tombol/daftar/paginasi/grafik).

| Kebutuhan | Komponen shadcn |
|---|---|
| Layout & navigasi | Sidebar (mobile = Sheet), Separator, Tooltip, Dropdown Menu |
| Kartu & daftar | Card (+CardAction), Item, Table, Empty, Skeleton |
| Form | Button, Input, InputGroup, Select, Label, Textarea, Checkbox, RadioGroup, Popover + Calendar (`date-picker.tsx`) |
| Status | Badge (varian status + `dot`), Progress, Avatar |
| Grafik | Chart (pembungkus Recharts: `ChartContainer`, `ChartTooltip`) |
| Filter & paging | Toggle / ToggleGroup, Pagination |

Satu-satunya file di `ui/` yang bukan dari registry: `date-picker.tsx` (rakitan Popover + Calendar, pola dari dokumentasi shadcn).

### Workflow menambah komponen
```bash
npx shadcn@latest add <nama> -o -y   # -o menimpa file yang sudah ada
python3 scripts/apply-brand.py       # pasang ulang kustomisasi merek + perbaiki import `cn`
npm uninstall cn                     # CLI kadang memasang paket npm "cn"; helper kita di @/lib/utils
```
`scripts/apply-brand.py` bersifat idempoten dan hanya memasang tambahan proyek: Button `soft`, Badge `soft/success/info/warning/danger/muted` + `dot`, target sentuh 40px (Button/Input/Select/Toggle), tombol “Browse” pada input file, dan perbaikan impor `cn`. Tampilan dasar tetap milik preset.

## Pemetaan dashboard lama → baru
- Sidebar panjang → sidebar putih, ikon + label, aktif berwarna primary-soft; dua kelompok (Dashboard & Pemberitahuan, lalu Menu Utama).
- Performa Kehadiran → `Card` + area chart `chart-*`, filter bulan sebagai tombol `soft`.
- Daily Monitoring (donut) → `HeroStatCard`/`StatTile` dengan dot status.
- Detail Kuota → `QuotaCard` pastel (lilac / cyan / peach).
- Kalender, Karyawan Indisipliner, Data Belum Lengkap → `Card` + `Avatar`, `Badge`, `Progress`.

## Langkah berikut
Halaman nyata (Dashboard, tabel Karyawan, Absensi), kalender agenda ala referensi, responsive sidebar (Sheet), dan i18n.
