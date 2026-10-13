export type Platform = "iOS" | "Android" | "N/A"
export type InviteStatus = "Sudah Diterima" | "Menunggu" | "Ditolak"
export type AppUser = { id: number; pin: string; name: string; office: string; position: string; platform: Platform; invite: InviteStatus; contact?: string }

const u = (id: number, pin: string, name: string, office: string, position: string, platform: Platform, invite: InviteStatus = "Sudah Diterima"): AppUser =>
  ({ id, pin, name, office, position, platform, invite })

/** Data contoh Pengguna App Karyawan (belum terhubung ke API). */
export const initialAppUsers: AppUser[] = [
  u(1, "112233", "Banjarmasin Demo 1", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "N/A"),
  u(2, "445566", "Banjarmasin Demo 2", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "iOS"),
  u(3, "778899", "Banjarmasin Demo 3", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "Android"),
  u(4, "100007", "Son", "PT. KSS Surabaya Utara - ITC", "Teknisi", "Android"),
  u(5, "2000", "Budi Hartono", "Arkys Esemka Racing", "Direksi", "Android"),
  u(6, "2007", "Citra Lestari", "Office", "Admin Support", "iOS"),
  u(7, "2014", "Dewi Anggraini", "PT ERA LINTAS TEKNOLOGI - PTC MALL", "Supervisor", "Android", "Menunggu"),
  u(8, "2021", "Fajar Nugroho", "ACT PON COBA", "Customer Care", "N/A", "Menunggu"),
  u(9, "2028", "Gita Pratiwi", "KANTOR PUSAT", "Staff Finance", "iOS"),
  u(10, "2035", "Hendra Wijaya", "Office", "Staff IT", "Android"),
  u(11, "2042", "Indah Permata", "PT. ASB (Kantor Banjarmasin)", "Manager", "N/A", "Ditolak"),
  u(12, "2049", "Joko Setiawan", "Office", "Karyawan", "Android"),
]

export type GpsEmployee = { id: number; pin: string; name: string; office: string; position: string; platform: Platform; registered: boolean }
const g = (id: number, pin: string, name: string, office: string, position: string, platform: Platform, registered: boolean): GpsEmployee =>
  ({ id, pin, name, office, position, platform, registered })

/** Data contoh Karyawan Absensi GPS. */
export const gpsEmployees: GpsEmployee[] = [
  g(1, "998", "fathur", "Office", "Admin", "N/A", false),
  g(2, "1709", "Anisah", "Office", "Admin", "Android", false),
  g(3, "1710", "siti", "Office", "Admin", "Android", false),
  g(4, "8989", "olivia", "Office", "Admin", "iOS", false),
  g(5, "9000", "raid", "Office", "Admin", "iOS", false),
  g(6, "9876", "Indra", "Office", "Staff", "Android", false),
  g(7, "90011", "DODY LESMA", "ACT PON COBA", "ASN", "iOS", false),
  g(8, "121200", "MARSELLA", "ACT PON COBA", "Staff", "iOS", false),
  g(9, "146464", "j", "Office", "Staff", "Android", false),
  g(10, "180301", "RIZKI MAULANA", "PT ERA LINTAS TEKNOLOGI - PTC MALL", "Sales Representatif", "Android", false),
  g(11, "180302", "Salsa Putri", "PT ERA LINTAS TEKNOLOGI - PTC MALL", "Sales Representatif", "iOS", false),
  g(12, "180303", "Teguh Santoso", "KANTOR PUSAT", "Staff Finance", "Android", false),
  g(13, "112233", "Banjarmasin Demo 1", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "N/A", true),
  g(14, "445566", "Banjarmasin Demo 2", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "iOS", true),
  g(15, "778899", "Banjarmasin Demo 3", "PT. ASB (Kantor Banjarmasin)", "Head Of Sales", "Android", true),
  g(16, "100007", "Son", "PT. KSS Surabaya Utara - ITC", "Teknisi", "Android", true),
  g(17, "2000", "Budi Hartono", "Arkys Esemka Racing", "Direksi", "Android", true),
  g(18, "2007", "Citra Lestari", "Office", "Admin Support", "iOS", true),
  g(19, "2014", "Dewi Anggraini", "PT ERA LINTAS TEKNOLOGI - PTC MALL", "Supervisor", "Android", true),
  g(20, "2021", "Fajar Nugroho", "ACT PON COBA", "Customer Care", "iOS", true),
]
