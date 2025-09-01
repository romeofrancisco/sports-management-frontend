import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import { Badge } from "@/components/ui/badge";
import { LineChart, Filter, Calendar, Dumbbell } from "lucide-react";

/**
 * MultiChartHeader component for the header section of the PlayerProgressMultiView
 *
 * @param {Object} props - Component props
 * @param {Array} props.metrics - Available metrics
 * @param {string|number|null} props.selectedMetric - Currently selected metric
 * @param {Function} props.setSelectedMetric - Function to set selected metric
 * @param {Object|null} props.dateRange - Current date range
 * @param {Function} props.onDateChange - Function to handle date range changes
 * @returns {JSX.Element} - Rendered component
 */
const MultiChartHeader = ({
  metrics,
  selectedMetric,
  setSelectedMetric,
  dateRange,
  onDateChange,
  compact,
}) => {
  return (
    <>
      {/* Controls Container */}
      <div className="flex ml-auto flex-col md:flex-row md:items-end gap-2">
        {/* Metric Selection */}
        <div className="flex flex-col min-w-[180px] w-full">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
            <Dumbbell className="h-3 w-3" />
            Performance Metric
          </label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="min-w-[10rem] md:min-w-[12rem] w-full bg-background/50 border-primary/50">
              <SelectValue placeholder="Select a metric to analyze" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">
                <div className="flex gap-2 items-center">
                  <LineChart className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Overall Performance</span>
                  </div>
                </div>
              </SelectItem>
              <SelectSeparator />
              {metrics &&
                metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id.toString()}>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-chart-1 rounded-full mr-2" />
                      <span>{metric.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {/* Date Range Selection */}
        <div className="flex flex-col flex-1 w-full">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" />
            Date Range
          </label>
          <DateRangePickerWithPresets
            value={dateRange}
            onChange={onDateChange}
            className="border-primary/50 hover:border-border transition-colors"
          />
        </div>
      </div>
    </>
  );
};

export default MultiChartHeader;
