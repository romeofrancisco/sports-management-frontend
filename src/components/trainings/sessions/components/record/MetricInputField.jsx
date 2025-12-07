import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, BookOpen, NotebookPen } from "lucide-react";
import RealTimeImprovementIndicator from "./RealTimeImprovementIndicator";
import { useMetricInput } from "./hooks/metric-input/useMetricInput";
import {
  getContainerClasses,
  getInputBorderClasses,
  getInputTextClasses,
  getStatusIndicatorClasses,
  getStatusTextClasses,
  getUnitSectionClasses,
  getTextareaClasses,
} from "./utils/styleHelpers";
import {
  createNumericInputHandler,
  createNumericKeyPressHandler,
} from "./utils/inputValidation";

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
  const {
    isFocused,
    setIsFocused,
    isHovered,
    setIsHovered,
    hasValue,
    numericValue,
    improvementData,
    improvementLoading,
    performanceStatus,
  } = useMetricInput({
    value,
    playerTrainingId,
    metric,
    fetchImprovement,
    getImprovementData,
  });

  // Create validation handlers using utility functions
  const handleInputChange = createNumericInputHandler(onChange, metric);
  const handleKeyPress = createNumericKeyPressHandler(metric);

  return (
    <div
      className="border-primary/20 bg-card rounded-xl border-2"
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
                  {metric.metric_unit && (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium px-2 py-1 self-start"
                    >
                      {metric.metric_unit.code}
                    </Badge>
                  )}
                </Label>
              </div>
              {metric.description && (
                <p className="text-sm text-muted-foreground leading-relaxed truncate">
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
                currentStatus={performanceStatus?.status}
              />
            ) : (
              <div className="w-full px-2 h-[80px] bg-muted/20 dark:bg-muted/10 rounded-lg border border-dashed border-muted-foreground/30 dark:border-muted-foreground/20 flex items-center justify-center">
                <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">
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
              className={getInputBorderClasses(
                performanceStatus,
                hasValue,
                isFocused
              )}
            >
              <div className="flex-1 relative">
                <Input
                  id={`metric-${metric.id}`}
                  data-metric-id={metric.id}
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter measurement..."
                  disabled={isFormDisabled}
                  className={getInputTextClasses(performanceStatus)}
                />

                {/* Value Status Indicator */}
                {hasValue && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <div
                      className={getStatusIndicatorClasses(performanceStatus)}
                    />
                    <span className={getStatusTextClasses(performanceStatus)}>
                      {numericValue?.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={getUnitSectionClasses(
                  performanceStatus,
                  hasValue,
                  isFocused
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
            <NotebookPen className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Label
              htmlFor={`notes-${metric.id}`}
              className="text-sm sm:text-base font-semibold text-foreground"
            >
              Training Notes & Observations
            </Label>
            <Badge
              variant="secondary"
              className="text-xs px-2 sm:px-3 py-1 font-medium dark:brightness-75"
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
              className={getTextareaClasses(performanceStatus, notes)}
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
