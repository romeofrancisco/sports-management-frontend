import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TeamStreakIndicator from "@/components/common/TeamStreakIndicator";
import { Award, TrendingUp, Trophy, Users, Goal, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TeamCard = ({ 
  team, 
  stats = {}, 
  formData = [], 
  onClick 
}) => {
  const { team_id, team_name, team_logo, championships = 0, win_ratio = 0, matches_played = 0, wins = 0, losses = 0 } = team;
    // Helper function for win ratio color
  const getWinRatioColor = (ratio) => {
    if (ratio >= 0.7) return "text-red-800";
    if (ratio >= 0.5) return "text-amber-600";
    if (ratio >= 0.3) return "text-amber-600";
    return "text-rose-600";
  };    // Helper function for win ratio background
  const getWinRatioBackground = (ratio) => {
    if (ratio >= 0.7) return "bg-red-50";
    if (ratio >= 0.5) return "bg-amber-50";
    if (ratio >= 0.3) return "bg-amber-50";
    return "bg-rose-50";
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md border ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {/* Championship indicator */}
        {championships > 0 && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-white px-3 py-1 text-xs font-medium flex items-center gap-1 rounded-bl-lg shadow-sm">
            <Trophy size={12} />
            <span>{championships > 1 ? `${championships}x ` : ''}Champion</span>
          </div>
        )}

        {/* Team header */}
        <div className="bg-muted/30 p-4 flex items-center gap-3">
          <div className="relative">
            <div className="size-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-muted shadow-sm">
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
                  <div className={`absolute -bottom-2 -right-2 ${getWinRatioBackground(win_ratio)} ${getWinRatioColor(win_ratio)} w-8 h-8 rounded-full border shadow-sm flex items-center justify-center text-xs font-bold`}>
                    {win_ratio ? Math.round(win_ratio * 100) : 0}%
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">Win rate: {win_ratio ? (win_ratio * 100).toFixed(1) : 0}%</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-base text-foreground">{team_name}</h3>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Shield className="size-3.5" />
                <span>W-L: {wins}-{losses}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Goal className="size-3.5" />
                <span>MP: {matches_played}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        {/* Team form */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Recent form:</span>
            <TeamStreakIndicator results={formData} />
          </div>
          
          {/* Additional stats if available */}
          {team.current_streak > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs py-0">
                {team.current_streak} game {team.streak_type === 'W' ? 'win' : 'loss'} streak
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;