import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import {
  Award,
  TrendingUp,
  Trophy,
  Users,
  Goal,
  Shield,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TeamCard = ({ team, stats = {}, formData = [], onClick }) => {
  const {
    team_id,
    team_name,
    team_logo,
    championships = 0,
    win_ratio = 0,    matches_played = 0,
    wins = 0,
    losses = 0,
  } = team;
  // Helper function for win ratio color
  const getWinRatioColor = (ratio) => {
    if (ratio >= 0.7) return "text-primary-foreground";
    if (ratio >= 0.5) return "text-primary-foreground";
    if (ratio >= 0.3) return "text-secondary-foreground";
    return "text-foreground";
  };
  // Helper function for win ratio background
  const getWinRatioBackground = (ratio) => {
    if (ratio >= 0.7) return "bg-primary";
    if (ratio >= 0.5) return "bg-primary/90";
    if (ratio >= 0.3) return "bg-secondary";
    return "bg-muted";
  };

  return (
    <Card
      className={`overflow-hidden py-0 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 border border-border/50 ${
        onClick ? "cursor-pointer" : ""
      }`}      onClick={onClick}
    >
      <div className="relative">
        {/* Championship indicator */}
        {championships > 0 && (
          <div className="absolute top-0 right-0 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground px-3 py-1 text-xs font-medium flex items-center gap-1 rounded-bl-lg shadow-sm border-b border-l border-secondary/30">
            <Trophy size={12} />
            <span>{championships > 1 ? `${championships}x ` : ""}Champion</span>
          </div>
        )}

        {/* Team header */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative">
            <div className="size-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-sm">
              {team_logo ? (
                <img
                  src={team_logo}
                  alt={team_name}
                  className="size-14 object-contain"
                />
              ) : (
                <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                  {team_name?.charAt(0) || "T"}
                </div>
              )}
            </div>

            {/* Win ratio indicator */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute -bottom-2 -right-2 ${getWinRatioBackground(
                      win_ratio
                    )} ${getWinRatioColor(
                      win_ratio
                    )} w-8 h-8 rounded-full border border-background shadow-sm flex items-center justify-center text-xs font-bold`}
                  >
                    {win_ratio ? Math.round(win_ratio * 100) : 0}%
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    Win rate: {win_ratio ? (win_ratio * 100).toFixed(1) : 0}%
                  </div>
                </TooltipContent>              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-base text-foreground">
              {team_name}
            </h3>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Shield className="size-3.5 text-primary/80" />
                <span>
                  {wins}W-{losses}L
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="size-3.5 text-secondary/80" />
                <span>{matches_played} Played</span>
              </div>
            </div>
          </div>        </div>
      </div>

      <CardContent>
        {/* Team performance section */}
        <div className="border-t border-border/50 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Latest Results:</span>
            <TeamStreakIndicator results={formData} />
          </div>

          {/* Current streak badge */}
          {team.current_streak > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <Badge
                variant="outline"
                className={`text-xs py-0 ${
                  team.streak_type === "W" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" 
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {team.current_streak}{" "}
                {team.streak_type === "W" ? "Win" : "Loss"} Streak
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
