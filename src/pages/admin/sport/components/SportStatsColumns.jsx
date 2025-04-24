import React from "react";
import SportStatsActions from "./SportStatsActions";

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
      size: 50
    },
  ];

  if (filter.is_record) {
    return withActionCol([
      {
        accessorKey: "display_name",
        header: "Display Name",
        cell: ({ getValue }) => getValue(),
        size: 100
      },
      {
        accessorKey: "point_value",
        header: "Points",
        cell: ({ getValue }) => getValue(),
        size: 50
      },
    ]);
  } else {
    return withActionCol([
      {
        accessorKey: "expression",
        header: "Formula",
        cell: ({ getValue }) => (
          <div className="whitespace-normal break-words text-xs text-muted-foreground">{getValue()}</div>
        ),
      }
    ]);
  }
};

export default getSportStatsColumn;
