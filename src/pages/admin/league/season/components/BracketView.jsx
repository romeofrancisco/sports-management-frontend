import React from "react";
import { useBracket } from "@/hooks/useBrackets";
import Loading from "@/components/common/FullLoading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BRACKET_TYPES } from "@/constants/bracket";
import BracketDisplay from "@/components/brackets/BracketDisplay";
import { Trophy, Users, BarChart } from "lucide-react";

const BracketView = ({ season, leagueId }) => {
  const { data: bracket, isLoading } = useBracket(leagueId, season.id);

  if (isLoading) {
    return <Loading />;
  }
  if (!bracket) {
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
              <p className="text-muted-foreground">
                No bracket data available for this season.
              </p>
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
    totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;
  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>{" "}
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Tournament Bracket
              </CardTitle>
              <CardDescription>
                Tournament bracket and match progression
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative px-6">
          {/* Tournament Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {" "}
            {[
              {
                title: "Tournament Format",
                value: bracketTypeDisplay,
                icon: Trophy,
                description: "Competition type",
                color: "from-primary via-primary/90 to-primary/80",
                iconBg: "bg-primary",
                iconColor: "text-primary",
              },
              {
                title: "Participating Teams",
                value: totalTeams,
                icon: Users,
                description: "Teams competing",
                color: "from-secondary via-secondary/90 to-secondary/80",
                iconBg: "bg-secondary",
                iconColor: "text-secondary",
              },
              {
                title: "Match Progress",
                value: `${completedMatches}/${totalMatches}`,
                icon: BarChart,
                description: `${completionPercentage}% complete`,
                color: "from-primary/80 via-primary/70 to-primary/60",
                iconBg: "bg-gradient-to-br from-primary to-primary/80",
                iconColor: "text-primary",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className={`group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
                  ></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl opacity-60"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-40"></div>

                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-3 rounded-xl ${stat.iconBg} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div
                      className={`text-2xl md:text-3xl font-bold ${stat.iconColor} drop-shadow-sm tracking-tight`}
                    >
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px] px-6">
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
