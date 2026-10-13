import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Pencil, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { initials, type Employee } from "@/data/employees"
import { StatusBadge } from "./status-badge"

/** Panel detail karyawan (Sheet dari kanan): foto, identitas, data dari perangkat, atasan lain. */
export function EmployeeDetailSheet({ employee, people, onClose, onEdit }: { employee: Employee | null; people: Employee[]; onClose: () => void; onEdit: (e: Employee) => void }) {
  const [tab, setTab] = useState<"foto" | "verifikasi">("foto")
  const src = employee ? (tab === "foto" ? employee.photo : employee.verifyPhoto) : undefined
  const supervisors = (employee?.supervisors ?? []).map((sid) => people.find((p) => p.id === sid)).filter((p): p is Employee => !!p)

  const rows: [string, React.ReactNode][] = employee ? [
    ["ID / PIN", employee.pin], ["NIK", employee.nik], ["Jenis kelamin", employee.gender],
    ["Tanggal mulai kerja", format(new Date(`${employee.startDate}T00:00:00`), "d MMM yyyy", { locale: id })],
    ["Nama di perangkat", employee.deviceName || "-"], ["Hak akses perangkat", employee.access], ["Jadwal", employee.schedule || "N/A"],
    ["Verifikasi perangkat", employee.verifyType ? <Badge variant="muted">{employee.verifyType}</Badge> : "Tidak"],
    ["Absen dengan kode QR", employee.allowQr ? "Diizinkan" : "Tidak"], ["Status", <StatusBadge status={employee.status} />],
    ["Tanggal tambah data", employee.createdAt], ["Tanggal diperbarui", employee.updatedAt],
  ] : []

  return (
    <Sheet open={!!employee} onOpenChange={(o) => { if (!o) { onClose(); setTab("foto") } }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b pb-4 pr-12">
          <SheetTitle className="text-xl">{employee?.name}</SheetTitle>
          <SheetDescription>{employee?.position} · {employee?.office}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="h-auto w-full rounded-xl group-data-[orientation=horizontal]/tabs:h-auto">
              <TabsTrigger value="foto" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Karyawan</TabsTrigger>
              <TabsTrigger value="verifikasi" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Verifikasi Perangkat</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mx-auto grid aspect-[3/4] w-full max-w-52 place-items-center overflow-hidden rounded-2xl bg-muted">
            {src ? <img src={src} alt={tab === "foto" ? "Foto karyawan" : "Foto verifikasi perangkat"} className="size-full object-cover" /> : <UserRound className="size-28 fill-muted-foreground/30 text-muted-foreground/40" strokeWidth={1} aria-label="Belum ada foto" />}
          </div>

          <dl className="space-y-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <section className="space-y-2 pb-2">
            <h3 className="text-sm font-bold">Atasan Lain</h3>
            {supervisors.length === 0 ? <p className="text-sm text-muted-foreground">Belum ada atasan lain.</p> : (
              <ul className="space-y-2">
                {supervisors.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-xl border p-2">
                    <Avatar><AvatarFallback>{initials(p.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0"><p className="truncate text-sm font-medium">{p.name}</p><p className="truncate text-xs text-muted-foreground">{p.position}</p></div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onClose}>Tutup</Button>
          {employee && <Button onClick={() => onEdit(employee)}><Pencil /> Ubah</Button>}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
