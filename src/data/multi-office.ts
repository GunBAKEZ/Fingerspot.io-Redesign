export type MultiOfficeEmployee = { id: number; pin: string; name: string; position: string; home: string; others: string[] }

const m = (id: number, pin: string, name: string, position: string, home: string, others: string[]): MultiOfficeEmployee => ({ id, pin, name, position, home, others })

/** Data contoh Karyawan Kerja di Beberapa Kantor (belum terhubung ke API). */
export const initialMultiOffice: MultiOfficeEmployee[] = [
  m(1, "10001", "Hendrawan", "Direksi", "PT ASB (Kantor Pusat)", ["Office", "PT.BBS-SMG", "PT. ASB (Kantor Banjarmasin)", "PT ASB (Kantor Solo Baru)", "PT ASB (Kantor Pontianak)", "ACT PON COBA"]),
  m(2, "10003", "Emanuela", "PT BW", "PT ASB (Kantor Solo Baru)", ["Office", "PT.BBS-SMG", "PT. ASB (Kantor Banjarmasin)", "PT. Biometrik Inovasi", "ACT PON COBA"]),
  m(3, "10006", "Arum", "Admin Keuangan", "PT ASB (Kantor Solo Baru)", ["PT.BBS-SMG", "PT. ASB (Kantor Banjarmasin)", "PT ASB (Kantor Pontianak)", "PT ASB (Kantor Pusat)"]),
  m(4, "11005", "Adriel", "Teknisi", "PT ASB (Kantor Solo Baru)", ["Office", "PT.BBS-SMG", "PT. ASB (Kantor Banjarmasin)", "PT ASB (Kantor Pontianak)"]),
  m(5, "11010", "Bagas Prasetyo", "Staff IT", "Office", ["Kantor Pusat", "Kantor Jogjakarta"]),
  m(6, "11022", "Clara Wijaya", "Manager", "Kantor Pusat", ["Kantor Purwokerto"]),
]

/** Semua kantor yang dapat dipilih. */
export const allOffices = [
  "Office", "PT.BBS-SMG", "PT. ASB (Kantor Banjarmasin)", "PT ASB (Kantor Pusat)", "PT ASB (Kantor Solo Baru)",
  "PT ASB (Kantor Pontianak)", "PT. Biometrik Inovasi", "ACT PON COBA", "Kantor Pusat", "Kantor Jogjakarta", "Kantor Purwokerto",
  "Kantor Balikpapan (DEMO)", "Arkys Esemka Racing", "PT ERA LINTAS TEKNOLOGI - PTC MALL",
]
