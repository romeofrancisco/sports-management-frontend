import React from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, Target, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import TournamentActions from "./TournamentActions";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useModal } from "@/hooks/useModal";
import { format } from "date-fns";

const TournamentCard = ({ tournament, viewMode }) => {
  const navigate = useNavigate();
  const { isAdmin } = useRolePermissions();

  // Modal state lifted up (like LeagueCard) so actions can toggle without triggering navigation
  const updateModal = useModal();
  const deleteModal = useModal();
  const [ignoreNextClick, setIgnoreNextClick] = React.useState(false);

  // Patch modal close to set ignoreNextClick
  const handleUpdateModalClose = () => {
    setIgnoreNextClick(true);
    updateModal.closeModal();
  };
  const handleDeleteModalClose = () => {
    setIgnoreNextClick(true);
    deleteModal.closeModal();
  };

  const handleCardClick = () => {
    if (ignoreNextClick) {
      setIgnoreNextClick(false);
      return;
    }
    if (!updateModal.isOpen && !deleteModal.isOpen) {
      navigate(`/tournaments/${tournament.id}`);
    }
  };

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "upcoming":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
      case "paused":
        return "bg-amber-500/20 text-amber-700 border-amber-500/30";
      case "canceled":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };
  

  if (viewMode === "list") {
    return (
      <Card onClick={handleCardClick} className="cursor-pointer relative overflow-hidden border-2 rounded-xl hover:shadow-lg group bg-card border-primary/20 shadow-sm hover:border-primary/50">
        {/* Tournament color indicator */}
        <div className="absolute top-0 right-0 w-3 h-full bg-primary opacity-80"></div>

        {/* Hover effects */}
        <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

        <CardHeader className="relative p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Tournament Avatar/Logo */}
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
                  <AvatarImage src={tournament.logo} alt={tournament.name} />
                  <AvatarFallback className="font-bold text-white bg-primary">
                    {tournament.name[0]}
                  </AvatarFallback>
                </Avatar>
                {/* Tournament status indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                    tournament.status === "ongoing"
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : tournament.status === "upcoming"
                      ? "bg-gradient-to-r from-blue-400 to-blue-500"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {tournament.name}
                </CardTitle>
                {/* Sport and status badges */}
                <div className="flex items-center gap-2 mt-1">
                  {tournament.sport?.name && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
                    >
                      {tournament.sport.name}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium px-2 py-0.5 capitalize ${getStatusColor(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </Badge>
                  {tournament.division && (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium px-2 py-0.5 capitalize"
                    >
                      {tournament.division}
                    </Badge>
                  )}
                </div>
                {/* Tournament details */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">
                          {tournament.teams_count || 0} teams
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Total number of teams</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Target className="h-3 w-3" />
                        <span>{tournament.games_count || 0} games</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Total number of games</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Calendar className="h-3 w-3" />
                        <span className="truncate">
                          {formatDate(tournament.start_date)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Start date</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            {isAdmin() && (
              <TournamentActions
                tournament={tournament}
                updateModal={{ ...updateModal, closeModal: handleUpdateModalClose }}
                deleteModal={{ ...deleteModal, closeModal: handleDeleteModalClose }}
                className="ml-4"
              />
            )}
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Grid view (card view)
  return (
    <Card
      onClick={handleCardClick} className="cursor-pointer relative overflow-hidden border-2 rounded-xl hover:shadow-lg group bg-card border-primary/20 shadow-sm hover:border-primary/50"
    >
      {/* Tournament color indicator */}
      <div className="absolute top-0 right-0 w-3 h-full bg-primary opacity-80"></div>

      {/* Hover effects */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

      <CardHeader className="relative p-5 space-y-4">
        {/* Status Badge and Actions */}
        <div className="flex items-start justify-between">
          <Badge
            variant="secondary"
            className={`text-xs font-medium px-2 py-0.5 capitalize ${getStatusColor(
              tournament.status
            )}`}
          >
            {tournament.status}
          </Badge>
          {isAdmin() && (
            <TournamentActions
              tournament={tournament}
              updateModal={{ ...updateModal, closeModal: handleUpdateModalClose }}
              deleteModal={{ ...deleteModal, closeModal: handleDeleteModalClose }}
            />
          )}
        </div>

        {/* Tournament Logo/Avatar */}
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
              <AvatarImage src={tournament.logo} alt={tournament.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                {tournament.name[0]}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator */}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card shadow-sm ${
                tournament.status === "ongoing"
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : tournament.status === "upcoming"
                  ? "bg-gradient-to-r from-blue-400 to-blue-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Tournament Name & Sport */}
        <div className="text-center space-y-1">
          <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {tournament.name}
          </CardTitle>
          <div className="flex items-center justify-center gap-2">
            {tournament.sport?.name && (
              <Badge
                variant="secondary"
                className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
              >
                {tournament.sport.name}
              </Badge>
            )}
            {tournament.division && (
              <Badge
                variant="outline"
                className="text-xs font-medium px-2 py-0.5 capitalize"
              >
                {tournament.division}
              </Badge>
            )}
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-help">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {tournament.teams_count || 0}
                </span>
                <span className="text-[10px] text-muted-foreground">Teams</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total number of teams</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-help">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {tournament.games_count || 0}
                </span>
                <span className="text-[10px] text-muted-foreground">Games</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total number of games</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-help">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {tournament.has_bracket ? "Yes" : "No"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Bracket
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Has bracket system</TooltipContent>
          </Tooltip>
        </div>

        {/* Tournament Dates */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t border-primary/10">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(tournament.start_date)}</span>
          {tournament.end_date && (
            <>
              <span>-</span>
              <span>{formatDate(tournament.end_date)}</span>
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default TournamentCard;
