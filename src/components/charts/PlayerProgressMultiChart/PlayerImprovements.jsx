import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  return (
    <div className="space-y-6">
      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Object.entries(multiPlayerData.results).map(
          ([playerId, playerData]) => {
            const playerMetric = playerData?.metrics_data?.find(
              (m) =>
                m.metric_id === selectedMetric ||
                m.metric_id === parseInt(selectedMetric)
            );
            const playerRecords = playerMetric?.data_points || [];

            // Loading state - minimalist
            if (isLoading) {
              return (
                <Card key={playerId} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-2 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                      <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-muted animate-pulse rounded" />
                      <div className="h-8 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              );
            }
            // Insufficient data state - minimalist
            if (playerRecords.length < 2) {
              return (
                <Card key={playerId} className="border-primary/20">
                  <CardContent className="text-center">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={playerData.profile}
                          alt={playerData.player_name}
                        />
                        <AvatarFallback className="text-xs">
                          {playerData.player_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm truncate">
                          {playerData.player_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {playerData.team_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      <Minus className="h-4 w-4 mx-auto mb-1" />
                      <p className="text-xs">Need more data</p>
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
              <Card
                key={playerId}
                className="border border-primary/20 hover:border-primary/50 transition-colors"
              >
                <CardContent>
                  {/* Header - Compact */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={playerData.profile}
                          alt={playerData.player_name}
                        />
                        <AvatarFallback className="text-xs border-2 border-primary/40">
                          {playerData.player_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {playerData.player_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {playerData.team_name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isImproved ? "default" : "secondary"}
                      className="text-xs"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {improvementPercentage > 0 ? "+" : ""}
                      {improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>

                  {/* Stats - Compact */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-secondary/50 rounded-md p-2">
                      <p className="text-xs text-secondary-foreground/70 mb-1">
                        Initial
                      </p>
                      <p className="font-semibold text-secondary-foreground text-sm">
                        {firstPoint.value.toFixed(1)}{" "}
                        {selectedMetricDetails?.unit ||
                          selectedMetricDetails?.metric_unit_data?.code}
                      </p>
                    </div>
                    <div className="bg-primary/80 rounded-md p-2">
                      <p className="text-xs text-primary-foreground/70 mb-1">
                        Current
                      </p>
                      <p className="font-semibold text-primary-foreground text-sm">
                        {lastPoint.value.toFixed(1)}{" "}
                        {selectedMetricDetails?.unit ||
                          selectedMetricDetails?.metric_unit_data?.code}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info - Minimal */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <Badge variant="outline" className="text-xs">
                      {playerRecords.length} Training Sessions
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {playerData.attendance_rate
                        ? `${playerData.attendance_rate}% attendance`
                        : "No attendance data"}
                    </span>
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
