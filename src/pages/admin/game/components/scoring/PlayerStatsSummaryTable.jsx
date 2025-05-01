import React, { useMemo, useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { getPeriodLabel, SCORING_TYPE_VALUES } from "@/constants/sport";

const PlayerStatsSummaryTable = ({ players, has_period = true }) => {
  const { current_period } = useSelector((state) => state.game);
  const { scoring_type } = useSelector((state) => state.sport);
  const [selectedPeriod, setSelectedPeriod] = useState(String(current_period));

  // Get available periods from the first player's stats
  const availablePeriods = useMemo(() => {
    const periods = new Set(["total"]);
    if (players.length > 0 && players[0].stats.length > 0) {
      Object.keys(players[0].stats[0].period_values || {}).forEach((period) => {
        periods.add(period);
      });
    }
    return Array.from(periods).sort((a, b) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return parseInt(a) - parseInt(b);
    });
  }, [players]);

  // Process data for the table based on selected period
  const tableData = useMemo(() => {
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
          rowData.total_points = Object.values(player.period_points || {}).reduce((sum, points) => sum + points, 0);
        }
      }

      // Add stats to row data
      player.stats.forEach((stat) => {
        if (scoring_type === SCORING_TYPE_VALUES.SETS) {
          if (selectedPeriod === "total") {
            // For ratio stats that have period-specific values
            if (typeof stat.value === "object") {
              rowData[stat.display_name] = Object.values(stat.value).join(", ");
            } else {
              rowData[stat.display_name] = stat.value;
            }
          } else {
            // For period-specific values
            if (typeof stat.value === "object" && stat.value[selectedPeriod]) {
              rowData[stat.display_name] = stat.value[selectedPeriod];
            } else {
              rowData[stat.display_name] = stat.period_values?.[selectedPeriod] || 0;
            }
          }
        } else {
          // For points scoring type, always use the total value
          rowData[stat.display_name] = stat.value;
        }
      });

      return rowData;
    });
  }, [players, selectedPeriod, scoring_type]);

  // Get all stat display names for columns
  const allStatDisplayNames = useMemo(() => {
    if (players.length === 0 || players[0].stats.length === 0) return [];
    return players[0].stats.map((stat) => stat.display_name);
  }, [players]);

  // Generate columns
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
      {
        accessorKey: "points",
        header: ({ column }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-xs"
              size="xs"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              PTS <ArrowUpDown className="size-3" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-medium">
              {scoring_type === SCORING_TYPE_VALUES.SETS
                ? (selectedPeriod === "total"
                  ? row.original.total_points
                  : row.original.points)
                : row.original.total_points}
            </span>
          </div>
        ),
        size: 50,
      },
    ];

    const statColumns = allStatDisplayNames.map((stat) => ({
      id: stat,
      accessorKey: stat,
      header: () => <div className="text-center text-xs">{stat}</div>,
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
  }, [allStatDisplayNames, selectedPeriod, scoring_type]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Player Stats</h3>
        {scoring_type === SCORING_TYPE_VALUES.SETS && has_period && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {getPeriodLabel(scoring_type)}:
            </span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[100px] text-xs" size="sm">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((period) => (
                  <SelectItem className="text-xs" key={period} value={period}>
                    {period === "total"
                      ? "Total"
                      : `${getPeriodLabel(scoring_type)} ${period}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        showPagination={false}
        className="text-xs"
      />
    </>
  );
};

export default PlayerStatsSummaryTable;
