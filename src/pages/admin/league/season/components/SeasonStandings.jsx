import React from "react";
import DataTable from "@/components/common/DataTable";
import { SPORT_STANDING_CONFIG } from "@/constants/sport";
import { Medal, Trophy, TrendingUp } from "lucide-react";

const SeasonStandings = ({ standings, sport }) => {
  if (!standings) return null;

  const { has_tie, scoring_type } = sport;
  const isSetBased = scoring_type === "sets";
  const isPointBased = scoring_type === "points";

  // Track which accessor keys we're already using to avoid duplicates
  const usedAccessorKeys = new Set();

  // Team name and rank column
  const baseColumns = [
    {
      id: "team",
      header: () => <div className="text-left ms-5 w-auto">Team</div>,
      cell: ({ row }) => {
        const { logo, name, standings } = row.original;
        const rank = standings.rank;

        // Simplified rank styling
        let icon = null;
        let textColor = "text-muted-foreground";
        
        if (rank === 1) {
          icon = <Trophy className="text-amber-500" size={16} />;
          textColor = "text-amber-500";
        } else if (rank === 2) {
          icon = <Medal className="text-gray-400" size={16} />;
          textColor = "text-gray-400";
        } else if (rank === 3) {
          icon = <Medal className="text-amber-700" size={16} />;
          textColor = "text-amber-700";
        }

        return (
          <div className="text-left ms-5 w-auto flex items-center gap-4">
            <div className={`w-5 text-end font-medium flex items-center justify-end ${textColor}`}>
              {icon || rank}
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
      header: "MP",
      cell: ({ getValue }) => getValue(),
      size: 10,
    },
    {
      accessorKey: "standings.wins",
      header: "W",
      cell: ({ getValue }) => <div className="text-emerald-600">{getValue()}</div>,
      size: 10,
    },
    {
      accessorKey: "standings.losses",
      header: "L",
      cell: ({ getValue }) => <div className="text-rose-600">{getValue()}</div>,
      size: 10,
    },
  ];

  // Add each column to tracking Set
  baseColumns.forEach(col => {
    if (col.accessorKey) usedAccessorKeys.add(col.accessorKey);
  });

  // Add ties column if sport has ties
  if (has_tie) {
    const tiesColumn = {
      accessorKey: "standings.ties",
      header: "T",
      cell: ({ getValue }) => <div className="text-amber-600">{getValue()}</div>,
      size: 10,
    };
    baseColumns.splice(3, 0, tiesColumn);
    usedAccessorKeys.add(tiesColumn.accessorKey);
  }

  // Sport-specific columns
  const sportColumns = [];
  
  if (isSetBased) {
    sportColumns.push(
      {
        accessorKey: "standings.sets_won",
        header: "SW",
        cell: ({ getValue }) => getValue() || 0,
        size: 10,
      },
      {
        accessorKey: "standings.sets_lost",
        header: "SL",
        cell: ({ getValue }) => getValue() || 0,
        size: 10,
      },
      {
        accessorKey: "standings.set_ratio",
        header: "SR",
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return typeof value === "number" ? value.toFixed(3) : "0.000";
        },
        size: 15,
      },
      {
        accessorKey: "standings.points",
        header: "PTS",
        cell: ({ getValue }) => <div className="font-bold">{getValue() || 0}</div>,
        size: 10,
      }
    );
  } else if (isPointBased) {
    sportColumns.push(
      {
        accessorKey: "standings.points_scored",
        header: "PF",
        cell: ({ getValue }) => getValue() || 0,
        size: 10,
      },
      {
        accessorKey: "standings.points_conceded",
        header: "PA",
        cell: ({ getValue }) => getValue() || 0,
        size: 10,
      },
      {
        accessorKey: "standings.point_differential",
        header: "PD",
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const textClass = value > 0 ? "text-emerald-600" : value < 0 ? "text-rose-600" : "";
          const prefix = value > 0 ? "+" : "";
          return <div className={textClass}>{`${prefix}${value}`}</div>;
        },
        size: 10,
      },
      {
        accessorKey: "standings.points",
        header: "PTS",
        cell: ({ getValue }) => <div className="font-bold">{getValue() || 0}</div>,
        size: 10,
      },
      {
        accessorKey: "standings.win_percentage",
        header: "Win%",
        cell: ({ getValue }) => `${((getValue() || 0) * 100).toFixed(1)}%`,
        size: 10,
      }
    );
  }

  // Track sport-specific columns
  sportColumns.forEach(col => {
    if (col.accessorKey) usedAccessorKeys.add(col.accessorKey);
  });

  // Add custom sport config columns that haven't already been added
  const config = SPORT_STANDING_CONFIG[scoring_type] || { columns: [] };
  const customColumns = config.columns
    .filter(col => !usedAccessorKeys.has(col.accessorKey))
    .map((col) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      cell: ({ getValue }) => {
        const value = getValue() || 0;
        if (col.type === "percentage") return `${(value * 100).toFixed(1)}%`;
        if (col.type === "decimal") return value.toFixed(2);
        return value;
      },
      size: 10,
    }));

  // Format all columns with consistent structure
  const formatColumn = (col) => ({
    ...col,
    header: typeof col.header === 'string' 
      ? () => <div className="text-center w-auto">{col.header}</div> 
      : col.header,
    cell: ({ getValue, ...rest }) => {
      const originalCell = col.cell;
      return (
        <div className="text-center w-auto font-medium">
          {originalCell ? originalCell({ getValue, ...rest }) : (getValue() || 0)}
        </div>
      );
    }
  });

  // Apply formatting to all columns
  const formattedColumns = [
    ...baseColumns.map(formatColumn),
    ...sportColumns.map(formatColumn),
    ...customColumns.map(formatColumn)
  ];

  const rankingDescription = isSetBased
    ? "Teams are ranked based on match points first, followed by set ratio and sets won."
    : isPointBased
    ? "Teams are ranked based on total points, followed by point differential and points scored."
    : "Teams are ranked based on total points, followed by win percentage.";

  return (
    <div className="bg-card rounded-lg border shadow-md overflow-hidden p-5">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Season Standings
      </h2>
      <DataTable
        columns={formattedColumns}
        data={standings}
        showPagination={false}
        alternateRowColors={true}
        className="text-sm"
      />
      <div className="mt-4 text-xs text-muted-foreground">
        <span>{rankingDescription}</span>
      </div>
    </div>
  );
};

export default SeasonStandings;
