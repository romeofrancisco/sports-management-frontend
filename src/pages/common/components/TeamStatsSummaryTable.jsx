import React, { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import formatPeriod from "@/utils/formatPeriod";
import { useSelector } from "react-redux";

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

const sortGroups = (groups) =>
  Object.entries(groups).sort(([, a], [, b]) =>
    a.isComposite === b.isComposite ? 0 : a.isComposite ? 1 : -1
  );

const TeamStatsSummaryTable = ({ team }) => {
  const { max_period } = useSelector((state) => state.sport);

  const periodsWithTotal = useMemo(() => {
    const periods = team.periods.map((p) => ({
      period: p.period,
      points: p.points,
      ...p.base_stats,
      ...p.calculated_stats,
    }));

    const total = {
      period: "Total",
      ...team.total_stats.base_stats,
      ...team.total_stats.calculated_stats,
      points: team.total_points,
    };

    return [...periods, total];
  }, [team]);

  const allStatKeys = useMemo(() => {
    const sample = periodsWithTotal[0] || {};
    return Object.keys(sample).filter((key) => key !== "period");
  }, [periodsWithTotal]);

  const groupedStats = useMemo(() => {
    const groups = groupStatKeys(allStatKeys);
    return sortGroups(groups);
  }, [allStatKeys]);

  const columns = useMemo(() => {
    const periodColumn = {
      accessorKey: "period",
      header: "Period",
      cell: ({ getValue }) => {
        const value = getValue();
        const display =
          typeof value === "number" ? formatPeriod(value, max_period) : value;

        return <span className="font-medium">{display}</span>;
      },
    };

    const pointsColumn = {
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
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className="font-medium text-muted-foreground">
            {typeof value === "number" ? value : "–"}
          </span>
        );
      },
    };

    const statColumns = groupedStats.flatMap(([prefix, group]) => {
      if (group.isComposite) {
        return [
          {
            id: `${prefix}_composite`,
            header: `${prefix}`,
            accessorFn: (row) => {
              const made = row[`${prefix}_MA`] ?? 0;
              const att = row[`${prefix}_AT`] ?? 0;
              return { made, att };
            },
            cell: ({ getValue }) => {
              const { made, att } = getValue();
              return (
                <span className="text-muted-foreground">
                  {made}/{att}
                </span>
              );
            },
          },
          {
            id: `${prefix}_pct`,
            header: `${prefix}%`,
            accessorFn: (row) => {
              const pc = row[`${prefix}_PC`] ?? 0;
              return pc;
            },
            cell: ({ getValue }) => (
              <span className="text-muted-foreground">
                {getValue().toFixed(1)}%
              </span>
            ),
          },
        ];
      }

      return {
        accessorKey: prefix,
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="text-xs"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Optional sorting
          >
            {prefix} <ArrowUpDown className="size-3" />
          </Button>
        ),
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span className="text-muted-foreground">
              {typeof value === "number"
                ? value.toFixed(1).replace(/\.0$/, "")
                : value}
            </span>
          );
        },
      };
    });

    // PTS is second column now
    return [periodColumn, pointsColumn, ...statColumns];
  }, [groupedStats]);

  return (
    <>
      <h1 className="text-xl font-medium">{team.team_name}</h1>
      <DataTable
        columns={columns}
        data={periodsWithTotal}
        showPagination={false}
        className="text-xs"
      />
    </>
  );
};

export default TeamStatsSummaryTable;
