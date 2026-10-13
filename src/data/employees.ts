export type EmployeeStatus = "Aktif" | "Nonaktif" | "Resign"
export type Employee = {
  id: number
  pin: string
  nik: string
  name: string
  office: string
  position: string
  access: "USER" | "ADMIN"
  /** Nama jadwal kerja; kosong = N/A. */
  schedule: string
  status: EmployeeStatus
  gender: "Pria" | "Wanita"
  /** yyyy-mm-dd */
  startDate: string
  /** Nama yang tampil di perangkat absensi (maks. 15 karakter). */
  deviceName: string
  /** PIN fingerspot.io. */
  fsPin: string
  allowQr: boolean
  /** Kosong = tanpa verifikasi ke perangkat. */
  verifyType: "" | "Sidik Jari" | "Wajah" | "Vein" | "Card"
  targetDevice: string
  /** URL pratinjau foto (hanya selama sesi). */
  /** Password untuk perangkat absensi. */
  devicePassword: string
  /** "yyyy-MM-dd HH:mm:ss" */
  createdAt: string
  updatedAt: string
  /** ID karyawan yang menjadi atasan lain (maks. 3). */
  supervisors: number[]
  photo?: string
  verifyPhoto?: string
}

export const employeeOffices = [
  "Kantor Balikpapan (DEMO)", "Arkys Esemka Racing", "Office", "PT ERA LINTAS TEKNOLOGI - PTC MALL",
  "ACT PON COBA", "Kantor Pusat", "Kantor Jogjakarta", "Kantor Purwokerto",
]
export const employeePositions = ["Direksi", "Staff IT", "Karyawan", "Admin Support", "Staff", "Manager", "Supervisor", "Staff Finance", "Teknisi", "Customer Care"]
export const schedules = ["P1", "Esemka 08-17", "Shift Pagi", "Shift Malam", "Daily Worker"]
/** Jadwal bawaan tiap jabatan; bila berbeda dengan jadwal karyawan, form ubah menampilkan peringatan. */
export const positionSchedule: Record<string, string> = {
  Direksi: "Daily Worker", "Staff IT": "Esemka 08-17", Karyawan: "P1", "Admin Support": "P1", Staff: "P1",
  Manager: "P1", Supervisor: "P1", "Staff Finance": "P1", Teknisi: "Shift Pagi", "Customer Care": "Shift Malam",
}
export const scheduleLabel = (name: string) => `${name} (${name === "Daily Worker" ? "Jam Kerja Fleksibel" : "Jam Kerja Tetap"})`
export const NO_SCHEDULE = "__none"
export const targetDevices = ["demo ambas 17-4-26 (C2692463DF142035)", "Mesin Lobi (A1B2C3D4E5F60718)"]
export const verifyTypes = ["Sidik Jari", "Wajah", "Vein", "Card"] as const

const e = (id: number, pin: string, nik: string, name: string, office: string, position: string, schedule: string, access: Employee["access"] = "USER", status: EmployeeStatus = "Aktif"): Employee =>
  ({ id, pin, nik, name, office, position, access, schedule, status, gender: "Pria", startDate: "2025-01-06", deviceName: name.slice(0, 15), fsPin: "000000", allowQr: false, verifyType: "Sidik Jari", targetDevice: targetDevices[0], devicePassword: "0", createdAt: "2026-07-25 12:52:06", updatedAt: "2026-10-06 09:35:53", supervisors: [] })

const names = ["Budi Hartono", "Citra Lestari", "Dewi Anggraini", "Fajar Nugroho", "Gita Pertiwi", "Hendra Wijaya", "Indah Permata", "Joko Santoso", "Kartika Sari", "Lukman Hakim", "Maya Putri", "Naufal Rizky", "Oki Pratama", "Putri Ayu", "Rudi Hermawan", "Sinta Wulandari", "Tono Prasetyo", "Umar Faruq", "Vina Melati", "Wahyu Ramadhan", "Yoga Pratama", "Zahra Amelia", "Rina Marlina", "Dimas Aryo", "Agus Salim"]

/** Data contoh: 5 baris pertama mengikuti screenshot aplikasi lama. */
export const initialEmployees: Employee[] = [
  e(1, "000001", "000001", "Moosa", "Kantor Balikpapan (DEMO)", "Direksi", "P1"),
  e(2, "075", "75", "Emil Stoll", "Arkys Esemka Racing", "Staff IT", "Esemka 08-17"),
  e(3, "098765", "098765", "Joko Setiawan", "Office", "Karyawan", ""),
  e(4, "1", "1", "Mahardika", "PT ERA LINTAS TEKNOLOGI - PTC MALL", "Admin Support", "P1"),
  e(5, "1000000001", "1000000001", "Dominika", "ACT PON COBA", "Staff", ""),
  ...names.map((n, i) =>
    e(6 + i, String(2000 + i * 7), String(3100000 + i * 13), n,
      employeeOffices[(i + 1) % employeeOffices.length], employeePositions[(i * 3) % employeePositions.length],
      i % 4 === 0 ? "" : schedules[i % schedules.length], i % 9 === 0 ? "ADMIN" : "USER",
      i % 11 === 10 ? "Resign" : i % 7 === 6 ? "Nonaktif" : "Aktif")
  ),
]

export const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
