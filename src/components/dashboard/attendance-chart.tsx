import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { attendanceTrend, offices } from "@/data/mock"

const config = Object.fromEntries(
  offices.map((o) => [o.key, { label: o.name, color: o.color }])
) satisfies ChartConfig

/** Grafik performa kehadiran per kantor; ToggleGroup menyalakan/mematikan seri. */
export function AttendanceChart() {
  const [visible, setVisible] = useState<string[]>(offices.map((o) => o.key))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa <span>kehadiran karyawan</span></CardTitle>
        <CardAction>
          <Select defaultValue="2026-10">
            <SelectTrigger size="sm" className="rounded-xl border-0 bg-primary-soft font-semibold text-primary shadow-none" aria-label="Bulan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-10">Oktober 2026</SelectItem>
              <SelectItem value="2026-09">September 2026</SelectItem>
              <SelectItem value="2026-08">Agustus 2026</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart data={attendanceTrend} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {offices.map((o) =>
              visible.includes(o.key) ? (
                <Line key={o.key} type="monotone" dataKey={o.key} stroke={`var(--color-${o.key})`} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: `var(--color-${o.key})` }} />
              ) : null
            )}
          </LineChart>
        </ChartContainer>
        <ToggleGroup type="multiple" size="sm" spacing={2} value={visible} onValueChange={setVisible} className="flex-wrap justify-start">
          {offices.map((o) => (
            <ToggleGroupItem key={o.key} value={o.key} aria-label={o.name} className="gap-2 rounded-full text-xs">
              <span className="size-2 rounded-full" style={{ background: o.color }} /> {o.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
    </Card>
  )
}
