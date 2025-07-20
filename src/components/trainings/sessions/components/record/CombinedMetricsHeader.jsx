import React from "react";
import { Activity, TrendingUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { Badge } from "../../../../ui/badge";
import MetricsStatusBadge from "./MetricsStatusBadge";
import PlayerStatistics from "./PlayerStatistics";

const CombinedMetricsHeader = ({
  completedMetrics,
  totalMetrics,
  currentPlayer,
  metricsToShow,
  metricValues,
  hasChanges,
  playersWithMetrics,
}) => {
  const progressPercentage = Math.round((completedMetrics / totalMetrics) * 100);
  const recordedCount = Object.entries(metricValues).filter(
    ([key, value]) => value !== "" && !isNaN(parseFloat(value))
  ).length;

  return (
    <div className="p-6 bg-card border-b border-primary/10">
      {/* Top Section - Title and Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Training Metrics
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Record performance data for analysis
            </p>
          </div>
        </div>

        {/* Metrics Counter */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {completedMetrics}/{totalMetrics}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Metrics Recorded
            </div>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-secondary/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/90 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Player Information Section */}
      <div className="bg-background/50 rounded-xl border border-border/50 p-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-3 border-card shadow-lg ring-2 ring-primary/20">
              <AvatarImage
                src={
                  currentPlayer?.player?.profile ||
                  currentPlayer?.player?.user?.profile
                }
                alt={`${currentPlayer?.player?.first_name} ${currentPlayer?.player?.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                {currentPlayer?.player?.profile ? (
                  <User className="h-8 w-8" />
                ) : (
                  `${currentPlayer?.player?.first_name?.[0] || ""}${
                    currentPlayer?.player?.last_name?.[0] || ""
                  }`.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">
                {currentPlayer?.player?.first_name}{" "}
                {currentPlayer?.player?.last_name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {metricsToShow.length} metrics to record
                </span>
                {recordedCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-500/10 border-green-500/20 text-green-600 font-medium"
                  >
                    {recordedCount} recorded
                  </Badge>
                )}
                {hasChanges && typeof hasChanges === 'function' && hasChanges() && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-500/10 border-blue-500/20 text-blue-600 font-medium"
                  >
                    Has changes
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="place-items-center">
            <MetricsStatusBadge 
              metricValues={metricValues}
              metricsToShow={metricsToShow}
            />
          </div>

          <PlayerStatistics playersWithMetrics={playersWithMetrics} />
        </div>
      </div>
    </div>
  );
};

export default CombinedMetricsHeader;
