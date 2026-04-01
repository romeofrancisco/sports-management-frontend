import React, { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { useSelector } from "react-redux";
import { SCORING_TYPE_VALUES } from "@/constants/sport";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const PlayerStatsSummaryTable = ({
  players,
  selectedPeriod = "total",
}) => {
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

  const mapPlayersToTableData = useMemo(() => {
    return (playerList) => {
      if (!playerList || !Array.isArray(playerList)) return [];

      return playerList.map((player) => {
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
    };
  }, [players, selectedPeriod, scoring_type]);

  const hasPlayingStatus = useMemo(() => {
    if (!Array.isArray(players)) return false;
    return players.some((player) =>
      Object.prototype.hasOwnProperty.call(player, "is_currently_playing")
    );
  }, [players]);

  const currentlyPlayingPlayers = useMemo(() => {
    if (
      !players ||
      !Array.isArray(players) ||
      players.length === 0
    ) {
      return [];
    }

    if (!hasPlayingStatus) return players;

    return players.filter((player) => Boolean(player.is_currently_playing));
  }, [players, hasPlayingStatus]);

  const benchPlayers = useMemo(() => {
    if (
      !players ||
      !Array.isArray(players) ||
      players.length === 0 ||
      !hasPlayingStatus
    ) {
      return [];
    }

    return players.filter((player) => !Boolean(player.is_currently_playing));
  }, [players, hasPlayingStatus]);

  const referencePlayer = useMemo(() => {
    if (!Array.isArray(players)) return null;

    return (
      players.find(
        (player) => Array.isArray(player?.stats) && player.stats.length > 0
      ) || null
    );
  }, [players]);

  // Generate columns with category grouping
  const getColumns = useMemo(() => {
    return (playerHeaderLabel) => {
      const baseColumns = [
        {
          accessorKey: "player",
          header: () => <span className="ps-4">{playerHeaderLabel}</span>,
          cell: ({ row }) => {
            const { jersey_number, name } = row.original;
            return (
              <div className="grid grid-cols-[1rem_auto] gap-2 ps-1">
                <span className="text-muted-foreground text-end">
                  {jersey_number}
                </span>
                <span className="truncate" title={name}>
                  {name}
                </span>
              </div>
            );
          },
          size: 150,
        },
      ];

      // Group stats by category
      if (
        !referencePlayer?.stats ||
        !Array.isArray(referencePlayer.stats)
      ) {
        return baseColumns;
      }

      const statColumns = flattenStats(referencePlayer.stats).map((stat) => ({
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

      return [...baseColumns, ...statColumns];
    };
  }, [referencePlayer]);

  const renderSection = (playerHeaderLabel, playerList, emptyMessage) => (
    <section className="space-y-2">
      {playerList.length > 0 ? (
        <DataTable
          columns={getColumns(playerHeaderLabel)}
          data={mapPlayersToTableData(playerList)}
          showPagination={false}
          className="text-xs"
        />
      ) : (
        <div className="text-xs text-muted-foreground border rounded-md p-3">
          {emptyMessage}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-[calc(100vw-3rem)] lg:max-w-[77rem]">
      {renderSection(
        "ON FIELD/COURT",
        currentlyPlayingPlayers,
        "No players currently on the field/court."
      )}

      {hasPlayingStatus &&
        renderSection(
          "BENCH",
          benchPlayers,
          "No bench players available."
        )}
    </div>
  );
};

export default PlayerStatsSummaryTable;
