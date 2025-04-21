import React from "react";
import SportStatsActions from "./SportStatsActions";

const getSportPositionsColumn = ({ setSelectedStat, modals }) => {
  return [
    {
      accessorKey: "name",
      header: "Position Name",
      cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: "abbreviation",
        header: "Abbreviation",
        cell: ({ getValue }) => getValue(),
      },
    {
      id: "actions",
      cell: ({ row }) => (
        <SportStatsActions
          stat={row.original}
          setSelectedGame={setSelectedStat}
          modals={modals}
        />
      ),
      size: 50,
    },
  ];
};

export default getSportPositionsColumn;
