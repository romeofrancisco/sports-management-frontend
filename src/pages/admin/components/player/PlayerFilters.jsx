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
import { SEX } from "@/constants/team";
import { useSports } from "@/hooks/useSports";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const FilterYearLevel = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5 lg:w-[9rem]">
      <Label className="text-xs text-muted-foreground">Year Level</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year Level</SelectLabel>
            <SelectItem className="text-xs" value="all">
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

export const FilterSex = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5 lg:w-[6rem]">
      <Label className="text-xs text-muted-foreground">Sex</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sex</SelectLabel>
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

export const FilterCourse = ({ value, onChange }) => {
  return (
    <div className="grid gap-0.5 max-w-[15rem] min-w-[10rem]">
      <Label className="text-xs text-muted-foreground">Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>All Course</SelectLabel>
            <SelectItem className="text-xs" value="all">
              All Course
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

export const FilterSport = ({ value, onChange }) => {
  const { data: sports } = useSports();

  return (
    <div className="grid gap-0.5 lg:w-[8rem]">
      <Label className="text-xs text-muted-foreground">Sport</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="text-xs w-full" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Player Sport</SelectLabel>
            <SelectItem className="text-xs" value="all">
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

export const SearchFilter = ({ value, onChange }) => {
  const [searchInput, setSearchInput] = useState(value);
  const [debouncedValue] = useDebounce(searchInput, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setSearchInput(value); // sync if value prop changes externally
  }, [value]);

  return (
    <div className="grid gap-0.5 w-full lg:max-w-[20rem] order-2 col-span-2 md:order-2 md:col-span-4 lg:col-span-1 lg:order-none">
      <Label className="text-xs text-muted-foreground">Search Player</Label>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search name..."
        className="text-xs h-8"
      />
    </div>
  );
};
