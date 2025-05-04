import React from "react";
import DataTable from "@/components/common/DataTable";
import { SPORT_STANDING_CONFIG } from "@/constants/sport";
import { Badge } from "@/components/ui/badge";
import { Award, Medal } from "lucide-react";

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
        const rank = standings.rank;
        
        // Styling for top 3 ranks
        const getRankStyle = (rank) => {
          if (rank === 1) return { icon: <Award className="text-amber-500" size={16} />, textColor: "text-amber-500" };
          if (rank === 2) return { icon: <Medal className="text-gray-400" size={16} />, textColor: "text-gray-400" };
          if (rank === 3) return { icon: <Medal className="text-amber-700" size={16} />, textColor: "text-amber-700" };
          return { icon: null, textColor: "text-muted-foreground" };
        };
        
        const rankStyle = getRankStyle(rank);
        
        return (
          <div className="text-left ms-5 w-auto flex items-center gap-4">
            <div className={`w-5 text-end font-medium flex items-center justify-end ${rankStyle.textColor}`}>
              {rankStyle.icon || rank}
            </div>
            <div className="relative size-7 flex items-center justify-center">
              <img src={logo} alt={name} className="size-7 rounded-full border" />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "standings.matches_played",
      header: () => <div className="text-center w-auto">MP</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium">{getValue()}</div>
      ),
      size: 10,
    },
    {
      accessorKey: "standings.wins",
      header: () => <div className="text-center w-auto">W</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-emerald-600">{getValue()}</div>
      ),
      size: 10,
    },
    {
      accessorKey: "standings.losses",
      header: () => <div className="text-center w-auto">L</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-rose-600">{getValue()}</div>
      ),
      size: 10,
    },
  ];

  // Add ties column if sport has ties
  if (has_tie) {
    baseColumns.splice(3, 0, {
      accessorKey: "standings.ties",
      header: () => <div className="text-center w-auto">T</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-amber-600">{getValue()}</div>
      ),
      size: 10,
    });
  }

  // Add sport-specific stat columns
  const formattedStatColumns = config?.columns?.map((col) => ({
    accessorKey: col.accessorKey,
    header: () => <div className="text-center w-auto">{col.header}</div>,
    cell: ({ getValue }) => (
      <div className="text-center w-auto font-medium">{getValue()}</div>
    ),
    size: 10,
  })) || [];

  const columns = [...baseColumns, ...formattedStatColumns];

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden p-5">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Season Standings</h2>
      <DataTable 
        columns={columns} 
        data={standings} 
        showPagination={false} 
        alternateRowColors={true}
        className="text-sm"
      />
    </div>
  );
};

export default SeasonStandings;
