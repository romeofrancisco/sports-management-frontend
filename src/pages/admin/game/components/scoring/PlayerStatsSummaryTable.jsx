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
import { getPeriodLabel } from "@/constants/sport";

const PlayerStatsSummaryTable = ({ players }) => {
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
        total_stats: player.total_stats, // Include total_stats for reference
      };

      // Add stats to row data
      player.stats.forEach((stat) => {
        if (selectedPeriod === "total") {
          rowData[stat.display_name] = stat.value;
        } else {
          rowData[stat.display_name] = stat.period_values[selectedPeriod] || 0;
        }
      });

      return rowData;
    });
  }, [players, selectedPeriod]);

  // Get all stat display names for columns
  const allStatDisplayNames = useMemo(() => {
    if (players.length === 0 || players[0].stats.length === 0) return [];
    return players[0].stats.map((stat) => stat.display_name);
  }, [players]);

  // Group related stats (e.g., FGM, FGA, FG%)
  const groupedStats = useMemo(() => {
    const groups = {};

    allStatDisplayNames.forEach((stat) => {
      // Remove special characters to find base stat name
      const baseStat = stat
        .replace(/[%_]/g, "")
        .replace(/(M|A|MA|AT|PC|P|%)$/, "");

      if (!groups[baseStat]) groups[baseStat] = [];
      groups[baseStat].push(stat);
    });

    // Sort each group in logical order (M, A, %)
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => {
        const order = { M: 0, MA: 0, P: 0, A: 1, AT: 1, "%": 2, PC: 2 };
        const getSuffix = (s) => {
          const match = s.match(/(M|A|MA|AT|%|PC|P)$/);
          return match ? match[1] : "";
        };
        return (order[getSuffix(a)] || 0) - (order[getSuffix(b)] || 0);
      });
    });

    return groups;
  }, [allStatDisplayNames]);

  // Calculate period points
  const calculatePeriodPoints = (row, period) => {
    if (period === "total") return row.total_points;

    // Find point-contributing stats (PTS, 3PM, FTM, FGM)
    const pointStats = ["PTS", "3PM", "FTM", "FGM"].filter(
      (stat) => row.total_stats && row.total_stats[stat] !== undefined
    );

    if (pointStats.length === 0) return 0;

    // Calculate proportional points for the period
    const mainStat = pointStats[0];
    const totalValue = row.total_stats[mainStat];
    const periodValue = row[mainStat] || 0;

    if (totalValue === 0) return 0;
    return Math.round((periodValue / totalValue) * row.total_points);
  };

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
          <Button
            variant="ghost"
            className="text-xs"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PTS <ArrowUpDown className="size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {calculatePeriodPoints(row.original, selectedPeriod)}
          </span>
        ),
        size: 50,
      },
    ];

    const statColumns = Object.entries(groupedStats).flatMap(
      ([groupName, statKeys]) =>
        statKeys.map((stat) => ({
          id: stat,
          accessorKey: stat,
          header: () => <span className="text-xs">{stat}</span>,
          cell: ({ getValue }) => {
            const value = getValue();
            return (
              <span className="text-muted-foreground">
                {typeof value === "number" && value % 1 !== 0
                  ? value.toFixed(1)
                  : value}
              </span>
            );
          },
          size: 50,
        }))
    );

    return [...baseColumns, ...statColumns];
  }, [groupedStats, selectedPeriod]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Player Stats</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{getPeriodLabel(scoring_type)}:</span>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[100px] text-xs" size="sm">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {availablePeriods.map((period) => (
                <SelectItem className="text-xs" key={period} value={period}>
                  {period === "total" ? "Total" : `${getPeriodLabel(scoring_type)} ${period}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
