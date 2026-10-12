import { Fingerprint, MapPin, Users } from "lucide-react"
import { useFakeLoading } from "@/hooks/use-fake-loading"
import { CalendarSkeleton, ChartCardSkeleton, ListCardSkeleton, QuotaSkeleton } from "@/components/dashboard/skeletons"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { CalendarCard } from "@/components/dashboard/calendar-card"
import { DailyMonitoring } from "@/components/dashboard/daily-monitoring"
import { LeaveRequests } from "@/components/dashboard/leave-requests"
import { PagedCard } from "@/components/dashboard/paged-card"
import { AppSidebar, Topbar } from "@/components/dashboard/shell"
import { QuotaCard } from "@/components/dashboard/stat-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { disciplineList, incompleteData } from "@/data/mock"

export default function Dashboard() {
  const loading = useFakeLoading()
  return (
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <Topbar />
          <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6">
            <div>
              <p className="text-xs text-muted-foreground">Demo Account / Dashboard</p>
              <h1 className="text-display font-extrabold">Selamat datang, <span className="font-normal">Demo Admin</span></h1>
            </div>

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
                <QuotaCard title="Absensi GPS via Ponsel" icon={MapPin} tone="mint" total={106} used={87} />
                <QuotaCard title="Karyawan" icon={Users} tone="peach" total={5406} used={369} />
              </CardContent>
            </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {loading ? <><ListCardSkeleton rows={5} /><ListCardSkeleton rows={5} /></> : <>
              <PagedCard
                title="Karyawan" titleRest="indisipliner"
                action={<span className="text-xs text-muted-foreground">Senin, 12 Oktober 2026</span>}
                items={disciplineList}
                render={(e) => (
                  <Item size="sm" className="px-0">
                    <ItemMedia><Avatar><AvatarFallback>{e.name[0].toUpperCase()}</AvatarFallback></Avatar></ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-bold">{e.name}</ItemTitle>
                      <ItemDescription>{e.role}</ItemDescription>
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
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
