import { Construction } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

/** Placeholder untuk menu yang belum dibangun. */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHeader crumbs={[{ label: title }]}>{title}</PageHeader>
      <Card>
        <Empty className="py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Construction /></EmptyMedia>
            <EmptyTitle>Halaman sedang dibangun</EmptyTitle>
            <EmptyDescription>Bagian “{title}” belum tersedia pada prototipe ini.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    </>
  )
}
