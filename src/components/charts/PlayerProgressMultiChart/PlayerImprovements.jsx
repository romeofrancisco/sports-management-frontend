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
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-lg bg-primary shadow-lg">
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Individual performance changes over time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary font-semibold">
            {Object.keys(multiPlayerData.results).length} Players
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20 text-secondary font-semibold">
            {isOverall ? "Overall" : selectedMetricDetails?.name || "Metric"}
          </Badge>
        </div>
      </div>

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

            // Loading state with enhanced styling
            if (isLoading) {
              return (
                <Card
                  key={playerId}
                  className="overflow-hidden border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gradient-to-r from-secondary/20 to-primary/20 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded animate-pulse" />
                      <div className="h-8 bg-gradient-to-r from-secondary/20 to-primary/20 rounded animate-pulse" />
                      <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded animate-pulse w-2/3 mx-auto" />
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
                  className="overflow-hidden border-dashed border-secondary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-secondary/50"
                >
                  <CardHeader className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/10 border-b border-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-secondary/30 shadow-md ring-2 ring-secondary/10">
                          <AvatarImage
                            src={playerData.profile}
                            alt={playerData.player_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-secondary/30 to-primary/20 text-secondary font-semibold">
                            {playerData.player_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary/60 rounded-full border-2 border-white shadow-sm" />
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
                  </CardHeader>
                  <CardContent className="pt-6 text-center">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl inline-flex border border-secondary/20">
                          <Minus className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary">
                          No Data Available
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
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
                className="overflow-hidden pt-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-primary/20 shadow-lg group hover:border-primary/40"
              >
                <CardHeader
                  className={`py-4 bg-gradient-to-r transition-all duration-300 ${
                    isImproved
                      ? "from-primary/10 via-primary/5 to-secondary/10 border-b border-primary/20"
                      : "from-secondary/10 via-secondary/5 to-primary/10 border-b border-secondary/20"
                  } group-hover:from-primary/20 group-hover:to-secondary/15`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                          <AvatarImage
                            src={playerData.profile}
                            alt={playerData.player_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/20 text-primary font-bold text-sm">
                            {playerData.player_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40"
                          style={{
                            backgroundColor:
                              playerColors[playerId] || "#8884d8",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors duration-300">
                          {playerData.player_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {playerData.team_name}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isImproved ? "default" : "secondary"}
                      className={`text-xs font-bold shadow-lg transition-all duration-300 ${
                        isImproved
                          ? "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground hover:from-primary/80 hover:to-primary/70 border-primary/20"
                          : "bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground hover:from-secondary/80 hover:to-secondary/70 border-secondary/20"
                      }`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {improvementPercentage > 0 ? "+" : ""}
                      {improvementPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-5">
                    {/* Performance Range */}
                    <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-secondary/5 rounded-xl p-5 border border-primary/10 shadow-sm">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary/60 to-secondary/40 shadow-sm"></div>
                            <p className="text-xs text-secondary font-semibold">
                              Initial
                            </p>
                          </div>
                          <p className="text-xl font-bold text-foreground">
                            {firstPoint.value.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {selectedMetricDetails?.unit}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-sm"></div>
                            <p className="text-xs text-primary font-semibold">
                              Current
                            </p>
                          </div>
                          <p className="text-xl font-bold text-foreground">
                            {lastPoint.value.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {selectedMetricDetails?.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4 border border-secondary/10">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/20 text-primary font-semibold"
                        >
                          {playerRecords.length} Sessions
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-secondary font-semibold">
                          Attendance
                        </p>
                        <p className="text-sm font-bold text-foreground">
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
