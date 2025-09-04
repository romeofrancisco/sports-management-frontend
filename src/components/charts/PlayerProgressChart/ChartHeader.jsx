import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";

/**
 * Chart Header component
 * Displays title, date range picker, and metric selector
 */
export const ChartHeader = ({
  metrics,
  selectedMetric,
  setSelectedMetric,
  dateRange,
  onDateChange,
  showDateControls = true,
  showMetricSelect = true,
}) => (
  <div className="flex gap-3 items-center flex-col sm:flex-row">
    {/* Metric Selection with integrated badge - Only show if enabled */}
    {showMetricSelect && (
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={selectedMetric}
          onValueChange={(newValue) => {
            // Reset selected metric to trigger a new API call
            setSelectedMetric(newValue);
          }}
        >
          <SelectTrigger className="w-full md:w-44 lg:w-48 border-primary/50 border-2">
            <div className="truncate">
              <SelectValue placeholder="Select a metric" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {/* Add Overall option first */}
            <SelectItem key="overall" value="overall">
              Overall Performance
            </SelectItem>
            {/* Divider between Overall and specific metrics */}
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
              Individual Metrics
            </div>
            {metrics.map((metric) => (
              <SelectItem key={metric.id} value={metric.id.toString()}>
                {metric.name} ({metric.metric_unit?.code || "-"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )}
    {/* Date Range Picker - Only show if enabled */}
    {showDateControls && onDateChange && (
      <div className="w-full sm:w-auto">
        <DateRangePickerWithPresets
          value={dateRange}
          onChange={onDateChange}
          className="w-full sm:w-auto"
        />
      </div>
    )}
  </div>
);
