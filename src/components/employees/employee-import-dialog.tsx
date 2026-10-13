import { useState } from "react"
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { downloadCsv, parseCsv } from "@/lib/csv"
import { templateRows, validateImport, type ImportResult } from "@/lib/employee-csv"
import type { Employee } from "@/data/employees"

/** Impor karyawan dari CSV: pilih file → validasi → ringkasan → impor baris yang valid. */
export function EmployeeImportDialog({
  open, existingPins, onClose, onImport,
}: { open: boolean; existingPins: string[]; onClose: () => void; onImport: (rows: Omit<Employee, "id">[]) => void }) {
  const [fileName, setFileName] = useState("")
  const [result, setResult] = useState<ImportResult | null>(null)

  const close = () => { setFileName(""); setResult(null); onClose() }
  const read = async (file?: File) => {
    if (!file) return
    setFileName(file.name)
    setResult(validateImport(parseCsv(await file.text()), existingPins))
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Impor Karyawan dari CSV</DialogTitle>
          <DialogDescription>Kolom wajib: ID/PIN, Nama, Kantor, Jabatan. Kolom lain (NIK, Hak Akses, Jadwal, Status, Jenis Kelamin, Tanggal Mulai) opsional.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="import-file">File CSV</Label>
          <Input id="import-file" type="file" accept=".csv,text/csv" onChange={(e) => read(e.target.files?.[0])} />
          <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={() => downloadCsv("templat-karyawan.csv", templateRows)}>
            <FileSpreadsheet /> Unduh templat CSV
          </Button>
        </div>

        {result?.fatal && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 p-3 text-sm text-danger"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> {result.fatal}</p>
        )}

        {result && !result.fatal && (
          <div className="space-y-3 text-sm" aria-live="polite">
            <p className="flex items-center gap-2 font-medium"><CheckCircle2 className="size-4 text-success" /> {result.valid.length} baris siap diimpor dari “{fileName}”</p>
            {result.errors.length > 0 && (
              <div className="rounded-xl bg-danger/10 p-3">
                <p className="flex items-center gap-2 font-medium text-danger"><AlertTriangle className="size-4" /> {result.errors.length} baris dilewati</p>
                <ul className="mt-2 max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-xs text-foreground/80">
                  {result.errors.map((e) => <li key={e.row}>Baris {e.row}: {e.message}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={close}>Batal</Button>
          <Button type="button" disabled={!result || result.valid.length === 0} onClick={() => { if (result) { onImport(result.valid); close() } }}>
            <Upload /> Impor {result && result.valid.length > 0 ? `${result.valid.length} karyawan` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
