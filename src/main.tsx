import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import Dashboard from "./pages/dashboard"
import DesignSystem from "./pages/design-system"

// Routing hash sederhana: #/design-system menampilkan showcase, selain itu dashboard.
function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return hash === "#/design-system" ? <DesignSystem /> : <Dashboard />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
