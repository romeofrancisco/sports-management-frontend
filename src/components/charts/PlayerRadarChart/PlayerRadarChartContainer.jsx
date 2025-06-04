import React, { useState } from "react";
import { PlayerRadarChart } from "./index";
import { usePlayerRadarChart } from "@/hooks/useTrainings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, RotateCcw, Loader2 } from "lucide-react";
import { format } from "date-fns";

const PlayerRadarChartContainer = ({ 
  playerId, 
  playerName, 
  className = "",
  dateRange = null,
  showDateControls = true 
}) => {
  // Only use internal date state if no external dateRange is provided
  const [internalDateRange, setInternalDateRange] = useState({
    from: "",
    to: ""
  });
  
  const [tempDateRange, setTempDateRange] = useState(internalDateRange);
  const [showDateControlsPopover, setShowDateControlsPopover] = useState(false);

  // Use external dateRange if provided, otherwise use internal state
  const effectiveDateRange = dateRange || internalDateRange;
  const {
    data: radarData,
    isLoading,
    error,
    refetch
  } = usePlayerRadarChart(playerId, effectiveDateRange, !!playerId);

  const handleDateRangeApply = () => {
    if (dateRange) {
      // External dateRange is controlled by parent, do nothing
      return;
    }
    setInternalDateRange(tempDateRange);
    setShowDateControlsPopover(false);
  };

  const handleDateRangeReset = () => {
    const resetRange = { from: "", to: "" };
    setTempDateRange(resetRange);
    if (dateRange) {
      // External dateRange is controlled by parent, do nothing  
      return;
    }
    setInternalDateRange(resetRange);
    setShowDateControlsPopover(false);
  };

  const handleDateRangeCancel = () => {
    setTempDateRange(effectiveDateRange);
    setShowDateControlsPopover(false);
  };
  if (isLoading) {
    return (
      <div className={`w-full ${className} flex items-center justify-center py-12`}>
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <p className="text-lg font-semibold">Loading radar chart...</p>
            <p className="text-sm text-muted-foreground">
              Analyzing performance data across training categories
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`w-full ${className} flex items-center justify-center py-12`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Failed to Load Data
            </p>
            <p className="text-sm text-muted-foreground">
              {error.response?.data?.detail || error.message || "An error occurred while loading the radar chart data"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/20 ${className}`}>      <div className="p-6">
        {/* Radar Chart */}
        <div>
          <PlayerRadarChart
            radarData={radarData}
            dateRange={effectiveDateRange}
            onDateRangeChange={() => setShowDateControlsPopover(true)}
            showControls={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerRadarChartContainer;
