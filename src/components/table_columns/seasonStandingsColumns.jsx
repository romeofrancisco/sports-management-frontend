import { Medal, Trophy } from "lucide-react";
import { HeaderWithTooltip } from "@/components/common/TableHelpers";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";

export const getSeasonStandingsColumns = ({ sport, teamFormData = {} }) => {
  const { has_tie, scoring_type } = sport;
  const isSetBased = scoring_type === "sets";

  const baseColumns = [
    {
      id: "team",
      header: () => (
        <div className="text-left md:ms-5">
          <HeaderWithTooltip label="Team" tooltipText="Team name and logo" />
        </div>
      ),
      cell: ({ row }) => {
        const { rank, team_logo, team_name } = row.original;

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
              className={`w-5 text-end  flex items-center justify-end ${rankStyle.textColor}`}
            >
              {rankStyle.icon || rank}
            </div>
            <div className="relative size-7 flex items-center justify-center">
              <img
                src={team_logo}
                alt={team_name}
                className="size-7 rounded-full border"
              />
            </div>
            <span className="">{team_name}</span>
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
          <HeaderWithTooltip
            label="STRK"
            tooltipText="Recent performance in last 5 games"
          />
        </div>
      ),
      cell: ({ row }) => {
        const teamId = row.original.team_id;
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
      accessorKey: "matches_played",
      header: () => (
        <div className="text-center w-auto">
          <HeaderWithTooltip label="MP" tooltipText="Matches Played" />
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center w-auto ">{getValue()}</div>
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
      accessorKey: "wins",
      header: () => (
        <div className="text-center w-auto">
          <HeaderWithTooltip label="W" tooltipText="Wins" />
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center w-auto  text-emerald-600">{getValue()}</div>
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
      accessorKey: "losses",
      header: () => (
        <div className="text-center w-auto">
          <HeaderWithTooltip label="L" tooltipText="Losses" />
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center w-auto  text-rose-600">{getValue()}</div>
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
      accessorKey: "win_percentage",
      header: () => (
        <div className="text-center w-auto">
          <HeaderWithTooltip label="PCT" tooltipText="Winning Percentage" />
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue() || 0;
        return (
          <div className="text-center w-auto ">
            {value.toFixed(3).toString().replace(/^0\./, ".")}
          </div>
        );
      },
      size: 50,
      minWidth: 45,
      meta: {
        priority: "high",
        mobileSize: 45,
        tabletSize: 50,
      },
    },
  ];

  // Add ties column if sport has ties
  if (has_tie) {
    baseColumns.splice(4, 0, {
      accessorKey: "ties",
      header: () => (
        <div className="text-center w-auto">
          <HeaderWithTooltip label="T" tooltipText="Ties" />
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center w-auto  text-amber-600">{getValue()}</div>
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
        id: "sets_w_l",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="SETS W-L"
              tooltipText="Sets Won and Lost"
            />
          </div>
        ),
        cell: ({ row }) => {
          const setsWon = row.original.sets_won || 0;
          const setsLost = row.original.sets_lost || 0;
          return (
            <div className="text-center w-auto ">
              {setsWon} - {setsLost}
            </div>
          );
        },
        size: 70,
        minWidth: 60,
        meta: {
          priority: "medium",
          mobileSize: 60,
          tabletSize: 65,
        },
      },
      {
        accessorKey: "set_ratio",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="SET RATIO"
              tooltipText="Ratio of sets won to sets lost"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center w-auto ">
              {typeof value === "number" ? value.toFixed(3) : "0.000"}
            </div>
          );
        },
        size: 60,
        minWidth: 55,
        meta: {
          priority: "high",
          mobileSize: 55,
          tabletSize: 60,
        },
      },
      {
        accessorKey: "sets_win_percentage",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="SETS WIN %"
              tooltipText="Sets Win Percentage"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center w-auto ">{value.toFixed(1)}%</div>;
        },
        size: 60,
        minWidth: 55,
        meta: {
          priority: "medium",
          mobileSize: 55,
          tabletSize: 60,
        },
      },
      {
        accessorKey: "points_per_set",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="PTS/SET"
              tooltipText="Average Points per Set"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center w-auto ">{value.toFixed(1)}</div>;
        },
        size: 60,
        minWidth: 55,
        meta: {
          priority: "medium",
          mobileSize: 55,
          tabletSize: 60,
        },
      },
      {
        accessorKey: "points_conceded_per_set",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="OPP/SET"
              tooltipText="Opponent Points Per Set"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center w-auto ">{value.toFixed(1)}</div>;
        },
        size: 60,
        minWidth: 55,
        meta: {
          priority: "medium",
          mobileSize: 55,
          tabletSize: 60,
        },
      },
      {
        accessorKey: "point_differential_per_set",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="DIFF/SET"
              tooltipText="Point Differential Per Set"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (
            <div
              className={`text-center w-auto  ${
                isPositive
                  ? "text-emerald-600"
                  : value < 0
                  ? "text-rose-600"
                  : ""
              }`}
            >
              {isPositive ? "+" : ""}
              {value.toFixed(1)}
            </div>
          );
        },
        size: 60,
        minWidth: 55,
        meta: {
          priority: "medium",
          mobileSize: 55,
          tabletSize: 60,
        },
      },
      {
        accessorKey: "points",
        header: () => (
          <div className="text-center w-auto">
            <HeaderWithTooltip
              label="PTS"
              tooltipText="Points that determine rankings"
            />
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-center w-auto">{getValue() || 0}</div>
        ),
        size: 45, // Reduced from original
        minWidth: 40,
        meta: {
          priority: "high",
          mobileSize: 40,
          tabletSize: 45,
        },
      }
    );
  } else {
    // For point-based sports
    baseColumns.push(
      {
        accessorKey: "points_per_game",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip label="PPG" tooltipText="Points Per Game" />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center w-auto ">{value.toFixed(1)}</div>;
        },
        size: 50,
        minWidth: 45,
        meta: {
          priority: "medium",
          mobileSize: 45,
          tabletSize: 50,
        },
      },
      {
        accessorKey: "points_conceded_per_game",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="OPPG"
              tooltipText="Opponent Points Per Game"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center w-auto ">{value.toFixed(1)}</div>;
        },
        size: 50,
        minWidth: 45,
        meta: {
          priority: "medium",
          mobileSize: 45,
          tabletSize: 50,
        },
      },
      {
        accessorKey: "point_differential_avg",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="AVG DIFF"
              tooltipText="Average Point Differential Per Game"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (
            <div
              className={`text-center w-auto  ${
                isPositive
                  ? "text-emerald-600"
                  : value < 0
                  ? "text-rose-600"
                  : ""
              }`}
            >
              {isPositive ? "+" : ""}
              {value.toFixed(1)}
            </div>
          );
        },
        size: 50,
        minWidth: 45,
        meta: {
          priority: "medium",
          mobileSize: 45,
          tabletSize: 50,
        },
      },
      {
        accessorKey: "point_differential",
        header: () => (
          <div className="text-center">
            <HeaderWithTooltip
              label="TOT DIFF"
              tooltipText="Total Point Differential"
            />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (
            <div
              className={`text-center w-auto ${
                isPositive
                  ? "text-emerald-600"
                  : value < 0
                  ? "text-rose-600"
                  : ""
              }`}
            >
              {isPositive ? "+" : ""}
              {value}
            </div>
          );
        },
        size: 50,
        minWidth: 45,
        meta: {
          priority: "medium",
          mobileSize: 45,
          tabletSize: 50,
        },
      },
      {
        accessorKey: "points",
        header: () => (
          <div className="text-center w-auto">
            <HeaderWithTooltip
              label="PTS"
              tooltipText="Points that determine rankings"
            />
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-center w-auto">{getValue() || 0}</div>
        ),
        size: 50,
        minWidth: 45,
        meta: {
          priority: "medium",
          mobileSize: 45,
          tabletSize: 50,
        },
      }
    );
  }

  return baseColumns;
};
