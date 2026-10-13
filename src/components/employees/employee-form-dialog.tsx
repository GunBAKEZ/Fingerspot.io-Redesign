import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { Eye, EyeOff, Info, TriangleAlert, UserRound } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { employeeOffices, employeePositions, NO_SCHEDULE, positionSchedule, scheduleLabel, schedules, targetDevices, verifyTypes, type Employee, type EmployeeStatus } from "@/data/employees"
import { SupervisorSlots } from "./supervisor-slots"
import { cn } from "@/lib/utils"

export type EmployeeValues = Omit<Employee, "id" | "createdAt" | "updatedAt">
type Draft = { first: string; last: string; verify: boolean; useJobSchedule: boolean } & Omit<EmployeeValues, "name">
const PHOTO_LIMIT = 100 * 1024 // foto verifikasi perangkat maks. 100KB

const today = () => format(new Date(), "yyyy-MM-dd")
const blank = (nextId: string): Draft => ({
  office: "", first: "", last: "", deviceName: "", pin: nextId, nik: nextId, position: "", startDate: today(),
  fsPin: "000000", gender: "Pria", allowQr: false, verify: true, verifyType: "Sidik Jari", targetDevice: targetDevices[0],
  access: "USER", schedule: "", status: "Aktif", devicePassword: "0", supervisors: [], useJobSchedule: false,
})
const fromEmployee = (e: Employee): Draft => {
  const [first, ...rest] = e.name.split(" ")
  const { id: _id, name: _name, createdAt: _c, updatedAt: _u, ...fields } = e
  return { ...fields, first, last: rest.join(" "), verify: e.verifyType !== "", useJobSchedule: false }
}

function Req({ children }: { children: React.ReactNode }) {
  return <Label>{children} <span className="text-danger" aria-hidden>*</span></Label>
}

function PhotoPanel({
  photo, verifyPhoto, onPhoto, onVerifyPhoto, edit, createdAt, updatedAt,
}: { photo?: string; verifyPhoto?: string; onPhoto: (u?: string) => void; onVerifyPhoto: (u?: string) => void; edit: boolean; createdAt?: string; updatedAt?: string }) {
  const [tab, setTab] = useState<"foto" | "verifikasi">("foto")
  const [error, setError] = useState("")
  const src = tab === "foto" ? photo : verifyPhoto
  const set = tab === "foto" ? onPhoto : onVerifyPhoto
  const label = tab === "foto" ? "Foto Karyawan" : "Foto Verifikasi Perangkat"

  const pick = (f?: File, input?: HTMLInputElement) => {
    setError("")
    if (!f) return set(undefined)
    if (tab === "verifikasi" && f.size > PHOTO_LIMIT) {
      setError(`Ukuran foto ${Math.round(f.size / 1024)}KB melebihi batas 100KB.`)
      if (input) input.value = ""
      return
    }
    set(URL.createObjectURL(f))
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setError("") }}>
        <TabsList className="h-auto w-full items-stretch rounded-xl group-data-[orientation=horizontal]/tabs:h-auto">
          <TabsTrigger value="foto" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Karyawan</TabsTrigger>
          <TabsTrigger value="verifikasi" className="h-auto whitespace-normal rounded-lg py-2 text-xs leading-tight sm:text-sm">Foto Verifikasi Perangkat</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "verifikasi" && (
        <Alert role="note" className="border-warning/40 bg-warning/10 text-center">
          <TriangleAlert className="text-warning" />
          <AlertDescription className="text-foreground/80">Foto ini digunakan untuk absensi di perangkat VIDA dan VIVO series. Ukuran foto tidak boleh lebih dari 100KB.</AlertDescription>
        </Alert>
      )}

      <div className="mx-auto grid aspect-[3/4] w-full max-w-60 place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-card">
        {src ? <img src={src} alt={label} className="size-full object-cover" /> : <UserRound className="size-24 text-primary/40" strokeWidth={1.25} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`photo-${tab}`} className="justify-center">{edit ? `Ubah ${label}` : "Upload Foto"}</Label>
        <Input id={`photo-${tab}`} key={tab} type="file" accept="image/*" aria-describedby={error ? "photo-error" : undefined} onChange={(e) => pick(e.target.files?.[0], e.target)} />
        {error && <p id="photo-error" role="alert" className="text-xs text-danger">{error}</p>}
        {src && <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => { set(undefined); setError("") }}>Hapus foto</Button>}
      </div>

      {edit && (
        <dl className="space-y-1.5 text-xs text-muted-foreground">
          <div className="rounded-lg bg-card px-3 py-2"><dt>Tanggal tambah data</dt><dd className="font-medium text-foreground">{createdAt}</dd></div>
          <div className="rounded-lg bg-card px-3 py-2"><dt>Tanggal diperbarui</dt><dd className="font-medium text-foreground">{updatedAt}</dd></div>
        </dl>
      )}
    </div>
  )
}

