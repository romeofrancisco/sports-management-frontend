import React from "react";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRACKET_TYPES } from "@/constants/bracket";
import BracketDisplay from "@/components/brackets/BracketDisplay";
import InfoCard from "@/components/common/InfoCard";
import { Trophy, Users, BarChart } from "lucide-react";

const BracketView = ({ season, leagueId }) => {
  const { data: bracket, isLoading } = useBracket(leagueId, season.id);

  if (isLoading) {
    return <Loading />;
  }  if (!bracket) {
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
                  Tournament Bracket
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tournament bracket and match progression
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative p-6">
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No bracket data available for this season.</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
    totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;  return (
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
                Tournament Bracket
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tournament bracket and match progression
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6">          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
              icon={<BarChart className="h-5 w-5 text-amber-600" />}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BracketView;
