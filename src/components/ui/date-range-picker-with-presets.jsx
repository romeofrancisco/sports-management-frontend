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
}) {  const [date, setDate] = React.useState(value || { from: null, to: null })
  const [selectedPreset, setSelectedPreset] = React.useState("")

  // Handle internal state vs controlled component
  React.useEffect(() => {
    if (value && (value.from !== date.from || value.to !== date.to)) {
      setDate(value)
      // Check if the new value matches any preset
      updateSelectedPreset(value)
    }
  }, [value])

  // Initialize preset on first render
  React.useEffect(() => {
    updateSelectedPreset(date)
  }, []) // Only run on mount
  // Function to determine which preset matches the current date range
  const updateSelectedPreset = (dateRange) => {
    if (!dateRange?.from && !dateRange?.to) {
      setSelectedPreset("overall")
      return
    }
    
    if (!dateRange?.from || !dateRange?.to) {
      setSelectedPreset("")
      return
    }

    const today = new Date()
    const from = new Date(dateRange.from)
    const to = new Date(dateRange.to)
    
    // Normalize times to compare dates only
    today.setHours(23, 59, 59, 999)
    to.setHours(23, 59, 59, 999)
    from.setHours(0, 0, 0, 0)
    
    // Check if 'to' date is today (within 1 day tolerance)
    const isToday = Math.abs(to - today) <= 24 * 60 * 60 * 1000
    
    if (isToday) {
      // Calculate the difference in days from 'from' to today
      const daysDiff = Math.ceil((today - from) / (1000 * 60 * 60 * 24))
      
      // Check if it matches common presets (allowing for some tolerance)
      if (daysDiff >= 28 && daysDiff <= 35) { // ~1 month (28-35 days)
        setSelectedPreset("1month")
      } else if (daysDiff >= 175 && daysDiff <= 190) { // ~6 months (175-190 days)
        setSelectedPreset("6months")
      } else if (daysDiff >= 360 && daysDiff <= 370) { // ~1 year (360-370 days)
        setSelectedPreset("1year")
      } else {
        setSelectedPreset("") // Custom range
      }
    } else {
      setSelectedPreset("") // Custom range - doesn't end at today
    }
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
    updateSelectedPreset(newDate)
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

    setSelectedPreset(preset)
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
        </PopoverTrigger>        <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
          <Select value={selectedPreset} onValueChange={handlePresetSelect}>
            <SelectTrigger>
              <SelectValue placeholder={selectedPreset || "Custom Range"} />
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
