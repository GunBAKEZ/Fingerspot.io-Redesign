import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { AppLayout } from "./components/dashboard/app-layout"
import { titleFor } from "./components/dashboard/nav"
import { useHashRoute } from "./hooks/use-hash-route"
import Announcements from "./pages/announcements"
import ComingSoon from "./pages/coming-soon"
import Dashboard from "./pages/dashboard"
import OrganizationStructure from "./pages/organization-structure"
import DesignSystem from "./pages/design-system"

function App() {
  const path = useHashRoute()
  if (path === "/design-system") return <DesignSystem />

  const page =
    path === "/" ? <Dashboard /> :
    path === "/pemberitahuan" ? <Announcements /> :
    path === "/organisasi" || path === "/organisasi/struktur" ? <OrganizationStructure /> :
    <ComingSoon title={titleFor(path) ?? "Halaman tidak ditemukan"} />

  return <AppLayout path={path}>{page}</AppLayout>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
