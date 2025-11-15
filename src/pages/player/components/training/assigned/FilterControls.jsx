import React, { useState, useEffect } from "react";
import { Table2, LayoutGrid, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/common/FilterDropdown";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const FilterControls = ({
  statusFilter,
  viewMode,
  onStatusFilterChange,
  onViewModeChange,
  dateRange,
  onDateRangeChange,
  search,
  onSearchChange,
}) => {
  // Debounced search state
  const [searchValue, setSearchValue] = useState(search || "");
  useEffect(() => {
    setSearchValue(search || "");
  }, [search]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearchChange) onSearchChange(searchValue);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue, onSearchChange]);

  return (
    <>
      {/* Single line layout for medium+ screens, stacked for small screens */}
      <div className="flex items-center gap-2">
        {/* Filters inside a dropdown to reduce clutter (matches PlayersFiltersBar) */}
        <div className="relative w-full">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search session title..."
            className="pl-9 h-9"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <FilterDropdown
          title="Filters"
          widthClass="w-72"
          onClear={() => {
            if (onStatusFilterChange) onStatusFilterChange("all");
            if (onDateRangeChange) onDateRangeChange(null);
            if (onSearchChange) onSearchChange("");
          }}
          headerRight={
            <div className="flex md:hidden gap-1 self-center ml-auto">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className="h-9 px-3"
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("cards")}
                className="h-9 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          }
        >
          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Status</span>
              <button
                onClick={() => onStatusFilterChange("all")}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(val) =>
                onStatusFilterChange(val === "all" ? "all" : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup className="px-1 mb-3">
            <div className="flex justify-between px-1 text-sm my-2">
              <span>Date Range</span>
              <button
                onClick={() => onDateRangeChange && onDateRangeChange(null)}
                className="text-primary cursor-pointer"
              >
                Reset
              </button>
            </div>
            <div className="w-full">
              <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
        </FilterDropdown>

        {/* View Mode Toggle - visible on all breakpoints for convenience */}
        <div className="hidden md:flex gap-1 self-center ml-auto">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="h-9 px-3"
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("cards")}
            className="h-9 px-3"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterControls;
