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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export const ControlledDateTimePicker = ({
  name,
  control,
  label,
  placeholder = "Select date and time...",
  helpText = "",
  errors,
  className = "",
  disabled = false,
  rules,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

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
                {field.value ? (
                  format(field.value, "MMM d, yyyy h:mm a")
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      // Preserve the existing time if there is one
                      const newDate = new Date(selectedDate);
                      if (field.value) {
                        newDate.setHours(field.value.getHours());
                        newDate.setMinutes(field.value.getMinutes());
                      }
                      field.onChange(newDate);
                    }
                  }}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {hours.reverse().map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            field.value &&
                            field.value.getHours() % 12 === hour % 12
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => {
                            const newDate = field.value
                              ? new Date(field.value)
                              : new Date();
                            newDate.setHours(
                              (hour % 12) + (newDate.getHours() >= 12 ? 12 : 0)
                            );
                            field.onChange(newDate);
                          }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              field.value && field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              const newDate = field.value
                                ? new Date(field.value)
                                : new Date();
                              newDate.setMinutes(minute);
                              field.onChange(newDate);
                            }}
                          >
                            {minute}
                          </Button>
                        )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex sm:flex-col p-2">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            field.value &&
                            ((ampm === "AM" && field.value.getHours() < 12) ||
                              (ampm === "PM" && field.value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => {
                            const newDate = field.value
                              ? new Date(field.value)
                              : new Date();
                            const currentHours = newDate.getHours();
                            newDate.setHours(
                              ampm === "PM"
                                ? currentHours < 12
                                  ? currentHours + 12
                                  : currentHours
                                : currentHours >= 12
                                ? currentHours - 12
                                : currentHours
                            );
                            field.onChange(newDate);
                          }}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
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
