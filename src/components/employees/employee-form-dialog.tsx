import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employeeOffices, employeePositions, NO_SCHEDULE, schedules, type Employee, type EmployeeStatus } from "@/data/employees"

type Draft = Omit<Employee, "id">
const empty: Draft = { pin: "", nik: "", name: "", office: "", position: "", access: "USER", schedule: "", status: "Aktif" }

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

/** Dialog tambah / ubah karyawan. `employee` null = tambah. */
export function EmployeeFormDialog({
  open, employee, existingPins, onClose, onSubmit,
}: {
  open: boolean
  employee: Employee | null
  existingPins: string[]
  onClose: () => void
  onSubmit: (values: Draft) => void
}) {
  const [d, setD] = useState<Draft>(empty)
  useEffect(() => { if (open) setD(employee ? { ...employee } : empty) }, [open, employee])
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  const pinTaken = d.pin.trim() !== "" && existingPins.includes(d.pin.trim()) && d.pin.trim() !== employee?.pin
  const valid = d.pin.trim() !== "" && d.name.trim() !== "" && d.office !== "" && d.position !== "" && !pinTaken

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-xl">
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit({ ...d, pin: d.pin.trim(), nik: d.nik.trim() || d.pin.trim(), name: d.name.trim() }) }}
          className="space-y-5"
        >
          <DialogHeader>
            <DialogTitle>{employee ? "Ubah Karyawan" : "Tambah Karyawan"}</DialogTitle>
            <DialogDescription>{employee ? `Mengubah data ${employee.name}.` : "Isi data karyawan baru."}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID / PIN" htmlFor="emp-pin" error={pinTaken ? "ID / PIN sudah dipakai." : undefined}>
              <Input id="emp-pin" autoFocus value={d.pin} onChange={(e) => set("pin", e.target.value)} aria-invalid={pinTaken} />
            </Field>
            <Field label="NIK" htmlFor="emp-nik">
              <Input id="emp-nik" value={d.nik} onChange={(e) => set("nik", e.target.value)} placeholder="Sama dengan ID bila kosong" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Nama" htmlFor="emp-name">
                <Input id="emp-name" value={d.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
            </div>
            <Field label="Kantor" htmlFor="emp-office">
              <Select value={d.office} onValueChange={(v) => set("office", v)}>
                <SelectTrigger id="emp-office" className="w-full rounded-xl"><SelectValue placeholder="Pilih kantor" /></SelectTrigger>
                <SelectContent>{employeeOffices.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Jabatan" htmlFor="emp-position">
              <Select value={d.position} onValueChange={(v) => set("position", v)}>
                <SelectTrigger id="emp-position" className="w-full rounded-xl"><SelectValue placeholder="Pilih jabatan" /></SelectTrigger>
                <SelectContent>{employeePositions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Hak akses perangkat absensi" htmlFor="emp-access">
              <Select value={d.access} onValueChange={(v) => set("access", v as Draft["access"])}>
                <SelectTrigger id="emp-access" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USER">USER</SelectItem><SelectItem value="ADMIN">ADMIN</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Jadwal" htmlFor="emp-schedule">
              <Select value={d.schedule || NO_SCHEDULE} onValueChange={(v) => set("schedule", v === NO_SCHEDULE ? "" : v)}>
                <SelectTrigger id="emp-schedule" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SCHEDULE}>Tanpa jadwal (N/A)</SelectItem>
                  {schedules.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status" htmlFor="emp-status">
              <Select value={d.status} onValueChange={(v) => set("status", v as EmployeeStatus)}>
                <SelectTrigger id="emp-status" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{(["Aktif", "Nonaktif", "Resign"] as const).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={!valid}>Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
