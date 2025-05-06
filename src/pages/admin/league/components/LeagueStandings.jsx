import React from "react";
import DataTable from "@/components/common/DataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon } from "lucide-react";
import { useTeamForm } from "@/hooks/useLeagues";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import { useParams } from "react-router";

const LeagueStandings = ({ rankings }) => {
  const { league } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } = useTeamForm(league);
  
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

  const columns = [
    {
      id: "team_with_rank",
      header: "Team",
      cell: ({ row }) => {
        const { team_logo, team_name, team_id, rank } = row.original;
        
        const getRankBadge = (rank) => {
          if (rank === 1) return "bg-amber-500 text-white font-bold";
          if (rank === 2) return "bg-gray-400 text-white font-bold";
          if (rank === 3) return "bg-amber-700 text-white font-bold";
          return "bg-muted text-muted-foreground";
        };
        
        return (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`px-2 rounded-md ${getRankBadge(rank)}`}>
              {rank}
            </Badge>
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
    {
      accessorKey: "win_ratio",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("W%", "Win Percentage")}
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="text-center font-medium">
            {(value * 100).toFixed(1)}%
          </div>
        );
      },
      size: 40,
    },
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
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-3">
        League Leaderboard
      </h2>
      <DataTable
        columns={columns}
        data={rankings || []}
        showPagination={false}
        className="text-sm"
        alternateRowColors={true}
      />
    </div>
  );
};

export default LeagueStandings;