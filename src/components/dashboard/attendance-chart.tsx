import { useState } from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { attendanceTrend, offices } from "@/data/mock"
import { cn } from "@/lib/utils"

/** Grafik performa kehadiran per kantor; legenda dapat diklik untuk menyalakan/mematikan seri. */
export function AttendanceChart() {
  const [hidden, setHidden] = useState<string[]>([])
  const toggle = (n: string) => setHidden((h) => (h.includes(n) ? h.filter((x) => x !== n) : [...h, n]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa <span>kehadiran karyawan</span></CardTitle>
        <select
          aria-label="Bulan"
          className="h-9 rounded-xl bg-primary-soft px-3 text-sm font-semibold text-primary outline-none"
          defaultValue="2026-10"
        >
          <option value="2026-10">Oktober 2026</option>
          <option value="2026-09">September 2026</option>
          <option value="2026-08">Agustus 2026</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: 0, boxShadow: "var(--shadow-pop)", background: "var(--popover)" }} />
              {offices.map((o) =>
                hidden.includes(o.name) ? null : (
                  <Line key={o.name} type="monotone" dataKey={o.name} stroke={o.color} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: o.color }} />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {offices.map((o) => (
            <button
              key={o.name}
              onClick={() => toggle(o.name)}
              className={cn(
                "flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium transition",
                hidden.includes(o.name) && "opacity-40"
              )}
            >
              <span className="size-2 rounded-full" style={{ background: o.color }} /> {o.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
