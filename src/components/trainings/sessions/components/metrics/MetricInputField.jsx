import React, { useEffect } from "react";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import { cn } from "@/lib/utils";
import RealTimeImprovementIndicator from "../RealTimeImprovementIndicator";

const MetricInputField = ({
  metric,
  value,
  onChange,
  notes,
  onNotesChange,
  playerTrainingId,
  fetchImprovement,
  getImprovementData,
}) => {
  const hasValue = value !== "" && !isNaN(parseFloat(value));
  
  // Get real-time improvement data
  const { data: improvementData, loading: improvementLoading } = getImprovementData(playerTrainingId, metric.id);

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
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm" 
          : "bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200",
        "p-6 space-y-4"
      )}
    >
      {/* Metric Header with Real-time Improvement */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              hasValue ? "bg-blue-500 shadow-sm" : "bg-gray-300"
            )} />
            <Label htmlFor={`metric-${metric.id}`} className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
              {metric.name}
            </Label>
          </div>
          {metric.description && (
            <p className="text-sm text-gray-600 leading-relaxed ml-6">{metric.description}</p>
          )}
        </div>
        
        {hasValue && (
          <div className="max-w-[280px] bg-white rounded-lg p-4 shadow-sm border border-gray-100">
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
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              id={`metric-${metric.id}`}
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              step="0.1"
              min={metric.is_lower_better ? undefined : 0}
              placeholder="Enter value..."
              className={cn(
                "text-lg font-medium h-12 rounded-lg border-2 transition-all duration-200",
                hasValue 
                  ? "border-blue-300 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                  : "border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20",
                "rounded-r-none"
              )}
            />
            {hasValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
          <div
            className={cn(
              "h-12 px-4 inline-flex items-center rounded-r-lg border-2 border-l-0 text-sm font-medium transition-all duration-200",
              hasValue 
                ? "border-blue-300 bg-blue-50 text-blue-700" 
                : "border-gray-200 bg-gray-50 text-gray-600 group-hover:border-gray-300 group-hover:bg-gray-100"
            )}
          >
            {metric.metric_unit?.code || "units"}
          </div>
        </div>
        
        {/* Quick Action Hints */}
        {!hasValue && (
          <div className="text-xs text-gray-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            💡 Enter a numeric value to see real-time improvement calculations
          </div>
        )}
      </div>

      {/* Enhanced Notes Section */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <Label htmlFor={`notes-${metric.id}`} className="text-sm font-medium text-gray-700 flex items-center gap-2">
          📝 Notes for {metric.name}
          <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          id={`notes-${metric.id}`}
          placeholder={`Add observations about ${metric.name} performance, technique, or any relevant details...`}
          rows={3}
          value={notes || ""}
          onChange={(e) => onNotesChange(e.target.value)}
          className={cn(
            "resize-none transition-all duration-200 rounded-lg",
            "border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20",
            notes && "bg-gray-50 border-gray-300"
          )}
        />
      </div>
    </div>
  );
};

export default MetricInputField;
