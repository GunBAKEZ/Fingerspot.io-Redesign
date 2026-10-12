import * as React from "react"
import { cn } from "@/lib/utils"

export const Card = ({ className, ...p }: React.ComponentProps<"div">) => (
  <div className={cn("rounded-2xl bg-card text-card-foreground shadow-card", className)} {...p} />
)
export const CardHeader = ({ className, ...p }: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center justify-between gap-4 px-6 pt-6", className)} {...p} />
)
export const CardTitle = ({ className, ...p }: React.ComponentProps<"h3">) => (
  <h3 className={cn("section-title", className)} {...p} />
)
export const CardContent = ({ className, ...p }: React.ComponentProps<"div">) => (
  <div className={cn("p-6", className)} {...p} />
)
