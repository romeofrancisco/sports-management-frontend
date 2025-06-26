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
  setDateRange = null,
  dateRangeParams = null,
  onDateChange,
}) => {
  const [selectedMetric, setSelectedMetric] = useState("overall");

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
    dateRange: dateRange || dateRangeParams,
  }); // Enhanced No data message
  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-muted/20 to-muted/5 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            No Metrics Available
          </CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            No performance metrics have been defined yet. Set up training
            metrics to start comparing player progress across your team.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Enhanced No players selected message
  if (
    !isLoading &&
    multiPlayerData &&
    (!multiPlayerData.results ||
      Object.keys(multiPlayerData.results).length === 0) &&
    !teamSlug
  ) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-primary/8 to-secondary/8 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Ready to Compare Players
          </CardTitle>
          <CardDescription className="text-base max-w-md mx-auto mb-6">
            Select multiple players from the list above to compare their
            performance and progress over time.
          </CardDescription>
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/30 text-primary px-4 py-2 text-sm"
            >
              <Activity className="h-4 w-4 mr-2" />
              Choose 2+ players to begin
            </Badge>
          </div>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card className="border pt-0 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Player Progress Comparison
            </CardTitle>
            <CardDescription
              className="text-sm text-muted-foreground truncate max-w-xs xl:max-w-md "
              title="Compare performance metrics across multiple players in your team"
            >
              Compare performance metrics across multiple players in your team
            </CardDescription>
          </div>
          <MultiChartHeader
            metrics={metrics}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[500px] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary/30 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-foreground">
                Loading player data...
              </p>
              <p className="text-sm text-muted-foreground">
                Analyzing performance metrics and generating insights
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chart Section */}
            <div className="bg-gradient-to-br from-card/50 to-muted/20 rounded-lg">
              <PlayerProgressMultiChart
                chartData={chartData}
                playerColors={playerColors}
                multiPlayerData={multiPlayerData}
                selectedMetricDetails={selectedMetricDetails}
              />
            </div>

            {/* Improvements Section */}
            {chartData.length > 0 && (
              <div className="bg-gradient-to-br from-secondary/5 to-background rounded-lg p-6">
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
  );
};

export default PlayerProgressMultiView;