/** Dialog tambah / ubah karyawan (dua kolom: foto di kiri, data di kanan). `employee` null = tambah. */
export function EmployeeFormDialog({
  open, employee, existingPins, people, nextId, formKey = 0, onClose, onSubmit,
}: {
  open: boolean
  employee: Employee | null
  existingPins: string[]
  /** Semua karyawan (untuk memilih Atasan Lain). */
  people: Employee[]
  nextId: string
  /** Naik tiap "Simpan & Buat Baru" agar formulir direset. */
  formKey?: number
  onClose: () => void
  onSubmit: (values: EmployeeValues, again: boolean) => void
}) {
  const edit = !!employee
  const [d, setD] = useState<Draft>(() => blank(nextId))
  const contentRef = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState<string>()
  const [verifyPhoto, setVerifyPhoto] = useState<string>()
  const [showPin, setShowPin] = useState(false)
  const [changingSchedule, setChangingSchedule] = useState(false)
  useEffect(() => {
    if (!open) return
    setD(employee ? fromEmployee(employee) : blank(nextId))
    setPhoto(employee?.photo); setVerifyPhoto(employee?.verifyPhoto)
    setShowPin(false); setChangingSchedule(false)
    contentRef.current?.scrollTo({ top: 0 })
  }, [open, employee, nextId, formKey])
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  const fullName = `${d.first.trim()} ${d.last.trim()}`.trim()
  const pinTaken = d.pin.trim() !== "" && existingPins.includes(d.pin.trim()) && d.pin.trim() !== employee?.pin
  const valid = d.office !== "" && d.first.trim() !== "" && d.pin.trim() !== "" && d.nik.trim() !== "" && d.position !== "" && !pinTaken
  const jobSchedule = positionSchedule[d.position]
  const scheduleDiffers = edit && !!jobSchedule && d.schedule !== jobSchedule

  const submit = (again: boolean) => {
    if (!valid) return
    const { first: _f, last: _l, verify, useJobSchedule, ...rest } = d
    onSubmit({
      ...rest, name: fullName, pin: d.pin.trim(), nik: d.nik.trim(),
      deviceName: (d.deviceName.trim() || fullName).slice(0, 15),
      schedule: scheduleDiffers && useJobSchedule ? jobSchedule : d.schedule,
      verifyType: verify ? d.verifyType : "", targetDevice: verify ? d.targetDevice : "",
      photo, verifyPhoto,
    }, again)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent ref={contentRef} className="max-h-[92dvh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-5xl">
        <form onSubmit={(e) => { e.preventDefault(); submit(false) }}>
          <div className="grid grid-cols-1 md:grid-cols-[21rem_1fr]">
            <aside className="min-w-0 border-b bg-primary-soft/50 p-6 md:border-r md:border-b-0 md:p-8">
              <PhotoPanel photo={photo} verifyPhoto={verifyPhoto} onPhoto={setPhoto} onVerifyPhoto={setVerifyPhoto} edit={edit} createdAt={employee?.createdAt} updatedAt={employee?.updatedAt} />
            </aside>

            <div className="min-w-0 space-y-5 p-6 md:p-8">
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-2xl text-primary">{edit ? "Ubah Karyawan" : "Tambah Karyawan"}</DialogTitle>
                <DialogDescription className="space-y-2 text-sm leading-relaxed">
                  {edit ? (
                    <span className="block">Mengubah data {employee.name}. Perubahan akan disinkronkan ke perangkat absensi.</span>
                  ) : (<>
                    <span className="block">Isilah data karyawan baru yang ingin ditambahkan pada kantor ini, karyawan baru otomatis akan tersinkron ke semua perangkat absensi yang ada di kantor ini.</span>
                    <span className="block">Selanjutnya daftarkan sidik jari/wajah pada perangkat absensi sesuai ID yang ditambahkan di fingerspot.io.</span>
                  </>)}
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
                  <Input id="emp-pin" inputMode="numeric" value={d.pin} disabled={edit} aria-invalid={pinTaken} onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))} />
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

              {edit && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={d.status} onValueChange={(v) => set("status", v as EmployeeStatus)}>
                      <SelectTrigger aria-label="Status" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{(["Aktif", "Nonaktif", "Resign"] as const).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-devpass">Password untuk perangkat absensi</Label>
                    <Input id="emp-devpass" inputMode="numeric" value={d.devicePassword} onChange={(e) => set("devicePassword", e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="emp-fspin" className="italic text-muted-foreground">
                  PIN fingerspot.io
                  <Tooltip>
                    <TooltipTrigger asChild><button type="button" aria-label="Info PIN fingerspot.io" className="inline-flex text-info"><Info className="size-4" /></button></TooltipTrigger>
                    <TooltipContent className="max-w-56">PIN untuk masuk ke aplikasi fingerspot.io di ponsel.</TooltipContent>
                  </Tooltip>
                </Label>
                <div className="relative">
                  <Input id="emp-fspin" type={edit && !showPin ? "password" : "text"} inputMode="numeric" maxLength={6} placeholder="000000" value={d.fsPin} className={edit ? "pr-11" : undefined} onChange={(e) => set("fsPin", e.target.value.replace(/\D/g, ""))} />
                  {edit && (
                    <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-1/2 -translate-y-1/2" aria-label={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"} onClick={() => setShowPin((v) => !v)}>
                      {showPin ? <EyeOff /> : <Eye />}
                    </Button>
                  )}
                </div>
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

              {/* Hanya saat ubah: jadwal karyawan dan peringatan jadwal jabatan */}
              {edit && (
                <>
                  <Separator />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Jadwal saat ini</p>
                      <p className="font-semibold">{d.schedule ? scheduleLabel(d.schedule) : "N/A"}</p>
                    </div>
                    {changingSchedule ? (
                      <Select value={d.schedule || NO_SCHEDULE} onValueChange={(v) => { set("schedule", v === NO_SCHEDULE ? "" : v); setChangingSchedule(false) }}>
                        <SelectTrigger aria-label="Pilih jadwal" className="w-44 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_SCHEDULE}>Tanpa jadwal (N/A)</SelectItem>
                          {schedules.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Button type="button" size="sm" onClick={() => setChangingSchedule(true)}>Ubah</Button>
                    )}
                  </div>

                  {scheduleDiffers && (
                    <Alert role="note" className="border-warning/40 bg-warning/10">
                      <TriangleAlert className="text-warning" />
                      <AlertTitle>Jadwal Jabatan</AlertTitle>
                      <AlertDescription className="space-y-3 text-foreground/80">
                        <p className="text-sm">{scheduleLabel(jobSchedule)}</p>
                        <p>Jadwal karyawan ini berbeda dengan jadwal jabatan. Apakah Anda ingin mengubah jadwal karyawan agar sesuai dengan jadwal jabatannya?</p>
                        <RadioGroup value={d.useJobSchedule ? "jabatan" : "khusus"} onValueChange={(v) => set("useJobSchedule", v === "jabatan")} aria-label="Pilihan jadwal">
                          <div className="flex items-center gap-2"><RadioGroupItem id="sch-khusus" value="khusus" /><Label htmlFor="sch-khusus" className="font-semibold">Tetap pakai jadwal khusus</Label></div>
                          <div className="flex items-center gap-2"><RadioGroupItem id="sch-jabatan" value="jabatan" /><Label htmlFor="sch-jabatan" className="font-semibold">Ubah ke jadwal jabatan</Label></div>
                        </RadioGroup>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {/* Hanya saat tambah: verifikasi ke perangkat */}
              {!edit && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Hanya saat ubah: Atasan Lain (maks. 3), selebar dialog */}
          {edit && (
            <section className="space-y-4 border-t px-6 py-6 md:px-8" aria-labelledby="atasan-lain">
              <h3 id="atasan-lain" className="text-sm font-bold">Atasan Lain</h3>
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p>Atasan Lain adalah atasan karyawan selain Atasan Kantor dan Atasan Langsung. Setiap karyawan dapat dipilih sampai 3 Atasan Lain. Atasan Kantor adalah staf yang ditunjuk untuk memimpin kantor tertentu. Atasan Langsung ditentukan berdasarkan struktur organisasi.</p>
                <p>Atasan karyawan dapat menerima notifikasi dan melihat riwayat absensi kehadiran karyawan di App fingerspot.io. Jika karyawan melakukan absensi GPS yang berlokasi diluar kantor maka atasan juga dapat menyetujui/menolak absensinya melalui App fingerspot.io di ponsel.</p>
              </div>
              <SupervisorSlots value={d.supervisors} onChange={(ids) => set("supervisors", ids)} people={people} selfId={employee.id} />
            </section>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t px-6 py-4 md:px-8">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            {!edit && <Button type="button" variant="soft" disabled={!valid} onClick={() => submit(true)}>Simpan &amp; Buat Baru</Button>}
            <Button type="submit" disabled={!valid}>Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
