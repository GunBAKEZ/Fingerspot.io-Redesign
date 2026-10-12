import { useState } from "react"
import { id } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { holidays } from "@/data/mock"

const parse = (k: string) => new Date(`${k}T00:00:00`)
const holidayDates = Object.keys(holidays).map(parse)

export function CalendarCard() {
  const [month, setMonth] = useState(new Date())
  const prefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`
  const monthHolidays = Object.entries(holidays).filter(([k]) => k.startsWith(prefix))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kalender <span>{month.getFullYear()}</span></CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          locale={id}
          weekStartsOn={1}
          month={month}
          onMonthChange={setMonth}
          selected={new Date()}
          showOutsideDays={false}
          modifiers={{ holiday: holidayDates, sunday: { dayOfWeek: [0] } }}
          modifiersClassNames={{ holiday: "text-danger font-bold", sunday: "text-danger" }}
          className="mx-auto p-0 [--cell-size:--spacing(10)]"
        />
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
