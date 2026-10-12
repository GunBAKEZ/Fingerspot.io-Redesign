import { useCallback, useEffect, useState } from "react"

type Theme = "light" | "dark"
const KEY = "fingerspot-theme"

function initial(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch { /* storage bisa diblokir */ }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** Tema terang/gelap: kelas `dark` di <html>, disimpan di localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try { localStorage.setItem(KEY, theme) } catch { /* abaikan */ }
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])
  return { theme, toggle }
}
