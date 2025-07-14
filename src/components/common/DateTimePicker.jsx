"use client"

import * as React from "react"
import { ChevronDownIcon, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateTimePicker({ 
  label, 
  value, 
  onChange, 
  type = "date", 
  help_text = "", 
  error = "",
  placeholder = "",
  id = "",
  className = ""
}) {
  const [open, setOpen] = React.useState(false)
  
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"))
      setOpen(false)
    }
  }

  const handleTimeChange = (e) => {
    onChange(e.target.value)
  }

  if (type === "time") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <Label htmlFor={id} className="text-sm">
            {label}
          </Label>
        )}
        {help_text && (
          <span className="text-xs text-muted-foreground">
            {help_text}
          </span>
        )}
        <Input
          type="time"
          id={id}
          value={value || ""}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          placeholder={placeholder}
        />
        {error && (
          <p className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
      )}
      {help_text && (
        <span className="text-xs text-muted-foreground">
          {help_text}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-between font-normal h-9"
          >
            {value ? new Date(value).toLocaleDateString() : placeholder || "Select date"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
