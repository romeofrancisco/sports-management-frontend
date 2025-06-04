import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { PerformanceAnalysisSection } from "@/components/charts/PlayerProgressChart/PerformanceAnalysisSection";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";

const PerformanceInsightCard = ({ playerId, dateRange, className = "" }) => {
  const {
    playerData,
    selectedMetric,
    selectedMetricData,
    isLoading,
    error,
  } = usePlayerMetrics(playerId, dateRange);

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !playerData) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>        <CardContent>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No Insights Available
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Unable to load performance insights
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get overall metrics for insights
  const overallMetric = playerData?.metrics_data?.find(m => m.metric_id === "overall");
  const analysis = overallMetric?.performance_analysis;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="space-y-4">
            {/* Overall Performance Trend */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center gap-2 mb-2">
                {analysis.overall_improvement?.is_positive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Overall Trend
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                {analysis.overall_improvement?.is_positive ? "Showing positive" : "Showing declining"} performance with{" "}
                {Math.abs(analysis.overall_improvement?.percentage || 0).toFixed(1)}% change
              </p>
            </div>

            {/* Recent Activity */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Recent Activity
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {analysis.recent_improvement?.sessions_count || 0} recent sessions tracked with{" "}
                {Math.abs(analysis.recent_improvement?.percentage || 0).toFixed(1)}% change
              </p>
            </div>

            {/* Data Quality */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Data Coverage
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {analysis.data_points_count || 0} data points collected across all metrics
              </p>
            </div>
          </div>        ) : (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No Insights Available
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Performance insights will appear when sufficient data is available
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceInsightCard;
