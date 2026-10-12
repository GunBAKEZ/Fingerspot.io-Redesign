import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/** Date picker shadcn (Popover + Calendar), lokal Indonesia. */
export function DatePicker({
  value, onChange, placeholder = "Pilih tanggal", className, disabled,
}: {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: React.ComponentProps<typeof Calendar>["disabled"]
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-44 justify-start font-normal data-[empty=true]:text-muted-foreground", className)}
          data-empty={!value}
        >
          <CalendarIcon />
          {value ? format(value, "d MMM yyyy", { locale: id }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-2xl p-0" align="start">
        <Calendar
          mode="single"
          locale={id}
          weekStartsOn={1}
          selected={value}
          disabled={disabled}
          onSelect={(d) => { onChange?.(d); setOpen(false) }}
          defaultMonth={value}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
