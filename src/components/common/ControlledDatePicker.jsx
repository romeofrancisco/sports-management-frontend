import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Controller } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverModalContent
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

const ControlledDatePicker = ({ 
  control, 
  name, 
  label, 
  placeholder = "Pick a date", 
  rules = {}, 
  error,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {rules.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                disabled={disabled}
                data-empty={!value}
                className={cn(
                  "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal",
                  error && "border-destructive focus-visible:ring-destructive",
                  className
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverModalContent className="w-auto p-0" align="start">
              <Calendar 
                mode="single" 
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                disabled={disabled}
              />
            </PopoverModalContent>
          </Popover>
        )}
      />
      
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  )
}


export default ControlledDatePicker
