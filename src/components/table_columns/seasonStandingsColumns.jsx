import { Medal, Trophy } from "lucide-react";
import { HeaderWithTooltip } from "@/components/common/TableHelpers";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";

export const getSeasonStandingsColumns = ({ sport, teamFormData = {} }) => {
  const { has_tie, scoring_type } = sport;
  const isSetBased = scoring_type === "sets";

  const baseColumns = [
    {
      id: "team",
      header: () => <div className="text-left md:ms-5">Team</div>,
      cell: ({ row }) => {
        const { logo, name, standings } = row.original;
        const rank = standings.rank;

        // Styling for top 3 ranks
        const getRankStyle = (rank) => {
          if (rank === 1)
            return {
              icon: <Trophy className="text-amber-500" size={16} />,
              textColor: "text-amber-500",
            };
          if (rank === 2)
            return {
              icon: <Medal className="text-gray-400" size={16} />,
              textColor: "text-gray-400",
            };
          if (rank === 3)
            return {
              icon: <Medal className="text-amber-700" size={16} />,
              textColor: "text-amber-700",
            };
          return { icon: null, textColor: "text-muted-foreground" };
        };

        const rankStyle = getRankStyle(rank);

        return (
          <div className="text-left md:ms-5 flex items-center gap-2 md:gap-4">
            <div
              className={`w-5 text-end font-medium flex items-center justify-end ${rankStyle.textColor}`}
            >
              {rankStyle.icon || rank}
            </div>
            <div className="relative size-7 flex items-center justify-center">
              <img
                src={logo}
                alt={name}
                className="size-7 rounded-full border"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
      size: 140, // Reduced from original
      minWidth: 120,
      meta: {
        priority: "high",
        mobileSize: 120,
        tabletSize: 130,
      },
    },
    {
      id: "form",
      header: () => (
        <div className="text-center">
          <HeaderWithTooltip label="STRK" tooltipText="Recent performance in last 5 games" />
        </div>
      ),
      cell: ({ row }) => {
        const teamId = row.original.standings.team_id;
        // Check if teamFormData exists and has the expected structure
        let formData = [];

        if (teamFormData && teamFormData.form && teamId) {
          // Convert to number if teamId is a string but form keys are numbers
          const formKey =
            typeof teamId === "string" ? parseInt(teamId, 10) : teamId;

          // Try both string and number keys to handle different API formats
          formData =
            teamFormData.form[teamId] || teamFormData.form[formKey] || [];
        }

        return (
          <div className="flex justify-center">
            <TeamStreakIndicator results={formData} />
          </div>
        );
      },
      size: 80,
      minWidth: 60,
      meta: {
        priority: "high",
        mobileSize: 60,
        tabletSize: 70,
      },
    },
    {
      accessorKey: "standings.matches_played",
      header: () => <div className="text-center w-auto">MP</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium">{getValue()}</div>
      ),
      size: 40, // Reduced from original
      minWidth: 35,
      meta: {
        priority: "high",
        mobileSize: 35,
        tabletSize: 40,
      },
    },
    {
      accessorKey: "standings.wins",
      header: () => <div className="text-center w-auto">W</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-emerald-600">
          {getValue()}
        </div>
      ),
      size: 40, // Reduced from original
      minWidth: 35, 
      meta: {
        priority: "high",
        mobileSize: 35,
        tabletSize: 40,
      },
    },
    {
      accessorKey: "standings.losses",
      header: () => <div className="text-center w-auto">L</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-rose-600">
          {getValue()}
        </div>
      ),
      size: 40, // Reduced from original
      minWidth: 35,
      meta: {
        priority: "high",
        mobileSize: 35,
        tabletSize: 40,
      },
    },
    {
      accessorKey: "standings.point_differential",
      header: () => <div className="text-center w-auto">PD</div>,
      cell: ({ getValue }) => {
        const value = getValue() || 0;
        return (
          <div
            className={`text-center w-auto font-medium ${
              value > 0 ? "text-emerald-600" : value < 0 ? "text-rose-600" : ""
            }`}
          >
            {value > 0 ? "+" : ""}
            {value}
          </div>
        );
      },
      size: 45, // Reduced from original
      minWidth: 40,
      meta: {
        priority: "high",
        mobileSize: 40,
        tabletSize: 45, 
      },
    },
    {
      accessorKey: "standings.points",
      header: () => <div className="text-center w-auto">PTS</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-bold">{getValue() || 0}</div>
      ),
      size: 45, // Reduced from original
      minWidth: 40,
      meta: {
        priority: "high",
        mobileSize: 40,
        tabletSize: 45,
      },
    },
  ];

  // Add ties column if sport has ties
  if (has_tie) {
    baseColumns.splice(4, 0, {
      accessorKey: "standings.ties",
      header: () => <div className="text-center w-auto">T</div>,
      cell: ({ getValue }) => (
        <div className="text-center w-auto font-medium text-amber-600">
          {getValue()}
        </div>
      ),
      size: 40, // Reduced from original
      minWidth: 35,
      meta: {
        priority: "high",
        mobileSize: 35,
        tabletSize: 40,
      },
    });
  }

  // Add scoring-type specific columns
  if (isSetBased) {
    // For set-based sports (volleyball, tennis, etc.)
    baseColumns.push(
      {
        id: "sets",
        header: () => <div className="text-center w-auto">SETS</div>,
        cell: ({ row }) => {
          const setsWon = row.original.standings.sets_won || 0;
          const setsLost = row.original.standings.sets_lost || 0;
          return (
            <div className="text-center w-auto font-medium">
              <span>{setsWon}</span> - <span>{setsLost}</span>
            </div>
          );
        },
        size: 60, // Reduced from original
        minWidth: 50,
        meta: {
          priority: "medium",
          mobileSize: 50,
          tabletSize: 55,
        },
      },
      {
        accessorKey: "standings.set_ratio",
        header: () => <div className="text-center w-auto">RATIO</div>,
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center w-auto font-medium">
              {typeof value === "number" ? value.toFixed(3) : "0.000"}
            </div>
          );
        },
        size: 70, // Reduced from original
        minWidth: 60,
        meta: {
          priority: "high",
          mobileSize: 60,
          tabletSize: 65,
        },
      }
    );
  } else {
    // For point-based sports (basketball, football, etc.)
    baseColumns.push({
      accessorKey: "standings.win_percentage",
      header: () => <div className="text-center w-auto">Win%</div>,
      cell: ({ getValue }) => {
        const value = getValue() || 0;
        return (
          <div className="text-center w-auto font-medium">
            {value.toFixed(3).replace(/^0/, "")}
          </div>
        );
      },
      size: 60, // Reduced from original
      minWidth: 50,
      meta: {
        priority: "high",
        mobileSize: 50,
        tabletSize: 55,
      },
    });
  }

  return baseColumns;
};
