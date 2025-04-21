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
    size:70
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
        accessorKey: "calculation_type",
        header: "Calculation Type",
        cell: ({ getValue }) =>
          getValue()[0].toUpperCase() + getValue().slice(1),
      },
    ]);
  }
};

export default getSportStatsColumn;
