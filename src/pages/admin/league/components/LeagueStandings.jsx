import React from "react";
import DataTable from "@/components/common/DataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const LeagueStandings = ({ rankings }) => {
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
      id: "rank",
      cell: ({ row }) => <div className="text-center">{row.original.rank}</div>,
      size: 20,
    },
    {
      id: "team",
      header: "Team",
      cell: ({ row }) => {
        const { team_logo, team_name } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={team_logo} alt={team_name} />
            </Avatar>
            <span>{team_name}</span>
          </div>
        );
      },
      size:110
    },
    {
      accessorKey: "matches_played",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("MP", "Matches Played")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
    {
      accessorKey: "wins",
      header: () => (
        <div className="text-center">{headerWithTooltip("W", "Wins")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
    {
      accessorKey: "losses",
      header: () => (
        <div className="text-center">{headerWithTooltip("L", "Losses")}</div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
    {
      accessorKey: "win_ratio",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("W%", "Win Percentage")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
    {
      accessorKey: "seasons_participated",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("SP", "Seasons Participated")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
    {
      accessorKey: "championships",
      header: () => (
        <div className="text-center">
          {headerWithTooltip("CH", "Championships Won")}
        </div>
      ),
      cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
      size: 30,
    },
  ];

  return (
    <div className="dark:bg-muted/30 bg-muted/50 p-5 lg:p-8 rounded-lg">
      <h1 className="text-2xl flex gap-2 font-semibold">League Leaderboards</h1>
      <DataTable
        columns={columns}
        data={rankings}
        showPagination={false}
        className="text-xs md:text-sm"
      />
    </div>
  );
};

export default LeagueStandings;
