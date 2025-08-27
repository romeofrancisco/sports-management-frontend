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
    <div className="bg-card/80 border border-border rounded-xl shadow-sm p-3 mb-4">
      {/* Single line layout for medium+ screens, stacked for small screens */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 border-0 md:border-r-2 md:pr-2">
          {["all", "completed", "in_progress", "assigned", "missed"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange(status)}
              className="text-xs h-8 px-3"
            >
              {status === "all" ? "All" : 
               status === "missed" ? "Missed" :
               status === "in_progress" ? "In Progress" :
               status === "assigned" ? "Assigned" :
               status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Controls Group */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center md:gap-2">
          {/* Date Range Picker */}
          <div className="w-full sm:w-auto">
            <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
          </div>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-48 md:w-52">
            <Input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search session title..."
              className="pl-9 h-9"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 self-center">
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

      </div>
    </div>
  );
};

export default FilterControls;
