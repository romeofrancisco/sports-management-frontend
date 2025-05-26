import React from "react";
import SportStatsActions from "../SportStatsActions";
import { CircleCheck, CircleX } from "lucide-react";

const getRecordingColumns = ({ setSelectedStat, modals, filter }) => {
  return [
    {
      accessorKey: "name",
      header: "Stat Name",
      cell: ({ getValue }) => getValue(),
    },    {
      accessorKey: "is_record",
      header: () => <div className="text-center">Recording</div>,
      cell: ({ getValue }) => (
        <div className="flex justify-center">
          {getValue() ? (
            <CircleCheck size={20} className="text-red-900 self-center" />
          ) : (
            <CircleX size={20} className="text-red-700" />
          )}
        </div>
      ),
      size: 80,
    },    {
      accessorKey: "is_points",
      header: () => <div className="text-center">Points</div>,
      cell: ({ getValue, row }) => (
        <div className="flex justify-center">
          {getValue() ? (
            <CircleCheck size={20} className="text-red-900 self-center" />
          ) : (
            <CircleX size={20} className="text-red-700" />
          )}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "uses_point_value",
      header: () => <div className="text-center">Uses Points</div>,      cell: ({ getValue, row }) => (
        <div className="flex justify-center">
          {getValue() ? (
            <CircleCheck size={20} className="text-red-900 self-center" />
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
      cell: ({ getValue }) => (        <div className="flex justify-center">
          {getValue() ? (
            <CircleCheck size={20} className="text-red-900 self-center" />
          ) : (
            <CircleX size={20} className="text-red-700" />
          )}
        </div>
      ),
      size: 80,
    },
    ...(filter.is_record === false ? [
      {
        accessorKey: "expression",
        header: "Formula",
        cell: ({ getValue }) => (
          <div className="whitespace-normal break-words text-xs text-muted-foreground">
            {getValue() ? getValue() : "N/A"} 
          </div>
        ),
      },
    ] : []),
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

export default getRecordingColumns;