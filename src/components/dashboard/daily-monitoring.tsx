import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dailyMonitoring } from "@/data/mock"

export function DailyMonitoring() {
  const { total, items } = dailyMonitoring
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily <span>monitoring</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={items} dataKey="count" innerRadius={58} outerRadius={80} paddingAngle={3} cornerRadius={6} stroke="none">
                {items.map((i) => <Cell key={i.key} fill={i.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="text-3xl font-extrabold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Karyawan</p>
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full rounded-xl" aria-label="Kantor"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kantor</SelectItem>
            <SelectItem value="pusat">Kantor Pusat</SelectItem>
            <SelectItem value="jogja">Kantor Jogjakarta</SelectItem>
          </SelectContent>
        </Select>
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-3 text-sm">
              <span className="size-3 rounded-md" style={{ background: i.color }} />
              <span className="flex-1">{i.label}</span>
              <span className="font-bold">{i.count} Karyawan</span>
              <span className="w-14 text-right text-muted-foreground">{((i.count / total) * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
