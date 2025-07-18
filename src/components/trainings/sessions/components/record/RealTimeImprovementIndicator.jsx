import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, Loader2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMetricValue } from '@/utils/formatters';

/**
 * Enhanced improvement indicator that shows real-time improvement calculations
 */
export const RealTimeImprovementIndicator = ({ 
  improvementData, 
  loading, 
  metricUnit,
  className = ""
}) => {  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        </div>
        <div>
          <div className="font-medium text-foreground">Calculating...</div>
          <div className="text-xs text-muted-foreground">Analyzing performance</div>
        </div>
      </div>
    );
  }

  if (!improvementData) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <div className="p-2 bg-muted rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="font-medium">No previous data</div>
          <div className="text-xs">First recording for this metric</div>
        </div>
      </div>
    );
  }
  const {
    previousValue,
    currentValue,
    percentage,
    isImprovement,
    isLowerBetter,
    metricName,
    previousSessionDate,
    normalizedPercentage
  } = improvementData;

  // Check if we have valid percentage data
  if (percentage === null || percentage === undefined) {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        <div>Previous: {formatMetricValue(previousValue)}{metricUnit?.code || ""}</div>
        <div className="text-orange-500">Cannot calculate improvement (division by zero)</div>
      </div>
    );
  }

  // No significant change (using raw percentage for this check)
  if (Math.abs(percentage) < 0.5) {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        No change from previous
      </div>
    );
  }

  const improvementText = isImprovement ? "Improved" : "Decreased";
  const improvementClass = isImprovement ? "text-green-600" : "text-red-500";
  const Icon = isImprovement ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Previous value reference */}
      <div className="text-xs text-muted-foreground">
        Previous: {formatMetricValue(previousValue)}{metricUnit?.code || ""}
        <span className="ml-1 text-muted-foreground/70">
          ({new Date(previousSessionDate).toLocaleDateString()})
        </span>      </div>      {/* Improvement indicator */}
      <div className={cn("flex items-center gap-1 text-xs font-medium", improvementClass)}>
        <Icon className="h-3 w-3" />
        <span>
          {improvementText} by {Math.abs(normalizedPercentage || percentage).toFixed(1)}%
        </span>
      </div>
      
      {/* Detailed comparison */}
      <div className="text-xs text-muted-foreground">
        {formatMetricValue(currentValue)} vs {formatMetricValue(previousValue)}
        {metricUnit?.code && ` ${metricUnit.code}`}
      </div>
    </div>
  );
};

export default RealTimeImprovementIndicator;
