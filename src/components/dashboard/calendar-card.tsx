import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { holidays } from "@/data/mock"
import { cn } from "@/lib/utils"

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
const key = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

export function CalendarCard() {
  const today = new Date()
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const first = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7 // Senin = 0
  const total = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]
  const move = (n: number) => setCursor(({ y, m }) => {
    const d = new Date(y, m + n, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const monthHolidays = Object.entries(holidays).filter(([k]) => k.startsWith(key(cursor.y, cursor.m, 1).slice(0, 7)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kalender <span>{cursor.y}</span></CardTitle>
        <div className="flex items-center gap-1">
          <button onClick={() => move(-1)} aria-label="Bulan sebelumnya" className="grid size-8 place-items-center rounded-lg hover:bg-muted"><ChevronLeft className="size-4" /></button>
          <span className="w-24 text-center text-sm font-semibold">{MONTHS[cursor.m]}</span>
          <button onClick={() => move(1)} aria-label="Bulan berikutnya" className="grid size-8 place-items-center rounded-lg hover:bg-muted"><ChevronRight className="size-4" /></button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
          {DAYS.map((d, i) => (
            <span key={d} className={cn("pb-2 text-xs font-bold", i === 6 ? "text-danger" : "text-muted-foreground")}>{d}</span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={i} />
            const isToday = d === today.getDate() && cursor.m === today.getMonth() && cursor.y === today.getFullYear()
            const holiday = holidays[key(cursor.y, cursor.m, d)]
            const sunday = i % 7 === 6
            return (
              <span key={i} className="grid place-items-center py-0.5">
                <span
                  title={holiday}
                  className={cn(
                    "relative grid size-9 place-items-center rounded-full font-medium",
                    (sunday || holiday) && "text-danger",
                    isToday && "bg-primary font-bold text-primary-foreground"
                  )}
                >
                  {d}
                  {holiday && !isToday && <span className="absolute bottom-1 size-1 rounded-full bg-danger" />}
                </span>
              </span>
            )
          })}
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="text-xs font-bold">Keterangan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {monthHolidays.length ? monthHolidays.map(([k, v]) => `${Number(k.slice(8))} — ${v}`).join(", ") : "Tidak ada hari libur"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
