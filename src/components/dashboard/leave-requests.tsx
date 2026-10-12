import { useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { leaveRequests, type LeaveStatus } from "@/data/mock"

const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()

export function LeaveRequests() {
  const [rows, setRows] = useState(leaveRequests)
  const decide = (name: string, status: LeaveStatus) =>
    setRows((r) => r.map((x) => (x.name === name ? { ...x, status } : x)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Karyawan <span>yang mengajukan izin</span></CardTitle>
        <CardAction><Badge variant="danger" dot>Hari ini</Badge></CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="date" aria-label="Tanggal mulai" className="w-44" />
          <ArrowRight className="size-4 text-primary" />
          <Input type="date" aria-label="Tanggal selesai" className="w-44" />
          <Button variant="secondary">Tampilkan</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Karyawan</TableHead>
              <TableHead className="hidden sm:table-cell">Jenis</TableHead>
              <TableHead className="hidden md:table-cell">Tanggal</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{initials(r.name)}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-bold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{r.type}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{r.range}</TableCell>
                <TableCell className="text-right">
                  {r.status === "pending" ? (
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" variant="soft" onClick={() => decide(r.name, "approved")}><Check /> Setujui</Button>
                      <Button size="icon-sm" variant="ghost" aria-label="Tolak" onClick={() => decide(r.name, "rejected")}><X /></Button>
                    </div>
                  ) : (
                    <Badge variant={r.status === "approved" ? "success" : "danger"} dot>
                      {r.status === "approved" ? "Disetujui" : "Ditolak"}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">Menampilkan {rows.length} dari {rows.length} data</p>
      </CardContent>
    </Card>
  )
}
