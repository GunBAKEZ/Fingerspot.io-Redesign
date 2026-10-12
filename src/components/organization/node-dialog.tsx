import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { offices } from "@/lib/org-tree"
import type { NodeAction } from "./org-tree"

const NONE = "__none"
type FormAction = Exclude<NodeAction, { kind: "delete" }>

/** Dialog tambah / ubah node. Mengembalikan nilai lewat `onSubmit`. */
export function NodeDialog({
  action, onClose, onSubmit,
}: {
  action: FormAction | null
  onClose: () => void
  onSubmit: (a: FormAction, values: { name: string; office?: string }) => void
}) {
  const [name, setName] = useState("")
  const [office, setOffice] = useState(NONE)

  useEffect(() => {
    if (!action) return
    if (action.kind === "rename") setName(action.node.name)
    else setName("")
    setOffice(action.kind === "office" ? (action.node.office ?? NONE) : NONE)
  }, [action])

  if (!action) return null
  const needsName = action.kind !== "office"
  const needsOffice = action.kind === "office" || (action.kind === "add" && action.withOffice)
  const typeLabel = action.kind === "add" ? (action.withOffice ? "Kantor" : action.nodeType === "struktur" ? "Struktur" : "Jabatan") : ""
  const title =
    action.kind === "add" ? `Tambah ${typeLabel}` :
    action.kind === "rename" ? (action.node.type === "struktur" ? "Ubah Struktur" : "Ubah Jabatan") :
    action.node.office ? "Ubah Kantor" : "Tambah Kantor"
  const target = action.kind === "add" ? action.parent.name : action.node.name
  const valid = (!needsName || name.trim() !== "") && (!(action.kind === "add" && action.withOffice) || office !== NONE)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    onSubmit(action, { name: name.trim(), office: needsOffice && office !== NONE ? office : undefined })
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{action.kind === "add" ? <>Ditambahkan di bawah <b>{target}</b>.</> : <>Mengubah <b>{target}</b>.</>}</DialogDescription>
          </DialogHeader>

          {needsName && (
            <div className="space-y-2">
              <Label htmlFor="node-name">Nama</Label>
              <Input id="node-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Divisi Keuangan" />
            </div>
          )}
          {needsOffice && (
            <div className="space-y-2">
              <Label htmlFor="node-office">Kantor</Label>
              <Select value={office} onValueChange={setOffice}>
                <SelectTrigger id="node-office" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {action.kind === "office" && <SelectItem value={NONE}>Tanpa kantor</SelectItem>}
                  {action.kind === "add" && <SelectItem value={NONE} disabled>Pilih kantor</SelectItem>}
                  {offices.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={!valid}>Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
