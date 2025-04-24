import React from "react";
import SportPositionActions from "./SportPositionActions";

const getSportPositionsColumn = ({ setSelectedPosition, modals }) => {
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
        <SportPositionActions
          position={row.original}
          setSelectedPosition={setSelectedPosition}
          modals={modals}
        />
      ),
      size: 50,
    },
  ];
};

export default getSportPositionsColumn;
