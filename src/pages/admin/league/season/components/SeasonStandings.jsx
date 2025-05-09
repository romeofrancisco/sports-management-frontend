import React from "react";
import DataTable from "@/components/common/DataTable";
import { TrendingUp } from "lucide-react";
import { getSeasonStandingsColumns } from "@/components/table_columns/SeasonStandingsColumns";
import { useParams } from "react-router";
import { useSeasonTeamForm } from "@/hooks/useSeasons";

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
    <div className="bg-card rounded-lg border shadow-md overflow-hidden p-5">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Season Standings
      </h2>
      <DataTable
        columns={columns}
        data={standings}
        showPagination={false}
        alternateRowColors={true}
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
    </div>
  );
};

export default SeasonStandings;
