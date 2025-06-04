import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";

/**
 * Chart Header component
 * Displays title, date range picker, and metric selector
 */
export const ChartHeader = ({
  playerName,
  metrics,
  selectedMetric,
  setSelectedMetric,
  selectedMetricData,
  dateRange,
  onDateChange,
  showDateControls = true,
}) => (  <CardHeader className="pb-3">
    <div className="flex gap-3 items-center flex-col sm:flex-row">
      {/* Metric Selection with integrated badge */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select 
          value={selectedMetric} 
          onValueChange={(newValue) => {
            // Reset selected metric to trigger a new API call
            setSelectedMetric(newValue);
          }}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select a metric" />
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
                {metric.name} ({metric.metric_unit?.code || '-'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Metric Badge - positioned next to selector */}
        {selectedMetricData && (
          selectedMetricData.metric_id === "overall" ? (
            <Badge variant="outline" className="bg-primary/10 whitespace-nowrap">
              Overall
            </Badge>
          ) : (
            <Badge variant="outline" className="whitespace-nowrap">
              {selectedMetricData.is_lower_better ? "Lower↓" : "Higher↑"}
            </Badge>
          )
        )}
      </div>      
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
  </CardHeader>
);
