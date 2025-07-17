import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const ProgressChartCard = ({ playerId, dateRange, className = "" }) => {
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
  if (!playerData && !isLoading)
    return <EmptyState message="No player data available" />;

  return (
    <Card
      className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border-2 border-primary/20 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Progress
            {/* Metric Badge - positioned beside title */}
            {selectedMetricData && (
              selectedMetricData.metric_id === "overall" ? (
                <Badge variant="outline" className="bg-primary/10 whitespace-nowrap">
                  Overall
                </Badge>
              ) : (
                <Badge variant="outline" className="whitespace-nowrap">
                  {selectedMetricData.is_lower_better ? "Lower↓" : "Higher↑"}
                </Badge>
              )
            )}
          </div>
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
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
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
