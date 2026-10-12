import { useSyncExternalStore } from "react"
import { announcements } from "@/data/announcements"

// Status baca dipakai bersama oleh halaman Pemberitahuan dan lencana inbox di Topbar.
let read = new Set(announcements.filter((a) => !a.unread).map((a) => a.id))
const listeners = new Set<() => void>()

export function markRead(ids: number[]) {
  read = new Set([...read, ...ids])
  listeners.forEach((l) => l())
}

export function useReadSet() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => read
  )
}

export function useUnreadCount() {
  const r = useReadSet()
  return announcements.filter((a) => !r.has(a.id)).length
}
