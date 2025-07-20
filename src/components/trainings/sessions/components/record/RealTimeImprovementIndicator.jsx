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
  currentStatus = null, // Add current status prop
}) => {
  if (loading) {
    // Use current status colors for loading state
    let loadingColors = {
      bg: "bg-gradient-to-r from-primary/5 to-primary/10",
      border: "border-primary/20",
      iconBg: "bg-primary/20 dark:bg-primary/30",
      iconColor: "text-primary",
      dotColor: "bg-primary/40"
    };

    if (currentStatus === "excellent") {
      loadingColors = {
        bg: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30",
        border: "border-green-200 dark:border-green-800",
        iconBg: "bg-green-200 dark:bg-green-800/50",
        iconColor: "text-green-600 dark:text-green-400",
        dotColor: "bg-green-500 dark:bg-green-400"
      };
    } else if (currentStatus === "stable") {
      loadingColors = {
        bg: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30",
        border: "border-amber-200 dark:border-amber-800",
        iconBg: "bg-amber-200 dark:bg-amber-800/50",
        iconColor: "text-amber-600 dark:text-amber-400",
        dotColor: "bg-amber-500 dark:bg-amber-400"
      };
    } else if (currentStatus === "needs-attention") {
      loadingColors = {
        bg: "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30",
        border: "border-red-200 dark:border-red-800",
        iconBg: "bg-red-200 dark:bg-red-800/50",
        iconColor: "text-red-600 dark:text-red-400",
        dotColor: "bg-red-500 dark:bg-red-400"
      };
    }

    return (
      <div
        className={cn(
          "p-3 rounded-lg border space-y-2",
          loadingColors.bg,
          loadingColors.border,
          className
        )}
      >
        {/* Main loading indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded-full", loadingColors.iconBg)}>
            <Loader2 className={cn("h-3 w-3 animate-spin", loadingColors.iconColor)} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">
              Calculating improvement...
            </div>
            <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
              Analyzing performance data
            </div>
          </div>
        </div>

        {/* Loading placeholder for previous session reference */}
        <div className="flex items-center gap-2 pt-1 border-t border-current/10">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", loadingColors.dotColor)}></div>
          <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
            Comparing with previous session data...
          </span>
        </div>
      </div>
    );
  }

  if (!improvementData) {
    return (
      <div
        className={cn(
          "p-3 rounded-lg border space-y-2 bg-gradient-to-r from-muted/30 to-muted/50 border-muted",
          className
        )}
      >
        {/* Main no data indicator */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-muted dark:bg-muted/50">
            <FileX className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">
              First recording
            </div>
            <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
              No previous data available
            </div>
          </div>
        </div>

        {/* Placeholder for previous session reference */}
        <div className="flex items-center gap-2 pt-1 border-t border-current/10">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></div>
          <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
            This will be your baseline measurement
          </span>
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
          "p-3 rounded-lg border space-y-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800",
          className
        )}
      >
        {/* Main error indicator */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-orange-200 dark:bg-orange-800/50">
            <FileX className="h-3 w-3 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-orange-700 dark:text-orange-300">
              Unable to calculate improvement
            </div>
            <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
              Data processing error
            </div>
          </div>
        </div>

        {/* Error details */}
        <div className="flex items-center gap-2 pt-1 border-t border-current/10">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400"></div>
          <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
            Previous: {formatMetricValue(previousValue)}{metricUnit?.code || ""}
          </span>
        </div>
      </div>
    );
  }

  // No significant change (using raw normalizedPercentage for this check)
  if (Math.abs(normalizedPercentage) < 1) {
    return (
      <div
        className={cn(
          "p-3 rounded-lg border space-y-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800",
          className
        )}
      >
        {/* Main stability indicator */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-amber-200 dark:bg-amber-800/50">
            <Activity className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              Stable performance
            </div>
            <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
              {formatMetricValue(currentValue)} vs{" "}
              {formatMetricValue(previousValue)}
              {metricUnit?.code && ` ${metricUnit.code}`}
            </div>
          </div>
        </div>

        {/* Previous session reference */}
        <div className="flex items-center gap-2 pt-1 border-t border-current/10">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></div>
          <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
            Previous: {formatMetricValue(previousValue)} {metricUnit?.code || ""}
            <span className="ml-1">({formatShortDate(previousSessionDate)})</span>
          </span>
        </div>
      </div>
    );
  }

  const improvementText = isImprovement ? "Improved" : "Decreased";
  const improvementClass = isImprovement ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300";
  const bgClass = isImprovement
    ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800"
    : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800";
  const Icon = isImprovement ? TrendingUp : TrendingDown;
  const iconClass = isImprovement ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  const dotClass = isImprovement ? "bg-green-500 dark:bg-green-400" : "bg-red-500 dark:bg-red-400";

  return (
    <div className={cn("p-3 rounded-lg border space-y-2", bgClass, className)}>
      {/* Main improvement indicator */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "p-1 rounded-full",
            isImprovement ? "bg-green-200 dark:bg-green-800/50" : "bg-red-200 dark:bg-red-800/50"
          )}
        >
          <Icon className={cn("h-3 w-3", iconClass)} />
        </div>
        <div className="flex-1">
          <div className={cn("text-xs font-semibold", improvementClass)}>
            {improvementText} by{" "}
            {Math.abs(normalizedPercentage || normalizedPercentage).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/60">
            {formatMetricValue(currentValue)} vs{" "}
            {formatMetricValue(previousValue)}
            {metricUnit?.code && ` ${metricUnit.code}`}
          </div>
        </div>
      </div>

      {/* Previous session reference */}
      <div className="flex items-center gap-2 pt-1 border-t border-current/10">
        <div className={cn("w-1.5 h-1.5 rounded-full", dotClass)}></div>
        <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
          Previous: {formatMetricValue(previousValue)} {metricUnit?.code || ""}
          <span className="ml-1">({formatShortDate(previousSessionDate)})</span>
        </span>
      </div>
    </div>
  );
};

export default RealTimeImprovementIndicator;
