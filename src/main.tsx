import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import Dashboard from "./pages/dashboard"
import DesignSystem from "./pages/design-system"

// Routing hash sederhana: #/design-system menampilkan showcase, selain itu dashboard.
const Page = location.hash === "#/design-system" ? DesignSystem : Dashboard

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>
)
