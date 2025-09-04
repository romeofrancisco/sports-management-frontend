import React from "react";
import { PieChart } from "lucide-react";
import { PlayerRadarChart } from "@/components/charts/PlayerRadarChart";
import { usePlayerRadarChart } from "@/hooks/useTrainings";
import ChartCard from "@/components/charts/ChartCard";

const RadarChartCard = ({
  playerId,
  playerName,
  dateRange,
  className = "",
  title = "Skills Radar Analysis",
  description = "Performance visualization across different skill categories",
}) => {
  const {
    data: radarData,
    isLoading,
    error,
  } = usePlayerRadarChart(playerId, dateRange, !!playerId);

  return (
    <ChartCard
      title={title}
      description={description}
      icon={PieChart}
      height={"full"}
      className={className}
      emptyMessage="No radar data available"
      hasData={radarData && radarData.categories && radarData.categories.length > 0}
    >
      <div className="h-full flex items-center justify-center">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Loading radar chart...
            </p>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-sm text-destructive">
              Failed to load radar chart
            </p>
          </div>
        ) : (
          radarData?.categories && (
            <PlayerRadarChart
              radarData={radarData}
              dateRange={dateRange}
              showControls={false}
              className="w-full"
            />
          )
        )}
      </div>
    </ChartCard>
  );
};

export default RadarChartCard;
