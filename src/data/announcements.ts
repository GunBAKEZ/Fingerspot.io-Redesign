export type Announcement = {
  id: number
  category: "umum" | "layanan"
  title: string
  /** Waktu lokal (WIB), format ISO tanpa zona. */
  date: string
  /** Isi contoh (bukan isi pengumuman asli). */
  body: string[]
  unread?: boolean
}

const lorem = (topic: string) => [
  `Kami menginformasikan bahwa ${topic}. Mohon perhatikan informasi ini agar operasional absensi di perusahaan Anda tetap berjalan lancar.`,
  "Jika Anda membutuhkan bantuan lebih lanjut, silakan hubungi tim Layanan Support Fingerspot melalui WhatsApp atau Telegram.",
]

export const announcements: Announcement[] = [
  { id: 1, category: "umum", unread: true, title: "Pembaruan Wajib Aplikasi Mobile Fingerspot.io ke Versi 7.0.0", date: "2026-10-09T10:09", body: lorem("aplikasi mobile Fingerspot.io wajib diperbarui ke versi 7.0.0 untuk tetap dapat melakukan absensi") },
  { id: 2, category: "umum", unread: true, title: "Jadwal Maintenance Sistem Fingerspot.io", date: "2026-10-08T17:49", body: lorem("akan dilakukan maintenance sistem terjadwal; layanan dapat terganggu sementara selama proses berlangsung") },
  { id: 3, category: "umum", title: "Pemberitahuan Kendala Waktu Perangkat Layanan Fingerspot.io", date: "2026-09-30T14:12", body: lorem("sebagian perangkat mengalami selisih waktu dan kini sudah ditangani") },
  { id: 4, category: "umum", title: "Pemberitahuan Gangguan Layanan Fingerspot.io", date: "2026-09-11T18:49", body: lorem("sempat terjadi gangguan layanan dan sistem telah kembali normal") },
  { id: 5, category: "umum", title: "Pemberitahuan Gangguan Layanan Fingerspot.io", date: "2026-08-01T14:48", body: lorem("sempat terjadi gangguan layanan dan sistem telah kembali normal") },
  { id: 6, category: "umum", title: "Jadwal Maintenance Sistem Fingerspot.io", date: "2026-07-28T15:25", body: lorem("akan dilakukan maintenance sistem terjadwal") },
  { id: 7, category: "umum", title: "Jadwal Maintenance Sistem Fingerspot.io", date: "2026-07-17T18:15", body: lorem("akan dilakukan maintenance sistem terjadwal") },
  { id: 8, category: "umum", title: "Pemberitahuan Penyesuaian Paket Layanan Fingerspot.io (Efektif 1 Agustus 2026)", date: "2026-07-15T00:01", body: lorem("terdapat penyesuaian paket layanan yang berlaku efektif 1 Agustus 2026") },
  { id: 9, category: "umum", title: "Absensi GPS Kini Lebih Aman dengan AI Liveness Face Recognition", date: "2026-06-28T00:01", body: lorem("absensi GPS kini dilengkapi deteksi liveness wajah berbasis AI untuk mencegah kecurangan") },
  { id: 10, category: "umum", title: "Pemberitahuan Perubahan Ketentuan Layanan dan Paket Fingerspot.io (Efektif 1 Mei 2026)", date: "2026-05-01T00:01", body: lorem("terdapat perubahan ketentuan layanan dan paket yang berlaku efektif 1 Mei 2026") },
  { id: 11, category: "umum", title: "Fitur Baru: Ekspor Laporan Absensi ke Excel", date: "2026-04-14T09:30", body: lorem("laporan absensi kini dapat diekspor ke format Excel") },
  { id: 12, category: "umum", title: "Panduan Pengaturan Shift Karyawan", date: "2026-03-20T11:00", body: lorem("tersedia panduan baru untuk mengatur shift karyawan") },
  { id: 13, category: "umum", title: "Jadwal Maintenance Sistem Fingerspot.io", date: "2026-02-26T16:20", body: lorem("akan dilakukan maintenance sistem terjadwal") },
  { id: 14, category: "umum", title: "Selamat Datang di Fingerspot.io", date: "2026-01-05T08:00", body: lorem("akun Anda telah aktif dan siap digunakan") },

  { id: 101, category: "layanan", unread: true, title: "Kuota Absensi GPS via Ponsel Anda Tersisa 19", date: "2026-10-12T08:05", body: lorem("sisa kuota Absensi GPS via Ponsel Anda tinggal 19 dari 106; pertimbangkan menambah kuota") },
  { id: 102, category: "layanan", title: "Pembayaran Paket Layanan Berhasil", date: "2026-10-01T13:42", body: lorem("pembayaran paket layanan Anda telah kami terima") },
  { id: 103, category: "layanan", title: "Perangkat Absensi Baru Berhasil Ditambahkan", date: "2026-09-18T10:15", body: lorem("sebuah perangkat absensi baru berhasil ditambahkan ke akun Anda") },
]
