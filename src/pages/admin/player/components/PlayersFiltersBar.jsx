import React from "react";
import {
  SearchFilter,
  FilterSport,
  FilterTeam,
  FilterSex,
  FilterYearLevel,
  FilterCourse,
} from "@/components/common/Filters";
import { Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/common/FilterDropdown";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table2, LayoutGrid } from "lucide-react";

const PlayersFiltersBar = ({
  filter,
  setFilter,
  setViewMode,
  viewMode,
  registerPlayer,
}) => {
  const hasActiveFilters =
    filter.search ||
    filter.sport ||
    filter.team ||
    filter.sex ||
    filter.year_level ||
    filter.course;

  const clearAllFilters = () => {
    setFilter({
      search: "",
      sex: null,
      sport: null,
      team: null,
      year_level: null,
      course: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      sex: null,
      sport: null,
      team: null,
      year_level: null,
      course: null,
    };
    setFilter((prev) => ({ ...prev, [filterType]: defaultValues[filterType] }));
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
          <DropdownMenuGroup className="px-1 mb-3">
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
            <FilterYearLevel
              value={filter.year_level}
              onChange={(val) =>
                setFilter((prev) => ({ ...prev, year_level: val }))
              }
              className="w-full"
              hideLabel={true}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Course</span>
              <button
                onClick={() => clearSpecificFilter("course")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <FilterCourse
              value={filter.course}
              onChange={(val) =>
                setFilter((prev) => ({ ...prev, course: val }))
              }
              className="w-full"
              hideLabel={true}
            />
            <div className="h-3" />
          </DropdownMenuGroup>
        </FilterDropdown>
      </div>
    </div>
  );
};

export default PlayersFiltersBar;
