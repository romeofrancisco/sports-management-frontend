import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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

// Sport filter component
export const SportFilter = ({ sports, selectedSport, setSelectedSport }) => (
  <Select value={selectedSport} onValueChange={setSelectedSport}>
    <SelectTrigger className="w-full sm:w-[180px]">
      <SelectValue placeholder="Select Sport" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={null}>All Sports</SelectItem>
      {sports?.map((sport) => (
        <SelectItem key={sport.id} value={sport.slug.toString()}>
          {sport.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Team filter component
export const TeamFilter = ({ teams, selectedTeam, setSelectedTeam }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal"
        >
          {"Select team..."}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search teams..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {teams?.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.slug}
                  onSelect={() => {
                    setSelectedTeam(team.slug);
                    setOpen(false);
                  }}
                >
                  {team.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedTeam === team.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Date filter component
export const DateFilter = ({ dateRange, setDateRange }) => (
  <DateRangePicker
    date={dateRange}
    onDateChange={setDateRange}
    className="w-full sm:w-auto"
  />
);

// Player filter component
export const PlayerFilter = ({
  players,
  selectedPlayer,
  setSelectedPlayer,
  isLoading,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal"
        >
          {"Select player..."}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search players..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandGroup>
              {!isLoading &&
                players?.map((player) => (
                  <CommandItem
                    key={player.id}
                    value={player.id?.toString() || ""}
                    onSelect={() => {
                      setSelectedPlayer(player.id?.toString() || "");
                      setOpen(false);
                    }}
                  >
                    {player.full_name}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedPlayer === player.id?.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
