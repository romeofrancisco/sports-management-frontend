import React from "react";
import { Calendar, Users, Trophy, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/utils/formatDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash, MoreHorizontal, SquarePen, Settings, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export const useSeasonTableColumns = (onEdit, onDelete, getStatusBadge) => {
  const { league } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useRolePermissions();

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name || `Season ${row.original.year}`}
        </div>
      ),
      size: 180,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={`${getStatusBadge(status)} capitalize`}
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const { start_date, end_date } = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-primary" />
              <span className="text-sm">{formatShortDate(start_date)}</span> -
              <span className="text-sm">{formatShortDate(end_date)}</span>
            </div>
          </div>
        );
      },
      size: 160,
    },
    {
      id: "games_progress",
      header: "Games",
      cell: ({ row }) => {
        const { games_count, games_played } = row.original;
        if (games_count === undefined)
          return <span className="text-muted-foreground">-</span>;

        const progress = ((games_played || 0) / games_count) * 100;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-primary" />
              <span className="text-sm font-medium">
                {games_played || 0}/{games_count}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "teams",
      header: "Teams",
      cell: ({ row }) => {
        const { teams_list } = row.original;
        if (!teams_list || teams_list.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-secondary" />
              <span className="text-sm font-medium">{teams_list.length}</span>
            </div>
            <div className="flex -space-x-1">
              {teams_list.slice(0, 3).map((team) => (
                <div key={team.id} className="relative">
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-6 h-6 rounded-full border-2 border-background object-cover"
                      title={team.name}
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
                      title={team.name}
                    >
                      <span className="text-xs font-medium text-primary">
                        {team.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {teams_list.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{teams_list.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const season = row.original;

        return isAdmin() ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/leagues/${league}/seasons/${season.id}`)
                }
                className="flex items-center gap-2"
              >
                <Settings size={14} />
                Manage Season
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(season)}
                className="flex items-center gap-2"
              >
                <SquarePen size={14} />
                Edit Season
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(season)}
              >
                <Trash size={14} />
                Delete Season
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate(`/leagues/${league}/seasons/${season.id}`)}
          >
            <Eye size={14} />
            View Season
          </Button>
        );
      },
      size: 40,
    },
  ];

  return columns;
};
