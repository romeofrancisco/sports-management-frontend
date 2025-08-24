import React from "react";
import { Search, X, Users, Calendar, Filter } from "lucide-react";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TeamSelect } from "@/components/common/TeamSelect";
import { useTeamDetails } from "@/hooks/useTeams";

/**
 * Enhanced visual filter component for training sessions matching admin teams style
 */
const EnhancedTrainingFilter = ({ filters, onFilterChange, teams = [] }) => {
  // Fetch selected team details for better display
  const { data: selectedTeam } = useTeamDetails(filters.team, {
    enabled: !!filters.team,
  });

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      // Handle date range specially
      if (key === "date") {
        const newFilters = { ...filters };
        
        // Helper function to format date without timezone conversion
        const formatDateSafe = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        if (value && typeof value === 'object' && (value.from || value.to)) {
          // DateRangePicker returns {from: Date, to: Date}
          if (value.from) {
            newFilters.start_date = formatDateSafe(value.from);
          } else {
            delete newFilters.start_date;
          }
          
          // Only set end_date if it's different from start_date or if there's no start_date
          if (value.to) {
            const endDateStr = formatDateSafe(value.to);
            const startDateStr = value.from ? formatDateSafe(value.from) : null;
            
            // Only set end_date if it's different from start_date
            if (endDateStr !== startDateStr) {
              newFilters.end_date = endDateStr;
            } else {
              // If they're the same, don't set end_date (single date selection)
              delete newFilters.end_date;
            }
          } else {
            delete newFilters.end_date;
          }
        } else {
          // Clear date filters
          delete newFilters.start_date;
          delete newFilters.end_date;
        }
        
        onFilterChange(newFilters);
      } else {
        onFilterChange({
          ...filters,
          [key]: value,
        });
      }
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      team: null,
      start_date: null,
      end_date: null,
      status: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      team: null,
      status: null,
    };
    
    if (filterType === "date") {
      // Clear both date fields when clearing date filter
      onFilterChange({
        ...filters,
        start_date: null,
        end_date: null,
      });
    } else {
      onFilterChange({
        ...filters,
        [filterType]: defaultValues[filterType],
      });
    }
  };

  const hasActiveFilters =
    filters.search || filters.team || filters.start_date || filters.end_date || filters.status;

  // Helper function to format date range for display from start_date and end_date
  const formatDateRange = () => {
    if (!filters.start_date && !filters.end_date) return '';
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    const fromStr = filters.start_date ? formatDate(filters.start_date) : '';
    const toStr = filters.end_date ? formatDate(filters.end_date) : '';
    
    if (fromStr && toStr) {
      return `${fromStr} - ${toStr}`;
    } else if (fromStr) {
      return `From ${fromStr}`;
    } else if (toStr) {
      return `Until ${toStr}`;
    }
    
    return '';
  };

  // Helper function to get team name - now using API to fetch team details
  const getTeamName = () => {
    if (!filters.team) return null;
    return selectedTeam?.name || `Team ${filters.team}`;
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
            placeholder="Search sessions..."
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <DateRangePicker
            value={{
              from: filters.start_date ? new Date(filters.start_date) : undefined,
              to: filters.end_date ? new Date(filters.end_date) : undefined,
            }}
            onChange={(value) => handleFilterChange("date", value)}
            showIcon={false}
            className="min-w-[140px] lg:min-w-[160px] bg-transparent border-muted-foreground/20"
          />
        </div>

        {/* Filter Row - Wraps on mobile, single row on desktop */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-3">
          {/* Team Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <TeamSelect
              placeholder="All Teams"
              value={filters.team || ""}
              onChange={(value) => handleFilterChange("team", value)}
              className="min-w-[140px] lg:min-w-[160px]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                handleFilterChange("status", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="min-w-[140px] lg:min-w-[160px] bg-transparent border-muted-foreground/20">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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

          {filters.team && getTeamName() && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Users className="h-3 w-3" />
              {getTeamName()}
              <Button
                onClick={() => clearSpecificFilter("team")}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {(filters.start_date || filters.end_date) && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              {formatDateRange()}
              <Button
                onClick={() => clearSpecificFilter("date")}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {filters.status && (
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1"
            >
              <Filter className="h-3 w-3" />
              {filters.status}
              <Button
                onClick={() => clearSpecificFilter("status")}
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

export default EnhancedTrainingFilter;
