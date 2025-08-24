import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useTeams } from "@/hooks/useTeams";
import { useMemo } from "react";

export const TeamSelect = ({
  name,
  label,
  placeholder = "Select a team",
  teams = [], // Keep for backward compatibility, but will be overridden by API
  excludeTeamId = null,
  value,
  onChange,
  errorMessage,
  disabled = false,
  helperText,
  className = "",
  searchPlaceholder = "Search teams...",
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  
  // Use API-based filtering with debounced search
  const searchFilter = useMemo(() => ({
    search: search.trim(),
  }), [search]);
  
  // Fetch teams from API with search filter
  const { data: teamsData, isLoading } = useTeams(searchFilter, 1, 50, true);
  const apiTeams = teamsData?.results || [];
  
  // Filter out excluded team
  const availableTeams = apiTeams?.filter(
    (team) => String(team.id) !== String(excludeTeamId)
  );
  
  // For displaying selected team, we might need to fetch it separately if not in current results
  const selectedTeam = availableTeams?.find(
    (team) => String(team.id) === String(value)
  );

  
  // Team logo component with fallback
  const TeamLogo = ({ team, size = "w-6 h-6" }) => {
    const [imageError, setImageError] = React.useState(false);
    if (!team.logo || imageError) {
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
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
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
        <PopoverContent className="w-full min-w-[200px] p-0 pointer-events-auto">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading teams..." : "No teams found."}
              </CommandEmpty>
              <CommandGroup>
                {availableTeams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={`${team.name} ${team.sport?.name || ''}`}
                    onSelect={() => {
                      if (onChange) onChange(String(team.id));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        String(value) === String(team.id)
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
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-xs text-left text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
