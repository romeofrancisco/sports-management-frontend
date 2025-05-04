import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamStatsComparison } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";

export default function TeamStatsComparison({ game }) {
  const { gameId } = useParams();
  const { data: statComparison, isLoading } = useTeamStatsComparison(gameId);

  // Calculate a dynamic maximum value for each stat type
  const getMaxValue = (label, homeValue, awayValue) => {
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

  if (
    !statComparison ||
    !statComparison.comparison_stats ||
    statComparison.comparison_stats.length === 0
  ) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Team Stats</h2>
          <div className="text-center text-muted-foreground py-8">
            No comparable stats available
          </div>
        </CardContent>
      </Card>
    );
  }

  const { home_team, away_team, comparison_stats } = statComparison;

  return (
    <Card>
      <CardContent>
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 border-b border-dashed pb-2 mb-2">
            Team Comparison
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium mb-2">
          <div className="flex items-center gap-2 justify-start">
            <img
              className="w-9"
              src={game.home_team.logo}
              alt={`${home_team.abbreviation} logo`}
            />
            {home_team.abbreviation}
          </div>
          <span></span>
          <div className="flex items-center gap-2 justify-start">
            <img
              className="w-9"
              src={game.away_team.logo}
              alt={`${away_team.abbreviation} logo`}
            />
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
                    className="h-3  rounded-xl"
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
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Team Stats</h2>
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
