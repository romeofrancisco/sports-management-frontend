import React from "react";
import SportStatsActions from "../SportStatsActions";
import { CircleCheck, CircleX } from "lucide-react";

const getDisplayColumns = ({ setSelectedStat, modals }) => {
  return [
    {
      accessorKey: "name",
      header: "Stat Name",
      cell: ({ getValue }) => getValue(),
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

export default getDisplayColumns;