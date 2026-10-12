import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Tone = "mint" | "lilac" | "peach" | "sky" | "rose" | "cream"
const toneBg: Record<Tone, string> = {
  mint: "bg-tint-mint", lilac: "bg-tint-lilac", peach: "bg-tint-peach",
  sky: "bg-tint-sky", rose: "bg-tint-rose", cream: "bg-tint-cream",
}
const toneIcon: Record<Tone, string> = {
  mint: "bg-success", lilac: "bg-chart-5", peach: "bg-warning",
  sky: "bg-info", rose: "bg-danger", cream: "bg-warning",
}

/** Kartu kuota (Perangkat / GPS / Karyawan) — pastel + ikon solid. */
export function QuotaCard({
  title, icon: Icon, tone, total, used,
}: { title: string; icon: LucideIcon; tone: Tone; total: number; used: number }) {
  const fmt = (n: number) => n.toLocaleString("id-ID")
  return (
    <Card className={cn("gap-4 py-5 shadow-none", toneBg[tone])}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className={cn("grid size-11 place-items-center rounded-xl text-white", toneIcon[tone])}>
            <Icon className="size-5" />
          </span>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item size="sm" className="px-0 py-1">
            <ItemContent><ItemDescription>Kuota</ItemDescription></ItemContent>
            <ItemActions className="font-semibold">{fmt(total)}</ItemActions>
          </Item>
          <Item size="sm" className="px-0 py-1">
            <ItemContent><ItemDescription>Terpakai</ItemDescription></ItemContent>
            <ItemActions className="font-semibold">{fmt(used)}</ItemActions>
          </Item>
        </ItemGroup>
        <Separator className="my-3 bg-foreground/15" />
        <Item size="sm" className="px-0 py-0">
          <ItemContent><ItemTitle>Sisa Kuota</ItemTitle></ItemContent>
          <ItemActions className="text-xl font-extrabold">{fmt(total - used)}</ItemActions>
        </Item>
      </CardContent>
    </Card>
  )
}

/** Kartu hero hijau untuk ringkasan utama. */
export function HeroStatCard({
  label, value, total, rows,
}: { label: string; value: number; total: number; rows: { label: string; value: number; max: number }[] }) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <div>
          <p className="text-sm opacity-70">{label}</p>
          <p className="mt-1 text-3xl font-extrabold">{value}<span className="opacity-50">/{total}</span></p>
        </div>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {rows.map((r) => (
            <Item key={r.label} size="sm" className="gap-2 p-0 text-primary-foreground">
              <ItemContent className="max-w-20 flex-none"><span className="text-xs opacity-80">{r.label}</span></ItemContent>
              <span className="w-6 text-sm font-bold">{r.value}</span>
              <Progress value={(r.value / r.max) * 100} className="h-1.5 flex-1 bg-white/20 [&_[data-slot=progress-indicator]]:bg-white" />
              <span className="w-6 text-right text-sm opacity-50">{r.max}</span>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

export function StatTile({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone: "info" | "danger" | "warning" | "success" }) {
  const dot = { info: "bg-info", danger: "bg-danger", warning: "bg-warning", success: "bg-success" }[tone]
  return (
    <Card className="flex-row items-start gap-3 p-4">
      <span className={cn("mt-1.5 size-2.5 rounded-full", dot)} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-extrabold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  )
}
