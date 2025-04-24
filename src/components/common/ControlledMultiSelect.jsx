import React from "react";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";

const ControlledMultiSelect = ({
  name,
  control,
  label,
  options = [],
  placeholder = "Select...",
  help_text = "",
  errors,
  className = "",
  max = Infinity,
  valueKey = "id",
  labelKey = "name",
  secondaryKey = "",
}) => {
  return (
    <div className={cn("grid gap-0.5", className)}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      <span className="text-muted-foreground text-xs font-medium">
        {help_text}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = field.value || [];

          const handleSelect = (val) => {
            let newValues;
            if (selected.includes(val)) {
              newValues = selected.filter((v) => v !== val);
            } else {
              if (selected.length >= max) return;
              newValues = [...selected, val];
            }
            field.onChange(newValues);
          };

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between h-auto min-h-10")}
                >
                  <div className="flex flex-wrap gap-1 overflow-y-auto max-h-32">
                    {selected.length > 0 ? (
                      options
                        .filter((opt) => selected.includes(opt[valueKey]))
                        .map((opt) => (
                          <Badge
                            key={opt[valueKey]}
                            className="rounded-sm px-1 font-medium truncate bg-muted text-accent-foreground"
                            style={{ maxWidth: "200px" }}
                          >
                            {opt[labelKey]}
                          </Badge>
                        ))
                    ) : (
                      <span className="text-muted-foreground font-normal">
                        {placeholder}
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option[valueKey]}
                          value={option[valueKey]}
                          onSelect={() => handleSelect(option[valueKey])}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selected.includes(option[valueKey])
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="grid">
                            {option[labelKey]}
                            {secondaryKey && (
                              <span className="text-xs text-muted-foreground ">
                                ({option[secondaryKey]})
                              </span>
                            )}
                          </div>
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

export default ControlledMultiSelect;
