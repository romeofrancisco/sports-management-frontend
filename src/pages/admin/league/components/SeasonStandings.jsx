import React from "react";
import DataTable from "@/components/common/DataTable";
import { SPORT_STANDING_CONFIG } from "@/constants/sport";

const SeasonStandings = ({ standings, sport }) => {
  if (!standings) return null;

  const { has_tie, scoring_type } = sport;
  const config = SPORT_STANDING_CONFIG[scoring_type];

  const baseColumns = [
    {
      id: "team",
      header: () => <div className="text-left ms-5 w-auto">Team</div>,
      cell: ({ row }) => {
        const { logo, name, standings } = row.original;
        return (
          <div className="text-left ms-5 w-auto flex items-center gap-4">
            <span className="w-3 text-end">{standings.rank}</span>
            <img src={logo} alt={name} className="size-7" />
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "standings.matches_played",
      header: () => <div className="text-center w-auto">MP</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto">{getValue()}</div>
      ),
      size: 10,
    },
    {
      accessorKey: "standings.wins",
      header: () => <div className="text-center w-auto">W</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto">{getValue()}</div>
      ),
      size: 10,
    },
    {
      accessorKey: "standings.losses",
      header: () => <div className="text-center w-auto">L</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto">{getValue()}</div>
      ),
      size: 10,
    },
  ];

  if (has_tie) {
    baseColumns.splice(2, 0, {
      accessorKey: "ties",
      header: () => <div className="text-center w-auto">T</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto">{getValue()}</div>
      ),
      size: 10,
    });
  }

  const formattedStatColumns = config.columns.map((col) => ({
    accessorKey: col.accessorKey,
    header: () => <div className="text-center w-auto">{col.header}</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-auto">{getValue()}</div>
    ),
    size: 10,
  }));

  const columns = [...baseColumns, ...formattedStatColumns];

  return <DataTable columns={columns} data={standings} width="w-[10rem]" showPagination={false} />;
};

export default SeasonStandings;
