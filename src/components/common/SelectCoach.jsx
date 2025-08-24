import React from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectCoach = ({
  name,
  control,
  label,
  coaches,
  placeholder,
  disabled = false,
  help_text,
  errors,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid gap-1">
      <Label className="text-sm text-left">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedCoach = coaches.find(coach => coach.id === field.value);
          
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full h-12 justify-between"
                  disabled={disabled}
                >
                  {selectedCoach ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={selectedCoach.profile}
                          alt={selectedCoach.full_name}
                        />
                        <AvatarFallback className="text-xs">
                          {selectedCoach.first_name?.[0] || ""}
                          {selectedCoach.last_name?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{selectedCoach.full_name}</span>
                    </div>
                  ) : (
                    placeholder
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search coaches..." />
                  <CommandEmpty>
                    {coaches.length === 0 ? "No coaches available" : "No coach found."}
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {coaches.map((coach) => (
                        <CommandItem
                          key={coach.id}
                          value={coach.full_name}
                          onSelect={() => {
                            // If the coach is already selected, deselect it
                            if (field.value === coach.id) {
                              field.onChange(null);
                            } else {
                              field.onChange(coach.id);
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === coach.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={coach.profile}
                                alt={coach.full_name}
                              />
                              <AvatarFallback className="text-xs">
                                {coach.first_name?.[0] || ""}
                                {coach.last_name?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left flex flex-col">
                              <span className="text-sm font-medium">
                                {coach.full_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {coach.sports && coach.sports.length > 0
                                  ? coach.sports.map((sport) => sport.name).join(", ")
                                  : "No sports assigned"}
                              </span>
                            </div>
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
      {help_text && (
        <p className="text-xs text-muted-foreground">{help_text}</p>
      )}
      {errors?.[name] && (
        <p className="text-xs text-destructive">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SelectCoach;
