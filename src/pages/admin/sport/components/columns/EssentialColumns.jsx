import React from "react";
import SportStatsActions from "../SportStatsActions";
import { CircleCheck, CircleX } from "lucide-react";

const getEssentialColumns = ({ setSelectedStat, modals, filter }) => {
  return [
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
    ...(filter.is_record ? [
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
      }
    ] : [
      {
        accessorKey: "expression",
        header: "Formula",
        cell: ({ getValue }) => (
          <div className="whitespace-normal break-words text-xs text-muted-foreground">
            {getValue() ? getValue() : "N/A"} 
          </div>
        ),
      }
    ]),
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
    }
  ];
};

export default getEssentialColumns;