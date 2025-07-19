import React from "react";
import { Loader2, TrendingUp, TrendingDown, FileX, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMetricValue } from "@/utils/formatters";
import { formatShortDate } from "@/utils/formatDate";

/**
 * Enhanced improvement indicator that shows real-time improvement calculations
 */
export const RealTimeImprovementIndicator = ({
  improvementData,
  loading,
  metricUnit,
  className = "",
}) => {
  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20",
          className
        )}
      >
        <div className="p-1.5 bg-primary/20 rounded-full">
          <Loader2 className="h-3 w-3 text-primary animate-spin" />
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground">
            Calculating improvement...
          </div>
          <div className="text-xs text-muted-foreground/80">
            Analyzing performance data
          </div>
        </div>
      </div>
    );
  }

  if (!improvementData) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-2 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border border-muted",
          className
        )}
      >
        <div className="p-1.5 bg-muted rounded-full">
          <FileX className="h-3 w-3 text-muted-foreground" />
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground">
            First recording
          </div>
          <div className="text-xs text-muted-foreground/80">
            No previous data available
          </div>
        </div>
      </div>
    );
  }
  const {
    previousValue,
    currentValue,
    isImprovement,
    previousSessionDate,
    normalizedPercentage,
  } = improvementData;

  // Check if we have valid percentage data
  if (normalizedPercentage === null || normalizedPercentage === undefined) {
    return (
      <div
        className={cn(
          "p-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200",
          className
        )}
      >
        <div className="text-xs font-medium text-orange-700">
          Unable to calculate improvement
        </div>
        <div className="text-xs text-orange-600/80 mt-0.5">
          Previous: {formatMetricValue(previousValue)}
          {metricUnit?.code || ""}
        </div>
      </div>
    );
  }

  // No significant change (using raw normalizedPercentage for this check)
  if (Math.abs(normalizedPercentage) < 1) {
    return (
      <div
        className={cn(
          "p-3 rounded-lg border space-y-2 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200",
          className
        )}
      >
        {/* Main stability indicator */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-amber-200">
            <Activity className="h-3 w-3 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-amber-700">
              Stable performance
            </div>
            <div className="text-xs text-muted-foreground/80">
              {formatMetricValue(currentValue)} vs{" "}
              {formatMetricValue(previousValue)}
              {metricUnit?.code && ` ${metricUnit.code}`}
            </div>
          </div>
        </div>

        {/* Previous session reference */}
        <div className="flex items-center gap-2 pt-1 border-t border-current/10">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <span className="text-xs text-muted-foreground/70">
            Previous: {formatMetricValue(previousValue)} {metricUnit?.code || ""}
            <span className="ml-1">({formatShortDate(previousSessionDate)})</span>
          </span>
        </div>
      </div>
    );
  }

  const improvementText = isImprovement ? "Improved" : "Decreased";
  const improvementClass = isImprovement ? "text-green-700" : "text-red-700";
  const bgClass = isImprovement
    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
    : "bg-gradient-to-r from-red-50 to-red-100 border-red-200";
  const Icon = isImprovement ? TrendingUp : TrendingDown;
  const iconClass = isImprovement ? "text-green-600" : "text-red-600";
  const dotClass = isImprovement ? "bg-green-500" : "bg-red-500";

  return (
    <div className={cn("p-3 rounded-lg border space-y-2", bgClass, className)}>
      {/* Main improvement indicator */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "p-1 rounded-full",
            isImprovement ? "bg-green-200" : "bg-red-200"
          )}
        >
          <Icon className={cn("h-3 w-3", iconClass)} />
        </div>
        <div className="flex-1">
          <div className={cn("text-xs font-semibold", improvementClass)}>
            {improvementText} by{" "}
            {Math.abs(normalizedPercentage || normalizedPercentage).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground/80">
            {formatMetricValue(currentValue)} vs{" "}
            {formatMetricValue(previousValue)}
            {metricUnit?.code && ` ${metricUnit.code}`}
          </div>
        </div>
      </div>

      {/* Previous session reference */}
      <div className="flex items-center gap-2 pt-1 border-t border-current/10">
        <div className={cn("w-1.5 h-1.5 rounded-full", dotClass)}></div>
        <span className="text-xs text-muted-foreground/70">
          Previous: {formatMetricValue(previousValue)} {metricUnit?.code || ""}
          <span className="ml-1">({formatShortDate(previousSessionDate)})</span>
        </span>
      </div>
    </div>
  );
};

export default RealTimeImprovementIndicator;
