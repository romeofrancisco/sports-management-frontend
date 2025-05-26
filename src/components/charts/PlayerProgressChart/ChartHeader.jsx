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
}) => (
  <CardHeader>
    <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
      <div>
        <CardTitle>{playerName || "Player"} Progress</CardTitle>
        <CardDescription>Track improvements over time</CardDescription>
      </div>
    </div>
    <div className="flex gap-4 items-center mt-4 flex-col sm:flex-row">
      <div className="w-full sm:w-64">
        <Select 
          value={selectedMetric} 
          onValueChange={(newValue) => {
            // Reset selected metric to trigger a new API call
            setSelectedMetric(newValue);
          }}
        >
          <SelectTrigger>
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
      </div>
      
      {/* Date Range Picker */}
      {onDateChange && (
        <div className="w-full sm:w-auto">
          <DateRangePickerWithPresets
            value={dateRange}
            onChange={onDateChange}
            className="w-full sm:w-auto"
          />
        </div>
      )}
      
      {/* Metric Badge */}
      {selectedMetricData && (
        selectedMetricData.metric_id === "overall" ? (
          <Badge variant="outline" className="bg-primary/10">
            Overall Performance
          </Badge>
        ) : (
          <Badge variant="outline">
            {selectedMetricData.is_lower_better
              ? "Lower is better"
              : "Higher is better"}
          </Badge>
        )
      )}
    </div>
  </CardHeader>
);
