import { employeeOffices, schedules, type Employee, type EmployeeStatus } from "@/data/employees"

export const csvHeader = ["ID/PIN", "NIK", "Nama", "Kantor", "Jabatan", "Hak Akses", "Jadwal", "Status", "Jenis Kelamin", "Tanggal Mulai"]

export const employeeToRow = (e: Employee) => [e.pin, e.nik, e.name, e.office, e.position, e.access, e.schedule || "N/A", e.status, e.gender, e.startDate]

export const templateRows = [csvHeader, ["3001", "3001", "Contoh Nama", employeeOffices[0], "Staff", "USER", "P1", "Aktif", "Pria", "2026-01-05"]]

const stamp = () => new Date().toISOString().slice(0, 19).replace("T", " ")
const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "")
const alias: Record<string, string> = { idpin: "pin", id: "pin", pin: "pin", nik: "nik", nama: "name", kantor: "office", jabatan: "position", hakakses: "access", jadwal: "schedule", status: "status", jeniskelamin: "gender", tanggalmulai: "startDate" }
const required = ["pin", "name", "office", "position"]
const labels: Record<string, string> = { pin: "ID/PIN", name: "Nama", office: "Kantor", position: "Jabatan" }

export type ImportError = { row: number; message: string }
export type ImportResult = { valid: Omit<Employee, "id">[]; errors: ImportError[]; fatal?: string }

/** Validasi isi CSV. Baris valid dipisah dari baris bermasalah (baris bermasalah dilewati). */
export function validateImport(rows: string[][], existingPins: string[]): ImportResult {
  if (rows.length === 0) return { valid: [], errors: [], fatal: "File kosong." }
  const idx: Record<string, number> = {}
  rows[0].forEach((h, i) => { const k = alias[norm(h)]; if (k && !(k in idx)) idx[k] = i })
  const missing = required.filter((k) => !(k in idx))
  if (missing.length) return { valid: [], errors: [], fatal: `Kolom wajib tidak ditemukan: ${missing.map((k) => labels[k]).join(", ")}.` }

  const seen = new Set(existingPins), valid: ImportResult["valid"] = [], errors: ImportError[] = []
  rows.slice(1).forEach((r, n) => {
    const row = n + 2 // nomor baris di file (header = 1)
    const get = (k: string) => (idx[k] === undefined ? "" : (r[idx[k]] ?? "").trim())
    const fail = (message: string) => errors.push({ row, message })
    const pin = get("pin"), name = get("name"), position = get("position")
    const office = employeeOffices.find((o) => o.toLowerCase() === get("office").toLowerCase())
    if (!pin) return fail("ID/PIN kosong")
    if (seen.has(pin)) return fail(`ID/PIN ${pin} sudah ada`)
    if (!name) return fail("Nama kosong")
    if (!office) return fail(`Kantor tidak dikenal: “${get("office") || "(kosong)"}”`)
    if (!position) return fail("Jabatan kosong")
    const access = (get("access") || "USER").toUpperCase()
    if (access !== "USER" && access !== "ADMIN") return fail(`Hak akses harus USER atau ADMIN (“${get("access")}”)`)
    const statusRaw = get("status") || "Aktif"
    const status = (["Aktif", "Nonaktif", "Resign"] as const).find((s) => s.toLowerCase() === statusRaw.toLowerCase())
    if (!status) return fail(`Status tidak valid: “${statusRaw}”`)
    const scheduleRaw = get("schedule")
    const schedule = !scheduleRaw || scheduleRaw.toUpperCase() === "N/A" ? "" : schedules.find((s) => s.toLowerCase() === scheduleRaw.toLowerCase())
    if (schedule === undefined) return fail(`Jadwal tidak dikenal: “${scheduleRaw}”`)
    const genderRaw = get("gender") || "Pria"
    const gender = (["Pria", "Wanita"] as const).find((g) => g.toLowerCase() === genderRaw.toLowerCase())
    if (!gender) return fail(`Jenis kelamin harus Pria atau Wanita (“${genderRaw}”)`)
    const d = get("startDate")
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    const startDate = !d ? new Date().toISOString().slice(0, 10) : m ? (m[1].length === 4 ? `${m[1]}-${m[2]}-${m[3]}` : `${m[3]}-${m[2]}-${m[1]}`) : null
    if (!startDate || Number.isNaN(Date.parse(startDate))) return fail(`Tanggal mulai tidak valid: “${d}” (gunakan yyyy-mm-dd)`)

    seen.add(pin)
    valid.push({ pin, nik: get("nik") || pin, name, office, position, access, schedule, status: status as EmployeeStatus, gender, startDate, deviceName: name.slice(0, 15), fsPin: "000000", allowQr: false, verifyType: "", targetDevice: "", devicePassword: "0", createdAt: stamp(), updatedAt: stamp(), supervisors: [] })
  })
  return { valid, errors }
}
