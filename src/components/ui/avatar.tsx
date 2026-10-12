import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

export const Avatar = ({ className, ...p }: React.ComponentProps<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-full", className)} {...p} />
)
export const AvatarImage = (p: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image className="size-full object-cover" {...p} />
)
export const AvatarFallback = ({ className, ...p }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cn("flex size-full items-center justify-center bg-primary-soft text-sm font-bold text-primary", className)}
    {...p}
  />
)
