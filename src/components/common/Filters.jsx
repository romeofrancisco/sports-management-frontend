import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { YEAR_LEVEL_CHOICES, COURSE_CHOICES } from "@/constants/player";
import { DIVISIONS } from "@/constants/team";
import { SEX } from "@/constants/player";
import { useSports } from "@/hooks/useSports";
import { useAllTeams } from "@/hooks/useTeams";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useLeagues } from "@/hooks/useLeagues";
import { useSeasons } from "@/hooks/useSeasons";
import { GAME_TYPES, GAME_TYPE_VALUES, GAME_STATUS } from "@/constants/game";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { STAT_TYPE } from "@/constants/sport";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const FilterYearLevel = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="All Levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year Level</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Levels
            </SelectItem>
            <SelectSeparator />
            {YEAR_LEVEL_CHOICES.map((year) => (
              <SelectItem
                className="text-xs"
                key={year.value}
                value={year.value}
              >
                {year.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 lg:w-[9rem] ${className}`}>
      <Label className="text-xs text-muted-foreground">Year Level</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue placeholder="Select Year Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year Level</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Levels
            </SelectItem>
            <SelectSeparator />
            {YEAR_LEVEL_CHOICES.map((year) => (
              <SelectItem
                className="text-xs"
                key={year.value}
                value={year.value}
              >
                {year.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterStatType = ({ value, onChange, className = "" }) => {
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Stat Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue placeholder="Select Stat Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>            <SelectLabel>Types</SelectLabel>
            <SelectItem className="text-xs" value="all_stats">
              All Stats
            </SelectItem>
            <SelectSeparator />
            {STAT_TYPE.map((stat) => (
              <SelectItem
                className="text-xs"
                key={stat.value.toString()}
                value={stat.value}
              >
                {stat.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterSex = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="All Sex" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sex</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All
            </SelectItem>
            <SelectSeparator />
            {SEX.map((sex) => (
              <SelectItem className="text-xs" key={sex.value} value={sex.value}>
                {sex.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 lg:w-[7rem] ${className}`}>
      <Label className="text-xs text-muted-foreground">Sex</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue placeholder="Select Sex" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sex</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All
            </SelectItem>
            <SelectSeparator />
            {SEX.map((sex) => (
              <SelectItem className="text-xs" key={sex.value} value={sex.value}>
                {sex.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterCourse = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="All Courses" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Course</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Courses
            </SelectItem>
            <SelectSeparator />
            {COURSE_CHOICES.map((course) => (
              <SelectItem
                className="text-xs"
                key={course.value}
                value={course.value}
              >
                {course.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 max-w-[15rem] min-w-[8rem] ${className}`}>
      <Label className="text-xs text-muted-foreground">Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue placeholder="Select Course" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Course</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Courses
            </SelectItem>
            <SelectSeparator />
            {COURSE_CHOICES.map((course) => (
              <SelectItem
                className="text-xs"
                key={course.value}
                value={course.value}
              >
                {course.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterSport = ({ value, onChange, className = "", hideLabel = false }) => {
  const { data: sports } = useSports();

  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="All Sports" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sport</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Sports
            </SelectItem>
            <SelectSeparator />
            {sports?.map((sport) => (
              <SelectItem className="text-xs" key={sport?.id} value={sport?.id}>
                {sport?.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Sport</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue placeholder="Select Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sport</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Sports
            </SelectItem>
            <SelectSeparator />
            {sports?.map((sport) => (
              <SelectItem className="text-xs" key={sport?.id} value={sport?.id}>
                {sport?.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterTeam = ({ value, onChange, className = "", hideLabel = false, sportFilter = null }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: teams } = useAllTeams(true, sportFilter ? { sport: sportFilter } : {});

  // Filter teams based on search
  const filteredTeams = teams?.filter(team =>
    team?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Find selected team
  const selectedTeam = teams?.find(team => String(team?.id) === String(value));

  // Team logo component with fallback
  const TeamLogo = ({ team, size = "w-4 h-4" }) => {
    const [imageError, setImageError] = useState(false);
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

  if (hideLabel) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`text-xs h-8 justify-between font-normal ${className}`}
          >
            {selectedTeam ? (
              <div className="flex items-center gap-1.5">
                <TeamLogo team={selectedTeam} size="size-4.5" />
                <span className="truncate">{selectedTeam.name}</span>
              </div>
            ) : (
              "All Teams"
            )}
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search teams..."
              value={search}
              onValueChange={setSearch}
              className="text-xs"
            />
            <CommandList>
              <CommandEmpty className="text-xs py-2">No teams found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all-teams"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "h-3 w-3",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Teams
                </CommandItem>
                {filteredTeams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={`${team.name}`}
                    onSelect={() => {
                      onChange(String(team.id));
                      setOpen(false);
                      setSearch("");
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "h-3 w-3",
                        String(value) === String(team.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-1.5">
                      <TeamLogo team={team} size="size-4.5" />
                      <span className="truncate">{team.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Team</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-xs h-8 justify-between font-normal"
          >
            {selectedTeam ? (
              <div className="flex items-center gap-2">
                <TeamLogo team={selectedTeam} />
                <span className="truncate">{selectedTeam.name}</span>
              </div>
            ) : (
              "Select Team"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search teams..."
              value={search}
              onValueChange={setSearch}
              className="text-xs"
            />
            <CommandList>
              <CommandEmpty className="text-xs py-2">No teams found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all-teams"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Teams
                </CommandItem>
                {filteredTeams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={`${team.name}`}
                    onSelect={() => {
                      onChange(String(team.id));
                      setOpen(false);
                      setSearch("");
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        String(value) === String(team.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <TeamLogo team={team} />
                      <span className="truncate">{team.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};


export const FilterDivision = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="All Divisions" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Divisions</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Division
            </SelectItem>
            <SelectSeparator />
            {DIVISIONS.map((division) => (
              <SelectItem
                className="text-xs"
                key={division.value}
                value={division.value}
              >
                {division.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Team's Division</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[8rem] max-w-full" size="sm">
          <SelectValue placeholder="Select Division" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Divisions</SelectLabel>
            <SelectItem className="text-xs" value={null}>
              All Division
            </SelectItem>
            <SelectSeparator />
            {DIVISIONS.map((division) => (
              <SelectItem
                className="text-xs"
                key={division.value}
                value={division.value}
              >
                {division.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const SearchFilter = ({ value, onChange, className = "", placeholder = "Search name...", hideLabel = false }) => {
  const [searchInput, setSearchInput] = useState(value);
  const [debouncedValue] = useDebounce(searchInput, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setSearchInput(value); // sync if value prop changes externally
  }, [value]);

  if (hideLabel) {
    return (
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={placeholder}
        className={`text-xs h-8 ${className}`}
      />
    );
  }

  return (
    <div className={`grid gap-0.5 w-full ${className}`}>
      <Label className="text-xs text-muted-foreground">Search</Label>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={placeholder}
        className="text-xs h-8"
      />
    </div>
  );
};

export const FilterGameType = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="Game Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Game Type</SelectLabel>
            {GAME_TYPES.map((type) => (
              <SelectItem
                className="text-xs"
                key={type.value}
                value={type.value}
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Game Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[8rem] w-full" size="sm">
          <SelectValue placeholder="Select Game Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Game Type</SelectLabel>
            {GAME_TYPES.map((type) => (
              <SelectItem
                className="text-xs"
                key={type.value}
                value={type.value}
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterGameStatus = ({ value, onChange, className = "", hideLabel = false }) => {
  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`text-xs h-8 ${className}`} size="sm">
          <SelectValue placeholder="Game Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Game Status</SelectLabel>
            {GAME_STATUS?.map((status) => (
              <SelectItem
                className="text-xs"
                key={status.value}
                value={status.value}
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[8rem] w-full" size="sm">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Game Status</SelectLabel>
            {GAME_STATUS?.map((status) => (
              <SelectItem
                className="text-xs"
                key={status.value}
                value={status.value}
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterSeason = ({ value, onChange, league, className = "", hideLabel = false }) => {
  const { data: seasons } = useSeasons(league);

  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`text-xs h-8 ${className}`}
          size="sm"
          disabled={!!!league}
        >
          <SelectValue
            placeholder={league ? "Select Season" : "Select League First"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Seasons</SelectLabel>
            {seasons?.map((season) => (
              <SelectItem
                className="text-xs"
                key={season?.id}
                value={season?.id}
              >
                {season.name} {season.year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Season</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="text-xs min-w-[8rem] w-full"
          size="sm"
          disabled={!!!league}
        >
          <SelectValue
            placeholder={league ? "Select Season" : "Select League First"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Seasons</SelectLabel>
            {seasons?.map((season) => (
              <SelectItem
                className="text-xs"
                key={season?.id}
                value={season?.id}
              >
                {season.name} {season.year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterLeague = ({ value, onChange, type, className = "", hideLabel = false }) => {
  const { data: leagues } = useLeagues();

  if (hideLabel) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`text-xs h-8 ${className}`}
          size="sm"
          disabled={type !== GAME_TYPE_VALUES.LEAGUE}
        >
          <SelectValue
            placeholder={
              type !== GAME_TYPE_VALUES.LEAGUE
                ? "Select League Type First"
                : "Select league"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Leagues</SelectLabel>
            {leagues?.map((league) => (
              <SelectItem
                className="text-xs"
                key={league?.id}
                value={league?.id}
              >
                {league.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">League</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="text-xs min-w-[8rem] w-full"
          size="sm"
          disabled={type !== GAME_TYPE_VALUES.LEAGUE}
        >
          <SelectValue
            placeholder={
              type !== GAME_TYPE_VALUES.LEAGUE
                ? "Select League Type First"
                : "Select league"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Leagues</SelectLabel>
            {leagues?.map((league) => (
              <SelectItem
                className="text-xs"
                key={league?.id}
                value={league?.id}
              >
                {league.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterDateRange = ({ value, onChange, className = "", hideLabel = false }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (value?.start_date && value?.end_date) {
      setDate({
        from: new Date(value.start_date),
        to: new Date(value.end_date),
      });
    } else {
      setDate(null);
    }
  }, [value]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      onChange({
        start_date: format(newDate.from, "yyyy-MM-dd"),
        end_date: format(newDate.to, "yyyy-MM-dd"),
      });
    } else {
      onChange({
        start_date: "",
        end_date: "",
      });
    }
  };

  if (hideLabel) {
    return (
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal text-xs h-8",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="me-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={`grid gap-0.5 ${className}`}>
      <Label className="text-xs text-muted-foreground">Date</Label>
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal text-xs h-8",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="me-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
