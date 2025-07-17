import {
  Edit,
  MoreHorizontal,
  Trash,
  Mail,
  User,
  Volleyball,
  Users,
  Shield,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getCoachTableColumns = ({ onEdit, onDelete }) => [
  {
    header: "Coach",
    accessorKey: "full_name",
    size: 200,
    meta: { priority: "high" },
    cell: ({ row }) => {
      const coach = row.original;
      return (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={coach.profile} alt={coach.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {coach.first_name[0]}{coach.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-foreground truncate">
              {coach.full_name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {coach.email}
              </p>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Gender",
    accessorKey: "sex",
    size: 80,
    meta: { priority: "medium" },
    cell: ({ getValue }) => (
      <Badge 
        variant="outline" 
        className="h-5 px-2 text-xs bg-primary/5 border-primary/20 text-primary capitalize"
      >
        {getValue()}
      </Badge>
    ),
  },
  {
    header: "Sports",
    accessorKey: "sports",
    size: 150,
    meta: { priority: "medium" },
    cell: ({ getValue }) => {
      const sports = getValue() || [];
      if (sports.length === 0) {
        return (
          <span className="text-xs text-muted-foreground italic">
            No sports assigned
          </span>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          {sports.slice(0, 2).map((sport) => (
            <Badge
              key={sport.id}
              variant="secondary"
              className="h-5 px-2 text-xs bg-secondary/10 border-secondary/20 text-secondary"
            >
              {sport.name}
            </Badge>
          ))}
          {sports.length > 2 && (
            <Badge
              variant="outline"
              className="h-5 px-2 text-xs text-muted-foreground"
            >
              +{sports.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    header: "Teams",
    accessorKey: "coached_teams",
    size: 100,
    meta: { priority: "medium" },
    cell: ({ getValue }) => {
      const teams = getValue() || [];
      if (teams.length === 0) {
        return <span className="text-xs text-muted-foreground italic">No teams</span>;
      }
      return (
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
                          {team.name.charAt(0)}
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
                  <div className="text-xs font-medium text-primary-foreground whitespace-pre-line">
                    {teams.map((team) => `• ${team.name}`).join("\n")}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 60,
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-xs md:text-sm cursor-pointer"
              onClick={() => onEdit(coach)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Coach
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(coach)}
              className="text-destructive text-xs md:text-sm cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4 text-destructive" />
              Delete Coach
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default getCoachTableColumns;
