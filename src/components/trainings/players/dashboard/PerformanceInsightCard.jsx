import React from "react";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
} from "lucide-react";
import { PerformanceAnalysisSection } from "@/components/charts/PlayerProgressChart/PerformanceAnalysisSection";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";
import ChartCard from "@/components/charts/ChartCard";

const PerformanceInsightCard = ({ 
  playerId, 
  dateRange, 
  className = "",
  title = "Performance Insights",
  description = "Performance analysis of player performance trends",
}) => {
  const { playerData, selectedMetric, selectedMetricData, isLoading, error } =
    usePlayerMetrics(playerId, dateRange);
  if (isLoading) {
    return (
      <ChartCard
        title={title}
        description={description}
        icon={Lightbulb}
        className={className}
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </ChartCard>
    );
  }
  if (error || !playerData) {
    return (
      <ChartCard
        title={title}
        description={description}
        icon={Lightbulb}
        className={className}
        hasData={false}
        emptyMessage="Unable to load performance insights"
      />
    );
  }

  // Get overall metrics for insights
  const overallMetric = playerData?.metrics_data?.find(
    (m) => m.metric_id === "overall"
  );
  const analysis = overallMetric?.performance_analysis;

  return (
    <ChartCard
      title={title}
      description={description}
      icon={Lightbulb}
      className={className}
      hasData={!!analysis}
      emptyMessage="Performance insights will appear when sufficient data is available"
    >
      {analysis && (
        <div className="space-y-4">
          {/* Overall Performance Trend */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              {analysis.overall_improvement?.is_positive ? (
                <TrendingUp className="w-4 h-4 text-primary dark:text-secondary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Overall Trend
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              {analysis.overall_improvement?.is_positive
                ? "Showing positive"
                : "Showing declining"}{" "}
              performance with{" "}
              {Math.abs(
                analysis.overall_improvement?.percentage || 0
              ).toFixed(1)}
              % change
            </p>
          </div>{" "}
          {/* Recent Activity */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Recent Activity
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              {analysis.recent_improvement?.sessions_count || 0} recent
              sessions tracked with{" "}
              {Math.abs(analysis.recent_improvement?.percentage || 0).toFixed(
                1
              )}
              % change
            </p>
          </div>{" "}
          {/* Data Quality */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary dark:text-secondary" />
              <span className="text-sm font-medium text-primary dark:text-secondary">
                Data Coverage
              </span>
            </div>
            <p className="text-xs text-primary/80 dark:text-secondary/70">
              {analysis.data_points_count || 0} data points collected across
              all metrics
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export default PerformanceInsightCard;
