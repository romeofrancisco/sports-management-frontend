import React from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import {
  Trash,
  MoreHorizontal,
  SquarePen,
  Settings,
  Calendar,
} from "lucide-react";
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
import { formatShortDate } from "@/utils/formatDate";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const SeasonCard = ({ season, onEdit, onDelete, getStatusBadge }) => {
  const { league } = useParams();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { isAdmin } = useRolePermissions();

  return (
    <div
      onClick={() => navigate(`/leagues/${league}/seasons/${season.id}`)}
      className="group relative bg-gradient-to-br from-card via-card to-card/95 border-2 border-primary/20 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/40 hover:scale-[1.02] overflow-hidden cursor-pointer"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <Calendar className="size-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex gap-1 items-center">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {season.name || `Season ${season.year}`}
                  </h3>
                  <Badge
                    className={`${getStatusBadge(
                      season.status
                    )} capitalize text-[11px] h-6`}
                    variant="outline"
                  >
                    {season.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatShortDate(season.start_date)} -{" "}
                  {formatShortDate(season.end_date)}
                </div>
              </div>
            </div>
          </div>
          {isAdmin() && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-primary/10 group-hover:border-primary/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    navigate(`/leagues/${league}/seasons/${season.id}`);
                  }}
                  className="flex items-center gap-2"
                >
                  <Settings size={14} />
                  Manage Season
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onEdit(season);
                  }}
                  className="flex items-center gap-2"
                >
                  <SquarePen size={14} />
                  Edit Season
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onDelete(season);
                  }}
                  className="text-red-600 dark:text-red-400 flex items-center gap-2"
                >
                  <Trash size={14} />
                  Delete Season
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-3">
          {season.games_count !== undefined && (
            <div className="p-3 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Games Progress
                </span>
                <span className="text-sm font-bold text-primary">
                  {season.games_played || 0}/{season.games_count}
                </span>
              </div>
              <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{
                    width: `${
                      ((season.games_played || 0) / season.games_count) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {season.teams_list && season.teams_list.length > 0 && (
            <div className="p-3 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-lg border border-secondary/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded bg-secondary/20">
                  <Settings size={12} className="text-secondary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Teams ({season.teams_list.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {season.teams_list.slice(0, 3).map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-2 rounded-lg border border-primary/20 text-xs font-medium hover:shadow-md transition-all duration-200"
                  >
                    {team.logo && (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-5 h-5 rounded-full object-cover border border-primary/20"
                      />
                    )}
                    <span className="text-foreground">{team.name}</span>
                  </div>
                ))}
                {season.teams_list.length > 3 && (
                  <div className="bg-gradient-to-r from-muted to-muted/80 px-3 py-2 rounded-lg border border-muted-foreground/20 text-xs text-muted-foreground font-medium">
                    +{season.teams_list.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonCard;
