import React from "react";
import { Activity, TrendingUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../ui/avatar";
import { Badge } from "../../../../ui/badge";
import MetricsStatusBadge from "./MetricsStatusBadge";
import PlayerStatistics from "./PlayerStatistics";

const MetricsProgressHeader = ({
  completedMetrics,
  totalMetrics,
  currentPlayer,
  metricsToShow,
  metricValues,
  hasChanges,
  playersWithMetrics,
}) => {
  const recordedCount = Object.entries(metricValues).filter(
    ([key, value]) => value !== "" && !isNaN(parseFloat(value))
  ).length;

  return (
    <div className="p-6 bg-card border-b border-primary/10">
      {/* Combined Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Player Info */}
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
            </div>
          </div>
        </div>

        {/* Center: Metrics Status */}
        <div className="flex justify-center items-center">
          <MetricsStatusBadge
            metricValues={metricValues}
            metricsToShow={metricsToShow}
          />
        </div>

        {/* Right: Player Statistics */}
        <div className="flex justify-end">
          <PlayerStatistics playersWithMetrics={playersWithMetrics} />
        </div>
      </div>
    </div>
  );
};

export default MetricsProgressHeader;
