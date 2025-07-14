"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export const ControlledDateRangePicker = ({
  name,
  control,
  label,
  placeholder = "Select date range...",
  helpText = "",
  errors,
  className = "",
  disabled = false,
  numberOfMonths = 2,
  rules,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`grid gap-0.5 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      <span className="text-xs text-muted-foreground font-medium">
        {helpText}
      </span>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value?.from ? (
                  field.value.to && field.value.to.getTime() !== field.value.from.getTime() ? (
                    <>
                      {format(field.value.from, "MMM dd, yyyy")} -{" "}
                      {format(field.value.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(field.value.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={field.value?.from}
                selected={field.value}
                onSelect={(dateRange) => {
                  if (dateRange?.from && dateRange?.to && 
                      dateRange.from.getTime() === dateRange.to.getTime()) {
                    // If both dates are the same, only keep the 'from' date
                    field.onChange({ from: dateRange.from, to: null });
                  } else {
                    field.onChange(dateRange);
                  }
                }}
                numberOfMonths={numberOfMonths}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};