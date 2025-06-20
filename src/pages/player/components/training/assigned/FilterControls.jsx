import React, { useState, useEffect } from "react";
import { 
  Table2, LayoutGrid, Search as SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";

const FilterControls = ({ 
  statusFilter, 
  viewMode, 
  onStatusFilterChange, 
  onViewModeChange, 
  dateRange,
  onDateRangeChange,
  search,
  onSearchChange
}) => {
  // Debounced search state
  const [searchValue, setSearchValue] = useState(search || "");
  useEffect(() => { setSearchValue(search || ""); }, [search]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearchChange) onSearchChange(searchValue);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue, onSearchChange]);

  return (
    <div className="bg-card/80 border border-border rounded-xl shadow-sm px-3 py-3 mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-2 sm:w-auto">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-1 w-full sm:w-auto">
          {["all", "completed", "in_progress", "assigned", "missed"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange(status)}
              className="text-xs w-full sm:w-auto"
            >
              {status === "all" ? "All" : 
               status === "missed" ? "Missed" :
               status === "in_progress" ? "In Progress" :
               status === "assigned" ? "Assigned" :
               status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        {/* Date Range Picker */}
        <div className="w-full sm:w-auto">
          <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        </div>
        {/* Search Input */}
        <div className="relative w-full sm:w-[180px]">
          <Input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search session title..."
            className="pl-9 w-full"
          />
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto sm:gap-2 sm:justify-end">
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Table2 className="h-4 w-4" />
          Table
        </Button>
        <Button
          variant={viewMode === "cards" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("cards")}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <LayoutGrid className="h-4 w-4" />
          Cards
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
