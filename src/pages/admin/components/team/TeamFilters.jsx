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
import { Label } from "@/components/ui/label";
import { DIVISIONS } from "@/constants/team";
import { Input } from "@/components/ui/input";
import { useSports } from "@/hooks/useSports";

export const SearchFilter = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5 max-w-[20rem]">
      <Label className="text-xs text-muted-foreground">Search Team</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search team name..."
        className="text-xs h-8"
      />
    </div>
  );
};

export const FilterSport = ({ value, onChange }) => {
  const { data: sports } = useSports();

  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Sport</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[10rem] max-w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Player Sport</SelectLabel>
            <SelectItem className="text-xs" value="all">All Sports</SelectItem>
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

export const FilterDivision = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Team's Division</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs min-w-[10rem] max-w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Divisions</SelectLabel>
            <SelectItem className="text-xs" value="all">All Division</SelectItem>
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
