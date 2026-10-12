import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Fingerprint, MapPin, UserCheck, Users } from "lucide-react"
import { useFakeLoading } from "@/hooks/use-fake-loading"
import { CalendarSkeleton, ChartCardSkeleton, ListCardSkeleton, QuotaSkeleton } from "@/components/dashboard/skeletons"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { CalendarCard } from "@/components/dashboard/calendar-card"
import { DailyMonitoring } from "@/components/dashboard/daily-monitoring"
import { LeaveRequests } from "@/components/dashboard/leave-requests"
import { PageHeader } from "@/components/dashboard/page-header"
import { PagedCard } from "@/components/dashboard/paged-card"
import { QuotaCard } from "@/components/dashboard/stat-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { disciplineRange, incompleteData } from "@/data/mock"
import { DateRangeFilter } from "@/components/dashboard/date-range-filter"

export default function Dashboard() {
  const loading = useFakeLoading()
  const [dFrom, setDFrom] = useState<Date | undefined>(new Date())
  const [dTo, setDTo] = useState<Date | undefined>(new Date())
  const [dApplied, setDApplied] = useState({ from: new Date(), to: new Date() })
  return (
    <>
    <PageHeader crumbs={[{ label: "Dashboard" }]}>
      Selamat datang, <span className="font-normal">Demo Admin</span>
    </PageHeader>

    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">{loading ? <ChartCardSkeleton /> : <AttendanceChart />}</div>
      {loading ? <CalendarSkeleton /> : <CalendarCard />}
    </div>

    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">{loading ? <ListCardSkeleton rows={4} /> : <LeaveRequests />}</div>
      {loading ? <ListCardSkeleton rows={4} ring /> : <DailyMonitoring />}
    </div>

    {loading ? <QuotaSkeleton /> : (
    <Card>
      <CardHeader>
        <CardTitle>Detail <span>kuota yang Anda miliki</span></CardTitle>
        <CardAction><Button variant="link" size="sm">Lihat selengkapnya →</Button></CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <QuotaCard title="Perangkat" icon={Fingerprint} tone="lilac" total={51} used={18} />
        <QuotaCard title="Absensi GPS via Ponsel" icon={MapPin} tone="cyan" total={106} used={87} />
        <QuotaCard title="Karyawan" icon={Users} tone="peach" total={5406} used={369} />
      </CardContent>
    </Card>
    )}

    <div className="grid gap-6 lg:grid-cols-2">
      {loading ? <><ListCardSkeleton rows={5} /><ListCardSkeleton rows={5} /></> : <>
      <PagedCard
        title="Karyawan" titleRest="indisipliner"
        toolbar={<DateRangeFilter from={dFrom} to={dTo} onFromChange={setDFrom} onToChange={setDTo} maxDays={30} onApply={() => dFrom && dTo && setDApplied({ from: dFrom, to: dTo })} />}
        items={disciplineRange(dApplied.from, dApplied.to)}
        empty={
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon"><UserCheck /></EmptyMedia>
              <EmptyTitle>Tidak ada karyawan indisipliner</EmptyTitle>
              <EmptyDescription>Semua karyawan disiplin pada rentang ini, atau rentangnya hanya berisi hari libur.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
        render={(e) => (
          <Item size="sm" className="px-0">
            <ItemMedia><Avatar><AvatarFallback>{e.name[0].toUpperCase()}</AvatarFallback></Avatar></ItemMedia>
            <ItemContent>
              <ItemTitle className="font-bold">{e.name}</ItemTitle>
              <ItemDescription>{e.role} · {format(e.date, "d MMM yyyy", { locale: id })}</ItemDescription>
            </ItemContent>
            <ItemActions><Badge variant={e.status === "Alpha" ? "danger" : "warning"} dot>{e.status}</Badge></ItemActions>
          </Item>
        )}
      />
      <PagedCard
        title="Data karyawan" titleRest="yang belum lengkap"
        action={<Button variant="link" size="sm">Lihat semua →</Button>}
        items={incompleteData}
        render={(e) => (
          <Item size="sm" className="flex-col items-stretch gap-2 px-0">
            <div className="flex justify-between text-sm">
              <ItemTitle>{e.name}</ItemTitle>
              <span className="font-bold">{e.percent}%</span>
            </div>
            <Progress value={e.percent} />
          </Item>
        )}
      />
      </>}
    </div>
    </>
  )
}
