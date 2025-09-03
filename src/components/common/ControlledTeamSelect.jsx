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

const ControlledTeamSelect = ({
  name,
  control,
  label,
  placeholder = "Select a team",
  teams = [],
  excludeTeamId = null,
  errors,
  disabled = false,
  helperText,
  className = "",
  rules,
  searchPlaceholder = "Search teams...",
}) => {
  // Filter out excluded team
  const availableTeams = teams.filter(
    (team) => String(team.id) !== String(excludeTeamId)
  );

  // Team logo component with fallback
  const TeamLogo = ({ team, size = "w-6 h-6" }) => {
    const [imageError, setImageError] = React.useState(false);
    
    if (!team.logo || imageError) {
      // Fallback to initials
      const initials = team.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      return (
        <div className={`${size} rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary`}>
          {initials}
        </div>
      );
    }

    return (
      <img
        src={team.logo}
        alt={`${team.name} logo`}
        className={`${size} rounded-full object-cover`}
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className={`grid gap-1 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      
      {helperText && (
        <span className="text-xs text-muted-foreground">
          {helperText}
        </span>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const selectedTeam = availableTeams.find(
            (team) => String(team.id) === String(field.value)
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
                  disabled={disabled || availableTeams.length === 0}
                >
                  {selectedTeam ? (
                    <div className="flex items-center gap-2">
                      <TeamLogo team={selectedTeam} size="w-5 h-5" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{selectedTeam.name}</span>
                        {selectedTeam.sport && (
                          <span className="text-xs text-muted-foreground">
                            {selectedTeam.sport.name}
                          </span>
                        )}
                      </div>
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
                    <CommandEmpty>No teams found.</CommandEmpty>
                    <CommandGroup>
                      {availableTeams.map((team) => (
                        <CommandItem
                          key={team.id}
                          value={`${team.name} ${team.sport?.name || ''}`}
                          onSelect={() => {
                            field.onChange(String(team.id));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              String(field.value) === String(team.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <TeamLogo team={team} size="w-6 h-6" />
                            <div className="flex flex-col items-start">
                              <span className="text-sm">{team.name}</span>
                              {team.sport && (
                                <span className="text-xs text-muted-foreground">
                                  {team.sport.name}
                                </span>
                              )}
                            </div>
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

      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default ControlledTeamSelect;
