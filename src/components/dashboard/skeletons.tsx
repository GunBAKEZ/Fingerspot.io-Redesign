import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const Title = ({ w = "w-56" }: { w?: string }) => <Skeleton className={`h-5 ${w}`} />

export function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader><Title /></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex gap-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-8 w-32 rounded-full" />)}</div>
      </CardContent>
    </Card>
  )
}

export function CalendarSkeleton() {
  return (
    <Card>
      <CardHeader><Title w="w-32" /></CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="mx-auto h-5 w-40" />
        <div className="grid grid-cols-7 gap-2">{Array.from({ length: 35 }, (_, i) => <Skeleton key={i} className="mx-auto size-9 rounded-full" />)}</div>
      </CardContent>
    </Card>
  )
}

export function ListCardSkeleton({ rows = 4, ring = false }: { rows?: number; ring?: boolean }) {
  return (
    <Card>
      <CardHeader><Title /></CardHeader>
      <CardContent className="space-y-4">
        {ring && <Skeleton className="mx-auto size-44 rounded-full" />}
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function QuotaSkeleton() {
  return (
    <Card>
      <CardHeader><Title w="w-64" /></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </CardContent>
    </Card>
  )
}
