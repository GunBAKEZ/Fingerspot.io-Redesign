# Fingerspot.io — Redesign Dashboard

Redesign dashboard [fingerspot.io](https://fingerspot.io) dengan **React 19 + Tailwind CSS v4 + shadcn/ui**.
Fokusnya: tampilan yang bersih dan ramah, satu warna aksi (biru sky, dari preset shadcn), warna status yang konsisten, mode gelap, dan semua komponen berasal dari **registry resmi shadcn/ui**.

> Status: **prototipe UI**. Seluruh data masih berupa data contoh (`src/data/mock.ts`) dan belum terhubung ke API Fingerspot.

| Terang | Gelap |
|---|---|
| ![Dashboard terang](docs/screenshots/dashboard-light.png) | ![Dashboard gelap](docs/screenshots/dashboard-dark.png) |

<p align="center"><img src="docs/screenshots/dashboard-mobile.png" alt="Dashboard mobile" width="260" /></p>

## Fitur

**Pemberitahuan** (`/#/pemberitahuan`)

- Tab **Umum** dan **Layanan Saya** dengan jumlah belum dibaca, daftar berhalaman (10 per halaman).
- Status baru/terbaca, klik untuk membuka detail (`Dialog`), dan tombol **Tandai semua dibaca**.
- Empty state dan skeleton loading.

**Daftar Karyawan** (`/#/karyawan/daftar`)

- Tabel karyawan dengan **filter per kolom**, urut (A–Z / Z–A), filter Kantor dan Status, pencarian global, *Tampilkan N data*, dan paginasi.
- Pilih baris (satu atau semua di halaman) dengan aksi massal **Hapus terpilih**.
- Aksi per baris: **Lihat detail** (Sheet), **Ubah** (Dialog), **Hapus**, serta menu ⋮ (Info Umum / Turunkan data ke perangkat absensi / Tambah Verifikasi).
- **Hapus Karyawan** menawarkan dua pilihan: **Resign** (memindahkan ke status Resign) atau **Hapus permanen**.
- **Aksi untuk terpilih** (setelah memilih baris): Turunkan data ke perangkat absensi, Resign, Ubah Jadwal; plus Hapus terpilih.
- **Tambah / Ubah Karyawan**: dialog dua kolom (foto karyawan & foto verifikasi perangkat di kiri; kantor, nama depan/belakang, nama di perangkat maks. 15 karakter, ID & NIK, jabatan, tanggal mulai, PIN, jenis kelamin, kode QR, verifikasi perangkat di kanan). ID default = angka terkecil yang belum dipakai; tersedia **Simpan** dan **Simpan & Buat Baru**.
- **Ubah Karyawan** berbeda dari Tambah: ada Status, password perangkat, PIN fingerspot.io tersembunyi (ikon mata), jadwal saat ini dengan tombol Ubah, peringatan bila jadwal berbeda dari jadwal jabatan (pilih tetap pakai jadwal khusus atau ubah ke jadwal jabatan), tanggal tambah/diperbarui, dan **Atasan Lain** (maks. 3, dipilih dari daftar karyawan aktif).
- **Foto Verifikasi Perangkat** menampilkan catatan (perangkat VIDA/VIVO) dan membatasi ukuran foto 100KB.
- **Detail karyawan** (panel samping) menampilkan foto dengan tab Foto Karyawan / Foto Verifikasi Perangkat, data perangkat, dan Atasan Lain.
- Ikon toolbar: panah masuk = **Impor**, panah keluar = **Ekspor**.
- **Ekspor CSV** sesuai filter aktif dan **Impor CSV** (validasi per baris: ID/PIN unik, kantor dikenal, hak akses/status/jadwal valid; baris bermasalah dilewati beserta alasannya; templat dapat diunduh). Berkas hasil ekspor dapat diimpor kembali.
- Di mobile tabel berganti menjadi kartu per karyawan.
- Menu **Karyawan** punya 6 submenu dan semuanya sudah dibangun.

**Pengguna App Karyawan** (`/#/karyawan/pengguna-app`)

- Tabel pengguna App fingerspot.io: ID, nama, kantor, jabatan, platform (iOS/Android/N/A), dan status undangan; urut per kolom, *Tampilkan N data*, pencarian, paginasi, pilih baris (kartu di mobile).
- **Aksi untuk terpilih** (pilih salah satu → *Hapus Pengguna Apps*, dengan konfirmasi), **Ekspor CSV**, dan tautan **Lihat Karyawan Absensi GPS**.
- **Tambah Pengguna App**: pilih karyawan aktif yang belum terdaftar, cari berdasarkan **No telepon** (+62, 8–13 digit) atau **Email** (validasi), lalu status undangan “Menunggu”.

**Karyawan Kerja di Beberapa Kantor** (`/#/karyawan/beberapa-kantor`)

- Tabel karyawan dengan kantor asal dan **chip kantor lainnya** yang bisa dihapus satu per satu (kantor terakhir dihapus = karyawan keluar dari daftar).
- **Tambah Karyawan Kerja di Banyak Kantor**: pilih karyawan, centang kantor lain (kantor asal dan yang sudah ada tidak ditawarkan); menambah ke baris yang sudah ada bila karyawan sudah terdaftar.
- Pola daftar yang sama (toolbar, aksi massal, ekspor CSV, kartu di mobile).

**Admin Perangkat Absensi** (`/#/karyawan/admin-perangkat`) — karyawan lintas kantor dengan chip kantor yang bisa dicabut (kantor terakhir dicabut = keluar dari daftar), aksi massal, ekspor CSV.

**Absensi Tidak Ditampilkan** (`/#/karyawan/absensi-tidak-ditampilkan`) — daftar karyawan yang disembunyikan dari Laporan Kehadiran; **Tambah karyawan** membuka pemilih (cari + centang banyak karyawan aktif), hapus per baris atau terpilih.

**Karyawan Resign** (`/#/karyawan/resign`) — ID, nama, kantor, jabatan, tanggal resign, diproses pada; per baris **Aktifkan kembali** atau **Hapus permanen** (dengan konfirmasi), juga lewat Aksi untuk terpilih.

**Karyawan Absensi GPS** (`/#/karyawan/pengguna-app/gps`)

- Tab **Belum Registrasi** / **Sudah Registrasi** dengan jumlah, tabel urut/cari/paginasi, dan lencana status registrasi.

**Jabatan Fungsional** (`/#/organisasi/jabatan`)

- Tabel dengan *Tampilkan N data* (10/25/50/100), pencarian, urut nama (A–Z / Z–A / asli), dan paginasi.
- Tambah, Ubah (validasi nama unik), dan Hapus dengan konfirmasi; Empty state untuk data kosong/tidak ada hasil.

**Struktur Organisasi** (`/#/organisasi/struktur`)

- Pohon struktur dan jabatan yang bisa diperluas/diciutkan, dengan pencarian (kata yang cocok disorot) dan tombol Perluas/Ciutkan semua.
- Aksi per node: **Tambah** (Struktur/Jabatan/Kantor), **Ubah** (nama, kantor), **Hapus** dengan konfirmasi dan jumlah turunan; node akar tidak bisa dihapus. Ikon gedung + tooltip menunjukkan kantor yang terhubung.
- Di layar kecil aksi dilipat dalam satu menu “⋯”.
- Perubahan tersimpan di memori (belum ke API). Logika pohon ada di `src/lib/org-tree.ts`.
- **Tampilan mobile tersendiri** (< 768px): topbar ringkas (logo, cari, tugas), **navigasi bawah** (Dashboard, Karyawan, Absensi, Info, Menu), lembar **Menu** dari bawah (akun, Saldo/Keranjang/Inbox, semua menu dengan submenu, tema, bahasa, keluar), tombol aksi mengambang (FAB) di Daftar Karyawan, dialog tampil sebagai lembar dari bawah, form karyawan layar penuh dengan header lengket, dan detail karyawan sebagai lembar bawah. Kode: `components/dashboard/mobile-shell.tsx`.
- Menu **Organisasi** di sidebar memiliki submenu (Collapsible; flyout saat sidebar ciut). Sidebar dibagi dua kelompok: Dashboard & Pemberitahuan, lalu “Menu Utama”. 

**Dashboard** (`/`)

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
- `/#/pemberitahuan` — Pemberitahuan
- `/#/karyawan/daftar` — Daftar Karyawan
- `/#/karyawan/pengguna-app` — Pengguna App Karyawan (+ `/gps`)
- `/#/karyawan/beberapa-kantor`, `/admin-perangkat`, `/absensi-tidak-ditampilkan`, `/resign` — submenu Karyawan lainnya
- `/#/organisasi/struktur` — Struktur Organisasi
- `/#/organisasi/jabatan` — Jabatan Fungsional
- `/#/design-system` — Showcase design system (warna, tipografi, komponen)
- Menu sidebar lain (Karyawan, Kantor, dst.) menampilkan halaman *“sedang dibangun”* sampai dikerjakan

## Tech stack

| Kebutuhan | Pustaka |
|---|---|
| Framework & build | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS v4 (token lewat variabel CSS) |
| Komponen | shadcn/ui (preset `b5JNeciq8`: style `radix-vega`, base `neutral`, base `radix`) |
| Grafik | Recharts via komponen `Chart` shadcn |
| Tanggal | react-day-picker, date-fns (locale `id`) |
| Ikon | lucide-react |
| Font | Inter Variable |

## Struktur proyek

```
src/
├── components/
│   ├── ui/               # komponen shadcn (dari registry resmi + kustomisasi merek)
│   ├── organization/     # pohon organisasi + dialog tambah/ubah
│   ├── employees/        # form, detail (Sheet), badge status karyawan
│   └── dashboard/        # komposisi aplikasi: app-layout, shell (sidebar/topbar), nav, kartu, grafik, filter
├── data/                 # mock.ts (dashboard), announcements.ts (pemberitahuan), employees.ts (karyawan) — data contoh
├── hooks/                # use-theme, use-hash-route, use-fake-loading, use-mobile
├── pages/                # dashboard, announcements, coming-soon, design-system
├── lib/                  # utils.ts (cn), org-tree.ts (data & fungsi pohon organisasi)
└── index.css             # design token (warna, radius, shadow, font)
docs/
├── DESIGN_SYSTEM.md      # dokumentasi design system lengkap
└── screenshots/
scripts/apply-brand.py    # memasang ulang tambahan proyek (varian soft/status, target sentuh) setelah `shadcn add`
```

Komponen di `components/dashboard/` hanya **menyusun** komponen shadcn (tanpa elemen HTML mentah untuk input, tombol, daftar, paginasi, atau grafik). Satu-satunya file di `components/ui/` yang bukan dari registry adalah `date-picker.tsx` (rakitan Popover + Calendar).

## Design system

Ringkas:

- **Tema:** preset shadcn `b5JNeciq8` (`npx shadcn@latest apply b5JNeciq8`): `radix-vega`, base `neutral`, aksen **sky** (`sky-700` terang; `sky-500` gelap agar teks aksen terbaca), font Inter, radius `0.625rem`. Latar halaman netral.
- **Status:** biru = tepat waktu, hijau = hadir/izin, oranye = terlambat, merah = tidak hadir/alpha.
- **Bentuk:** mengikuti preset (kartu dengan ring tipis, kontrol `rounded-md`, badge pil).
- **Mode gelap:** palet netral bawaan shadcn (hampir hitam) dengan aksen sky-500; seri grafik 1–5 memakai skala sky yang dinaikkan agar terlihat di latar gelap.
- **Token** ada di `src/index.css` dan otomatis tersedia sebagai utility Tailwind (`bg-primary`, `text-danger`, `bg-tint-cyan`, …).

Dokumentasi lengkap: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Menambah komponen shadcn

```bash
npx shadcn@latest add <nama> -o -y   # -o menimpa file yang sudah ada
python3 scripts/apply-brand.py       # pasang ulang kustomisasi merek
npm uninstall cn                     # jika CLI memasang paket npm "cn"
```

Catatan: `shadcn add -o` dan `shadcn apply` menimpa file di `src/components/ui/`. `scripts/apply-brand.py` memasang kembali hanya tambahan proyek: varian Button `soft`, varian Badge `soft/success/info/warning/danger/muted` + prop `dot`, target sentuh 40px (`pointer-coarse:`) pada Button/Input/Select/Toggle, dan gaya tombol “Browse” pada input file; juga memperbaiki impor `cn` yang salah (`from "cn"` → `@/lib/utils`). Aman dijalankan berulang kali.

## Menghubungkan ke API

Data contoh dan simulasi loading ada di dua tempat:

- `src/data/mock.ts` dan `src/data/announcements.ts` — ganti fungsi/konstanta (mis. `disciplineRange`, `leaveRequests`, `dailyMonitoring`) dengan pemanggilan API.
- `src/hooks/use-fake-loading.ts` — ganti dengan `isLoading` dari query (mis. TanStack Query); skeleton di `components/dashboard/skeletons.tsx` sudah siap dipakai.

## Deploy

Proyek ini dapat langsung di-deploy ke [Vercel](https://vercel.com/new): preset **Vite**, build command `npm run build`, output `dist`. Routing memakai hash (`/#/design-system`), sehingga tidak perlu konfigurasi rewrite.

## Roadmap

- [ ] Sambungan ke API Fingerspot
- [x] Halaman Pemberitahuan
- [x] Struktur Organisasi
- [x] Jabatan Fungsional
- [x] Daftar Karyawan (tabel, filter, tambah/ubah/hapus, ekspor)
- [x] Pengguna App Karyawan + Karyawan Absensi GPS
- [x] Karyawan Kerja di Beberapa Kantor
- [x] Admin Perangkat Absensi, Absensi Tidak Ditampilkan, Karyawan Resign
- [ ] Halaman Absensi dan Laporan
- [ ] Router sungguhan (React Router) menggantikan `use-hash-route`
- [ ] i18n (ID/EN)
