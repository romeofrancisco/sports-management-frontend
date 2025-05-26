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
import { LineChart, Filter, Calendar } from "lucide-react";

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
}) => {return (
    <div className="space-y-4">
      {/* Control Labels */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
          <Filter className="h-3 w-3 mr-1" />
          Filters
        </Badge>
        <span className="text-xs text-muted-foreground">Customize your comparison view</span>
      </div>
      
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
        {/* Metric Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Performance Metric
          </label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="min-w-[15rem] bg-background/50 border-border/50 hover:border-border transition-colors">
              <SelectValue placeholder="Select a metric to analyze" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">
                <div className="flex items-center">
                  <div className="p-1 bg-primary/10 rounded mr-2">
                    <LineChart className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Overall Performance</span>
                    <p className="text-xs text-muted-foreground">Comprehensive analysis</p>
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
        </div>        {/* Date Range Selection */}
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Date Range
          </label>
          <DateRangePickerWithPresets
            value={dateRange}
            onChange={onDateChange}
            className="w-full border-border/50 hover:border-border transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default MultiChartHeader;
