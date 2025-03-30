import React from "react";
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
import { Badge } from "@/components/ui/badge";

const MultiSelect = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue) => {
    const newValues = value.includes(currentValue)
      ? value.filter((val) => val !== currentValue)
      : [...value, currentValue];
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10", className)}
        >
          <div className="flex flex-wrap gap-1 overflow-y-auto max-h-32">
            {value.length > 0 ? (
              options
                .filter((option) => value.includes(option.value))
                .map((option) => (
                  <Badge
                    key={option.value}
                    className="rounded-sm px-1 font-medium truncate bg-muted text-accent-foreground"
                    style={{ maxWidth: "200px" }}
                  >
                    {option.label}
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
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
