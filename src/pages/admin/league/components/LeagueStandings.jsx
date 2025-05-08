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
import { useTeamForm, useLeagueDetails } from "@/hooks/useLeagues";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";

const LeagueStandings = ({ rankings, isSeasonStandings = false }) => {
  const { league } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } = useTeamForm(league);
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
        // Sort by points first if in season standings
        if (isSeasonStandings && a.points !== b.points) {
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
        
        // For points-based sports, sort by point differential
        if (!isSetBased) {
          if (a.goal_difference !== b.goal_difference) {
            return b.goal_difference - a.goal_difference;
          }
          // Then by goals/points scored
          if (a.goals_scored !== b.goals_scored) {
            return b.goals_scored - a.goals_scored;
          }
        }
        
        // As a last resort, use win ratio
        return b.win_ratio - a.win_ratio;
      });
    }
    
    // Keep original order from backend (sorted by championships first for league standings)
    return rankings;
  }, [rankings, sortByPerformance, isSetBased, isSeasonStandings]);
  
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

  // Base columns that are common to both league and season standings
  const baseColumns = [
    {
      id: "team_with_rank",
      header: "Team",
      cell: ({ row }) => {
        const { team_logo, team_name, team_id, rank } = row.original;
        
        // Styling for top 3 ranks
        const getRankStyle = (rank) => {
          if (rank === 1) return { icon: <TrophyIcon className="text-amber-500" size={16} />, textColor: "text-amber-500" };
          if (rank === 2) return { icon: <Medal className="text-gray-400" size={16} />, textColor: "text-gray-400" };
          if (rank === 3) return { icon: <Medal className="text-amber-700" size={16} />, textColor: "text-amber-700" };
          return { icon: null, textColor: "text-muted-foreground" };
        };
        
        const rankStyle = getRankStyle(rank);
        
        return (
          <div className="flex items-center gap-3">
            <div className={`w-5 text-end font-medium flex items-center justify-end ${rankStyle.textColor}`}>
              {rankStyle.icon || rank}
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="border size-8">
                <AvatarImage src={team_logo} alt={team_name} />
                <AvatarFallback className="text-xs bg-muted">{team_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{team_name}</span>
            </div>
          </div>
        );
      },
      size: 200
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
        const form = teamFormData?.form?.[teamId] || [];
        
        return (
          <div className="flex justify-center">
            <TeamStreakIndicator results={form} />
          </div>
        );
      },
      size: 80
    },
    {
      accessorKey: "matches_played",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("MP", "Matches Played")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center font-medium">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "wins",
      header: () => (
        <div className="text-center">{headerWithTooltip("W", "Wins")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center text-emerald-600 font-medium">{getValue()}</div>,
      size: 40,
    },
    {
      accessorKey: "losses",
      header: () => (
        <div className="text-center">{headerWithTooltip("L", "Losses")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center text-rose-600 font-medium">{getValue()}</div>,
      size: 40,
    },
  ];

  // Add ties column if sport has ties
  if (hasTie) {
    baseColumns.push({
      accessorKey: "ties",
      header: () => (
        <div className="text-center">{headerWithTooltip("T", "Ties")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center text-amber-600 font-medium">{getValue() || 0}</div>,
      size: 40,
    });
  }

  // Add sport-specific columns
  if (isSetBased) {
    // For set-based sports (volleyball, tennis, etc.)
    baseColumns.push(
      {
        accessorKey: "sets_won",
        header: () => (
          <div className="text-center">{headerWithTooltip("Sets W", "Sets Won")}</div>
        ),
        cell: ({ getValue }) => <div className="text-center font-medium">{getValue() || 0}</div>,
        size: 50,
      },
      {
        accessorKey: "sets_lost",
        header: () => (
          <div className="text-center">{headerWithTooltip("Sets L", "Sets Lost")}</div>
        ),
        cell: ({ getValue }) => <div className="text-center font-medium">{getValue() || 0}</div>,
        size: 50,
      },
      {
        accessorKey: "set_ratio",
        header: () => (
          <div className="text-center">{headerWithTooltip("Set Ratio", "Ratio of sets won to sets lost")}</div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center font-medium">
              {typeof value === 'number' ? value.toFixed(3) : '0.000'}
            </div>
          );
        },
        size: 60,
      }
    );
    
    // Only add points column for season standings in set-based sports
    if (isSeasonStandings) {
      baseColumns.push(
        {
          accessorKey: "points",
          header: () => (
            <div className="text-center">
              {headerWithTooltip((
                <div className="flex items-center justify-center gap-1">
                  <Star size={12} className="text-amber-500" />
                  <span>Points</span>
                </div>
              ), "Match points earned (2 for win)")}
            </div>
          ),
          cell: ({ getValue }) => <div className="text-center font-bold">{getValue() || 0}</div>,
          size: 60,
        }
      );
    }
  } else {
    // For point-based sports
    baseColumns.push(
      {
        accessorKey: "goal_difference",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("PD", "Point Differential")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          const isPositive = value > 0;
          return (
            <div className={`text-center font-medium ${isPositive ? 'text-emerald-600' : value < 0 ? 'text-rose-600' : 'text-muted-foreground'}`}>
              {value > 0 ? `+${value}` : value}
            </div>
          );
        },
        size: 50,
      }
    );
    
    // Only add points column for season standings in point-based sports
    if (isSeasonStandings) {
      baseColumns.push(
        {
          accessorKey: "points",
          header: () => (
            <div className="text-center">
              {headerWithTooltip((
                <div className="flex items-center justify-center gap-1">
                  <Star size={12} className="text-amber-500" />
                  <span>PTS</span>
                </div>
              ), "League points (3 for win, 1 for tie)")}
            </div>
          ),
          cell: ({ getValue }) => <div className="text-center font-bold">{getValue() || 0}</div>,
          size: 60,
        }
      );
    }
  }

  // Add win percentage for point-based sports
  if (!isSetBased) {
    baseColumns.push(
      {
        accessorKey: "win_ratio",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("WIN%", "Win Percentage")}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue() || 0;
          return (
            <div className="text-center font-medium">
              {(value * 100).toFixed(1)}%
            </div>
          );
        },
        size: 50,
      }
    );
  }

  // Add league-specific columns only for league standings
  if (!isSeasonStandings) {
    baseColumns.push(
      {
        accessorKey: "seasons_participated",
        header: () => (
          <div className="text-center">
            {headerWithTooltip("SP", "Seasons Participated")}
          </div>
        ),
        cell: ({ getValue }) => <div className="text-center font-medium">{getValue()}</div>,
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
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-700 dark:text-amber-300 flex gap-1 items-center">
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
  }

  return (
    <div className="bg-card rounded-lg border shadow-md overflow-hidden p-5">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" />
          {isSeasonStandings ? "Season Standings" : "League All-Time Standings"}
          {isSetBased && (
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              Set-based Scoring
            </Badge>
          )}
          {!isSetBased && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              Point-based Scoring
            </Badge>
          )}
        </h2>
        
        {!isSeasonStandings && (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={sortByPerformance ? "outline" : "default"}
                    size="sm"
                    className="h-8"
                    onClick={() => setSortByPerformance(false)}
                  >
                    <TrophyIcon size={16} className="mr-1" /> All-time
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort by championships first, then performance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={!sortByPerformance ? "outline" : "default"}
                    size="sm"
                    className="h-8"
                    onClick={() => setSortByPerformance(true)}
                  >
                    <Star size={16} className="mr-1" /> Current
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort by current performance only (without championships)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      <DataTable
        columns={baseColumns}
        data={sortedRankings || []}
        showPagination={false}
        className="text-sm"
        alternateRowColors={true}
      />
      
      <div className="mt-4 text-xs text-muted-foreground">
        {isSeasonStandings ? (
          isSetBased ? (
            <span>Teams are ranked based on match points, followed by set ratio and sets won.</span>
          ) : (
            <span>Teams are ranked based on points, followed by point differential and points scored.</span>
          )
        ) : (
          sortByPerformance ? (
            isSetBased ? (
              <span>Teams are ranked based on set ratio and sets won over all seasons.</span>
            ) : (
              <span>Teams are ranked based on win percentage and point differential over all seasons.</span>
            )
          ) : (
            isSetBased ? (
              <span>Teams are ranked based on championships first, followed by set ratio and sets won.</span>
            ) : (
              <span>Teams are ranked based on championships first, followed by win percentage and point differential.</span>
            )
          )
        )}
      </div>
    </div>
  );
};

export default LeagueStandings;