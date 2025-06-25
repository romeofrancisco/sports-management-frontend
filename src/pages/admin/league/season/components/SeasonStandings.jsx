import React from "react";
import DataTable from "@/components/common/DataTable";
import { TrendingUp } from "lucide-react";
import { getSeasonStandingsColumns } from "@/components/table_columns/SeasonStandingsColumns";
import { useParams } from "react-router";
import { useSeasonTeamForm } from "@/hooks/useSeasons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SeasonStandings = ({ standings, sport }) => {
  const { league, season } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } = useSeasonTeamForm(
    league,
    season
  );

  if (!standings) return null;

  const { scoring_type } = sport;
  const isSetBased = scoring_type === "sets";

  // Get columns from the extracted module with teamFormData passed in
  const columns = getSeasonStandingsColumns({ sport, teamFormData });

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Season Standings
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Team rankings and performance
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
            ) : (
              <span>
                Teams are ranked based on total points, followed by point
                differential and points scored.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonStandings;
