import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Trophy, BarChart3 } from "lucide-react";
import { usePlayerProgressById } from "@/hooks/useTrainings";
import PlayerProgressStatsSkeleton from "./PlayerProgressStatsSkeleton";
import { formatMetricValue } from "@/utils/formatters";

// Get last 30 days as default date range - calculated once outside component
const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  return {
    date_from: from.toISOString().split("T")[0],
    date_to: to.toISOString().split("T")[0],
  };
};

const PlayerProgressStats = ({ playerId }) => {
  const dateRange = getDefaultDateRange();
  // Fetch player progress data with backend calculations
  const {
    data: playerData,
    isLoading,
    isError,
  } = usePlayerProgressById(playerId, !!playerId);
  if (isLoading) {
    return <PlayerProgressStatsSkeleton />;
  } // If there's an error or the player has no metrics data at all
  if (
    isError ||
    !playerData ||
    (playerData.metrics_data && playerData.metrics_data.length === 0)
  ) {
    return (
      <div className="mb-6">
        <Card className="relative overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/5 to-background shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/5" />
          <CardContent className="relative p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Enhanced icon with animated background */}
              <div className="relative">
                <div className="absolute inset-0 bg-muted/20 rounded-full animate-pulse" />
                <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 p-6 rounded-full shadow-inner">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/60" />
                </div>
              </div>
              {/* Enhanced title and description */}
              <div className="space-y-3 max-w-md">
                <h3 className="text-xl font-bold text-foreground">
                  No Training Data Available
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This player hasn't recorded any training metrics yet. Start
                  tracking their progress by recording their first performance
                  data.
                </p>
              </div>
              {/* Enhanced call to action with better styling */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-gradient-to-r from-muted/20 to-muted/30 px-4 py-3 rounded-full border border-muted-foreground/10 shadow-sm">
                <div className="p-1 bg-primary/10 rounded-full">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">
                  Use "Record New Training Session" to get started
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Recent Improvement Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950/50 dark:via-amber-900/50 dark:to-amber-950/50 border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-xl shadow-sm">
              <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wider">
                Last 30 Days
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Recent Improvement
            </h3>
            {playerData?.recent_improvement ? (
              <>
                
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-3xl font-bold ${
                      playerData.recent_improvement.is_positive
                        ? "text-green-900 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {playerData.recent_improvement.is_positive ? "+" : ""}
                    {parseFloat(
                      playerData.recent_improvement.percentage
                    ).toFixed(1)}
                    %
                  </p>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      playerData.recent_improvement.is_positive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {playerData.recent_improvement.is_positive ? "↗" : "↘"}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {playerData.recent_improvement.metric_count} metric
                  {playerData.recent_improvement.metric_count !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-muted-foreground">--</p>
                <p className="text-xs text-muted-foreground">
                  No recent data available
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Overall Improvement Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950/50 dark:via-amber-900/50 dark:to-amber-950/50 border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-xl shadow-sm">
              <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wider">
                All Time
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Overall Improvement
            </h3>
            {playerData?.overall_improvement ? (
              <>
                
                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-3xl font-bold ${
                      playerData.overall_improvement.is_positive
                        ? "text-green-900 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {playerData.overall_improvement.is_positive ? "+" : ""}
                    {parseFloat(
                      playerData.overall_improvement.percentage
                    ).toFixed(1)}
                    %
                  </p>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      playerData.overall_improvement.is_positive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {playerData.overall_improvement.is_positive ? "↗" : "↘"}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {playerData.overall_improvement.metric_count} metric
                  {playerData.overall_improvement.metric_count !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-muted-foreground">--</p>
                <p className="text-xs text-muted-foreground">
                  Not enough data for analysis
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Top Performance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-red-100 to-red-50 dark:from-red-950/50 dark:via-red-900/50 dark:to-red-950/50 border-red-200/50 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            
            <div className="p-3 bg-red-900/10 dark:bg-red-400/10 rounded-xl shadow-sm">
              <Trophy className="h-6 w-6 text-red-900 dark:text-red-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-red-900/70 dark:text-red-400/70 uppercase tracking-wider">
                Best Result
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Top Performance
            </h3>
            {playerData?.best_performance ? (
              <>
                <div className="flex items-baseline gap-2">
                  
                  <p className="text-3xl font-bold text-red-900 dark:text-red-400">
                    {formatMetricValue(
                      playerData.best_performance.value,
                      playerData.best_performance.unit
                    )}
                  </p>
                  <span className="text-lg font-medium text-red-900/70 dark:text-red-400/70">
                    {playerData.best_performance.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {playerData.best_performance.metric_name}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-muted-foreground">--</p>
                <p className="text-xs text-muted-foreground">
                  No performance data recorded
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgressStats;
