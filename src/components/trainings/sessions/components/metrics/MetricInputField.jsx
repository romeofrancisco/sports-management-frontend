import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Target, Activity, BookOpen, Zap } from "lucide-react";
import RealTimeImprovementIndicator from "../record/RealTimeImprovementIndicator";

const MetricInputField = ({
  metric,
  value,
  onChange,
  notes,
  onNotesChange,
  playerTrainingId,
  fetchImprovement,
  getImprovementData,
  isFormDisabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasValue =
    value !== "" && !isNaN(parseFloat(value)) && parseFloat(value) !== 0;
  const numericValue = hasValue ? parseFloat(value) : null;

  // Get real-time improvement data
  const { data: improvementData, loading: improvementLoading } =
    getImprovementData(playerTrainingId, metric.id);

  // Debounced improvement calculation
  useEffect(() => {
    if (hasValue) {
      const timeoutId = setTimeout(() => {
        fetchImprovement(playerTrainingId, metric.id, value);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [value, playerTrainingId, metric.id, fetchImprovement, hasValue]);

  // Determine performance status
  const getPerformanceStatus = () => {
    if (
      !improvementData ||
      !hasValue ||
      typeof improvementData.normalizedPercentage !== "number" ||
      parseFloat(value) === 0
    )
      return null;

    const improvement = improvementData.normalizedPercentage;
    if (improvement > 1)
      return {
        status: "excellent",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (improvement > -1)
      return { status: "stable", color: "text-amber-600", bg: "bg-amber-50" };
    return {
      status: "needs-attention",
      color: "text-red-600",
      bg: "bg-red-50",
    };
  };

  const performanceStatus = getPerformanceStatus();
  return (
    <div
      className={cn(
        "group relative rounded-2xl border-2 transition-colors duration-300",
        hasValue || isFocused
          ? "bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/5"
          : "bg-gradient-to-r from-muted/30 to-muted/50 hover:from-primary/5 hover:to-primary/10 border-border/60 hover:border-primary/20 hover:shadow-md",
        performanceStatus && performanceStatus.status === "excellent"
          ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
          : performanceStatus && performanceStatus.status === "stable"
          ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
          : performanceStatus && performanceStatus.status === "needs-attention"
          ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
          : "",
        isFormDisabled && "opacity-60 cursor-not-allowed",
        "overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header Section */}
        <div className="space-y-4">
          {/* Metric Name and Unit */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="size-10 sm:size-12 bg-primary flex items-center justify-center rounded-xl shadow-sm flex-shrink-0">
              <Target className="size-5 sm:size-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label
                  htmlFor={`metric-${metric.id}`}
                  className="text-lg sm:text-xl font-bold text-foreground cursor-pointer truncate"
                >
                  {metric.name}
                </Label>
                {metric.metric_unit && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-2 py-1 self-start"
                  >
                    {metric.metric_unit.code}
                  </Badge>
                )}
              </div>
              {metric.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 truncate">
                  {metric.description}
                </p>
              )}
            </div>
          </div>

          {/* Real-time Improvement Panel */}
          <div className="w-full min-h-[90px] flex items-center">
            {hasValue ? (
              <RealTimeImprovementIndicator
                improvementData={improvementData}
                loading={improvementLoading}
                metricUnit={metric.metric_unit}
                className="text-xs leading-tight w-full"
              />
            ) : (
              <div className="w-full h-[80px] bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center">
                <p className="text-xs text-muted-foreground/70">
                  Enter a value to see real-time performance analysis and
                  improvement tracking
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Input Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <div
              className={cn(
                "flex items-stretch rounded-xl overflow-hidden border-2 focus-within:ring-2 shadow-sm transition-colors duration-300",
                // Performance-based colors take priority
                performanceStatus && performanceStatus.status === "excellent"
                  ? "border-green-300 focus-within:ring-green-100 focus-within:border-green-500"
                  : performanceStatus && performanceStatus.status === "stable"
                  ? "border-amber-300 focus-within:ring-amber-100 focus-within:border-amber-500"
                  : performanceStatus &&
                    performanceStatus.status === "needs-attention"
                  ? "border-red-300 focus-within:ring-red-100 focus-within:border-red-500"
                  : // Fallback to input state colors
                  hasValue || isFocused
                  ? "border-primary/30 focus-within:ring-primary/20"
                  : "border-border focus-within:ring-primary/20"
              )}
            >
              <div className="flex-1 relative">
                <Input
                  id={`metric-${metric.id}`}
                  type="number"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  step="0.1"
                  min={metric.is_lower_better ? undefined : 0}
                  placeholder="Enter measurement..."
                  disabled={isFormDisabled}
                  className={cn(
                    "text-lg sm:text-xl font-semibold h-10 sm:h-12 border-0 bg-transparent focus:ring-0 focus:outline-none rounded-none px-4 sm:px-6 transition-colors duration-300",
                    // Override shadcn focus-visible styles with performance-based colors
                    performanceStatus &&
                      performanceStatus.status === "excellent"
                      ? "text-green-700 placeholder:text-green-500 focus-visible:border-green-500 border-r-2 focus-visible:ring-green-100 focus-visible:ring-[3px]"
                      : performanceStatus &&
                        performanceStatus.status === "stable"
                      ? "text-amber-700 placeholder:text-amber-500 focus-visible:border-amber-500 border-r-2 focus-visible:ring-amber-100 focus-visible:ring-[3px]"
                      : performanceStatus &&
                        performanceStatus.status === "needs-attention"
                      ? "text-red-700 placeholder:text-red-500 focus-visible:border-red-500 border-r-2 focus-visible:ring-red-100 focus-visible:ring-[3px]"
                      : "text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  )}
                />

                {/* Value Status Indicator */}
                {hasValue && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm transition-colors duration-300",
                        performanceStatus &&
                          performanceStatus.status === "excellent"
                          ? "bg-green-500"
                          : performanceStatus &&
                            performanceStatus.status === "stable"
                          ? "bg-amber-500"
                          : performanceStatus &&
                            performanceStatus.status === "needs-attention"
                          ? "bg-red-500"
                          : "bg-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold transition-colors duration-300",
                        performanceStatus &&
                          performanceStatus.status === "excellent"
                          ? "text-green-600"
                          : performanceStatus &&
                            performanceStatus.status === "stable"
                          ? "text-amber-600"
                          : performanceStatus &&
                            performanceStatus.status === "needs-attention"
                          ? "text-red-600"
                          : "text-primary"
                      )}
                    >
                      {numericValue?.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "px-3 sm:px-6 flex items-center justify-center min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors duration-300",
                  // Performance-based colors take priority
                  performanceStatus && performanceStatus.status === "excellent"
                    ? "bg-green-100 text-green-700 border-l border-green-300"
                    : performanceStatus && performanceStatus.status === "stable"
                    ? "bg-amber-100 text-amber-700 border-l border-amber-300"
                    : performanceStatus &&
                      performanceStatus.status === "needs-attention"
                    ? "bg-red-100 text-red-700 border-l border-red-300"
                    : // Fallback to input state colors
                    hasValue || isFocused
                    ? "bg-primary/10 text-primary border-l border-primary/20"
                    : "bg-muted/30 text-muted-foreground border-l border-border"
                )}
              >
                {metric.metric_unit?.code || "units"}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notes Section */}
        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Label
              htmlFor={`notes-${metric.id}`}
              className="text-sm sm:text-base font-semibold text-foreground"
            >
              Training Notes & Observations
            </Label>
            <Badge
              variant="secondary"
              className="text-xs px-2 sm:px-3 py-1 font-medium"
            >
              Optional
            </Badge>
          </div>

          <div className="relative">
            <Textarea
              id={`notes-${metric.id}`}
              placeholder={`Record observations about ${metric.name}...\n• Technique notes\n• Performance factors\n• Areas for improvement`}
              rows={3}
              value={notes || ""}
              onChange={(e) => onNotesChange(e.target.value)}
              disabled={isFormDisabled}
              className={cn(
                "resize-none rounded-xl border-2 text-sm leading-relaxed p-3 sm:p-4 shadow-sm transition-colors duration-300",
                // Performance-based colors take priority
                performanceStatus && performanceStatus.status === "excellent"
                  ? "focus-visible:ring-2 focus-visible:ring-green-100 focus-visible:border-green-500 border-green-300 bg-green-50/50"
                  : performanceStatus && performanceStatus.status === "stable"
                  ? "focus-visible:ring-2 focus-visible:ring-amber-100 focus-visible:border-amber-500 border-amber-300 bg-amber-50/50"
                  : performanceStatus &&
                    performanceStatus.status === "needs-attention"
                  ? "focus-visible:ring-2 focus-visible:ring-red-100 focus-visible:border-red-500 border-red-300 bg-red-50/50"
                  : // Fallback to default colors (no ring)
                    "focus-visible:ring-0 border-border hover:border-primary/30",
                notes
                  ? performanceStatus
                    ? "" // Performance colors already applied above
                    : "bg-secondary/20 border-primary/20"
                  : performanceStatus
                  ? "" // Performance colors already applied above
                  : "border-border hover:border-primary/30",
                "placeholder:text-muted-foreground/70 placeholder:text-sm"
              )}
            />

            {notes && (
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                <Badge
                  variant="outline"
                  className="text-xs opacity-70 px-2 py-1"
                >
                  {notes.length} chars
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricInputField;
