import React from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Users,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import LeagueActions from "./LeagueActions";

const LeagueCard = ({ league, index, viewMode }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/leagues/${league.id}`);
  };

  // Check if league is active
  const isActive = league.status === "active" || !league.status;

  if (viewMode === "list") {
    return (
      <Card className="relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30 cursor-pointer animate-in fade-in-50"
        style={{
          animationDelay: `${index * 50}ms`,
          animationDuration: "500ms",
        }}
        onClick={handleCardClick}
      >
        {/* League color indicator */}
        <div className="absolute top-0 right-0 w-3 h-full bg-primary opacity-80"></div>
        
        {/* Hover effects */}
        <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        <CardHeader className="relative p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* League Avatar/Logo */}
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
                  <AvatarImage src={league.logo} alt={league.name} />
                  <AvatarFallback className="font-bold text-white bg-primary">
                    {league.name[0]}
                  </AvatarFallback>
                </Avatar>
                {/* League status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card shadow-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-amber-400 to-amber-500'
                }`}></div>
              </div>

              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {league.name}
                </CardTitle>
                
                {/* Sport and status badges */}
                <div className="flex items-center gap-2 mt-1">
                  {league.sport?.name && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
                    >
                      {league.sport.name}
                    </Badge>
                  )}
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={`text-xs font-medium px-2 py-0.5 ${
                      isActive
                        ? "bg-green-500/20 text-green-700 border-green-500/30"
                        : "bg-amber-500/20 text-amber-700 border-amber-500/30"
                    }`}
                  >
                    {league.status || "Active"}
                  </Badge>
                </div>                {/* League details */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">{league.teams_count || 0} teams</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total number of teams across all seasons
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Target className="h-3 w-3" />
                        <span>{league.games_count || 0} games</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total number of games played across all seasons
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <TrendingUp className="h-3 w-3" />
                        <span>{league.seasons_count || 0} seasons</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total number of seasons for this league
                    </TooltipContent>
                  </Tooltip>
                  
                  {league.season && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">{league.season}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        Current or most recent season
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ml-2">
              <LeagueActions league={league} />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Grid view (card view)
  return (
    <Card className="relative overflow-hidden border-2 rounded-xl transition-all duration-300 hover:shadow-lg group bg-card border-border shadow-sm hover:border-primary/30 cursor-pointer animate-in fade-in-50"
      style={{
        animationDelay: `${index * 100}ms`,
        animationDuration: "500ms",
      }}
      onClick={handleCardClick}
    >
      {/* League color indicator */}
      <div className="absolute top-0 right-0 w-3 h-full bg-primary opacity-80"></div>
      
      {/* Hover effects */}
      <div className="absolute top-2 right-5 w-6 h-6 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <CardHeader className="relative p-5 space-y-4">
        {/* Status Badge and Actions */}
        <div className="flex items-start justify-between">
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={`text-xs font-medium px-2 py-0.5 ${
              isActive
                ? "bg-green-500/20 text-green-700 border-green-500/30"
                : "bg-amber-500/20 text-amber-700 border-amber-500/30"
            }`}
          >
            {league.status || "Active"}
          </Badge>
          <LeagueActions league={league} />
        </div>

        {/* Logo Section */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/50">
              <AvatarImage src={league.logo} alt={league.name} />
              <AvatarFallback className="font-bold text-2xl text-white bg-primary">
                {league.name[0]}
              </AvatarFallback>
            </Avatar>
            {/* League status indicator */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card shadow-sm ${
              isActive 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`}></div>
          </div>
        </div>

        {/* League Info */}
        <div className="space-y-2 text-center">
          <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
            {league.name}
          </CardTitle>

          {/* Sport badge */}
          {league.sport?.name && (
            <div className="flex justify-center">
              <Badge 
                variant="secondary" 
                className="text-xs font-medium px-2 py-0.5 bg-primary/20 text-primary border-primary/40"
              >
                {league.sport.name}
              </Badge>
            </div>
          )}          {/* Statistics */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">{league.teams_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total teams across all seasons</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Target className="h-3 w-3" />
                  <span className="font-medium">{league.games_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total games played</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">{league.seasons_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of seasons</p>
              </TooltipContent>
            </Tooltip>
            
            {league.season && (
              <>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <Trophy className="h-3 w-3" />
                      <span className="font-medium truncate max-w-16">{league.season}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current/Recent season: {league.season}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default LeagueCard;
