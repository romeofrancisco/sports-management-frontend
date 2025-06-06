import React from "react";
import { useLeagueTeamForm } from "@/hooks/useLeagues";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import LeagueTeamsList from "./LeagueTeamsList";

const LeagueTeamsGrid = ({
  teams: propTeams,
  showHeader = true,
  maxTeams = null,
  gridCols = "lg:grid-cols-3",
  className = ""
}) => {
  const { league } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } = useLeagueTeamForm(league);
  
  // Use props teams if provided, otherwise use API response
  const teams = propTeams || teamFormData?.teams || [];

  // If showHeader is false, just return the teams list without container
  if (!showHeader) {
    return (
      <LeagueTeamsList
        teams={teams}
        formData={teamFormData?.form || {}}
        isLoading={isFormLoading}
        maxTeams={maxTeams}
        gridCols={gridCols}
        className={className}
      />
    );
  }

  return (
    <div>
      {/* Teams List */}
      <div className="animate-in fade-in-50 duration-500 delay-300">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                  Team Standings
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Current league positions and team performance
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative p-6">
            <LeagueTeamsList
              teams={teams}
              formData={teamFormData?.form || {}}
              isLoading={isFormLoading}
              maxTeams={maxTeams}
              gridCols={gridCols}
              className={className}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeagueTeamsGrid;
