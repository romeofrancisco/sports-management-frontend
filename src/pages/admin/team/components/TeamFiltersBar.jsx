import React from "react";
import {
  SearchFilter,
  FilterSport,
  FilterDivision,
} from "@/components/common/Filters";
import { Search, X, Volleyball, Shield, VenusAndMars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSports } from "@/hooks/useSports";
import { DIVISIONS } from "@/constants/team";

const TeamFiltersBar = ({ filter, setFilter }) => {
  const { data: sports } = useSports();
  const hasActiveFilters = filter.search || filter.sport || filter.division;

  const clearAllFilters = () => {
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

  // Helper functions to get display names
  const getSportName = () => {
    if (!filter.sport || !sports) return null;
    const sport = sports.find((s) => s.id === parseInt(filter.sport));
    return sport?.name || null;
  };

  const getDivisionName = () => {
    if (!filter.division) return null;
    const division = DIVISIONS.find((d) => d.value === filter.division);
    return division?.label || filter.division;
  };
  return (
    <div className="space-y-3">
      {/* Responsive Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-primary/20 rounded-lg">
        {/* Search Filter - Full width on mobile, flex-1 on desktop */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <SearchFilter
            value={filter.search}
            onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-muted-foreground/60 min-w-0"
            placeholder="Search teams..."
            hideLabel={true}
          />
        </div>

        {/* Filter Row - Wraps on mobile, single row on desktop */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-3">
          {/* Sport Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Volleyball className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterSport
              value={filter.sport}
              onChange={(val) => setFilter((prev) => ({ ...prev, sport: val }))}
              className="min-w-[140px] lg:min-w-[160px]"
              hideLabel={true}
            />
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterDivision
              value={filter.division}
              onChange={(val) =>
                setFilter((prev) => ({ ...prev, division: val }))
              }
              className="min-w-[140px] lg:min-w-[160px]"
              hideLabel={true}
            />
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

      {/* Responsive Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Active filters:
          </span>

          {filter.search && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Search className="h-3 w-3" />"{filter.search}"
              <Button
                onClick={() => clearSpecificFilter("search")}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {filter.sport && getSportName() && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Volleyball className="h-3 w-3" />
              {getSportName()}
              <Button
                onClick={() => clearSpecificFilter("sport")}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {filter.division && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {getDivisionName()}
              <Button
                onClick={() => clearSpecificFilter("division")}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamFiltersBar;
