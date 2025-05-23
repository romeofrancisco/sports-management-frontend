import React from "react";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const ControlledCombobox = ({
  name,
  control,
  label,
  placeholder = "Select an option...",
  help_text = "",
  options = [],
  groupLabel = "",
  errors,
  className = "",
  valueKey = "value",
  labelKey = "label",
  size = "",
  disabled = false,
  searchPlaceholder = "Search...",
}) => {
  return (
    <div className={`grid gap-0.5 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      <span className="text-xs text-muted-foreground font-medium">
        {help_text}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = options.find(
            (opt) => String(opt[valueKey]) === String(field.value)
          );
          const [open, setOpen] = React.useState(false);
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                  size={size}
                  disabled={disabled}
                >
                  {selected ? selected[labelKey] : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[200px] p-0 pointer-events-auto">
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                      {groupLabel && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          {groupLabel}
                        </span>
                      )}
                      {options.map((opt) => (
                        <CommandItem
                          key={String(opt[valueKey])}
                          value={String(opt[valueKey])}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              String(field.value) === String(opt[valueKey])
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {opt[labelKey]}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default ControlledCombobox;
