import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
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
  return (
    <div className={cn("rounded-2xl p-5", toneBg[tone])}>
      <div className="flex items-center gap-3">
        <span className={cn("grid size-11 place-items-center rounded-xl text-white", toneIcon[tone])}>
          <Icon className="size-5" />
        </span>
        <p className="font-bold">{title}</p>
      </div>
      <dl className="mt-5 space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Kuota</dt><dd className="font-semibold">{total.toLocaleString("id-ID")}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Terpakai</dt><dd className="font-semibold">{used.toLocaleString("id-ID")}</dd></div>
      </dl>
      <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-foreground/15 pt-3">
        <span className="text-sm font-semibold">Sisa Kuota</span>
        <span className="text-xl font-extrabold">{(total - used).toLocaleString("id-ID")}</span>
      </div>
    </div>
  )
}

/** Kartu hero hijau (seperti "Todays shooting") untuk ringkasan utama. */
export function HeroStatCard({
  label, value, total, rows,
}: { label: string; value: number; total: number; rows: { label: string; value: number; max: number }[] }) {
  return (
    <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-card">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}<span className="opacity-50">/{total}</span></p>
      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0 text-xs opacity-80">{r.label}</span>
            <span className="w-6 font-bold">{r.value}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full rounded-full bg-white" style={{ width: `${(r.value / r.max) * 100}%` }} />
            </span>
            <span className="w-6 text-right opacity-50">{r.max}</span>
          </li>
        ))}
      </ul>
    </div>
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
