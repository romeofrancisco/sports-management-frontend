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
import { GAME_STATUS, GAME_TYPE_VALUES, GAME_TYPES } from "@/constants/game";
import { useLeagues } from "@/hooks/useLeagues";
import { useSeasons } from "@/hooks/useSeasons";
import { Label } from "@radix-ui/react-dropdown-menu";
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export const FilterType = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[10rem] max-w-full" size="sm">
          <SelectValue />
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

export const FilterStatus = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5 ml-auto">
      <Label className="text-xs text-muted-foreground">Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[10rem] max-w-full" size="sm">
          <SelectValue />
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

export const FilterSeason = ({ value, onChange, league }) => {
  const { data: seasons } = useSeasons(league);

  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Season</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="text-xs min-w-[10rem] max-w-full"
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

export const FilterLeague = ({ value, onChange, type }) => {
  const { data: leagues } = useLeagues();

  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">League</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="text-xs min-w-[10rem] max-w-full"
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

export const FilterDate = ({ value, onChange }) => {
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

  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Date</Label>
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "min-w-[12rem] justify-start text-left font-normal text-xs h-8",
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
