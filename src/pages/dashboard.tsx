import { Fingerprint, MapPin, Users } from "lucide-react"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { CalendarCard } from "@/components/dashboard/calendar-card"
import { DailyMonitoring } from "@/components/dashboard/daily-monitoring"
import { LeaveRequests } from "@/components/dashboard/leave-requests"
import { PagedCard } from "@/components/dashboard/paged-card"
import { Sidebar, Topbar } from "@/components/dashboard/shell"
import { QuotaCard } from "@/components/dashboard/stat-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { disciplineList, incompleteData } from "@/data/mock"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6">
          <div>
            <p className="text-xs text-muted-foreground">Demo Account / Dashboard</p>
            <h1 className="text-display font-extrabold">Selamat datang, <span className="font-normal">Demo Admin</span></h1>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2"><AttendanceChart /></div>
            <CalendarCard />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2"><LeaveRequests /></div>
            <DailyMonitoring />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detail <span>kuota yang Anda miliki</span></CardTitle>
              <Button variant="link" size="sm" className="text-primary">Lihat selengkapnya →</Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <QuotaCard title="Perangkat" icon={Fingerprint} tone="lilac" total={51} used={18} />
              <QuotaCard title="Absensi GPS via Ponsel" icon={MapPin} tone="mint" total={106} used={87} />
              <QuotaCard title="Karyawan" icon={Users} tone="peach" total={5406} used={369} />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <PagedCard
              title="Karyawan" titleRest="indisipliner"
              action={<span className="text-xs text-muted-foreground">Senin, 12 Oktober 2026</span>}
              items={disciplineList}
              render={(e) => (
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>{e.name[0].toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.role}</p>
                  </div>
                  <Badge variant={e.status === "Alpha" ? "danger" : "warning"} dot>{e.status}</Badge>
                </div>
              )}
            />
            <PagedCard
              title="Data karyawan" titleRest="yang belum lengkap"
              action={<Button variant="link" size="sm" className="text-primary">Lihat semua →</Button>}
              items={incompleteData}
              render={(e) => (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{e.name}</span>
                    <span className="font-bold">{e.percent}%</span>
                  </div>
                  <Progress value={e.percent} />
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
