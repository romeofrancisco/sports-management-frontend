import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  User,
  Calendar,
  Users,
} from "lucide-react";
import { getPerformanceTrend } from "@/pages/coach/utils/performanceHelpers";
import { formatShortDate } from "@/utils/formatDate";
import { useTeamPlayers } from "@/hooks/useTeams";
import { useMultiPlayerProgress } from "@/hooks/useMultiPlayerProgress";
import Loading from "@/components/common/FullLoading";

// Get last 30 days as default date range for recent improvements
const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  return {
    date_from: from.toISOString().split("T")[0],
    date_to: to.toISOString().split("T")[0],
  };
};

/**
 * Get recent improvement percentage from backend data
 * @param {Object} player - Player data object with improvement fields
 * @returns {number|null} Recent improvement percentage or null if no data
 */
const getRecentImprovementPercentage = (player) => {
  // Prioritize recent improvement if available
  if (player.recent_improvement?.percentage !== undefined) {
    return player.recent_improvement.percentage;
  }

  // Fallback to overall improvement if recent not available
  if (player.overall_improvement?.percentage !== undefined) {
    return player.overall_improvement.percentage;
  }

  // No meaningful improvement data available
  return null;
};

/**
 * Get badge variant based on improvement percentage
 * @param {number|null} improvementPercentage - Improvement percentage
 * @returns {string} Badge variant
 */
const getImprovementBadgeVariant = (improvementPercentage) => {
  if (improvementPercentage === null) return "outline"; // No data available
  if (improvementPercentage >= 5) return "default"; // Good improvement
  if (improvementPercentage >= 0) return "secondary"; // Positive or neutral
  return "destructive"; // Declining performance
};

/**
 * Team-specific Player Progress section component
 */
const TeamPlayerProgressSection = ({ teamSlug }) => {
  const dateRange = getDefaultDateRange();
  const { data: teamPlayers, isLoading: playersLoading } = useTeamPlayers(teamSlug);
  const { data: playerProgress, isLoading: progressLoading } = useMultiPlayerProgress({
    teamSlug,
    filters: { 
      metric: "overall",
      ...dateRange // Add 30-day date range for recent improvements only
    },
    enabled: !!teamSlug
  });

  const renderTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-secondary" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-primary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderTrendText = (trend) => {
    switch (trend) {
      case "improving":
        return <span className="text-secondary font-bold">Improving</span>;
      case "declining":
        return <span className="text-primary font-bold">Declining</span>;
      default:
        return (
          <span className="text-muted-foreground font-medium">Stable</span>
        );
    }
  };

  if (playersLoading || progressLoading) {
    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Team Player Progress
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Recent player development within the team (30 days)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Loading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Team Player Progress
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Recent player development within the team (30 days)
            </CardDescription>
          </div>
        </div>
      </CardHeader><CardContent>
        {playerProgress?.results && Object.keys(playerProgress.results).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(playerProgress.results).map(([playerId, player], index) => {
              const improvementPercentage = getRecentImprovementPercentage(player);
              const trend = getPerformanceTrend(player);

              return (                <div
                  key={playerId}
                  className="relative overflow-hidden border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group bg-card border-border shadow-sm"
                >
                  {/* Simple performance indicator */}
                  <div className="absolute top-0 right-0 w-3 h-full bg-primary"></div>
                  {/* Additional hover effects */}
                  <div className="absolute top-2 right-5 w-6 h-6 bg-secondary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-500" />
                          <h4 className="font-semibold text-foreground">
                            {player.player_name}
                          </h4>
                        </div>                        <div className="grid grid-cols-1 md:grid-cols-[auto_auto] gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{player.training_count || 0} sessions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>
                              {player.attendance_rate?.toFixed(1) || 0}%
                              attendance
                            </span>
                          </div>
                          {player.recent_metrics_count > 0 && (
                            <div className="flex items-center gap-1 md:col-span-2">
                              <TrendingUp className="h-3 w-3" />
                              <span>
                                {player.recent_metrics_count} metrics recorded
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {improvementPercentage !== null ? (
                          <Badge
                            variant={getImprovementBadgeVariant(
                              improvementPercentage
                            )}
                            className="font-medium"
                          >
                            {improvementPercentage > 0 ? '+' : ''}{improvementPercentage.toFixed(1)}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">
                            No data
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs justify-end">
                          {renderTrendIcon(trend)}
                          {renderTrendText(trend)}
                        </div>
                      </div>
                    </div>
                    {/* Enhanced improvement progress bar */}
                    {improvementPercentage !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            Recent Improvement
                          </span>
                          <span className="text-xs text-foreground font-bold">
                            {improvementPercentage > 0 ? '+' : ''}{improvementPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/60 rounded-full h-2.5 shadow-inner border border-border/30">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-700 shadow-sm ${
                              improvementPercentage >= 0 
                                ? 'bg-gradient-to-r from-primary via-primary to-secondary' 
                                : 'bg-gradient-to-r from-destructive via-destructive to-destructive/80'
                            }`}
                            style={{ 
                              width: `${Math.min(100, Math.abs(improvementPercentage) * 10)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground/70">
                      Last training:{" "}
                      {formatShortDate(player.last_training_date) ||
                        "No recent training"}
                    </div>
                  </div>
                </div>
              );            })}
            {Object.keys(playerProgress.results).length > 6 && (
              <div className="text-center pt-4 md:col-span-2">
                <button className="text-sm text-primary hover:text-secondary font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-secondary/30">
                  View all {Object.keys(playerProgress.results).length} team players →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No team player progress data available
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                Team player performance data will appear here as training sessions
                are completed and metrics are recorded for team members
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamPlayerProgressSection;
