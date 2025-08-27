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
} from "lucide-react";
import { getPerformanceTrend } from "../utils/performanceHelpers";
import { formatShortDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
 * Enhanced Player Progress section component
 */
const PlayerProgressSection = ({ playerProgress }) => {
  const navigate = useNavigate();

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
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Player Progress Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track recent improvements and development insights over the past 3
              months.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {playerProgress?.player_progress?.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playerProgress.player_progress
                .slice(0, 6)
                .map((player, index) => {
                  const improvementPercentage =
                    getRecentImprovementPercentage(player);
                  const trend = getPerformanceTrend(player);

                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group bg-card shadow-sm"
                    >
                      <div className="absolute top-0 right-0 w-3 h-full bg-primary"></div>
                      <div className="absolute top-2 right-5 w-6 h-6 bg-secondary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-500" />
                              <h4 className="font-semibold text-foreground">
                                {player.player_name}
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[auto_auto] gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{player.total_sessions} sessions</span>
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
                                    {player.recent_metrics_count} metrics
                                    recorded
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
                                {improvementPercentage > 0 ? "+" : ""}
                                {improvementPercentage.toFixed(1)}%
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-slate-500"
                              >
                                No data
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs justify-end">
                              {renderTrendIcon(trend)}
                              {renderTrendText(trend)}
                            </div>
                          </div>
                        </div>
                        {improvementPercentage !== null && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                Recent Improvement
                              </span>
                              <span className="text-xs text-foreground font-bold">
                                {improvementPercentage > 0 ? "+" : ""}
                                {improvementPercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted/60 rounded-full h-2.5 shadow-inner border border-border/30">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-700 shadow-sm ${
                                  improvementPercentage >= 0
                                    ? "bg-gradient-to-r from-primary via-primary to-secondary"
                                    : "bg-gradient-to-r from-destructive via-destructive to-destructive/80"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(8, (Math.abs(improvementPercentage) / 30) * 100)
                                  )}%`,
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
                  );
                })}
            </div>
            {playerProgress.player_progress.length > 6 && (
              <Button
                onClick={() => navigate("/trainings/progress/individual")}
              >
                View All Players
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No player progress data available
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Player performance data will be displayed here as training
              sessions are completed and metrics are recorded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressSection;
