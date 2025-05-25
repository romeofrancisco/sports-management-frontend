import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, TrendingUp, Activity } from "lucide-react";
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
  // Enhanced No data message
  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-muted/30 to-muted/10">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">No Metrics Available</CardTitle>
          <CardDescription className="text-base">
            No performance metrics have been defined yet. Set up training metrics to start comparing player progress.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Enhanced No players selected message
  if (!isLoading && multiPlayerData && 
      (!multiPlayerData.results || Object.keys(multiPlayerData.results).length === 0) && !teamSlug) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Ready to Compare Players</CardTitle>
          <CardDescription className="text-base">
            Select multiple players from the list above to compare their performance and progress over time.
          </CardDescription>
          <div className="mt-4">
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              <Activity className="h-3 w-3 mr-1" />
              Choose 2+ players to begin
            </Badge>
          </div>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <Card className="w-full border-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Player Comparison
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Compare performance metrics across multiple players
              </CardDescription>
            </div>
          </div>
          
          {/* Enhanced Control Header */}
          <MultiChartHeader 
            metrics={metrics}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            dateRange={dateRange}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
          />
        </CardHeader>
      </Card>

      {/* Main Content Section */}
      <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-background to-muted/10 overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-lg font-medium">Loading player data...</p>
                <p className="text-sm text-muted-foreground">Analyzing performance metrics</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Chart Section */}
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <PlayerProgressMultiChart 
                  chartData={chartData}
                  playerColors={playerColors}
                  multiPlayerData={multiPlayerData}
                  selectedMetricDetails={selectedMetricDetails}
                />
              </div>
              
              {/* Improvements Section */}
              {chartData.length > 0 && (
                <div className="bg-gradient-to-br from-muted/30 to-background rounded-lg p-4 border border-border/30">
                  <PlayerImprovements
                    multiPlayerData={multiPlayerData}
                    selectedMetric={selectedMetric}
                    selectedMetricDetails={selectedMetricDetails}
                    playerColors={playerColors}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgressMultiView;