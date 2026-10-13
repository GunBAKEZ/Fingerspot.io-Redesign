import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { Info, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { employeeOffices, employeePositions, targetDevices, verifyTypes, type Employee } from "@/data/employees"
import { cn } from "@/lib/utils"

export type EmployeeValues = Omit<Employee, "id" | "schedule" | "status" | "access"> & Pick<Employee, "schedule" | "status" | "access">
type Draft = { first: string; last: string; verify: boolean } & Omit<EmployeeValues, "name">

const today = () => format(new Date(), "yyyy-MM-dd")
const blank = (nextId: string): Draft => ({
  office: "", first: "", last: "", deviceName: "", pin: nextId, nik: nextId, position: "", startDate: today(),
  fsPin: "000000", gender: "Pria", allowQr: false, verify: true, verifyType: "Sidik Jari", targetDevice: targetDevices[0],
  access: "USER", schedule: "", status: "Aktif",
})
const fromEmployee = (e: Employee): Draft => {
  const [first, ...rest] = e.name.split(" ")
  const { id: _id, name: _name, ...fields } = e
  return { ...fields, first, last: rest.join(" "), verify: e.verifyType !== "" }
}

function Req({ children }: { children: React.ReactNode }) {
  return <Label>{children} <span className="text-danger" aria-hidden>*</span></Label>
}

function PhotoPanel({ photo, verifyPhoto, onPhoto, onVerifyPhoto }: { photo?: string; verifyPhoto?: string; onPhoto: (u?: string) => void; onVerifyPhoto: (u?: string) => void }) {
  const [tab, setTab] = useState<"foto" | "verifikasi">("foto")
  const src = tab === "foto" ? photo : verifyPhoto
  const set = tab === "foto" ? onPhoto : onVerifyPhoto
  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="h-auto w-full rounded-xl group-data-[orientation=horizontal]/tabs:h-auto">
          <TabsTrigger value="foto" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Karyawan</TabsTrigger>
          <TabsTrigger value="verifikasi" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Verifikasi Perangkat</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mx-auto grid aspect-[3/4] w-full max-w-60 place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-card">
        {src ? <img src={src} alt={tab === "foto" ? "Foto karyawan" : "Foto verifikasi perangkat"} className="size-full object-cover" /> : <UserRound className="size-24 text-primary/40" strokeWidth={1.25} />}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`photo-${tab}`} className="justify-center">Upload Foto</Label>
        <Input
          id={`photo-${tab}`} key={tab} type="file" accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; set(f ? URL.createObjectURL(f) : undefined) }}
        />
        {src && <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => set(undefined)}>Hapus foto</Button>}
      </div>
    </div>
  )
}

