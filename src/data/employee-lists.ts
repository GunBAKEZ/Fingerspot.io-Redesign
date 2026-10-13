export type AdminDevice = { id: number; pin: string; name: string; position: string; home: string; offices: string[] }
export const initialAdminDevice: AdminDevice[] = [
  { id: 1, pin: "61", name: "cobaco", position: "Marketing", home: "PT. KSS Surabaya Timur - Klampis", offices: ["Kantor Produksi", "Kantor Papan di Balikpapan"] },
  { id: 2, pin: "075", name: "Emil Stoll", position: "Staff IT", home: "Arkys Esemka Racing", offices: ["Arkys Esemka Racing"] },
  { id: 3, pin: "2008", name: "Kevan", position: "Dept Head Store", home: "PT ERA LINTAS TEKNOLOGI - PTC MALL", offices: ["PT ERA LINTAS TEKNOLOGI - PTC MALL"] },
  { id: 4, pin: "10001", name: "Hendrawan", position: "Direksi", home: "PT ASB(Kantor Pusat)", offices: ["PT ASB(Kantor Pusat)", "Kantor Balikpapan (DEMO)", "PT. KSS Surabaya Timur - Klampis"] },
  { id: 5, pin: "12321", name: "Demo Karyawan Athallah", position: "Head Of Sales", home: "PT FINGERSPOT WIYUNG", offices: ["Kantor Produksi"] },
  { id: 6, pin: "69420", name: "Muhammad Taufiq", position: "Direktur", home: "Kantor Balikpapan (DEMO)", offices: ["Arkys Esemka Racing"] },
]

export type HiddenEmployee = { id: number; pin: string; name: string; office: string; position: string }
export const initialHidden: HiddenEmployee[] = [
  { id: 1, pin: "11004", name: "Khosiah", office: "PT ASB(Kantor Solo Baru)", position: "Sales Counter" },
]

export type ResignedEmployee = { id: number; pin: string; name: string; office: string; position: string; resignDate: string; processedAt: string }
const r = (id: number, pin: string, name: string, office: string, position: string, resignDate: string, processedAt: string): ResignedEmployee => ({ id, pin, name, office, position, resignDate, processedAt })
export const initialResigned: ResignedEmployee[] = [
  r(1, "0000000090890", "Nabil test", "Kantor Balikpapan (DEMO)", "Admin", "2026-08-03", "2026-10-06 09:18:22"),
  r(2, "001", "Tomas Sand", "Arkys Esemka Racing", "Team Principal", "2026-10-08", "2026-10-08 09:02:55"),
  r(3, "002", "Henrik Shaw", "Arkys Esemka Racing", "OWNER UTAMA", "2026-10-08", "2026-10-08 09:22:24"),
  r(4, "003", "Katrin Delgado", "Arkys Esemka Racing", "Sporting Director", "2026-10-08", "2026-10-08 09:02:58"),
  r(5, "0030", "Sidqi Nata", "Kantor Balikpapan (DEMO)", "Sales Counter", "2026-07-25", "2026-08-21 08:05:04"),
  r(6, "004", "Sebastian Fischer", "Arkys Esemka Racing", "Pembalap Utama", "2026-10-08", "2026-10-08 09:02:59"),
  r(7, "005", "Olivia Eriksson", "Arkys Esemka Racing", "Pembalap Utama", "2026-10-08", "2026-10-08 09:03:00"),
]
