import { useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { leaveRequests } from "@/data/mock"

const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()

export function LeaveRequests() {
  const [rows, setRows] = useState(leaveRequests)
  const decide = (name: string, status: "approved" | "rejected") =>
    setRows((r) => r.map((x) => (x.name === name ? { ...x, status } : x)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Karyawan <span>yang mengajukan izin</span></CardTitle>
        <Badge variant="danger" dot>Hari ini</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="date" aria-label="Tanggal mulai" className="w-44" />
          <ArrowRight className="size-4 text-primary" />
          <Input type="date" aria-label="Tanggal selesai" className="w-44" />
          <Button variant="secondary">Tampilkan</Button>
        </div>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada data</p>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.name} className="flex flex-wrap items-center gap-3 py-3">
                <Avatar><AvatarFallback>{initials(r.name)}</AvatarFallback></Avatar>
                <div className="min-w-[9rem] flex-1">
                  <p className="truncate text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role} · {r.type}</p>
                </div>
                <span className="order-last w-full pl-12 text-xs text-muted-foreground sm:order-none sm:w-auto sm:pl-0">{r.range}</span>
                {r.status === "pending" ? (
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="soft" onClick={() => decide(r.name, "approved")}><Check /> Setujui</Button>
                    <Button size="sm" variant="ghost" aria-label="Tolak" onClick={() => decide(r.name, "rejected")}><X /></Button>
                  </div>
                ) : (
                  <Badge variant={r.status === "approved" ? "success" : "danger"} dot>
                    {r.status === "approved" ? "Disetujui" : "Ditolak"}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">Menampilkan {rows.length} dari {rows.length} data</p>
      </CardContent>
    </Card>
  )
}
