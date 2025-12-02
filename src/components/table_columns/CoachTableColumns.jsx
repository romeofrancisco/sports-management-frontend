import {
  Edit,
  MoreHorizontal,
  Trash,
  RotateCcw,
  Trophy,
  Users,
  Mars,
  Venus,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getCoachTableColumns = ({ onEdit, onDelete, onReactivate }) => [
  {
    header: () => <h1 className="ps-3">Coach</h1>,
    accessorKey: "full_name",
    size: 260,
    meta: { priority: "high" },
    cell: ({ row }) => {
      const coach = row.original;
      return (
        <div className="flex gap-3 items-center sm:ps-3">
          <div className="relative">
            <Avatar className="size-10 border-primary/20 border-2">
              <AvatarImage src={coach.profile} alt={coach.full_name} />
              <AvatarFallback className="rounded-lg bg-accent">
                {coach.first_name?.[0]}
                {coach.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {coach.sex === "male" && (
                <Mars className="inline-block h-4 w-4 mr-1 text-blue-500" />
              )}
              {coach.sex === "female" && (
                <Venus className="inline-block h-4 w-4 mr-1 text-pink-500" />
              )}
              {coach.full_name}
            </span>
            <span className="text-muted-foreground text-xs">{coach.email}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant={coach.is_active ? "default" : "destructive"}
                className={`h-4 px-1.5 text-[10px] ${
                  coach.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {coach.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Qualified Sports",
    accessorKey: "sports",
    size: 180,
    meta: { priority: "medium" },
    cell: ({ row }) => {
      const sports = row.original.sports || [];

      if (sports.length === 0) {
        return <span className="text-muted-foreground text-sm">No sports</span>;
      }

      return (
        <div className="flex items-center gap-1 flex-wrap">
          {sports.slice(0, 3).map((sport) => (
            <Badge
              key={sport.id}
              variant="secondary"
              className="h-5 px-2 text-xs bg-primary/10 border-primary/20 text-primary"
            >
              {sport.name}
            </Badge>
          ))}
          {sports.length > 3 && (
            <Badge
              variant="outline"
              className="h-5 px-2 text-xs text-muted-foreground"
            >
              +{sports.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Teams & Stats",
    accessorKey: "coached_teams",
    size: 200,
    meta: { priority: "medium" },
    cell: ({ row }) => {
      const coach = row.original;
      const teams = coach.coached_teams || [];

      return (
        <div className="flex flex-col gap-2">
          {/* Stats row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Trophy className="h-3.5 w-3.5 text-primary/80" />
              {teams.length > 1 ? "Teams:" : "Team:"}{" "}
              <span className="text-xs font-medium">
                {coach.team_count || 0}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              {coach.player_count > 1 ? "Players:" : "Player:"}{" "}
              <span className="text-xs text-muted-foreground">
                {coach.player_count || 0}
              </span>
            </div>
          </div>
          {/* Teams avatars */}
          {teams.length === 0 ? (
            <span className="text-muted-foreground text-xs">
              No teams assigned
            </span>
          ) : (
            <TooltipProvider>
              <div className="flex items-center -space-x-2">
                {teams.slice(0, 4).map((team) => (
                  <Tooltip key={team.id}>
                    <TooltipTrigger asChild>
                      <div className="relative cursor-pointer">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-6 h-6 rounded-full border-2 border-background object-cover shadow"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center shadow">
                            <span className="text-[10px] font-medium text-primary">
                              {team.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">{team.name}</TooltipContent>
                  </Tooltip>
                ))}
                {teams.length > 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10 cursor-pointer">
                        <span className="text-[10px] text-muted-foreground">
                          +{teams.length - 4}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="text-xs font-medium whitespace-pre-line">
                        {teams
                          .slice(4)
                          .map((team) => `• ${team.name}`)
                          .join("\n")}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 40,
    meta: { priority: "high" },
    cell: ({ row }) => {
      const coach = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(coach)}>
              <Edit />
              Update Coach
            </DropdownMenuItem>
            {coach.is_active ? (
              <DropdownMenuItem
                onClick={() => onDelete(coach)}
                className="text-destructive"
              >
                <Trash />
                Delete Coach
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onReactivate(coach)}
                className="text-green-600 dark:text-green-400"
              >
                <RotateCcw />
                Reactivate Coach
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default getCoachTableColumns;
