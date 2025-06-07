import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Radar } from "lucide-react";
import { ProgressChart } from "@/components/charts/PlayerProgressChart/ProgressChart";
import { PlayerRadarChart } from "@/components/charts/PlayerRadarChart";
import { TrainingAnalyticsChart } from "@/components/charts/TeamAnalyticsCharts/TrainingAnalyticsChart";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";
import { usePlayerRadarChart } from "@/hooks/useTrainings";

/**
 * Charts section for player dashboard - 3 months summary only
 */
const ChartsSection = ({ user, overview }) => {  // Get last 3 months date range - memoized to prevent infinite re-renders
  const dateRange = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    return {
      from: threeMonthsAgo.toISOString().split('T')[0], // Use ISO date strings
      to: now.toISOString().split('T')[0]
    };
  }, []); // Empty dependency array since we want a fixed 3-month range

  // Fetch player metrics for progress chart
  const { 
    selectedMetricData, 
    isLoading: metricsLoading 
  } = usePlayerMetrics(user?.id, dateRange);

  // Fetch radar chart data
  const { 
    data: radarData, 
    isLoading: radarLoading 
  } = usePlayerRadarChart(user?.id, dateRange);

  return (
    <div className="space-y-6">
      {/* Progress and Radar Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Chart */}
        {user?.id && (
          <Card className="relative overflow-hidden col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary shadow-lg">
                  <Activity className="h-4 w-4 text-primary-foreground" />
                </div>
                Progress Chart
              </CardTitle>
              <CardDescription>
                Your performance trends (Last 3 months)
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="h-80">
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : selectedMetricData ? (
                  <ProgressChart selectedMetricData={selectedMetricData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No progress data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Radar Chart */}
        {user?.id && (
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-secondary/3 to-transparent" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary shadow-lg">
                  <Radar className="h-4 w-4 text-secondary-foreground" />
                </div>
                Skills Radar
              </CardTitle>
              <CardDescription>
                Performance metrics overview (Last 3 months)
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="h-80">
                {radarLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                  </div>
                ) : radarData ? (
                  <PlayerRadarChart radarData={radarData} showControls={false} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No radar data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Training Analytics */}
      {overview?.training_analytics && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/3 to-transparent" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent shadow-lg">
                <Activity className="h-5 w-5 text-accent-foreground" />
              </div>
              Training Analytics
            </CardTitle>
            <CardDescription>
              Session participation trends (Last 3 months)
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-80">
              <TrainingAnalyticsChart
                data={overview.training_analytics}
                title="Training Progress"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartsSection;
