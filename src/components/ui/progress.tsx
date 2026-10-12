import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export function Progress({
  className, value, indicatorClassName, ...p
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      value={value}
      {...p}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
}
