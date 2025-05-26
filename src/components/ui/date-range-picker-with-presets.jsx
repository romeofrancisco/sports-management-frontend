import * as React from "react"
import { addDays, subDays, subMonths, subYears, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DateRangePickerWithPresets({ 
  className,
  value,
  onChange,
  placeholder = "Select date range...",
  ...props 
}) {
  const [date, setDate] = React.useState(value || { from: null, to: null })

  // Handle internal state vs controlled component
  React.useEffect(() => {
    if (value && (value.from !== date.from || value.to !== date.to)) {
      setDate(value)
    }
  }, [value])

  const handleDateChange = (newDate) => {
    setDate(newDate)
    if (onChange) {
      onChange(newDate)
    }
  }

  const handlePresetSelect = (preset) => {
    const today = new Date()
    let newRange = { from: null, to: null }

    switch (preset) {
      case "1month":
        newRange = {
          from: subMonths(today, 1),
          to: today
        }
        break
      case "6months":
        newRange = {
          from: subMonths(today, 6),
          to: today
        }
        break
      case "1year":
        newRange = {
          from: subYears(today, 1),
          to: today
        }
        break
      case "overall":
        newRange = {
          from: null,
          to: null
        }
        break
      default:
        break
    }

    handleDateChange(newRange)
  }

  const formatDateRange = () => {
    if (!date?.from) {
      return <span className="text-muted-foreground">{placeholder}</span>
    }

    if (date.from && !date.to) {
      return format(date.from, "MMM dd, yyyy")
    }

    if (date.from && date.to) {
      return `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
    }

    return <span className="text-muted-foreground">{placeholder}</span>
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
          <Select onValueChange={handlePresetSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Quick presets" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="1month">Last 1 Month</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last 1 Year</SelectItem>
              <SelectItem value="overall">Overall (All Time)</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
