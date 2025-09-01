import React from "react";
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
import ChartCard from "@/components/charts/ChartCard";

const ProgressChartCard = ({ 
  playerId, 
  dateRange, 
  className = "",
  title = "Performance Progress",
  description = "Track player performance trends over time",
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
  if (!playerData && !isLoading)
    return <EmptyState message="No player data available" />;

  return (
    <ChartCard
      title={title}
      description={description}
      icon={TrendingUp}
      className={className}
      action={
        <div className="flex gap-2 items-center">
          {/* Metric Badge */}
          {selectedMetricData && (
            selectedMetricData.metric_id === "overall" ? (
              <Badge>
                Overall Performance
              </Badge>
            ) : (
              <Badge>
                {selectedMetricData.is_lower_better ? "Lower is Better" : "Higher is Better"}
              </Badge>
            )
          )}
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
        </div>
      }
    >
      <div className="space-y-6">
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
    </ChartCard>
  );
};

export default ProgressChartCard;
