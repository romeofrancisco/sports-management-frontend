import React from "react";
import {
  SearchFilter,
  FilterSport,
  FilterDivision,
} from "@/components/common/Filters";
import {
  Search,
  X,
  Volleyball,
  Shield,
  VenusAndMars,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSports } from "@/hooks/useSports";
import { DIVISIONS } from "@/constants/team";
import { Table2, LayoutGrid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const TeamFiltersBar = ({
  filter,
  setFilter,
  setViewMode,
  viewMode,
  createTeam,
}) => {
  const hasActiveFilters = filter.search || filter.sport || filter.division;

  const clearAllFilters = (e) => {
    e.preventDefault();
    setFilter({
      search: "",
      sport: null,
      division: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      sport: null,
      division: null,
    };
    setFilter((prev) => ({ ...prev, [filterType]: defaultValues[filterType] }));
  };

  return (
    <div className="flex items-center gap-2 w-full">
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
      <Button onClick={createTeam}>
        <Users />
        Create Team
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <SlidersHorizontal />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup className="flex items-center justify-between">
            <DropdownMenuLabel>Filter</DropdownMenuLabel>
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="block md:hidden" />
          <DropdownMenuGroup className="px-1 mb-3 block md:hidden">
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
                placeholder="Search teams..."
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
              <span>Division</span>
              <button
                onClick={() => clearSpecificFilter("division")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <FilterDivision
              value={filter.division}
              onChange={(val) =>
                setFilter((prev) => ({ ...prev, division: val }))
              }
              className="w-full"
              hideLabel={true}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="px-1">
            <DropdownMenuItem
              className="justify-center text-sm text-destructive"
              onSelect={clearAllFilters}
              disabled={!hasActiveFilters}
            >
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TeamFiltersBar;
