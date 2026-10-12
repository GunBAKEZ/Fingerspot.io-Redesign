import { useEffect, useState } from "react"

const current = () => location.hash.replace(/^#/, "") || "/"

/** Router hash minimal: `#/pemberitahuan` → "/pemberitahuan". Cocok untuk hosting statis tanpa konfigurasi rewrite. */
export function useHashRoute() {
  const [path, setPath] = useState(current)
  useEffect(() => {
    const on = () => setPath(current())
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return path
}
