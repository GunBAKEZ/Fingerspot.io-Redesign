export const offices = [
  { key: "pusat", name: "Kantor Pusat", color: "var(--chart-3)" },
  { key: "jogja", name: "Kantor Jogjakarta", color: "var(--chart-2)" },
  { key: "purwokerto", name: "Kantor Purwokerto", color: "var(--chart-1)" },
  { key: "glodok", name: "Kantor Harco Glodok", color: "var(--chart-5)" },
  { key: "balikpapan", name: "Kantor Balikpapan", color: "var(--chart-4)" },
] as const

export const attendanceTrend = ["Minggu ke-1", "Minggu ke-2", "Minggu ke-3", "Minggu ke-4"].map((week, i) => ({
  week,
  pusat: [92, 96, 94, 97][i],
  jogja: [81, 88, 85, 90][i],
  purwokerto: [74, 79, 83, 80][i],
  glodok: [66, 72, 70, 78][i],
  balikpapan: [58, 64, 61, 69][i],
}))

export const dailyMonitoring = {
  total: 152,
  items: [
    { key: "tepat", label: "Tepat Waktu", count: 98, color: "var(--info)" },
    { key: "terlambat", label: "Terlambat", count: 21, color: "var(--warning)" },
    { key: "izin", label: "Izin", count: 9, color: "var(--success)" },
    { key: "alpha", label: "Tidak Hadir", count: 24, color: "var(--danger)" },
  ],
}

export type LeaveStatus = "pending" | "approved" | "rejected"

export const leaveRequests: { name: string; role: string; type: string; range: string; start: string; end: string; status: LeaveStatus }[] = [
  { name: "Rina Marlina", role: "Staff HRD", type: "Cuti Tahunan", range: "12 – 14 Okt 2026", start: "2026-10-12", end: "2026-10-14", status: "pending" },
  { name: "Dimas Aryo", role: "Teknisi", type: "Sakit", range: "12 Okt 2026", start: "2026-10-12", end: "2026-10-12", status: "approved" },
  { name: "Sinta Wulandari", role: "Admin Support", type: "Izin Keluarga", range: "13 – 14 Okt 2026", start: "2026-10-13", end: "2026-10-14", status: "pending" },
  { name: "Budi Hartono", role: "Sales", type: "Cuti Menikah", range: "19 – 23 Okt 2026", start: "2026-10-19", end: "2026-10-23", status: "approved" },
]

export const disciplineList = [
  { name: "Mahardika", role: "Admin Support", status: "Alpha" },
  { name: "Moosa", role: "Direksi", status: "Alpha" },
  { name: "bunga", role: "Admin Support", status: "Alpha" },
  { name: "Brian", role: "Owner (Tester)", status: "Alpha" },
  { name: "Bunga", role: "Staff Sales", status: "Alpha" },
  { name: "Citra Lestari", role: "Staff Finance", status: "Terlambat" },
  { name: "Fajar Nugroho", role: "Teknisi", status: "Terlambat" },
  { name: "Dewi Anggraini", role: "Customer Care", status: "Alpha" },
  { name: "Yoga Pratama", role: "Teknisi", status: "Terlambat" },
  { name: "Lia Safitri", role: "Staff HRD", status: "Alpha" },
]

export const incompleteData = [
  { name: "ZANUAR HELMI S", percent: 0 },
  { name: "Zaki Maulana", percent: 25 },
  { name: "Zahri Efendi", percent: 50 },
  { name: "YUYUN SRI LESTA", percent: 50 },
  { name: "YUSUF", percent: 25 },
  { name: "yusnaniii", percent: 0 },
  { name: "Wahyu Ramadhan", percent: 75 },
  { name: "Wulan Sari", percent: 50 },
]

export const holidays: Record<string, string> = {
  "2026-10-20": "Cuti bersama (contoh)",
}

/** Data contoh: daftar indisipliner berbeda per hari (diputar berdasarkan tanggal); akhir pekan kosong. */
export function disciplineFor(date: Date) {
  const day = date.getDay()
  if (day === 0 || day === 6) return []
  const n = date.getDate() % disciplineList.length
  return [...disciplineList.slice(n), ...disciplineList.slice(0, n)].slice(0, 5).map((e) => ({ ...e, date: new Date(date) }))
}

/** Gabungan data indisipliner untuk rentang tanggal (maks. 31 hari). */
export function disciplineRange(from: Date, to: Date) {
  const out: ReturnType<typeof disciplineFor> = []
  const d = new Date(from)
  for (let i = 0; i < 31 && d <= to; i++) {
    out.push(...disciplineFor(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}
