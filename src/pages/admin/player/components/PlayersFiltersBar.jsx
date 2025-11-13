import React, { useMemo } from "react";
import {
  SearchFilter,
  FilterSport,
  FilterTeam,
  FilterSex,
} from "@/components/common/Filters";
import { Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/common/FilterDropdown";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table2, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAcademicInfoForm } from "@/hooks/useAcademicInfo";

const PlayersFiltersBar = ({
  filter,
  setFilter,
  setViewMode,
  viewMode,
  registerPlayer,
}) => {
  // Fetch academic info data
  const { data: allAcademic } = useAcademicInfoForm();
  const { data: coursesForYear } = useAcademicInfoForm(
    filter.year_level ? { year_level: filter.year_level } : undefined,
    { enabled: !!filter.year_level }
  );
  const { data: sectionsForCourse } = useAcademicInfoForm(
    filter.year_level && filter.course
      ? { year_level: filter.year_level, course: filter.course }
      : undefined,
    { enabled: !!filter.year_level && !!filter.course }
  );

  // Generate options from academic data
  const yearOptions = useMemo(() => {
    if (!allAcademic) return [];
    return [...new Set(allAcademic.map((a) => a.year_level))];
  }, [allAcademic]);

  const courseOptions = useMemo(() => {
    if (!coursesForYear) return [];
    return [...new Set(coursesForYear.map((a) => a.course))];
  }, [coursesForYear]);

  const sectionOptions = useMemo(() => {
    if (!sectionsForCourse) return [];
    const sections = [
      ...new Set(sectionsForCourse.map((a) => a.section || "")),
    ];
    return sections.filter((s) => s !== ""); // Filter out empty sections
  }, [sectionsForCourse]);

  const hasActiveFilters =
    filter.search ||
    filter.sport ||
    filter.team ||
    filter.sex ||
    filter.year_level ||
    filter.course ||
    filter.section;

  const clearAllFilters = () => {
    setFilter({
      search: "",
      sex: null,
      sport: null,
      team: null,
      year_level: null,
      course: null,
      section: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const updates = { [filterType]: null };

    // Cascade clearing: if clearing year, also clear course and section
    if (filterType === "year_level") {
      updates.course = null;
      updates.section = null;
    }
    // If clearing course, also clear section
    else if (filterType === "course") {
      updates.section = null;
    }

    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const handleYearChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      year_level: value === "all" ? null : value,
      course: null,
      section: null,
    }));
  };

  const handleCourseChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      course: value === "all" ? null : value,
      section: null,
    }));
  };

  const handleSectionChange = (value) => {
    setFilter((prev) => ({
      ...prev,
      section: value === "all" ? null : value,
    }));
  };

  return (
    <div className=" flex gap-2 items-center">
      {/* Search Filter - Full width on desktop, hidden on small (mobile uses dropdown) */}
      <div className="hidden md:block relative w-full">
        <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
        <SearchFilter
          value={filter.search}
          onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
          className="w-full ps-7"
          placeholder="Search teams..."
          hideLabel={true}
        />
      </div>
      <Button className="flex-1" onClick={registerPlayer}>
        <User />
        Register Player
      </Button>
      {/* Filters dropdown (replaces inert Filters button) */}
      <div className="flex items-center gap-2 ml-auto">
        <FilterDropdown
          title="Filters"
          widthClass="w-72"
          onClear={clearAllFilters}
          disableClear={!hasActiveFilters}
          headerRight={
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <Table2 />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <LayoutGrid />
              </Button>
            </div>
          }
        >
          <DropdownMenuGroup className="block md:hidden px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Search</span>
              <button
                onClick={() => clearSpecificFilter("search")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <div className="relative w-full">
              <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
              <SearchFilter
                value={filter.search}
                onChange={(val) =>
                  setFilter((prev) => ({ ...prev, search: val }))
                }
                className="w-full ps-7"
                placeholder="Search players..."
                hideLabel={true}
              />
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Sport</span>
              <button
                onClick={() => clearSpecificFilter("sport")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <FilterSport
              value={filter.sport}
              onChange={(val) => setFilter((prev) => ({ ...prev, sport: val }))}
              className="w-full"
              hideLabel={true}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Team</span>
              <button
                onClick={() => clearSpecificFilter("team")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <FilterTeam
              value={filter.team}
              onChange={(val) => setFilter((prev) => ({ ...prev, team: val }))}
              className="w-full"
              hideLabel={true}
              sportFilter={filter.sport}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Sex</span>
              <button
                onClick={() => clearSpecificFilter("sex")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <FilterSex
              value={filter.sex}
              onChange={(val) => setFilter((prev) => ({ ...prev, sex: val }))}
              className="w-full"
              hideLabel={true}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Year Level</span>
              <button
                onClick={() => clearSpecificFilter("year_level")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <Select
              value={filter.year_level || "all"}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by year level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Year Levels</SelectItem>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Course</span>
              <button
                onClick={() => clearSpecificFilter("course")}
                className="text-primary cursor-pointer"
                disabled={!filter.year_level}
              >
                Reset
              </button>
            </div>
            <Select
              value={filter.course || "all"}
              onValueChange={handleCourseChange}
              disabled={!filter.year_level}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !filter.year_level
                      ? "Select year level first"
                      : "Filter by course..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseOptions.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Section</span>
              <button
                onClick={() => clearSpecificFilter("section")}
                className="text-primary cursor-pointer"
                disabled={!filter.course}
              >
                Reset
              </button>
            </div>
            <Select
              value={filter.section || "all"}
              onValueChange={handleSectionChange}
              disabled={!filter.course}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !filter.course
                      ? "Select course first"
                      : "Filter by section..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sectionOptions.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-3" />
          </DropdownMenuGroup>
        </FilterDropdown>
      </div>
    </div>
  );
};

export default PlayersFiltersBar;
