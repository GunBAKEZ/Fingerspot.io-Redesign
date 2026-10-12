import { Fragment } from "react"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type Crumb = { label: string; href?: string }

/** Header halaman: breadcrumb shadcn + judul. Item terakhir = halaman aktif. Breadcrumb hanya tampil jika ada halaman induk (lebih dari 1 item). */
export function PageHeader({ crumbs, children }: { crumbs: Crumb[]; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {crumbs.length > 1 && (
      <Breadcrumb>
        <BreadcrumbList className="text-xs sm:gap-2">
          {crumbs.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i === crumbs.length - 1 ? (
                  <BreadcrumbPage className="font-semibold">{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={c.href ?? "#/"} className="hover:text-primary">{c.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      )}
      <h1 className="text-display font-extrabold">{children}</h1>
    </div>
  )
}
