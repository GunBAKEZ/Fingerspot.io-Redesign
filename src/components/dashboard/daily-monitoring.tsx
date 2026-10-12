import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dailyMonitoring } from "@/data/mock"

const config = Object.fromEntries(
  dailyMonitoring.items.map((i) => [i.key, { label: i.label, color: i.color }])
) satisfies ChartConfig

export function DailyMonitoring() {
  const { total, items } = dailyMonitoring
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily <span>monitoring</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative mx-auto size-44">
          <ChartContainer config={config} className="size-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
              <Pie data={items} dataKey="count" nameKey="key" innerRadius={58} outerRadius={80} paddingAngle={3} cornerRadius={6} stroke="none">
                {items.map((i) => <Cell key={i.key} fill={i.color} />)}
              </Pie>
            </PieChart>
          </ChartContainer>
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
        <ItemGroup>
          {items.map((i) => (
            <Item key={i.key} size="sm" className="px-0 py-2">
              <ItemMedia><span className="size-3 rounded-md" style={{ background: i.color }} /></ItemMedia>
              <ItemContent><ItemTitle>{i.label}</ItemTitle></ItemContent>
              <ItemActions className="gap-3">
                <span className="font-bold">{i.count} Karyawan</span>
                <span className="w-14 text-right text-muted-foreground">{((i.count / total) * 100).toFixed(1)}%</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
