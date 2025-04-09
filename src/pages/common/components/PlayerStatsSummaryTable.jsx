import React, { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Helper to calculate total points
const addTotalPoints = (players) =>
  players.map((player) => ({
    ...player,
    total_points: player.periods.reduce((sum, p) => sum + p.points, 0),
  }));
// Extract all unique stat keys
const getAllStatKeys = (players) => [
  ...new Set(
    players.flatMap(({ total_stats }) => [
      ...Object.keys(total_stats.base_stats),
      ...Object.keys(total_stats.calculated_stats),
    ])
  ),
];
// Group stats by prefix and mark composites
const groupStatKeys = (keys) =>
  keys.reduce((acc, key) => {
    const match = key.match(/^(.*?)(?:_(MA|AT|PC))?$/);
    const prefix = match[1];
    if (!acc[prefix]) {
      acc[prefix] = { keys: [], isComposite: false };
    }
    acc[prefix].keys.push(key);
    if (/_MA$|_AT$|_PC$/.test(key)) {
      acc[prefix].isComposite = true;
    }
    return acc;
  }, {});
// Sort groups: non-composites first
const sortGroups = (groups) =>
  Object.entries(groups).sort(([, a], [, b]) =>
    a.isComposite === b.isComposite ? 0 : a.isComposite ? 1 : -1
  );

const PlayerStatsSummaryTable = ({ players }) => {
  const playersWithTotalPoints = useMemo(
    () => addTotalPoints(players),
    [players]
  );

  const allStatKeys = useMemo(
    () => getAllStatKeys(playersWithTotalPoints),
    [playersWithTotalPoints]
  );

  const statGroups = useMemo(() => groupStatKeys(allStatKeys), [allStatKeys]);

  const sortedGroupEntries = useMemo(
    () => sortGroups(statGroups),
    [statGroups]
  );

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
        accessorKey: "total_points",
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
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.total_points}</span>,
      },
    ];

    const statGroupColumns = sortedGroupEntries.flatMap(
      ([groupName, group]) => {
        if (group.isComposite) {
          return [
            {
              accessorKey: `${groupName}_composite`,
              header: groupName,
              cell: ({ row }) => {
                const stats = row.original.total_stats.calculated_stats;
                const made = stats[`${groupName}_MA`] ?? 0;
                const att = stats[`${groupName}_AT`] ?? 0;
                return (
                  <span className="text-muted-foreground">{`${made}/${att}`}</span>
                );
              },
            },
            {
              accessorKey: `${groupName}_pct`,
              header: `${groupName}%`,
              cell: ({ row }) => {
                const pc =
                  row.original.total_stats.calculated_stats[
                    `${groupName}_PC`
                  ] ?? 0;
                return (
                  <span className="text-muted-foreground">{`${pc.toFixed(
                    1
                  )}%`}</span>
                );
              },
            },
          ];
        }

        return {
          id: groupName,
          accessorFn: ({ total_stats }) =>
            total_stats.base_stats[groupName] ??
            total_stats.calculated_stats[groupName] ??
            0,
          header: ({ column }) => (
            <Button
              variant="ghost"
              className="text-xs"
              size="xs"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {groupName} <ArrowUpDown className="size-3" />
            </Button>
          ),
          cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
        };
      }
    );

    return [...baseColumns, ...statGroupColumns];
  }, [sortedGroupEntries]);

  return (
    <DataTable
      columns={columns}
      data={playersWithTotalPoints}
      showPagination={false}
      className="text-xs"
    />
  );
};

export default PlayerStatsSummaryTable;
