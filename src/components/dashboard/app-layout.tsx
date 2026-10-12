import { AppSidebar, Topbar } from "@/components/dashboard/shell"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

/** Kerangka halaman aplikasi: sidebar + topbar + area konten. */
export function AppLayout({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar-width-icon": "3.5rem" } as React.CSSProperties}>
        <AppSidebar path={path} />
        <SidebarInset className="bg-background">
          <Topbar />
          <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
