import React, { useEffect } from "react";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import { cn } from "@/lib/utils";
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
  const hasValue = value !== "" && !isNaN(parseFloat(value));

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
  return (
    <div
      className={cn(
        "group transition-all duration-300 rounded-xl border-2 border-transparent",
        hasValue
          ? "bg-primary/5 border-primary/20 shadow-sm"
          : "bg-card hover:bg-secondary/5 border-border hover:border-primary/30",
        "p-6 space-y-4"
      )}
    >
      {/* Metric Header with Real-time Improvement */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                hasValue ? "bg-primary shadow-sm" : "bg-muted-foreground/30"
              )}
            />
            <Label
              htmlFor={`metric-${metric.id}`}
              className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors"
            >
              {metric.name}
            </Label>
          </div>
          {metric.description && (
            <p className="text-sm text-muted-foreground leading-relaxed ml-6">
              {metric.description}
            </p>
          )}
        </div>
        {hasValue && (
          <div className="max-w-[280px] bg-card rounded-lg p-4 shadow-sm border border-primary/10">
            <RealTimeImprovementIndicator
              improvementData={improvementData}
              loading={improvementLoading}
              metricUnit={metric.metric_unit}
              className="text-sm"
            />
          </div>
        )}
      </div>
      {/* Enhanced Input Controls */}
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="flex-1 relative">            <Input
              id={`metric-${metric.id}`}
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              step="0.1"
              min={metric.is_lower_better ? undefined : 0}
              placeholder="Enter value..."
              disabled={isFormDisabled}
              className={cn(
                "text-lg font-medium h-12 rounded-lg border-2 transition-all duration-200",
                hasValue
                  ? "border-primary/30 bg-card shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  : "border-border hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
                "rounded-r-none"
              )}
            />
            {hasValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
            )}
          </div>
          <div
            className={cn(
              "h-12 px-4 inline-flex items-center rounded-r-lg border-2 border-l-0 text-sm font-medium transition-all duration-200",
              hasValue
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-border bg-muted text-muted-foreground group-hover:border-primary/30 group-hover:bg-secondary/10"
            )}
          >
            {metric.metric_unit?.code || "units"}
          </div>
        </div>
        {/* Quick Action Hints */}
        {!hasValue && (
          <div className="text-xs text-muted-foreground ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            💡 Enter a numeric value to see real-time improvement calculations
          </div>
        )}
      </div>
      {/* Enhanced Notes Section */}
      <div className="space-y-3 pt-2 border-t border-border">
        <Label
          htmlFor={`notes-${metric.id}`}
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          📝 Notes for {metric.name}
          <span className="text-xs text-muted-foreground font-normal">
            (optional)
          </span>
        </Label>        <Textarea
          id={`notes-${metric.id}`}
          placeholder={`Add observations about ${metric.name} performance, technique, or any relevant details...`}
          rows={3}
          value={notes || ""}
          onChange={(e) => onNotesChange(e.target.value)}
          disabled={isFormDisabled}
          className={cn(
            "resize-none transition-all duration-200 rounded-lg",
            "border-border hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
            notes && "bg-secondary/5 border-primary/20"
          )}
        />
      </div>
    </div>
  );
};

export default MetricInputField;
