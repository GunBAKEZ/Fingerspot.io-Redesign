import { useEffect, useState } from "react"

/** Simulasi loading awal untuk data contoh. Ganti dengan `isLoading` dari query API saat sudah terhubung. */
export function useFakeLoading(ms = 900) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}
