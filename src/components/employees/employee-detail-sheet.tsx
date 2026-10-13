import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { initials, type Employee } from "@/data/employees"
import { StatusBadge } from "./status-badge"

/** Panel detail karyawan (Sheet dari kanan). */
export function EmployeeDetailSheet({ employee, onClose, onEdit }: { employee: Employee | null; onClose: () => void; onEdit: (e: Employee) => void }) {
  const rows: [string, React.ReactNode][] = employee ? [
    ["ID / PIN", employee.pin], ["NIK", employee.nik], ["Kantor", employee.office], ["Jabatan", employee.position],
    ["Jenis kelamin", employee.gender], ["Tanggal mulai kerja", format(new Date(`${employee.startDate}T00:00:00`), "d MMM yyyy", { locale: id })],
    ["Nama di perangkat", employee.deviceName || "-"], ["Hak akses perangkat", employee.access], ["Jadwal", employee.schedule || "N/A"],
    ["Verifikasi perangkat", employee.verifyType ? `${employee.verifyType} · ${employee.targetDevice}` : "Tidak"], ["Absen dengan kode QR", employee.allowQr ? "Diizinkan" : "Tidak"],
    ["Status", <StatusBadge status={employee.status} />],
  ] : []
  return (
    <Sheet open={!!employee} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex-row items-center gap-3 border-b pb-4 pr-12">
          <Avatar className="size-12">{employee?.photo && <AvatarImage src={employee.photo} alt="" />}<AvatarFallback>{employee && initials(employee.name)}</AvatarFallback></Avatar>
          <div className="min-w-0">
            <SheetTitle className="truncate">{employee?.name}</SheetTitle>
            <SheetDescription className="truncate">{employee?.position} · {employee?.office}</SheetDescription>
          </div>
        </SheetHeader>
        <dl className="flex-1 space-y-4 overflow-y-auto px-4 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <SheetFooter className="flex-row justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onClose}>Tutup</Button>
          {employee && <Button onClick={() => onEdit(employee)}><Pencil /> Ubah</Button>}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
