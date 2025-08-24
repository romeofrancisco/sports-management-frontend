import React from "react";
import { 
  Search, 
  X, 
  Trophy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSports } from "@/hooks/useSports";

/**
 * Enhanced visual filter component for teams matching admin teams style
 */
const EnhancedTeamFilter = ({ filters, onFilterChange }) => {
  const { data: sports } = useSports();
  
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [key]: value
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      sport: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      sport: null,
    };
    handleFilterChange(filterType, defaultValues[filterType]);
  };

  const hasActiveFilters = filters.search || filters.sport;

  // Helper function to get sport name
  const getSportName = () => {
    if (!filters.sport || !sports) return null;
    const sport = sports.find((s) => s.id.toString() === filters.sport);
    return sport?.name || null;
  };

  return (
    <div className="space-y-3">
      {/* Responsive Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-primary/20 rounded-lg">
        {/* Search Filter - Full width on mobile, flex-1 on desktop */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            type="search"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-muted-foreground/60 min-w-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search teams..."
          />
        </div>

        {/* Filter Row - Wraps on mobile, single row on desktop */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-3">
          {/* Sport Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Trophy className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select
              value={filters.sport || "all"}
              onValueChange={(value) => handleFilterChange("sport", value === "all" ? null : value)}
            >
              <SelectTrigger className="min-w-[140px] lg:min-w-[160px] bg-transparent border-muted-foreground/20">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports?.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {filters.search && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Search className="h-3 w-3" />"{filters.search}"
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

          {filters.sport && getSportName() && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Trophy className="h-3 w-3" />
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
        </div>
      )}
    </div>
  );
};

export default EnhancedTeamFilter;
