import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Fingerprint, MapPin, Moon, Sun, Users } from "lucide-react"
import { HeroStatCard, QuotaCard, StatTile } from "@/components/dashboard/stat-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { DatePicker } from "@/components/ui/date-picker"
import { Progress } from "@/components/ui/progress"

const colors = [
  ["primary", "bg-primary", "cyan-700", "Aksi utama, state aktif"],
  ["primary-soft", "bg-primary-soft", "#E3F6FA", "Hover / item nav aktif"],
  ["foreground", "bg-foreground", "#1B2559", "Teks & judul (navy)"],
  ["background", "bg-background border", "#F6F7FB", "Kanvas halaman"],
  ["card", "bg-card border", "#FFFFFF", "Permukaan kartu"],
  ["muted-foreground", "bg-muted-foreground", "#8790AD", "Teks sekunder"],
  ["info", "bg-info", "#3B5BDB", "Tepat waktu"],
  ["success", "bg-success", "#1F9D6B", "Hadir / Izin"],
  ["warning", "bg-warning", "#F59F00", "Terlambat"],
  ["danger", "bg-danger", "#E5484D", "Tidak hadir / Alpha"],
] as const

const tints = ["cyan", "lilac", "peach", "sky", "rose", "cream"] as const
const tintBg = { cyan: "bg-tint-cyan", lilac: "bg-tint-lilac", peach: "bg-tint-peach", sky: "bg-tint-sky", rose: "bg-tint-rose", cream: "bg-tint-cream" }

const trend = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map((w, i) => ({
  w, hadir: [72, 91, 84, 88][i], terlambat: [10, 6, 12, 7][i],
}))

const trendConfig = {
  hadir: { label: "Hadir", color: "var(--chart-3)" },
  terlambat: { label: "Terlambat", color: "var(--chart-1)" },
} satisfies ChartConfig

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export default function DesignSystem() {
  const [dark, setDark] = useState(false)
  const toggle = () => { document.documentElement.classList.toggle("dark"); setDark((d) => !d) }

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Badge>v0.1 · React + Tailwind + shadcn</Badge>
          <h1 className="mt-3 text-display font-extrabold">Fingerspot Design System</h1>
          <p className="mt-1 max-w-xl text-muted-foreground">
            Bahasa visual baru untuk dashboard fingerspot.io: bersih, ramah, kartu putih lembut di atas kanvas abu-biru,
            dengan satu warna aksi (cyan) dan warna status yang konsisten.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={toggle} aria-label="Ganti tema">
          {dark ? <Sun /> : <Moon />}
        </Button>
      </header>

      <Section title="Warna" hint="Semua token ada di src/index.css dan otomatis tersedia sebagai utility Tailwind (bg-primary, text-danger, …).">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {colors.map(([name, cls, hex, use]) => (
            <Card key={name} className="p-3">
              <div className={`h-16 rounded-xl ${cls}`} />
              <p className="mt-3 text-sm font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{hex}</p>
              <p className="mt-1 text-xs">{use}</p>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {tints.map((t) => (
            <div key={t} className={`rounded-2xl p-4 text-sm font-semibold ${tintBg[t]}`}>tint-{t}</div>
          ))}
        </div>
      </Section>

      <Section title="Tipografi" hint="Plus Jakarta Sans — humanis, terbaca di tabel padat. Judul bagian: kata pertama bold, sisanya regular.">
        <Card className="gap-3 p-6">
          <p className="text-display font-extrabold">Display 28 / ExtraBold</p>
          <p className="section-title">Performa <span>kehadiran</span> (Section title 18)</p>
          <p className="text-base">Body 16 — Teks isi untuk paragraf dan deskripsi.</p>
          <p className="text-sm">Body 14 — Default untuk tabel, form, dan menu.</p>
          <p className="text-xs text-muted-foreground">Caption 12 — Label, hint, metadata.</p>
        </Card>
      </Section>

      <Section title="Bentuk & kedalaman" hint="Radius 16px (kartu), 12px (kontrol), pill (badge). Tanpa border tebal — pisahkan dengan shadow lembut.">
        <div className="grid grid-cols-3 gap-4">
          <div className="grid h-24 place-items-center rounded-2xl bg-card text-sm shadow-card">rounded-2xl + shadow-card</div>
          <div className="grid h-24 place-items-center rounded-xl bg-card text-sm shadow-card">rounded-xl</div>
          <div className="grid h-24 place-items-center rounded-2xl bg-card text-sm shadow-pop">shadow-pop (overlay)</div>
        </div>
      </Section>

      <Section title="Komponen">
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Tampilkan</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Hapus</Button>
              <Button size="sm">Small</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info" dot>Tepat Waktu</Badge>
              <Badge variant="warning" dot>Terlambat</Badge>
              <Badge variant="danger" dot>Alpha</Badge>
              <Badge variant="success" dot>Izin</Badge>
              <Badge variant="muted">Draft</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DatePicker placeholder="Pilih tanggal mulai" className="w-full" />
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>MH</AvatarFallback></Avatar>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-xs"><span>Kelengkapan data</span><span className="font-bold">50%</span></div>
                  <Progress value={50} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Preview dashboard" hint="Contoh penerapan kartu & grafik. Dashboard lengkap dengan sidebar shadcn ada di halaman utama.">
        <div className="space-y-6 rounded-3xl bg-background p-6 ring-1 ring-border">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatTile tone="info" label="Tepat Waktu" value="0 Karyawan" hint="0%" />
                  <StatTile tone="danger" label="Tidak Hadir" value="156 Karyawan" hint="102,63%" />
                  <StatTile tone="warning" label="Terlambat" value="0 Karyawan" hint="0%" />
                  <StatTile tone="success" label="Izin" value="0 Karyawan" hint="0%" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Performa <span>kehadiran</span></CardTitle>
                      <CardAction><Button size="sm" variant="soft">Oktober 2026</Button></CardAction>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={trendConfig} className="h-64 w-full">
                        <AreaChart data={trend} margin={{ left: -16 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="w" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis tickLine={false} axisLine={false} unit="%" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="hadir" stroke="var(--color-hadir)" fill="var(--color-hadir)" fillOpacity={0.12} strokeWidth={2} />
                          <Area type="monotone" dataKey="terlambat" stroke="var(--color-terlambat)" fill="var(--color-terlambat)" fillOpacity={0.12} strokeWidth={2} />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <HeroStatCard
                    label="Total karyawan hadir hari ini" value={152} total={156}
                    rows={[
                      { label: "Tepat waktu", value: 120, max: 156 },
                      { label: "Terlambat", value: 22, max: 156 },
                      { label: "Izin", value: 10, max: 156 },
                      { label: "Alpha", value: 4, max: 156 },
                    ]}
                  />
                </div>

                <div>
                  <h3 className="section-title mb-4">Detail <span>kuota Anda</span></h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <QuotaCard title="Perangkat" icon={Fingerprint} tone="lilac" total={51} used={18} />
                    <QuotaCard title="Absensi GPS via Ponsel" icon={MapPin} tone="cyan" total={106} used={87} />
                    <QuotaCard title="Karyawan" icon={Users} tone="peach" total={5406} used={369} />
                  </div>
                </div>
              </div>
        <Button asChild variant="soft"><a href="#/">Buka dashboard lengkap →</a></Button>
      </Section>
    </div>
  )
}
