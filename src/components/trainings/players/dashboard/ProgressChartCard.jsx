import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { usePlayerMetrics } from "@/hooks/usePlayerMetrics";
import { ProgressChart } from "@/components/charts/PlayerProgressChart/ProgressChart";
import { LoadingState } from "@/components/charts/PlayerProgressChart/LoadingState";
import { ErrorState } from "@/components/charts/PlayerProgressChart/ErrorState";
import { EmptyState } from "@/components/charts/PlayerProgressChart/EmptyState";
import { NoMetricsState } from "@/components/charts/PlayerProgressChart/NoMetricsState";
import { NoDataState } from "@/components/charts/PlayerProgressChart/NoDataState";
import { SelectMetricPrompt } from "@/components/charts/PlayerProgressChart/SelectMetricPrompt";
import { ChartHeader } from "@/components/charts/PlayerProgressChart/ChartHeader";

const ProgressChartCard = ({ 
  playerId, 
  dateRange, 
  className = "" 
}) => {
  const {
    playerData,
    metrics,
    selectedMetric,
    selectedMetricData,
    effectiveDateRange,
    isLoading,
    error,
    hasMetricsData,
    hasDataPoints,
    setSelectedMetric,
    handleDateChange,
  } = usePlayerMetrics(playerId, dateRange);

  // Handle early error and empty states
  if (error) return <ErrorState error={error} />;
  if (!playerData && !isLoading) return <EmptyState message="No player data available" />;

  return (
    <Card className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        <ChartHeader
          playerName={playerData?.player_name || "Player"}
          metrics={metrics || []}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          selectedMetricData={selectedMetricData}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          showDateControls={false}
        />
        <div>
          {isLoading ? (
            <LoadingState />
          ) : !hasMetricsData ? (
            <NoMetricsState />
          ) : !selectedMetric ? (
            <SelectMetricPrompt />
          ) : hasDataPoints ? (
            <ProgressChart selectedMetricData={selectedMetricData} />
          ) : (
            <NoDataState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChartCard;
