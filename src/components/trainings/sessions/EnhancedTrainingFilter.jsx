import React from "react";
import { Search, Plus, Table2, LayoutGrid } from "lucide-react";
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
import FilterDropdown from "@/components/common/FilterDropdown";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * Enhanced visual filter component for training sessions matching admin teams style
 */
const EnhancedTrainingFilter = ({
  filters,
  onFilterChange,
  teams = [],
  onNewSession,
  viewMode,
  setViewMode,
}) => {
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
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        if (value && typeof value === "object" && (value.from || value.to)) {
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
    filters.search ||
    filters.team ||
    filters.start_date ||
    filters.end_date ||
    filters.status;

  // Helper function to format date range for display from start_date and end_date
  const formatDateRange = () => {
    if (!filters.start_date && !filters.end_date) return "";

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const fromStr = filters.start_date ? formatDate(filters.start_date) : "";
    const toStr = filters.end_date ? formatDate(filters.end_date) : "";

    if (fromStr && toStr) {
      return `${fromStr} - ${toStr}`;
    } else if (fromStr) {
      return `From ${fromStr}`;
    } else if (toStr) {
      return `Until ${toStr}`;
    }

    return "";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block relative w-full">
        <Search className="size-4 text-muted-foreground absolute top-1/2 left-2 transform -translate-y-1/2" />
        <Input
          type="search"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          placeholder="Search sessions..."
          className="w-full pl-7"
        />
      </div>

      {/* New Session button (optional) */}
      {onNewSession && (
        <Button onClick={onNewSession} variant="default" className="flex-1">
          <Plus />
          New Session
        </Button>
      )}

      <div className="flex items-center gap-2">
        <FilterDropdown
          title="Filters"
          widthClass="w-72"
          onClear={clearAllFilters}
          disableClear={!hasActiveFilters}
          headerRight={
            <div className="md:hidden flex items-center gap-2">
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
              <span>Date</span>
              <button
                onClick={() => clearSpecificFilter("date")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <DateRangePicker
                value={{
                  from: filters.start_date
                    ? new Date(filters.start_date)
                    : undefined,
                  to: filters.end_date ? new Date(filters.end_date) : undefined,
                }}
                onChange={(value) => handleFilterChange("date", value)}
                className="w-full bg-transparent border-muted-foreground/20"
              />
            </div>
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
            <div className="flex items-center gap-1.5">
              <TeamSelect
                placeholder="All Teams"
                value={filters.team || ""}
                onChange={(value) => handleFilterChange("team", value)}
                className="w-full"
              />
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Status</span>
              <button
                onClick={() => clearSpecificFilter("status")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-full bg-transparent border-muted-foreground/20">
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
          </DropdownMenuGroup>
        </FilterDropdown>
      </div>
    </div>
  );
};

export default EnhancedTrainingFilter;