/** Dialog tambah / ubah karyawan (dua kolom: foto di kiri, data di kanan). `employee` null = tambah. */
export function EmployeeFormDialog({
  open, employee, existingPins, nextId, formKey = 0, onClose, onSubmit,
}: {
  open: boolean
  employee: Employee | null
  existingPins: string[]
  nextId: string
  /** Naik tiap "Simpan & Buat Baru" agar formulir direset. */
  formKey?: number
  onClose: () => void
  onSubmit: (values: EmployeeValues & { name: string }, again: boolean) => void
}) {
  const [d, setD] = useState<Draft>(() => blank(nextId))
  const contentRef = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState<string>()
  const [verifyPhoto, setVerifyPhoto] = useState<string>()
  useEffect(() => {
    if (!open) return
    setD(employee ? fromEmployee(employee) : blank(nextId))
    setPhoto(employee?.photo); setVerifyPhoto(employee?.verifyPhoto)
    contentRef.current?.scrollTo({ top: 0 })
  }, [open, employee, nextId, formKey])
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  const fullName = `${d.first.trim()} ${d.last.trim()}`.trim()
  const pinTaken = d.pin.trim() !== "" && existingPins.includes(d.pin.trim()) && d.pin.trim() !== employee?.pin
  const valid = d.office !== "" && d.first.trim() !== "" && d.pin.trim() !== "" && d.nik.trim() !== "" && d.position !== "" && !pinTaken

  const submit = (again: boolean) => {
    if (!valid) return
    const { first: _f, last: _l, verify, ...rest } = d
    onSubmit({
      ...rest, name: fullName, pin: d.pin.trim(), nik: d.nik.trim(),
      deviceName: (d.deviceName.trim() || fullName).slice(0, 15),
      verifyType: verify ? d.verifyType : "", targetDevice: verify ? d.targetDevice : "",
      photo, verifyPhoto,
    }, again)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent ref={contentRef} className="max-h-[92dvh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[21rem_1fr]">
          <aside className="min-w-0 border-b bg-primary-soft/50 p-6 md:border-r md:border-b-0 md:p-8">
            <PhotoPanel photo={photo} verifyPhoto={verifyPhoto} onPhoto={setPhoto} onVerifyPhoto={setVerifyPhoto} />
          </aside>

          <form onSubmit={(e) => { e.preventDefault(); submit(false) }} className="min-w-0 space-y-5 p-6 md:p-8">
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-2xl text-primary">{employee ? "Ubah Karyawan" : "Tambah Karyawan"}</DialogTitle>
              <DialogDescription className="space-y-2 text-sm leading-relaxed">
                <span className="block">Isilah data karyawan baru yang ingin ditambahkan pada kantor ini, karyawan baru otomatis akan tersinkron ke semua perangkat absensi yang ada di kantor ini.</span>
                <span className="block">Selanjutnya daftarkan sidik jari/wajah pada perangkat absensi sesuai ID yang ditambahkan di fingerspot.io.</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Req>Nama Kantor</Req>
              <Select value={d.office} onValueChange={(v) => set("office", v)}>
                <SelectTrigger aria-label="Nama Kantor" className="w-full rounded-xl"><SelectValue placeholder="Pilih kantor" /></SelectTrigger>
                <SelectContent>{employeeOffices.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="emp-first">Nama Depan <span className="text-danger" aria-hidden>*</span></Label><Input id="emp-first" autoFocus placeholder="Isi Nama Depan" value={d.first} onChange={(e) => set("first", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="emp-last">Nama Belakang</Label><Input id="emp-last" placeholder="Isi Nama Belakang" value={d.last} onChange={(e) => set("last", e.target.value)} /></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-device-name">Nama di perangkat absensi</Label>
              <Input id="emp-device-name" maxLength={15} placeholder="Isi nama karyawan yang ditampilkan di perangkat absensi" value={d.deviceName} onChange={(e) => set("deviceName", e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Nama ini akan digunakan di perangkat absensi, panjang nama maksimal 15 karakter ({(d.deviceName || fullName).slice(0, 15).length}/15). Kosongkan isian ini untuk mengisinya otomatis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emp-pin">ID di Perangkat Absensi <span className="text-danger" aria-hidden>*</span></Label>
                <Input id="emp-pin" inputMode="numeric" value={d.pin} aria-invalid={pinTaken} onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))} />
                {pinTaken && <p className="text-xs text-danger">ID sudah dipakai.</p>}
              </div>
              <div className="space-y-2"><Label htmlFor="emp-nik">NIK Karyawan <span className="text-danger" aria-hidden>*</span></Label><Input id="emp-nik" inputMode="numeric" value={d.nik} onChange={(e) => set("nik", e.target.value)} /></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Req>Jabatan Karyawan</Req>
                <Select value={d.position} onValueChange={(v) => set("position", v)}>
                  <SelectTrigger aria-label="Jabatan Karyawan" className="w-full rounded-xl"><SelectValue placeholder="Pilih jabatan" /></SelectTrigger>
                  <SelectContent>{employeePositions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="italic text-muted-foreground">Tanggal Mulai Kerja</Label>
                <DatePicker className="w-full" value={new Date(`${d.startDate}T00:00:00`)} onChange={(v) => set("startDate", v ? format(v, "yyyy-MM-dd") : today())} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-fspin" className="italic text-muted-foreground">PIN fingerspot.io</Label>
              <Input id="emp-fspin" inputMode="numeric" maxLength={6} placeholder="000000" value={d.fsPin} onChange={(e) => set("fsPin", e.target.value.replace(/\D/g, ""))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Req>Jenis Kelamin</Req>
                <RadioGroup value={d.gender} onValueChange={(v) => set("gender", v as Draft["gender"])} className="flex gap-5" aria-label="Jenis Kelamin">
                  {(["Pria", "Wanita"] as const).map((g) => (
                    <div key={g} className="flex items-center gap-2"><RadioGroupItem id={`g-${g}`} value={g} /><Label htmlFor={`g-${g}`} className="font-normal">{g}</Label></div>
                  ))}
                </RadioGroup>
              </div>
              <div className="flex items-start gap-2 sm:pt-6">
                <Checkbox id="emp-qr" className="mt-0.5" checked={d.allowQr} onCheckedChange={(c) => set("allowQr", c === true)} />
                <Label htmlFor="emp-qr" className="block font-normal leading-snug">
                  Izinkan absensi di perangkat absensi dengan Kode QR
                  <Tooltip>
                    <TooltipTrigger asChild><button type="button" aria-label="Info Kode QR" className="ml-1 inline-flex align-middle text-info"><Info className="size-4" /></button></TooltipTrigger>
                    <TooltipContent className="max-w-56">Karyawan dapat absen dengan memindai kode QR di perangkat absensi.</TooltipContent>
                  </Tooltip>
                </Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Tambahkan Verifikasi Ke Perangkat Absensi?</Label>
              <RadioGroup value={d.verify ? "ya" : "tidak"} onValueChange={(v) => set("verify", v === "ya")} className="flex gap-5" aria-label="Tambahkan verifikasi ke perangkat">
                {[["ya", "Ya"], ["tidak", "Tidak"]].map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2"><RadioGroupItem id={`v-${v}`} value={v} /><Label htmlFor={`v-${v}`} className="font-normal">{l}</Label></div>
                ))}
              </RadioGroup>
            </div>

            <div className={cn("space-y-5", !d.verify && "hidden")}>
              <p className="text-xs leading-relaxed text-muted-foreground">Pada perangkat akan tampil halaman registrasi sidik jari/kartu. Silakan daftarkan sidik jari/kartu karyawan pada perangkat absensi tersebut.</p>
              <RadioGroup value={d.verifyType} onValueChange={(v) => set("verifyType", v as Draft["verifyType"])} className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Jenis verifikasi">
                {verifyTypes.map((t) => (
                  <div key={t} className="flex items-center gap-2"><RadioGroupItem id={`t-${t}`} value={t} /><Label htmlFor={`t-${t}`} className="font-normal">{t}</Label></div>
                ))}
              </RadioGroup>
              <div className="space-y-2">
                <Label>Target Perangkat Absensi</Label>
                <Select value={d.targetDevice} onValueChange={(v) => set("targetDevice", v)}>
                  <SelectTrigger aria-label="Target Perangkat Absensi" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{targetDevices.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <Separator />
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
              {!employee && <Button type="button" variant="soft" disabled={!valid} onClick={() => submit(true)}>Simpan &amp; Buat Baru</Button>}
              <Button type="submit" disabled={!valid}>Simpan</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
