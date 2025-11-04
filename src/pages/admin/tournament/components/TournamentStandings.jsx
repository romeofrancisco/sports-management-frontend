import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { getSeasonStandingsColumns } from "@/components/table_columns/seasonStandingsColumns";
import { useTournamentTeamForm } from "@/hooks/useTournaments";

const TournamentStandings = ({ tournament, standings }) => {
  const { data: teamFormData, isLoading: isFormLoading } = useTournamentTeamForm(
    tournament?.id
  );

  if (!standings || standings.length === 0) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
          
          <CardContent className="p-12 text-center relative">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No standings available yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sport = tournament?.sport;
  const { scoring_type } = sport || {};
  const isSetBased = scoring_type === "sets";

  // Prepare tournamentDetails object similar to seasonDetails
  const tournamentDetails = {
    bracket_type: tournament?.bracket?.elimination_type,
  };

  // Get columns from the reusable module with teamFormData passed in
  // Use useMemo to regenerate columns when teamFormData changes
  const columns = useMemo(() => {
    return getSeasonStandingsColumns({ 
      seasonDetails: tournamentDetails, 
      sport, 
      teamFormData: teamFormData || [] 
    });
  }, [teamFormData, tournamentDetails.bracket_type, sport]);

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Tournament Standings
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Current team rankings and statistics
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <DataTable
            columns={columns}
            data={standings}
            showPagination={false}
            alternateRowColors={true}
            className="text-sm"
          />
          <div className="mt-4 text-xs text-muted-foreground">
            {isSetBased ? (
              <span>
                Teams are ranked based on match points first, followed by set ratio
                and sets won.
              </span>
            ) : tournamentDetails.bracket_type === "round_robin" ? (
              <span>
                Teams are ranked based on total points (3 for win, 1 for tie), 
                followed by win percentage and point differential.
              </span>
            ) : (
              <span>
                Teams are ranked based on win percentage, followed by point differential.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentStandings;
