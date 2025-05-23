import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { LineChart } from "lucide-react";

/**
 * MultiChartHeader component for the header section of the PlayerProgressMultiView
 * 
 * @param {Object} props - Component props
 * @param {Array} props.metrics - Available metrics
 * @param {string|number|null} props.selectedMetric - Currently selected metric
 * @param {Function} props.setSelectedMetric - Function to set selected metric
 * @param {Object|null} props.dateRange - Date range from parent component
 * @param {Object} props.localDateRange - Local date range state
 * @param {Function} props.setLocalDateRange - Function to update local date range
 * @returns {JSX.Element} - Rendered component
 */
const MultiChartHeader = ({
  metrics,
  selectedMetric,
  setSelectedMetric,
  dateRange,
  localDateRange,
  setLocalDateRange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      <Select value={selectedMetric} onValueChange={setSelectedMetric}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="overall">
            <div className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              <span>Overall Performance</span>
            </div>
          </SelectItem>
          <SelectSeparator />
          {metrics &&
            metrics.map((metric) => (
              <SelectItem key={metric.id} value={metric.id.toString()}>
                {metric.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {!dateRange && (
        <DateRangePicker
          date={localDateRange}
          onDateChange={setLocalDateRange}
          className="w-full md:w-auto"
        />
      )}
    </div>
  );
};

export default MultiChartHeader;
