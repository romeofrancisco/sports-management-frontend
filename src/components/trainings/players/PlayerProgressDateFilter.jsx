import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import { Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PlayerProgressDateFilter - Date range filter component for player progress views
 * @param {Object} dateRange - Current date range selection {from: Date, to: Date}
 * @param {Function} onDateChange - Callback when date range changes
 * @param {string} className - Additional CSS classes
 */
const PlayerProgressDateFilter = ({
  dateRange,
  onDateChange,
  className = "",
}) => {
  return (
    <Card className={cn("border-border/50 bg-card/50 shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter Label */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span>Date Range</span>
          </div>

          {/* Date Range Picker */}
          <div className="flex-1 w-full sm:w-auto">
            <DateRangePickerWithPresets
              value={dateRange}
              onChange={onDateChange}
              placeholder="Select date range..."
              className="w-full sm:w-auto min-w-[280px]"
            />
          </div>

          {/* Optional indicator for active filter */}
          {(dateRange?.from || dateRange?.to) && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              <Filter className="h-3 w-3" />
              <span>Active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProgressDateFilter;
