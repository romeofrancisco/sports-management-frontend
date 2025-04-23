import React, { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";

// Helper functions (same as PlayerStatsSummaryTable)
const extractStatFamily = (stat) =>
  stat.replace(/(_MA|_AT|_PC|M|A|%|_M|_A|_%)$/, "");

const groupStatsByDynamicFamily = (stats) => {
  const groups = {};

  stats.forEach((stat) => {
    const family = extractStatFamily(stat);
    if (!groups[family]) groups[family] = [];
    groups[family].push(stat);
  });

  // Sort each group logically (M, A, %)
  const suffixOrder = ["MA", "M", "AT", "A", "PC", "%"];
  const getRank = (stat) =>
    suffixOrder.findIndex((s) => stat.endsWith(s)) !== -1
      ? suffixOrder.findIndex((s) => stat.endsWith(s))
      : 99;

  Object.values(groups).forEach((group) =>
    group.sort((a, b) => getRank(a) - getRank(b))
  );

  return groups;
};

const TeamStatsSummaryTable = ({ team }) => {
  const { max_period } = useSelector((state) => state.sport);

  // Combine all stats from periods and totals
  const allStats = useMemo(() => {
    const stats = new Set();
    
    // Get stats from periods
    team.periods?.forEach(period => {
      Object.keys(period.stats || {}).forEach(key => stats.add(key));
    });
    
    // Get stats from totals
    Object.keys(team.total_stats || {}).forEach(key => stats.add(key));
    
    return Array.from(stats);
  }, [team]);

  // Group stats by their family (similar to player table)
  const groupedStats = useMemo(
    () => groupStatsByDynamicFamily(allStats),
    [allStats]
  );

  // Format data for the table
  const tableData = useMemo(() => {
    const periods = team.periods?.map(period => ({
      period: period.period,
      points: period.points,
      ...period.stats
    })) || [];
    
    const totalRow = {
      period: "Total",
      points: team.total_points,
      ...team.total_stats
    };
    
    return [...periods, totalRow];
  }, [team]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "period",
        header: "Period",
        cell: ({ getValue }) => {
          const value = getValue();
          const display = 
            typeof value === "number" ? `Q${value}` : value;
          return <span className="font-medium">{display}</span>;
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
        cell: ({ getValue }) => (
          <span className="font-medium text-muted-foreground">
            {getValue()}
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
  }, [groupedStats]);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-medium">{team.team_name}</h1>
      <DataTable
        columns={columns}
        data={tableData}
        showPagination={false}
        className="text-xs"
      />
    </div>
  );
};

export default TeamStatsSummaryTable;