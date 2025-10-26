import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SCORING_TYPE_VALUES } from "@/constants/sport";

const TeamStatsSummary = ({ teamStats, selectedPeriod = "total" }) => {
  const { home_team, away_team } = useSelector((state) => state.game);
  const { home_team: homeStats, away_team: awayStats } = teamStats || {};
  const { win_points_threshold } = useSelector((state) => state.sport);
  const { scoring_type } = useSelector((state) => state.sport);

  // Get stat names in order provided by backend
  const statNames = homeStats?.total_stats
    ? Object.keys(homeStats.total_stats)
    : [];

  // Helper to format the stat value based on its type
  const formatStat = (value) => {
    if (typeof value === "string" && value.includes("/")) {
      return value;
    }
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return value;
      }
      return value;
    }
    return value;
  };

  // Get the selected period data
  const getSelectedPeriodData = () => {
    if (!selectedPeriod) return null;

    const homePeriod = homeStats?.periods?.find(
      (p) => p.period === selectedPeriod
    );
    const awayPeriod = awayStats?.periods?.find(
      (p) => p.period === selectedPeriod
    );

    return { homePeriod, awayPeriod };
  };

  const periodData = getSelectedPeriodData();

  // Calculate max value for visualization bars
  const getMaxValue = (homeValue, awayValue, statName = "") => {
    // For Points stat in set-based sports, use win_points_threshold as max value
    if (scoring_type === SCORING_TYPE_VALUES.SETS && statName === "Points") {
      return win_points_threshold || 25; // fallback to 25 if threshold not set
    }

    // Special case for percentage stats (any stat containing %)
    if (
      statName.toLowerCase().includes("%") ||
      statName.toLowerCase().includes("percentage") ||
      statName.toLowerCase().includes("ratio")
    ) {
      // Check if we're dealing with a decimal-based percentage (like 0.311)
      if (homeValue < 1 && awayValue < 1) {
        return 1; // Decimal percentages are typically between 0-1
      }
      return 100; // Regular percentages are out of 100
    }

    const maxFromValues = Math.max(
      typeof homeValue === "number" ? homeValue : parseFloat(homeValue) || 0,
      typeof awayValue === "number" ? awayValue : parseFloat(awayValue) || 0
    );
    return Math.max(Math.ceil(maxFromValues * 1.5), 5);
  };

  return (
    <div>
      {/* Teams Header */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium mb-4">
        <div className="flex items-center gap-2 justify-start">
          <img src={home_team.logo} alt={home_team.name} className="w-9" />
          <span>{home_team.abbreviation}</span>
        </div>
        <span></span>
        <div className="flex items-center gap-2 justify-start">
          <span>{away_team.abbreviation}</span>
          <img src={away_team.logo} alt={away_team.name} className="w-9" />
        </div>
      </div>

      {/* Stats - Show total stats when no period is selected or "total" is selected */}
      {(!selectedPeriod || selectedPeriod === "total") && (
        <div>
          <div className="grid grid-cols-[1fr_5rem_1fr] items-center gap-4 border-t border-dashed">
            <div className="text-start border-r border-dashed py-2 pe-2">
              <div className="font-bold">
                {teamStats.home_team.total_points || 0}
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                <div
                  className="h-3 rounded-xl"
                  style={{
                    width: `${
                      ((teamStats.home_team.total_points || 0) /
                        getMaxValue(
                          teamStats.home_team.total_points || 0,
                          teamStats.away_team.total_points || 0
                        )) *
                      100
                    }%`,
                    backgroundColor: home_team.color || "#3b82f6",
                  }}
                ></div>
              </div>
            </div>

            <div className="text-xs text-center whitespace-normal">Points</div>

            <div className="text-left border-l border-dashed py-2 ps-2">
              <div className="font-bold">
                {teamStats.away_team.total_points || 0}
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                <div
                  className="h-3 rounded-xl"
                  style={{
                    width: `${
                      ((teamStats.away_team.total_points || 0) /
                        getMaxValue(
                          teamStats.home_team.total_points || 0,
                          teamStats.away_team.total_points || 0
                        )) *
                      100
                    }%`,
                    backgroundColor: away_team.color || "#ef4444",
                  }}
                ></div>
              </div>
            </div>
          </div>
          {statNames.map((statName, idx) => {
            const homeValue = homeStats?.total_stats[statName];
            const awayValue = awayStats?.total_stats[statName];
            const maxValue = getMaxValue(homeValue, awayValue, statName);
            const homePercent =
              ((typeof homeValue === "number"
                ? homeValue
                : parseFloat(homeValue) || 0) /
                maxValue) *
              100;
            const awayPercent =
              ((typeof awayValue === "number"
                ? awayValue
                : parseFloat(awayValue) || 0) /
                maxValue) *
              100;

            return (
              <div
                key={statName}
                className="grid grid-cols-[1fr_5rem_1fr] items-center gap-4 border-t border-dashed"
              >
                <div className="text-start border-r border-dashed py-2 pe-2">
                  <div className="font-bold">{formatStat(homeValue)}</div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                    <div
                      className="h-3 rounded-xl"
                      style={{
                        width: `${homePercent}%`,
                        backgroundColor: home_team.color || "#3b82f6",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-center whitespace-normal">
                  {statName}
                </div>

                <div className="text-left border-l border-dashed py-2 ps-2">
                  <div className="font-bold">{formatStat(awayValue)}</div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                    <div
                      className="h-3 rounded-xl"
                      style={{
                        width: `${awayPercent}%`,
                        backgroundColor: away_team.color || "#ef4444",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Period Stats */}
      {scoring_type === SCORING_TYPE_VALUES.SETS &&
        selectedPeriod &&
        selectedPeriod !== "total" &&
        periodData && (
          <div>
            <div className="grid grid-cols-[1fr_5rem_1fr] items-center gap-4 border-t border-dashed">
              <div className="text-start border-r border-dashed py-2 pe-2">
                <div className="font-bold">
                  {periodData.homePeriod?.points || 0}
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <div
                    className="h-3 rounded-xl"
                    style={{
                      width: `${
                        ((periodData.homePeriod?.points || 0) /
                          getMaxValue(
                            periodData.homePeriod?.points || 0,
                            periodData.awayPeriod?.points || 0,
                            "Points"
                          )) *
                        100
                      }%`,
                      backgroundColor: home_team.color || "#3b82f6",
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-center whitespace-normal">
                Points
              </div>

              <div className="text-left border-l border-dashed py-2 ps-2">
                <div className="font-bold">
                  {periodData.awayPeriod?.points || 0}
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <div
                    className="h-3 rounded-xl"
                    style={{
                      width: `${
                        ((periodData.awayPeriod?.points || 0) /
                          getMaxValue(
                            periodData.homePeriod?.points || 0,
                            periodData.awayPeriod?.points || 0,
                            "Points"
                          )) *
                        100
                      }%`,
                      backgroundColor: away_team.color || "#ef4444",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {periodData.homePeriod &&
              Object.entries(periodData.homePeriod.stats).map(
                ([statName, homeValue], idx) => {
                  const awayValue = periodData.awayPeriod?.stats[statName];
                  const maxValue = getMaxValue(homeValue, awayValue, statName);
                  const homePercent =
                    ((typeof homeValue === "number"
                      ? homeValue
                      : parseFloat(homeValue) || 0) /
                      maxValue) *
                    100;
                  const awayPercent =
                    ((typeof awayValue === "number"
                      ? awayValue
                      : parseFloat(awayValue) || 0) /
                      maxValue) *
                    100;

                  return (
                    <div
                      key={statName}
                      className="grid grid-cols-[1fr_5rem_1fr] items-center gap-4 border-t border-dashed"
                    >
                      <div className="text-start border-r border-dashed py-2 pe-2">
                        <div className="font-bold">{formatStat(homeValue)}</div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                          <div
                            className="h-3 rounded-xl"
                            style={{
                              width: `${homePercent}%`,
                              backgroundColor: home_team.color || "#3b82f6",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-xs text-center whitespace-normal">
                        {statName}
                      </div>

                      <div className="text-left border-l border-dashed py-2 ps-2">
                        <div className="font-bold">{formatStat(awayValue)}</div>
                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-xl">
                          <div
                            className="h-3 rounded-xl"
                            style={{
                              width: `${awayPercent}%`,
                              backgroundColor: away_team.color || "#ef4444",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        )}
    </div>
  );
};

export default TeamStatsSummary;
