import React from "react";
import { 
  Table2, LayoutGrid, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FilterControls = ({ 
  statusFilter, 
  categoryFilter, 
  categories, 
  viewMode, 
  onStatusFilterChange, 
  onCategoryFilterChange, 
  onViewModeChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <div className="flex items-center gap-1">
          {["all", "completed", "in_progress", "assigned", "missed"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange(status)}
              className="text-xs"
            >
              {status === "all" ? "All" : 
               status === "missed" ? "Missed" :
               status === "in_progress" ? "In Progress" :
               status === "assigned" ? "Assigned" :
               status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="flex items-center gap-2"
        >
          <Table2 className="h-4 w-4" />
          Table
        </Button>
        <Button
          variant={viewMode === "cards" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("cards")}
          className="flex items-center gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          Cards
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
