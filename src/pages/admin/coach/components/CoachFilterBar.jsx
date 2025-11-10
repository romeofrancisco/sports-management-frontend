import {
  SearchFilter,
  FilterSex,
  FilterSport,
} from "@/components/common/Filters";
import React from "react";
import { Search, X, Users2, Volleyball, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSports } from "@/hooks/useSports";
import { SEX } from "@/constants/player";
import FilterDropdown from "@/components/common/FilterDropdown";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table2, LayoutGrid } from "lucide-react";

const CoachFilterBar = ({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  createCoach,
}) => {
  const { data: sports } = useSports();
  const hasActiveFilters = filter.search || filter.sport || filter.sex;

  const clearAllFilters = () => {
    setFilter({
      search: "",
      sport: null,
      sex: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      sport: null,
      sex: null,
    };
    setFilter((prev) => ({ ...prev, [filterType]: defaultValues[filterType] }));
  };

  return (
    <div className="space-y-3">
      {/* Responsive Filter Controls */}
      <div className="flex flex-col-reverse md:flex-row gap-2">
        {/* Search Filter - Full width on mobile, flex-1 on desktop */}
        <div className="relative w-full">
          <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
          <SearchFilter
            value={filter.search}
            onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
            className="w-full ps-7"
            placeholder="Search coaches..."
            hideLabel={true}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={createCoach} className="flex-1">
            <Plus />
            Register Coach
          </Button>

          {/* Filters dropdown for small screens */}
          <div className="flex items-center gap-2">
            <FilterDropdown
              title="Filters"
              widthClass="w-64"
              onClear={clearAllFilters}
              disableClear={!hasActiveFilters}
              headerRight={
                <div className="items-center gap-2 md:hidden flex">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("table")}
                  >
                    <Table2 />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("cards")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              }
            >
              <DropdownMenuGroup className="px-1 mb-3">
                <div className="flex md:hidden justify-between px-1 text-sm my-2">
                  <span>Search</span>
                  <button
                    onClick={() => clearSpecificFilter("search")}
                    className="text-primary cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
                <div className="relative w-full block md:hidden">
                  <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
                  <SearchFilter
                    value={filter.search}
                    onChange={(val) =>
                      setFilter((prev) => ({ ...prev, search: val }))
                    }
                    className="w-full ps-7"
                    placeholder="Search coaches..."
                    hideLabel={true}
                  />
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="block md:hidden" />
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
                  onChange={(sport) =>
                    setFilter((prev) => ({ ...prev, sport }))
                  }
                  className="w-full"
                  hideLabel={true}
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
                  onChange={(sex) => setFilter((prev) => ({ ...prev, sex }))}
                  className="w-full"
                  hideLabel={true}
                />
              </DropdownMenuGroup>
            </FilterDropdown>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <X className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachFilterBar;
