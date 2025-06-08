import React, { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon, Star, Medal, TrendingUp } from "lucide-react";
import { useLeagueTeamForm, useLeagueDetails } from "@/hooks/useLeagues";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { te } from "date-fns/locale";

const LeagueStandings = ({ rankings }) => {
  const { league } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } =
    useLeagueTeamForm(league);
  const { data: leagueDetails } = useLeagueDetails(league);

  // Add a state to toggle between different sorting methods
  const [sortByPerformance, setSortByPerformance] = React.useState(false);

  // Determine if this is a set-based sport like volleyball
  const isSetBased = leagueDetails?.sport?.scoring_type === "sets";
  const hasTie = leagueDetails?.sport?.has_tie;

  // Create sorting methods - either by championships or by current performance
  const sortedRankings = useMemo(() => {
    if (!rankings || rankings.length === 0) return [];

    if (sortByPerformance) {
      // Sort by current performance without championships factor
      return [...rankings].sort((a, b) => {
        // Sort by points first
        if (a.points !== b.points) {
          return b.points - a.points;
        }

        // For set-based sports, next sort by set ratio
        if (isSetBased) {
          if (a.set_ratio !== b.set_ratio) {
            return b.set_ratio - a.set_ratio;
          }
          // Then by sets won
          return b.sets_won - a.sets_won;
        }

        // For points-based sports, sort by win ratio
        return b.win_ratio - a.win_ratio;
      });
    }

    // Keep original order from backend (sorted by championships first)
    return rankings;
  }, [rankings, sortByPerformance, isSetBased]);

  const headerWithTooltip = (label, tooltipText) => (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{label}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const baseColumns = [
    {
      id: "team_with_rank",
      header: "Team",
      cell: ({ row }) => {
        const { team_logo, team_name, team_id, rank } = row.original;

        // Styling for top 3 ranks
        const getRankStyle = (rank) => {
          if (rank === 1)
            return {
              icon: <TrophyIcon className="text-amber-500" size={16} />,
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
          <div className="flex items-center gap-3">
            <div
              className={`w-5 text-end  flex items-center justify-end ${rankStyle.textColor}`}
            >
              {rankStyle.icon || rank}
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="border size-8">
                <AvatarImage src={team_logo} alt={team_name} />
                <AvatarFallback className="text-xs bg-muted">
                  {team_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="">{team_name}</span>
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      id: "form",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("STRK", "Recent performance in last 5 games")}
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
    },
    {
      accessorKey: "matches_played",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("MP", "Matches Played")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "wins",
      header: () => (
        <div className="text-center">{headerWithTooltip("W", "Wins")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "losses",
      header: () => (
        <div className="text-center">{headerWithTooltip("L", "Losses")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "win_ratio",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("PCT", "Winning Percentage")}
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue() || 0;
        return (
          <div className="text-center ">
            {value.toFixed(3).toString().replace(/^0\./, ".")}
          </div>
        );
      },
      size: 50,
    },
  ];

  // Add ties column if sport has ties
  if (hasTie) {
    baseColumns.push({
      accessorKey: "ties",
      header: () => (
        <div className="text-center">{headerWithTooltip("T", "Ties")}</div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center ">{getValue() || 0}</div>
      ),
      size: 40,
    });
  }

  // Add sport-specific columns
  if (isSetBased) {
    // For set-based sports (volleyball, tennis, etc.)
    baseColumns.push(
      {
        id: "sets_w_l",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("SETS W-L", "Sets Won and Lost")}
          </div>
        ),
        cell: ({ row }) => {
          const setsWon = row.original.sets_won || 0;
          const setsLost = row.original.sets_lost || 0;
          return (
            <div className="text-center ">
              {setsWon} - {setsLost}
            </div>
          );
        },
        size: 70,
      },
      {
        accessorKey: "set_ratio",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("SET RATIO", "Ratio of sets won to sets lost")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center ">
              {typeof value === "number" ? value.toFixed(3) : "0.000"}
            </div>
          );
        },
        size: 60,
      },
      {
        accessorKey: "sets_win_percentage",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("SETS WIN %", "Sets Win Percentage")}
          </div>
        ),
        cell: ({ row }) => {
          // Calculate sets win percentage if needed
          const setsWon = row.original.sets_won || 0;
          const setsPlayed =
            (row.original.sets_won || 0) + (row.original.sets_lost || 0);
          const percentage = setsPlayed > 0 ? (setsWon / setsPlayed) * 100 : 0;

          return <div className="text-center ">{percentage.toFixed(1)}%</div>;
        },
        size: 60,
      },
      {
        accessorKey: "points_per_set",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("PTS/SET", "Average Points per Set")}
          </div>
        ),
        cell: ({ getValue, row }) => {
          // Use the value if available or calculate if needed
          const value = getValue() || row.original.points_per_set || 0;
          return (
            <div className="text-center ">
              {typeof value === "number" ? value.toFixed(1) : value}
            </div>
          );
        },
        size: 60,
      },
      {
        accessorKey: "points_conceded_per_set",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("OPP/SET", "Opponent Points Per Set")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center font-medium">{value.toFixed(1)}</div>
          );
        },
        size: 60,
      },
      {
        accessorKey: "point_differential_per_set",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("DIFF/SET", "Point Differential Per Set")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (            <div
              className={`text-center font-medium ${
                isPositive
                  ? "text-red-800"
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
      }
    );
  } else {
    // For point-based sports
    baseColumns.push(
      {
        accessorKey: "points_per_game",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("PPG", "Points Per Game")}
          </div>
        ),
        cell: ({ getValue, row }) => {
          const value = getValue() || row.original.points_per_game || 0;
          return (
            <div className="text-center ">
              {typeof value === "number" ? value.toFixed(1) : value}
            </div>
          );
        },
        size: 50,
      },
      {
        accessorKey: "points_conceded_per_game",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("OPPG", "Opponent Points Per Game")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return <div className="text-center ">{value.toFixed(1)}</div>;
        },
        size: 50,
      },
      {
        accessorKey: "point_differential_avg",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("DIFF", "Average Point Differential Per Game")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (            <div
              className={`text-center  ${
                isPositive
                  ? "text-red-800"
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
      }
    );
  }

  // Add common columns for all sport types
  baseColumns.push(
    {
      accessorKey: "seasons_participated",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("SP", "Seasons Participated")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center ">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "championships",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("CH", "Championships Won")}
        </div>
      ),
      cell: ({ getValue }) => {
        const championships = getValue();
        return (
          <div className="flex justify-center items-center">
            {championships > 0 ? (
              <Badge
                variant="outline"
                className="bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-700 dark:text-amber-300 flex gap-1 items-center"
              >
                <TrophyIcon size={12} className="text-amber-500" />
                <span>{championships}</span>
              </Badge>
            ) : (
              <span className="text-muted-foreground">0</span>
            )}
          </div>
        );
      },
      size: 50,
    }
  );
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
              League Leaderboard
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete team standings and performance metrics
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative px-6">
        <DataTable
          columns={baseColumns}
          data={sortedRankings || []}
          showPagination={false}
          className="text-sm"
          alternateRowColors={true}
        />

        <div className="mt-4 text-xs text-muted-foreground">
          {sortByPerformance ? (
            isSetBased ? (
              <span>
                Teams are ranked based on match points, followed by set ratio and
                sets won.
              </span>
            ) : (
              <span>
                Teams are ranked based on performance only (win percentage).
              </span>
            )
          ) : isSetBased ? (
            <span>
              Teams are ranked based on championships first, followed by match
              points, set ratio and sets won.
            </span>
          ) : (
            <span>
              Teams are ranked based on championships first, followed by win
              percentage.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueStandings;
