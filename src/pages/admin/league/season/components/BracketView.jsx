import React from "react";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import { Card, CardContent } from "@/components/ui/card";
import { BRACKET_TYPES } from "@/constants/bracket";
import BracketDisplay from "@/components/brackets/BracketDisplay";
import InfoCard from "@/components/common/InfoCard";
import { Trophy, Users, BarChart } from "lucide-react";

const BracketView = ({ season, leagueId }) => {
  const { data: bracket, isLoading } = useBracket(leagueId, season.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!bracket) {
    return (
      <Card className="p-6">
        <CardContent>
          <p>No bracket data available for this season.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const bracketTypeDisplay =
    bracket.elimination_type === BRACKET_TYPES.SINGLE
      ? "Single Elimination Tournament"
      : bracket.elimination_type === BRACKET_TYPES.ROUND_ROBIN
      ? "Round Robin Tournament"
      : "Tournament";

  const totalTeams = bracket.team_count;
  const completedMatches =
    bracket.rounds?.reduce(
      (count, round) =>
        count + round.matches.filter((match) => match.winner !== null).length,
      0
    ) || 0;
  const totalMatches =
    bracket.rounds?.reduce((count, round) => count + round.matches.length, 0) ||
    0;

  const completionPercentage =
    totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <InfoCard
          title="Tournament Format"
          value={bracketTypeDisplay}
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          className="hover:shadow-md transition-all duration-300"
        />

        <InfoCard
          title="Participating Teams"
          value={`${totalTeams} Teams`}
          icon={<Users className="h-5 w-5 text-indigo-500" />}
          className="hover:shadow-md transition-all duration-300"
        />

        <InfoCard
          title="Match Progress"
          value={`${completedMatches}/${totalMatches}`}
          icon={<BarChart className="h-5 w-5 text-blue-500" />}
          description={`${completionPercentage}% complete`}
          className="hover:shadow-md transition-all duration-300"
        />
      </div>
      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] p-6">
              <BracketDisplay bracket={bracket} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BracketView;
