import React from "react";
import DataTable from "@/components/common/DataTable";
import { SPORT_STANDING_CONFIG } from "@/constants/sport";
import { Badge } from "@/components/ui/badge";
import { Award, Medal, Trophy, Star, TrendingUp } from "lucide-react";

const SeasonStandings = ({ standings, sport }) => {
  if (!standings) return null;

  const { has_tie, scoring_type } = sport;
  const isSetBased = scoring_type === "sets";
  
  // We'll filter out the config columns that would duplicate our standard columns
  const config = SPORT_STANDING_CONFIG[scoring_type];
  const filteredConfigColumns = config?.columns?.filter(col => {
    // Filter out columns that we're already handling explicitly
    if (isSetBased && (col.header === 'SW' || col.header === 'SL' || col.header === 'SR')) {
      return false;
    }
    return true;
  }) || [];

  // No need to sort in the frontend - data comes pre-sorted from the backend
  // Backend handles proper sorting by points, set ratio, etc.

  const baseColumns = [
    {
      id: "team",
      header: () => <div className="text-left ms-5 w-auto">Team</div>,
      cell: ({ row }) => {
        const { logo, name, standings } = row.original;
        const rank = standings.rank;
        
        // Styling for top 3 ranks
        const getRankStyle = (rank) => {
          if (rank === 1) return { icon: <Trophy className="text-amber-500" size={16} />, textColor: "text-amber-500" };
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

  // Add scoring-type specific columns
  if (isSetBased) {
    // For set-based sports (volleyball, tennis, etc.)
    const setScoringColumns = [
      {
        accessorKey: "standings.sets_won",
        header: () => <div className="text-center w-auto">Sets W</div>,
        cell: ({ getValue }) => (
          <div className="text-center w-auto font-medium">{getValue() || 0}</div>
        ),
        size: 10,
      },
      {
        accessorKey: "standings.sets_lost",
        header: () => <div className="text-center w-auto">Sets L</div>,
        cell: ({ getValue }) => (
          <div className="text-center w-auto font-medium">{getValue() || 0}</div>
        ),
        size: 10,
      },
      {
        accessorKey: "standings.set_ratio",
        header: () => <div className="text-center w-auto">Set Ratio</div>,
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center w-auto font-medium">
              {typeof value === 'number' ? value.toFixed(3) : '0.000'}
            </div>
          )
        },
        size: 15,
      },
      {
        accessorKey: "standings.points",
        header: () => (
          <div className="text-center w-auto flex items-center justify-center gap-1">
            <Star size={12} className="text-amber-500" />
            <span>Points</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-center w-auto font-bold">{getValue() || 0}</div>
        ),
        size: 10,
      },
    ];
    
    baseColumns.push(...setScoringColumns);
  } else {
    // For point-based sports (basketball, football, etc.)
    const pointScoringColumns = [
      {
        accessorKey: "standings.points",
        header: () => (
          <div className="text-center w-auto flex items-center justify-center gap-1">
            <Star size={12} className="text-amber-500" />
            <span>PTS</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-center w-auto font-bold">{getValue() || 0}</div>
        ),
        size: 10,
      },
      {
        accessorKey: "standings.win_percentage",
        header: () => <div className="text-center w-auto">Win%</div>,
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center w-auto font-medium">
              {(value * 100).toFixed(1)}%
            </div>
          )
        },
        size: 10,
      },
    ];
    
    baseColumns.push(...pointScoringColumns);
  }

  // Add any custom sport-specific columns from configuration
  const formattedStatColumns = filteredConfigColumns.map((col) => ({
    accessorKey: col.accessorKey,
    header: () => <div className="text-center w-auto">{col.header}</div>,
    cell: ({ getValue }) => {
      const value = getValue() || 0;
      // Format value based on type
      let displayValue = value;
      if (col.type === 'percentage') {
        displayValue = `${(value * 100).toFixed(1)}%`;
      } else if (col.type === 'decimal') {
        displayValue = value.toFixed(2);
      }
      
      return (
        <div className="text-center w-auto font-medium">{displayValue}</div>
      );
    },
    size: 10,
  }));

  const columns = [...baseColumns, ...formattedStatColumns];

  return (
    <div className="bg-card rounded-lg border shadow-md overflow-hidden p-5">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Season Standings
        {isSetBased && (
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            Set-based Scoring
          </Badge>
        )}
      </h2>
      <DataTable 
        columns={columns} 
        data={standings} 
        showPagination={false} 
        alternateRowColors={true}
        className="text-sm"
      />
      
      <div className="mt-4 text-xs text-muted-foreground">
        {isSetBased ? (
          <span>Teams are ranked based on match points first, followed by set ratio and sets won.</span>
        ) : (
          <span>Teams are ranked based on total points, followed by win percentage.</span>
        )}
      </div>
    </div>
  );
};

export default SeasonStandings;
