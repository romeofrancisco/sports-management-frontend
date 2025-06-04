import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { PlayerRadarChart } from "@/components/charts/PlayerRadarChart";
import { usePlayerRadarChart } from "@/hooks/useTrainings";

const RadarChartCard = ({ 
  playerId, 
  playerName, 
  dateRange, 
  className = "" 
}) => {
  const {
    data: radarData,
    isLoading,
    error,
  } = usePlayerRadarChart(playerId, dateRange, !!playerId);

  return (
    <Card className={`bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-secondary" />
          Skills Radar Analysis
        </CardTitle>
      </CardHeader>      <CardContent className="pt-0">
        <div className="h-96 flex items-center justify-center">
          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading radar chart...</p>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">Failed to load radar chart</p>
            </div>
          ) : radarData?.categories ? (
            <PlayerRadarChart
              radarData={radarData}
              dateRange={dateRange}
              showControls={false}
              className="w-full"
            />
          ) : (
            <div className="text-center space-y-4">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No radar data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarChartCard;
