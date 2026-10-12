export const offices = [
  { name: "Kantor Pusat", color: "var(--chart-3)" },
  { name: "Kantor Jogjakarta", color: "var(--chart-2)" },
  { name: "Kantor Purwokerto", color: "var(--chart-1)" },
  { name: "Kantor Harco Glodok", color: "var(--chart-5)" },
  { name: "Kantor Balikpapan", color: "var(--chart-4)" },
] as const

export const attendanceTrend = ["Minggu ke-1", "Minggu ke-2", "Minggu ke-3", "Minggu ke-4"].map((week, i) => ({
  week,
  "Kantor Pusat": [92, 96, 94, 97][i],
  "Kantor Jogjakarta": [81, 88, 85, 90][i],
  "Kantor Purwokerto": [74, 79, 83, 80][i],
  "Kantor Harco Glodok": [66, 72, 70, 78][i],
  "Kantor Balikpapan": [58, 64, 61, 69][i],
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

export const leaveRequests: { name: string; role: string; type: string; range: string; status: LeaveStatus }[] = [
  { name: "Rina Marlina", role: "Staff HRD", type: "Cuti Tahunan", range: "12 – 14 Okt 2026", status: "pending" },
  { name: "Dimas Aryo", role: "Teknisi", type: "Sakit", range: "12 Okt 2026", status: "approved" },
  { name: "Sinta Wulandari", role: "Admin Support", type: "Izin Keluarga", range: "13 – 14 Okt 2026", status: "pending" },
  { name: "Budi Hartono", role: "Sales", type: "Cuti Menikah", range: "19 – 23 Okt 2026", status: "approved" },
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
