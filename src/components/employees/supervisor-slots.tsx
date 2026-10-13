import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { initials, type Employee } from "@/data/employees"

const MAX = 3

/** Tiga slot "Atasan Lain": pilih karyawan dari daftar, atau hapus. */
export function SupervisorSlots({ value, onChange, people, selfId }: { value: number[]; onChange: (ids: number[]) => void; people: Employee[]; selfId?: number }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const byId = new Map(people.map((p) => [p.id, p]))
  const candidates = people.filter((p) => p.id !== selfId && !value.includes(p.id) && p.status === "Aktif" && p.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: MAX }, (_, i) => {
        const person = value[i] !== undefined ? byId.get(value[i]) : undefined
        if (person) {
          return (
            <div key={person.id} className="relative flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-4 text-center">
              <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-1" aria-label={`Hapus atasan ${person.name}`} onClick={() => onChange(value.filter((id) => id !== person.id))}><X /></Button>
              <Avatar className="size-12"><AvatarFallback>{initials(person.name)}</AvatarFallback></Avatar>
              <div><p className="text-sm font-semibold">{person.name}</p><p className="text-xs text-muted-foreground">{person.position}</p></div>
            </div>
          )
        }
        const firstEmpty = i === value.length
        return (
          <Popover key={`empty-${i}`} open={firstEmpty && open} onOpenChange={(o) => { setOpen(o); if (!o) setQ("") }}>
            <PopoverTrigger asChild disabled={!firstEmpty}>
              <button type="button" disabled={!firstEmpty} aria-label="Tambah Atasan Karyawan"
                className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-muted/40 p-4 text-sm text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Plus /></span>
                Tambah<br />Atasan Karyawan
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 rounded-2xl p-2">
              <Input autoFocus placeholder="Cari karyawan…" value={q} onChange={(e) => setQ(e.target.value)} className="h-9" />
              <ul className="mt-2 max-h-56 overflow-y-auto">
                {candidates.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted-foreground">Tidak ada karyawan.</li>}
                {candidates.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted" onClick={() => { onChange([...value, p.id]); setOpen(false); setQ("") }}>
                      <Avatar className="size-8"><AvatarFallback className="text-xs">{initials(p.name)}</AvatarFallback></Avatar>
                      <span className="min-w-0"><span className="block truncate text-sm font-medium">{p.name}</span><span className="block truncate text-xs text-muted-foreground">{p.position}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )
      })}
    </div>
  )
}
