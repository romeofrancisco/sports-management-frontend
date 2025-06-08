import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TeamActions from "./TeamActions";
import { getDivisionLabel } from "@/constants/team";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Target, User } from "lucide-react";

const TeamCard = ({ team, onView, onEdit, onDelete }) => {  // Get team color for styling
  const teamColor = team.color;
  
  // Check if team has a coach
  const hasCoach = team.coach_name || team.coach?.full_name;
  
  return (
    <Card className="relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30">
      {/* Enhanced team color indicator */}
      <div 
        className="absolute top-0 right-0 w-3 h-full opacity-80"
        style={{ backgroundColor: teamColor }}
      ></div>
      
      {/* Hover effects */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-secondary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <CardHeader className="relative p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">            {/* Avatar with system colors */}
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
                <AvatarImage src={team.logo} alt={team.name} />
                <AvatarFallback className="font-bold text-white bg-primary">
                  {team.name[0]}
                </AvatarFallback>              </Avatar>
              {/* Team status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                hasCoach 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}></div>
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {team.name}
              </CardTitle>              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
                >
                  {getDivisionLabel(team.division)}
                </Badge>
              </div>
                {/* Additional team info */}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {team.sport_name && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span className="font-medium">{team.sport_name}</span>
                  </div>
                )}
                {team.player_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{team.player_count || 0} players</span>
                  </div>
                )}
              </div>              {/* Coach information - improved layout */}
              <div className="flex items-center justify-between mt-1 text-xs">
                <div className={`flex items-center gap-1 flex-1 min-w-0 ${
                  hasCoach 
                    ? 'text-muted-foreground' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium truncate">
                    {hasCoach 
                      ? `Coach: ${team.coach_name || team.coach?.full_name}`
                      : "No coach"
                    }
                  </span>
                </div>
                {!hasCoach && (
                  <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 flex-shrink-0">
                    Needs Coach
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-2">
            <TeamActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
          {/* Team abbreviation with system colors */}
        {team.abbreviation && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Team Code</span>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/20 text-secondary">
                {team.abbreviation}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default TeamCard;
