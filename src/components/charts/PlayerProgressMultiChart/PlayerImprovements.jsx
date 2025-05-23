import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * PlayerImprovements component for displaying performance changes for multiple players
 * 
 * @param {Object} props - Component props
 * @param {Object} props.multiPlayerData - Multi-player data from API
 * @param {string|number} props.selectedMetric - Selected metric ID
 * @param {Object} props.selectedMetricDetails - Selected metric details
 * @param {Object} props.playerColors - Player colors mapping
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} - Rendered component
 */
const PlayerImprovements = ({
  multiPlayerData,
  selectedMetric,
  selectedMetricDetails,
  playerColors,
  isLoading
}) => {
  if (!multiPlayerData?.results) return null;

  // Get title based on selected metric
  const isOverall = selectedMetric === "overall";
  const title = isOverall ? "Overall Performance Improvements" : "Player Improvements";

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">        {Object.entries(multiPlayerData.results).map(([playerId, playerData]) => {
          const playerMetric = playerData?.metrics_data?.find(
            (m) => m.metric_id === selectedMetric || m.metric_id === parseInt(selectedMetric)
          );
          const playerRecords = playerMetric?.data_points || [];

          // Check if this player's data is still loading
          if (isLoading) {
            return (
              <Card key={playerId}>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-center mb-2">
                    {playerData.player_name}
                  </h4>
                  <p className="text-sm text-center text-muted-foreground">
                    Loading data...
                  </p>
                </CardContent>
              </Card>
            );
          }

          if (playerRecords.length < 2) {
            return (
              <Card key={playerId}>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-center mb-2">
                    {playerData.player_name}
                  </h4>
                  <p className="text-sm text-center text-muted-foreground">
                    Not enough data
                  </p>
                </CardContent>
              </Card>
            );
          }          // Instead of recalculating, use the overall improvement from the API
          let improvementPercentage = 0;
          let isImproved = false;
          
          // Get improvement data from the API response
          if (playerData.overall_improvement) {
            improvementPercentage = playerData.overall_improvement.percentage;
            isImproved = playerData.overall_improvement.is_positive;
          }
          
          // For display purposes, get first and last points
          const sortedRecords = [...playerRecords].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          
          const firstPoint = sortedRecords[0];
          const lastPoint = sortedRecords[sortedRecords.length - 1];

          return (
            <Card key={playerId}>
              <CardContent className="pt-4">
                <h4 className="font-medium text-center mb-2">
                  {playerData.player_name}
                </h4>
                <div className="flex justify-center items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: playerColors[playerId] || "#8884d8",
                    }}
                  />
                  <span
                    className={
                      isImproved ? "text-green-600" : "text-red-600"
                    }
                  >
                    {improvementPercentage > 0 ? "+" : ""}
                    {improvementPercentage.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-center mt-2">
                  From {firstPoint.value} to {lastPoint.value}{" "}
                  {selectedMetricDetails?.unit}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerImprovements;
