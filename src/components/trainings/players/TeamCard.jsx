import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trophy, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamCard = ({ team, onClick }) => (
  <Card
    className="relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30 cursor-pointer"
    onClick={() => onClick(team.slug)}
  >
    {/* Enhanced team color indicator */}
    <div 
      className="absolute top-0 right-0 w-3 h-full opacity-80"
      style={{ backgroundColor: team.color || '#6366f1' }}
    ></div>
    
    {/* Hover effects */}
    <div className="absolute top-2 right-5 w-6 h-6 bg-secondary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
    
    <CardHeader className="relative p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar with system colors */}
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
              <AvatarImage src={team.logo} alt={team.name} />
              <AvatarFallback className="font-bold text-white bg-primary">
                {team.name[0]}
              </AvatarFallback>
            </Avatar>
            {/* Team status indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
              {team.name}
            </CardTitle>
            
            {/* Sport badge - show sport information */}
            {(team.sport?.name || team.sport_name) && (
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
                >
                  {team.sport?.name || team.sport_name}
                </Badge>
              </div>
            )}
            
            {/* Additional team info */}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {(team.sport?.name || team.sport_name) && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  <span className="font-medium">{team.sport?.name || team.sport_name}</span>
                </div>
              )}
              {team.player_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{team.player_count || 0} players</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action indicator */}
        <div className="ml-2 flex-shrink-0 p-2 rounded-full bg-muted/20 group-hover:bg-primary/10 transition-all duration-300">
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
      
      {/* Team abbreviation */}
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

export default TeamCard;
