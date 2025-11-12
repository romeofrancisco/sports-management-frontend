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
  PopoverModalContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Helper function to get nested error
const getNestedError = (errors, path) => {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, errors);
};

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
  secondaryLabel = "",
  size = "",
  disabled = false,
  searchPlaceholder = "Search...",
  rules = {},
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
        rules={rules}
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
                  {selected ? (
                    <div className="grid text-start w-full">
                      <span className="truncate overflow-hidden whitespace-nowrap w-full block">
                        {selected[labelKey]}
                      </span>
                      {selected[secondaryLabel] && (
                        <span className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap w-full block">
                          {selected[secondaryLabel]}
                        </span>
                      )}
                    </div>
                  ) : (
                    placeholder
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverModalContent className="w-full min-w-[200px] p-0 pointer-events-auto">
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
                          // Use the label as the searchable value so typing matches the option name
                          value={String(opt[labelKey])}
                          onSelect={(currentValue) => {
                            // `currentValue` will be the label (because we used label as value).
                            // Find the option by label and pass its id/value to the form field.
                            const selectedOpt = options.find(
                              (o) => String(o[labelKey]) === String(currentValue)
                            );
                            if (selectedOpt) {
                              field.onChange(selectedOpt[valueKey]);
                            } else {
                              // Fallback: pass the raw currentValue
                              field.onChange(currentValue);
                            }
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
                          <div className="grid text-start">
                            <span className="truncate overflow-hidden whitespace-nowrap w-full block">
                              {opt[labelKey]}
                            </span>
                            {opt[secondaryLabel] && (
                              <span className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap w-full block">
                                {opt[secondaryLabel]}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverModalContent>
            </Popover>
          );
        }}
      />
      {(() => {
        const fieldError = getNestedError(errors, name);
        return fieldError && (
          <p className="text-xs text-left text-destructive">
            {fieldError.message}
          </p>
        );
      })()}
    </div>
  );
};

export default ControlledCombobox;
