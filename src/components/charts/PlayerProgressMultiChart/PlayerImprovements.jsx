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
  if (!multiPlayerData?.results) return null;

  // Get title based on selected metric
  const isOverall = selectedMetric === "overall";
  const title = isOverall
    ? "Overall Performance Improvements"
    : "Player Improvements";
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Individual performance changes over time
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-muted/50">
          {Object.keys(multiPlayerData.results).length} Players
        </Badge>
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
                <Card
                  key={playerId}
                  className="overflow-hidden border-0 shadow-md"
                >
                  <CardHeader className="pb-3 bg-gradient-to-r from-muted/40 to-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Insufficient data state with enhanced styling
            if (playerRecords.length < 2) {
              return (
                <Card
                  key={playerId}
                  className="overflow-hidden border-dashed border-muted shadow-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={playerData.profile}
                          alt={playerData.player_name}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {playerData.player_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {playerData.player_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {playerData.team_name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 text-center">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/20 rounded-xl inline-flex">
                        <Minus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No Data Available
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Need at least 2 records for analysis
                        </p>
                      </div>
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
                className="overflow-hidden pt-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md group"
              >
                <CardHeader
                  className={`py-3 bg-gradient-to-r ${
                    isImproved
                      ? "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
                      : "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30"
                  } group-hover:from-primary/10 group-hover:to-primary/5 transition-colors duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-primary/10">
                          <AvatarImage
                            src={playerData.profile_picture}
                            alt={playerData.player_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                            {playerData.player_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{
                            backgroundColor:
                              playerColors[playerId] || "#8884d8",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate text-foreground">
                          {playerData.player_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {playerData.team_name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isImproved ? "default" : "destructive"}
                      className={`text-xs font-semibold shadow-sm ${
                        isImproved
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
                          : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {improvementPercentage > 0 ? "+" : ""}
                      {improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-5">
                  <div className="space-y-4">
                    {/* Performance Range */}
                    <div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl p-4 border border-muted/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Initial
                            </p>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {firstPoint.value.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedMetricDetails?.unit}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Current
                            </p>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {lastPoint.value.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedMetricDetails?.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs bg-muted/50 hover:bg-muted/70"
                      >
                        {playerRecords.length} Sessions
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Attendance
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {playerData.attendance_rate
                            ? `${playerData.attendance_rate}%`
                            : "N/A"}
                        </p>
                      </div>
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
