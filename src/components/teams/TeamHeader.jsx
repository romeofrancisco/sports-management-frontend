import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit } from "lucide-react";
import { getDivisionLabel } from "@/constants/team";

const TeamHeader = ({ data, team, teamColor }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 rounded-xl p-4 md:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/teams')} 
            variant="outline"
            size="sm"
            className="self-start bg-card/80 backdrop-blur-md border-2 border-primary/30 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>

          {/* Team Logo */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-60"></div>
            <div className="relative bg-card p-3 rounded-xl shadow-lg border-2 border-secondary/30">
              <Avatar className="h-12 w-12 md:h-16 md:w-16">
                <AvatarImage src={data.logo} alt={data.name} />                <AvatarFallback 
                  className="font-bold text-white text-lg md:text-2xl"
                  style={{ backgroundColor: teamColor }}
                >
                  {data.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="sm:border-l-2 sm:border-primary/40 sm:pl-4 md:pl-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {data.name}
              </h1>
              {data.abbreviation && (
                <Badge 
                  className="font-bold"
                  style={{ 
                    backgroundColor: `${teamColor}20`,
                    color: teamColor,
                    borderColor: `${teamColor}50`
                  }}
                >
                  {data.abbreviation}
                </Badge>
              )}
            </div>
            <p className="text-foreground mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold">
              {data.sport_name} Team
            </p>            <div className="flex items-center gap-3 mt-1">
              <Badge variant="secondary" className="text-xs">
                {getDivisionLabel(data.division)}
              </Badge>
              <div className="flex flex-col gap-1">
                {data.head_coach_name && (
                  <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                    Head Coach: {data.head_coach_name}
                  </span>
                )}
                {data.assistant_coach_name && (
                  <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                    Assistant Coach: {data.assistant_coach_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-6 mt-4 lg:mt-0">
          <Button
            onClick={() => navigate(`/teams/${team}/edit`)}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Team
          </Button>            {/* Team Status Indicator - dynamically determined from backend data */}
          {data.total_players > 0 && (data.head_coach_name || data.assistant_coach_name) && (
            <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-secondary/30 shadow-lg">
              <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-sm"></div>
              <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                Active Team
              </span>
            </div>
          )}
          {(!data.head_coach_name && !data.assistant_coach_name) || !data.total_players && (
            <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-amber-300/30 shadow-lg">
              <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 animate-pulse shadow-sm"></div>
              <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                Setup Required
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
