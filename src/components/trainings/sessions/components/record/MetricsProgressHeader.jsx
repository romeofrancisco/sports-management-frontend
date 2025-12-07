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
    <div className="mb-6">
      {/* Combined Header Section */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-start lg:items-center">
        {/* Left: Player Info */}
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-2 sm:border-3 border-card shadow-lg ring-2 ring-primary/20 flex-shrink-0">
            <AvatarImage
              src={
                currentPlayer?.player?.profile ||
                currentPlayer?.player?.user?.profile
              }
              alt={`${currentPlayer?.player?.first_name} ${currentPlayer?.player?.last_name}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm sm:text-base md:text-lg">
              {currentPlayer?.player?.profile ? (
                <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              ) : (
                `${currentPlayer?.player?.first_name?.[0] || ""}${
                  currentPlayer?.player?.last_name?.[0] || ""
                }`.toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
              {currentPlayer?.player?.first_name}{" "}
              {currentPlayer?.player?.last_name}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {metricsToShow.length} metrics to record
              </span>
            </div>
          </div>
        </div>

        {/* Center: Metrics Status - Full width on mobile */}
        <div className="flex justify-center items-center w-full lg:w-auto">
          <MetricsStatusBadge
            metricValues={metricValues}
            metricsToShow={metricsToShow}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsProgressHeader;
