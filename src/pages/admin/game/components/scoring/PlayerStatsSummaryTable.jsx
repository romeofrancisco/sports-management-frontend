import React, { useMemo, useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useSelector } from "react-redux";
import { getPeriodLabel, SCORING_TYPE_VALUES } from "@/constants/sport";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const PlayerStatsSummaryTable = ({
  players,
  has_period = true,
  selectedPeriod = "total",
}) => {
  const { current_period } = useSelector((state) => state.game);
  const { scoring_type } = useSelector((state) => state.sport);

  // Flatten stats from grouped categories
  const flattenStats = (statsArray) => {
    if (!statsArray || !Array.isArray(statsArray)) return [];

    const flattened = [];
    statsArray.forEach((categoryGroup) => {
      if (categoryGroup.stats && Array.isArray(categoryGroup.stats)) {
        flattened.push(...categoryGroup.stats);
      }
    });
    return flattened;
  };

  // Get available periods from the first player's stats
  const availablePeriods = useMemo(() => {
    const periods = new Set(["total"]);

    // Safely check if players array exists, has elements, and if stats property is an array with elements
    if (
      players &&
      Array.isArray(players) &&
      players.length > 0 &&
      players[0]?.stats &&
      Array.isArray(players[0].stats) &&
      players[0].stats.length > 0
    ) {
      // Flatten the grouped stats to access period_values
      const flatStats = flattenStats(players[0].stats);
      if (flatStats.length > 0) {
        Object.keys(flatStats[0].period_values || {}).forEach((period) => {
          periods.add(period);
        });
      }
    }

    return Array.from(periods).sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return parseInt(a) - parseInt(b);
    });
  }, [players]);

  // Process data for the table based on selected period
  const tableData = useMemo(() => {
    if (!players || !Array.isArray(players)) return [];

    return players.map((player) => {
      const rowData = {
        id: player.id,
        name: player.name,
        jersey_number: player.jersey_number,
        team_id: player.team_id,
        total_points: player.total_points,
      };

      // For set-based scoring, add period points
      if (scoring_type === SCORING_TYPE_VALUES.SETS) {
        if (selectedPeriod !== "total") {
          rowData.points = player.period_points?.[selectedPeriod] || 0;
        } else {
          // Calculate total points from all periods
          rowData.total_points = Object.values(
            player.period_points || {}
          ).reduce((sum, points) => sum + points, 0);
        }
      }

      // Add stats to row data
      if (player.stats && Array.isArray(player.stats)) {
        // Flatten grouped stats
        const flatStats = flattenStats(player.stats);

        flatStats.forEach((stat) => {
          if (scoring_type === SCORING_TYPE_VALUES.SETS) {
            if (selectedPeriod === "total") {
              // For ratio stats that have period-specific values
              if (typeof stat.value === "object") {
                rowData[stat.display_name] = Object.values(stat.value).join(
                  ", "
                );
              } else {
                rowData[stat.display_name] = stat.value;
              }
            } else {
              // For period-specific values
              if (
                typeof stat.value === "object" &&
                stat.value[selectedPeriod]
              ) {
                rowData[stat.display_name] = stat.value[selectedPeriod];
              } else {
                rowData[stat.display_name] =
                  stat.period_values?.[selectedPeriod] || 0;
              }
            }
          } else {
            // For points scoring type, always use the total value
            rowData[stat.display_name] = stat.value;
          }
        });
      }

      return rowData;
    });
  }, [players, selectedPeriod, scoring_type]);

  // Get all stat display names for columns
  const allStatDisplayNames = useMemo(() => {
    if (
      !players ||
      !Array.isArray(players) ||
      players.length === 0 ||
      !players[0]?.stats ||
      !Array.isArray(players[0].stats) ||
      players[0].stats.length === 0
    ) {
      return [];
    }

    // Flatten grouped stats to get all display names
    const flatStats = flattenStats(players[0].stats);
    return flatStats.map((stat) => stat.display_name);
  }, [players]);

  // Generate columns with category grouping
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "player",
        header: () => <span className="ps-4">Player</span>,
        cell: ({ row }) => {
          const { jersey_number, name } = row.original;
          return (
            <div className="grid grid-cols-[1rem_auto] gap-2 ps-1">
              <span className="text-muted-foreground text-end">
                {jersey_number}
              </span>
              <span>{name}</span>
            </div>
          );
        },
      },
    ];

    // Group stats by category
    if (
      !players ||
      !Array.isArray(players) ||
      players.length === 0 ||
      !players[0]?.stats ||
      !Array.isArray(players[0].stats)
    ) {
      return baseColumns;
    }

    const categoryColumns = players[0].stats.map((categoryGroup) => {
      const subColumns = categoryGroup.stats.map((stat) => ({
        id: stat.display_name,
        accessorKey: stat.display_name,
        header: () => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center text-xs select-none">
                {stat.display_name}
              </div>
            </TooltipTrigger>
            <TooltipContent>{stat.name}</TooltipContent>
          </Tooltip>
        ),
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className="text-center text-muted-foreground">
              {value !== undefined ? value : "-"}
            </div>
          );
        },
        size: 50,
      }));

      return {
        id: categoryGroup.category, // Add id for the parent column group
        header: () => (
          <div className="text-center font-bold text-xs">
            {categoryGroup.category === "Other"
              ? ""
              : categoryGroup.category.toUpperCase()}
          </div>
        ),
        columns: subColumns,
      };
    });

    return [...baseColumns, ...categoryColumns];
  }, [players, selectedPeriod, scoring_type]);

  return (
    <div className="max-w-[calc(100vw-3rem)] lg:max-w-[77rem]">
      <DataTable
        columns={columns}
        data={tableData}
        showPagination={false}
        className="text-xs"
      />
    </div>
  );
};

export default PlayerStatsSummaryTable;
