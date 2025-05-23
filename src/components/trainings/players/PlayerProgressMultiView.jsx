import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import PlayerProgressMultiChart from "@/components/charts/PlayerProgressMultiChart/PlayerProgressMultiChart";
import PlayerImprovements from "@/components/charts/PlayerProgressMultiChart/PlayerImprovements";
import MultiChartHeader from "@/components/charts/PlayerProgressMultiChart/MultiChartHeader";
import { useMultiPlayerChartData } from "@/hooks/useMultiPlayerChartData";

const PlayerProgressMultiView = ({
  players = [],
  teamSlug = null,
  dateRange = null,
}) => {
  const [selectedMetric, setSelectedMetric] = useState("overall");
  const [localDateRange, setLocalDateRange] = useState({
    from: null,
    to: null,
  });
  
  // Use our custom hook to get all chart data and related info
  const {
    metrics,
    chartData,
    playerColors,
    multiPlayerData,
    selectedMetricDetails,
    isLoading,
    metricsLoading,
  } = useMultiPlayerChartData({
    players,
    teamSlug,
    selectedMetric,
    dateRange,
    localDateRange
  });

  // No data message
  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <Card className="w-full border-0">
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>No metrics have been defined yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }  // No players selected message
  if (!isLoading && multiPlayerData && 
      (!multiPlayerData.results || Object.keys(multiPlayerData.results).length === 0) && !teamSlug) {
    return (
      <Card className="w-full border-0">
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>
            Select players to compare their progress
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0">      <CardHeader>
        <CardTitle>Player Comparison</CardTitle>
        <CardDescription>Compare progress between players</CardDescription>
        {/* Use our new extracted header component */}
        <MultiChartHeader 
          metrics={metrics}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          dateRange={dateRange}
          localDateRange={localDateRange}
          setLocalDateRange={setLocalDateRange}
        />
      </CardHeader>      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading player data...
          </div>
        ) : (
          <div>
            {/* Use our new extracted chart component */}
            <PlayerProgressMultiChart 
              chartData={chartData}
              playerColors={playerColors}
              multiPlayerData={multiPlayerData}
              selectedMetricDetails={selectedMetricDetails}
            />
            
            {/* Use our new extracted improvements component */}
            {chartData.length > 0 && (
              <PlayerImprovements
                multiPlayerData={multiPlayerData}
                selectedMetric={selectedMetric}
                selectedMetricDetails={selectedMetricDetails}
                playerColors={playerColors}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressMultiView;