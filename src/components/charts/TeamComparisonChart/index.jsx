import React from "react";
import { useTeamStatsComparison } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { SCORING_TYPE_VALUES } from "@/constants/sport";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeamStatsComparison({ game }) {
  const { gameId } = useParams();
  const { data: statComparison, isLoading } = useTeamStatsComparison(gameId);
  const { scoring_type, win_points_threshold } = useSelector(
    (state) => state.sport
  );

  // Calculate a dynamic maximum value for each stat type
  const getMaxValue = (label, homeValue, awayValue) => {
    // For Points stat in set-based sports, use win_points_threshold as max value
    if (scoring_type === SCORING_TYPE_VALUES.SETS && label === "Points") {
      return win_points_threshold || 25; // fallback to 25 if threshold not set
    }

    // Use the greater of the two values and add a buffer
    const maxFromValues = Math.max(homeValue, awayValue);

    // Special case for percentage stats (any stat containing %)
    if (
      label.toLowerCase().includes("%") ||
      label.toLowerCase().includes("percentage") ||
      label.toLowerCase().includes("ratio")
    ) {
      // Check if we're dealing with a decimal-based percentage (like 0.311)
      if (homeValue < 1 && awayValue < 1) {
        return 1; // Decimal percentages are typically between 0-1
      }
      return 100; // Regular percentages are out of 100
    }

    // For all other stats, use 150% of the max value
    // with a minimum of 5 for small values
    return Math.max(Math.ceil(maxFromValues * 1.5), 5);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const hasData =
    statComparison &&
    statComparison.comparison_stats &&
    statComparison.comparison_stats.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2">
            Team Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              No comparable stats available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { home_team, away_team, comparison_stats } = statComparison;

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2">
          Team Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium my-2">
          <div className="flex items-center gap-2 justify-start">
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage
                src={game.home_team.logo}
                alt={home_team.abbreviation}
              />
              <AvatarFallback className="bg-muted/50 text-muted-foreground ">
                {game.home_team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {home_team.abbreviation}
          </div>
          <span></span>
          <div className="flex items-center gap-2 justify-start">
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage
                src={game.away_team.logo}
                alt={away_team.abbreviation}
              />
              <AvatarFallback className="bg-muted/50 text-muted-foreground ">
                {game.away_team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {away_team.abbreviation}
          </div>
        </div>

        {comparison_stats.map((stat) => {
          const maxValue = getMaxValue(
            stat.label,
            stat.home_value,
            stat.away_value
          );
          const homePercent = (stat.home_value / maxValue) * 100;
          const awayPercent = (stat.away_value / maxValue) * 100;

          return (
            <div
              key={stat.label}
              className="grid grid-cols-[1fr_3.5rem_1fr] items-center gap-4 border-t border-dashed"
            >
              <div className="text-start border-r border-dashed py-2 pe-2">
                <div className="font-bold">{stat.home_value}</div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <div
                    className="h-3 rounded-xl"
                    style={{
                      width: `${homePercent}%`,
                      backgroundColor: game.home_team.color,
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-center whitespace-normal">
                {stat.label}
              </div>

              <div className="text-left border-l border-dashed py-2 ps-2">
                <div className="font-bold">{stat.away_value}</div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <div
                    className="h-3 rounded-xl"
                    style={{
                      width: `${awayPercent}%`,
                      backgroundColor: game.away_team.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2">
          Team Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium border-t border-b py-4">
          <Skeleton className="h-6 w-12 mx-auto" />
          <div></div>
          <Skeleton className="h-6 w-12 mx-auto" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-3 items-center gap-4 my-3">
            <div className="text-right">
              <Skeleton className="h-6 w-12 ml-auto" />
              <Skeleton className="h-2 w-full mt-1" />
            </div>

            <Skeleton className="h-4 w-20 mx-auto" />

            <div className="text-left">
              <Skeleton className="h-6 w-12 mr-auto" />
              <Skeleton className="h-2 w-full mt-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
