import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Mail, User, Target } from "lucide-react";
import CoachActions from "./CoachActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CoachCard = ({ coach, onDelete, onUpdate }) => {

  return (
    <Card className="relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30">
      {/* Primary color bar */}
      <div className="absolute bg-primary top-0 right-0 w-3 h-full" />
      {/* Hover effect */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      <CardHeader className="relative p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar with status */}
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
                <AvatarImage src={coach.profile} alt={coach.full_name} />
                <AvatarFallback className="font-bold text-primary bg-primary/10">
                  {coach.first_name?.[0]}
                  {coach.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {/* Status indicator: green if has teams, amber if none */}
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                  coach.team_count > 0
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-amber-400 to-amber-500"
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {coach.full_name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {coach.email || "No email"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40 capitalize"
                >
                  {coach.sex || "N/A"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="ml-2">
            <CoachActions
              coach={coach}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </div>
        </div>
        {/* Stats Row */}
        <div className="pt-2 border-t border-border/50 flex items-center gap-4 text-xs mt-2">
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3 text-primary/80" />
            <span className="font-medium">{coach.team_count} Teams</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-secondary/80" />
            <span className="font-medium">{coach.player_count} Players</span>
          </div>
        </div>
        {/* Sports (always render) */}
        <div className="pt-2 border-t border-border/50 min-h-[56px]">
          <div className="flex items-center gap-2 mb-1 mt-2">
            <Target className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Qualified Sports
            </span>
          </div>
          {coach.sports && coach.sports.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {coach.sports.map((sport) => (
                <Badge
                  key={sport.id}
                  variant="secondary"
                  className="h-5 px-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                >
                  {sport.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No sports</span>
          )}
        </div>
        {/* Teams List (always render) */}
        <div className="pt-2 border-t border-border/50 min-h-[56px]">
          <div className="flex items-center gap-2 mb-1 mt-2">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Teams
            </span>
          </div>
          <TooltipProvider>
            {coach.coached_teams && coach.coached_teams.length > 0 ? (
              <div className="flex items-center -space-x-2">
                {coach.coached_teams.slice(0, 4).map((team) => (
                  <Tooltip key={team.id}>
                    <TooltipTrigger asChild>
                      <div className="relative cursor-pointer">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-7 h-7 rounded-full border-2 border-background object-cover shadow"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center shadow">
                            <span className="text-xs font-medium text-primary">
                              {team.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {team.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
                {coach.coached_teams.length > 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10 cursor-pointer">
                        <span className="text-xs text-muted-foreground">
                          +{coach.coached_teams.length - 4}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="text-xs font-medium text-primary-foreground whitespace-pre-line">
                        {coach.coached_teams.map((team) => `• ${team.name}`).join("\n")}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">No teams</span>
            )}
          </TooltipProvider>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CoachCard;
