# Fingerspot.io — Redesign Dashboard

Redesign dashboard [fingerspot.io](https://fingerspot.io) dengan **React 19 + Tailwind CSS v4 + shadcn/ui**.
Fokusnya: tampilan yang bersih dan ramah, satu warna aksi (teal), warna status yang konsisten, mode gelap, dan semua komponen berasal dari **registry resmi shadcn/ui**.

> Status: **prototipe UI**. Seluruh data masih berupa data contoh (`src/data/mock.ts`) dan belum terhubung ke API Fingerspot.

| Terang | Gelap |
|---|---|
| ![Dashboard terang](docs/screenshots/dashboard-light.png) | ![Dashboard gelap](docs/screenshots/dashboard-dark.png) |

<p align="center"><img src="docs/screenshots/dashboard-mobile.png" alt="Dashboard mobile" width="260" /></p>

## Fitur

- **Performa kehadiran** — grafik garis per kantor; legenda (`ToggleGroup`) menyalakan/mematikan seri.
- **Kalender** — shadcn `Calendar` berbahasa Indonesia, minggu mulai Senin, hari libur ditandai.
- **Karyawan yang mengajukan izin** — tabel dengan filter rentang tanggal, tombol Setujui/Tolak, dan Empty state.
- **Daily monitoring** — grafik donat + rincian status (tepat waktu, terlambat, izin, tidak hadir).
- **Detail kuota** — kartu pastel Perangkat, GPS, dan Karyawan.
- **Karyawan indisipliner** — filter rentang tanggal (maks. 30 hari), paginasi dengan ellipsis.
- **Data karyawan belum lengkap** — daftar dengan progress.
- **Sidebar** shadcn: ciut ke ikon di desktop, menjadi menu geser (Sheet) di mobile.
- **Mode gelap** — toggle di Topbar, tersimpan di `localStorage`, tanpa kedipan saat dimuat.
- **Skeleton loading** per kartu.

## Menjalankan

Prasyarat: **Node.js 20+**.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Type-check (`tsc -b`) + build produksi ke `dist/` |
| `npm run preview` | Menjalankan hasil build secara lokal |

Halaman:

- `/` — Dashboard
- `/#/design-system` — Showcase design system (warna, tipografi, komponen)

## Tech stack

| Kebutuhan | Pustaka |
|---|---|
| Framework & build | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS v4 (token lewat variabel CSS) |
| Komponen | shadcn/ui (style `new-york`, base `radix`) |
| Grafik | Recharts via komponen `Chart` shadcn |
| Tanggal | react-day-picker, date-fns (locale `id`) |
| Ikon | lucide-react |
| Font | Plus Jakarta Sans |

## Struktur proyek

```
src/
├── components/
│   ├── ui/               # komponen shadcn (dari registry resmi + kustomisasi merek)
│   └── dashboard/        # komposisi khusus dashboard (kartu, grafik, sidebar, filter)
├── data/mock.ts          # data contoh
├── hooks/                # use-theme, use-fake-loading, use-mobile
├── pages/                # dashboard.tsx, design-system.tsx
├── lib/utils.ts          # helper cn()
└── index.css             # design token (warna, radius, shadow, font)
docs/
├── DESIGN_SYSTEM.md      # dokumentasi design system lengkap
└── screenshots/
scripts/apply-brand.py    # memasang ulang kustomisasi merek setelah `shadcn add`
```

Komponen di `components/dashboard/` hanya **menyusun** komponen shadcn (tanpa elemen HTML mentah untuk input, tombol, daftar, paginasi, atau grafik). Satu-satunya file di `components/ui/` yang bukan dari registry adalah `date-picker.tsx` (rakitan Popover + Calendar).

## Design system

Ringkas:

- **Warna aksi:** teal `#167A65`; teks navy `#1B2559`; kanvas `#F6F7FB`.
- **Status:** biru = tepat waktu, hijau = hadir/izin, oranye = terlambat, merah = tidak hadir/alpha.
- **Bentuk:** kartu `rounded-2xl` tanpa border dengan `shadow-card`; kontrol `rounded-xl`.
- **Token** ada di `src/index.css` dan otomatis tersedia sebagai utility Tailwind (`bg-primary`, `text-danger`, `bg-tint-mint`, …).

Dokumentasi lengkap: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Menambah komponen shadcn

```bash
npx shadcn@latest add <nama> -o -y   # -o menimpa file yang sudah ada
python3 scripts/apply-brand.py       # pasang ulang kustomisasi merek
npm uninstall cn                     # jika CLI memasang paket npm "cn"
```

Catatan: `shadcn add -o` menimpa file di `src/components/ui/`, termasuk kustomisasi merek (Button `soft`, Card tanpa border, Input `rounded-xl`, dll.). `scripts/apply-brand.py` memasangnya kembali dan juga memperbaiki impor `cn` yang kadang salah dihasilkan CLI (`from "cn"` → `@/lib/utils`). Skrip ini aman dijalankan berulang kali.

## Menghubungkan ke API

Data contoh dan simulasi loading ada di dua tempat:

- `src/data/mock.ts` — ganti fungsi/konstanta (mis. `disciplineRange`, `leaveRequests`, `dailyMonitoring`) dengan pemanggilan API.
- `src/hooks/use-fake-loading.ts` — ganti dengan `isLoading` dari query (mis. TanStack Query); skeleton di `components/dashboard/skeletons.tsx` sudah siap dipakai.

## Deploy

Proyek ini dapat langsung di-deploy ke [Vercel](https://vercel.com/new): preset **Vite**, build command `npm run build`, output `dist`. Routing memakai hash (`/#/design-system`), sehingga tidak perlu konfigurasi rewrite.

## Roadmap

- [ ] Sambungan ke API Fingerspot
- [ ] Halaman Karyawan (tabel, filter, dialog tambah/edit)
- [ ] Halaman Absensi dan Laporan
- [ ] Router sungguhan (React Router) menggantikan hash routing
- [ ] i18n (ID/EN)
