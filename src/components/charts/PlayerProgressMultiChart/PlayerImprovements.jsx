import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, User, BarChart3 } from "lucide-react";

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
  isLoading,
}) => {
  if (!multiPlayerData?.results) return null;

  // Get title based on selected metric
  const isOverall = selectedMetric === "overall";
  const title = isOverall
    ? "Overall Performance Improvements"
    : "Player Improvements";
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Individual performance changes over time</p>
        </div>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(multiPlayerData.results).map(
          ([playerId, playerData]) => {
            const playerMetric = playerData?.metrics_data?.find(
              (m) =>
                m.metric_id === selectedMetric ||
                m.metric_id === parseInt(selectedMetric)
            );
            const playerRecords = playerMetric?.data_points || [];

            // Loading state with enhanced styling
            if (isLoading) {
              return (
                <Card key={playerId} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-center">
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded animate-pulse mx-auto w-16" />
                      <div className="h-2 bg-muted rounded animate-pulse mx-auto w-24" />
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Insufficient data state with enhanced styling
            if (playerRecords.length < 2) {
              return (
                <Card key={playerId} className="overflow-hidden border-dashed">
                  <CardHeader className="pb-3 bg-gradient-to-r from-muted/20 to-muted/5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-muted/30 rounded-full">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h4 className="font-medium text-sm truncate">
                        {playerData.player_name}
                      </h4>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-center">
                    <div className="space-y-2">
                      <div className="p-2 bg-muted/20 rounded-lg inline-flex">
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Insufficient data for analysis
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Calculate improvement data
            let improvementPercentage = 0;
            let isImproved = false;

            if (playerData.overall_improvement) {
              improvementPercentage = playerData.overall_improvement.percentage;
              isImproved = playerData.overall_improvement.is_positive;
            }

            // Get first and last points for display
            const sortedRecords = [...playerRecords].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            const firstPoint = sortedRecords[0];
            const lastPoint = sortedRecords[sortedRecords.length - 1];

            const improvementIcon = isImproved ? TrendingUp : TrendingDown;
            const Icon = improvementIcon;

            return (
              <Card key={playerId} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">                <CardHeader className={`pb-3 bg-gradient-to-r ${
                  isImproved 
                    ? 'from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50' 
                    : 'from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{
                          backgroundColor: playerColors[playerId] || "#8884d8",
                        }}
                      />
                      <h4 className="font-medium text-sm truncate">
                        {playerData.player_name}
                      </h4>
                    </div>
                    <Badge 
                      variant={isImproved ? "default" : "destructive"}
                      className="text-xs"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {improvementPercentage > 0 ? "+" : ""}
                      {improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Performance Range */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">From</p>
                          <p className="text-sm font-semibold">
                            {firstPoint.value.toFixed(1)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {selectedMetricDetails?.unit}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">To</p>
                          <p className="text-sm font-semibold">
                            {lastPoint.value.toFixed(1)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {selectedMetricDetails?.unit}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>                    {/* Training Sessions Count */}
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {playerRecords.length} training session{playerRecords.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
};

export default PlayerImprovements;
