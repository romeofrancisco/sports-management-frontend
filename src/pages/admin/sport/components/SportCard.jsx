import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Trophy, Target, Settings } from "lucide-react";
import SportActions from "./SportActions";

const SportCard = ({ sport, onEdit, onDelete, onReactivate }) => {
  // Format scoring type for display
  const getScoringTypeLabel = (type) => {
    switch (type) {
      case 'points':
        return 'Points-based';
      case 'sets':
        return 'Sets-based';
      default:
        return type;
    }
  };

  // Get appropriate icon based on scoring type
  const getScoringIcon = (type) => {
    return type === 'sets' ? Trophy : Target;
  };

  const ScoringIcon = getScoringIcon(sport.scoring_type);
  const isActive = sport.is_active !== false; // Default to true if undefined

  return (
    <Card className={`relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group bg-card border-border shadow-sm hover:border-primary/30 ${
      !isActive ? 'opacity-60' : ''
    }`}>
      {/* Sport color indicator */}
      <div className={`absolute top-0 right-0 w-3 h-full opacity-80 ${
        isActive ? 'bg-primary' : 'bg-gray-400'
      }`}></div>
      
      {/* Hover effects */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <CardHeader className="relative p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Sport Avatar/Icon */}
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
                <AvatarImage src={sport.banner} alt={sport.name} />
                <AvatarFallback className="font-bold text-white bg-primary">
                  {sport.name[0]}
                </AvatarFallback>
              </Avatar>
              {/* Sport status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              }`}></div>
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {sport.name}
              </CardTitle>
              
              {/* Scoring type badge */}
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
                >
                  {getScoringTypeLabel(sport.scoring_type)}
                </Badge>
                {!isActive && (
                  <Badge 
                    variant="outline" 
                    className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                  >
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Sport details */}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ScoringIcon className="h-3 w-3" />
                  <span className="font-medium">{sport.scoring_type === 'sets' ? 'Set-based' : 'Point-based'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{sport.max_players_on_field} on field</span>
                </div>
              </div>

              {/* Team configuration info */}
              <div className="flex items-center justify-between mt-1 text-xs">
                <div className="flex items-center gap-1 flex-1 min-w-0 text-muted-foreground">
                  <Settings className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium truncate">
                    Team size: {sport.max_players_per_team} players
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-2">
            <SportActions 
              sport={sport} 
              onDelete={onDelete} 
              onEdit={onEdit} 
              onReactivate={onReactivate}
            />
          </div>
        </div>

        {/* Additional sport configuration details */}
        {(sport.scoring_type === 'sets' && (sport.win_threshold || sport.win_points_threshold)) && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Sets Config</span>
              <div className="flex gap-2">
                {sport.win_threshold && (
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/20 text-secondary">
                    {sport.win_threshold} sets to win
                  </span>
                )}
                {sport.win_points_threshold && (
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-primary/20 text-primary">
                    {sport.win_points_threshold} pts/set
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Points-based sport configuration */}
        {sport.scoring_type === 'points' && sport.has_period && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Game Config</span>
              <div className="flex gap-2">
                {sport.max_period && (
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/20 text-secondary">
                    {sport.max_period} periods
                  </span>
                )}
                {sport.has_overtime && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                    OT
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default SportCard;
