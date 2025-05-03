import React from "react";
import SportStatsActions from "./SportStatsActions";
import { CircleCheck, CircleX } from "lucide-react";

const baseColumns = [
  {
    accessorKey: "name",
    header: "Stat Name",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ getValue }) => getValue(),
    size: 100,
  },
  {
    accessorKey: "is_player_stat",
    header: () => <div className="text-center">Player Stat</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_team_stat",
    header: () => <div className="text-center">Team Stat</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_team_comparison",
    header: () => <div className="text-center">Team Comparison</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_player_summary",
    header: () => <div className="text-center">Player Summary</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_team_summary",
    header: () => <div className="text-center">Team Summary</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_boxscore",
    header: () => <div className="text-center">Boxscore</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_record",
    header: () => <div className="text-center">Recording</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700 self-center" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "is_negative",
    header: () => <div className="text-center">Negative</div>,
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {getValue() ? (
          <CircleCheck size={20} className="text-green-700 self-center" />
        ) : (
          <CircleX size={20} className="text-red-700" />
        )}
      </div>
    ),
    size: 80,
  },
];

const getSportStatsColumn = ({ setSelectedStat, modals, filter }) => {
  const withActionCol = (extraCols = []) => [
    ...baseColumns,
    ...extraCols,
    {
      id: "actions",
      cell: ({ row }) => (
        <SportStatsActions
          stat={row.original}
          setSelectedStat={setSelectedStat}
          modals={modals}
        />
      ),
      size: 50,
    },
  ];

  if (filter.is_record) {
    return withActionCol([
      {
        accessorKey: "display_name",
        header: "Display Name",
        cell: ({ getValue }) => getValue(),
        size: 100,
      },
      {
        accessorKey: "point_value",
        header: "Points",
        cell: ({ getValue }) => getValue(),
        size: 50,
      },
    ]);
  } else {
    return withActionCol([
      {
        accessorKey: "expression",
        header: "Formula",
        cell: ({ getValue }) => (
          <div className="whitespace-normal break-words text-xs text-muted-foreground">
            {getValue() ? getValue() : "N/A"} 
          </div>
        ),
      },
    ]);
  }
};

export default getSportStatsColumn;
