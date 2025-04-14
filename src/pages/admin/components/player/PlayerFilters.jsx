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
import { useSports } from "@/hooks/useSports";

export const FilterYearLevel = ({value, onChange}) => {
  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Year Level</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="min-w-[10rem] max-w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Year Level</SelectLabel>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectSeparator />
            {YEAR_LEVEL_CHOICES.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterCourse = ({value, onChange}) => {
  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="min-w-[10rem] max-w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>All Course</SelectLabel>
            <SelectItem value="all">All Course</SelectItem>
            <SelectSeparator />
            {COURSE_CHOICES.map((course) => (
              <SelectItem key={course.value} value={course.value}>
                {course.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FilterSport = ({value, onChange}) => {
  const { data: sports } = useSports();

  return (
    <div className="grid gap-0.5">
      <Label className="text-xs text-muted-foreground">Sport</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="min-w-[10rem] max-w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Player Sport</SelectLabel>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectSeparator />
            {sports?.map((sport) => (
              <SelectItem key={sport?.id} value={sport?.id}>
                {sport?.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const SearchFilter = ({value, onChange}) => {
  return (
    <div className="grid gap-0.5 max-w-[20rem]">
      <Label className="text-xs text-muted-foreground">Search</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search name..." />
    </div>
  );
};
