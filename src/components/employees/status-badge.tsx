import { Badge } from "@/components/ui/badge"
import type { EmployeeStatus } from "@/data/employees"

const variant = { Aktif: "success", Nonaktif: "muted", Resign: "danger" } as const

export const StatusBadge = ({ status }: { status: EmployeeStatus }) => <Badge variant={variant[status]} dot>{status}</Badge>
