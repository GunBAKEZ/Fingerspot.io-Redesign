import { addDays } from "date-fns"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"

/** Filter rentang tanggal (mulai → selesai + Tampilkan), dipakai di beberapa kartu. */
export function DateRangeFilter({
  from, to, onFromChange, onToChange, onApply, maxDays,
}: {
  from?: Date
  to?: Date
  onFromChange: (d: Date | undefined) => void
  onToChange: (d: Date | undefined) => void
  onApply: () => void
  /** Batas panjang rentang (hari) agar data tidak terlalu besar. */
  maxDays?: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePicker value={from} onChange={onFromChange} placeholder="Tanggal mulai" />
      <ArrowRight className="size-4 text-primary" />
      <DatePicker
        value={to}
        onChange={onToChange}
        placeholder="Tanggal selesai"
        disabled={from ? { before: from, ...(maxDays ? { after: addDays(from, maxDays) } : {}) } : undefined}
      />
      <Button variant="secondary" disabled={!from || !to} onClick={onApply}>Tampilkan</Button>
    </div>
  )
}
