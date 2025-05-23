import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Trophy, BarChart3 } from "lucide-react";
import { usePlayerProgressById } from "@/hooks/useTrainings";
import ContentLoading from "@/components/common/ContentLoading";
import { formatMetricValue } from "@/utils/formatters";

const PlayerProgressStats = ({ playerId }) => {
  // Get last 30 days as default date range
  const dateRange = useMemo(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    return {
      date_from: from.toISOString().split('T')[0],
      date_to: to.toISOString().split('T')[0],
    };
  }, []);
  // Fetch player progress data with backend calculations
  const { data: playerData, isLoading, isError } = usePlayerProgressById(playerId, !!playerId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <ContentLoading />
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <ContentLoading />
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <ContentLoading />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If there's an error or the player has no metrics data at all
  if (isError || !playerData || (playerData.metrics_data && playerData.metrics_data.length === 0)) {
    return (
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">No Training Data Available</h3>
              <p className="text-muted-foreground text-sm">
                No metrics have been recorded for this player yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border shadow-sm card-hover-effect">
        <CardContent className="p-4 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-4">
            <Activity className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Recent Improvement
            </p>
            {playerData?.recent_improvement ? (
              <>
                <p className={`text-xl font-semibold ${playerData.recent_improvement.is_positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {playerData.recent_improvement.is_positive ? '+' : ''}{parseFloat(playerData.recent_improvement.percentage).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Last 30 days ({playerData.recent_improvement.metric_count} metrics)
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">--</p>
                <p className="text-xs text-muted-foreground">
                  No recent data
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border shadow-sm card-hover-effect">
        <CardContent className="p-4 flex items-center">
          <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full mr-4">
            <BarChart3 className="h-5 w-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Overall Improvement
            </p>
            {playerData?.overall_improvement ? (
              <>
                <p className={`text-xl font-semibold ${playerData.overall_improvement.is_positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {playerData.overall_improvement.is_positive ? '+' : ''}{parseFloat(playerData.overall_improvement.percentage).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Across {playerData.overall_improvement.metric_count} metrics
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">--</p>
                <p className="text-xs text-muted-foreground">
                  Not enough data
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border shadow-sm card-hover-effect">
        <CardContent className="p-4 flex items-center">
          <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-4">
            <Trophy className="h-5 w-5 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Top Performance
            </p>
            {playerData?.best_performance ? (
              <>                <p className="text-xl font-semibold">
                  {formatMetricValue(playerData.best_performance.value, playerData.best_performance.unit)} {playerData.best_performance.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {playerData.best_performance.metric_name}
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">--</p>
                <p className="text-xs text-muted-foreground">
                  No metrics recorded
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
