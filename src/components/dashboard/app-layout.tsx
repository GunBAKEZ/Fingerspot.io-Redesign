import { BottomNav, MobileTopbar } from "@/components/dashboard/mobile-shell"
import { AppSidebar, Topbar } from "@/components/dashboard/shell"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

/** Kerangka halaman aplikasi. Desktop: sidebar + topbar. Mobile: topbar ringkas + navigasi bawah (tampilan tersendiri). */
export function AppLayout({ path, children }: { path: string; children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="min-h-dvh bg-background">
          <MobileTopbar />
          <main className="w-full min-w-0 space-y-5 p-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</main>
          <BottomNav path={path} />
        </div>
      </TooltipProvider>
    )
  }
  return (
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar-width-icon": "3.5rem" } as React.CSSProperties}>
        <AppSidebar path={path} />
        <SidebarInset className="min-w-0 bg-background">
          <Topbar />
          <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
