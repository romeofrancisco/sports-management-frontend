import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullPageLoading from "@/components/common/FullPageLoading";
import { useTeamsInSeason } from "@/hooks/useTeams";
import { Users, Trophy, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SeasonTeams = ({ seasonId, leagueId }) => {
  const { data: teams, isLoading } = useTeamsInSeason(leagueId, seasonId);

  if (isLoading) return <FullPageLoading />;
  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Season Teams
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Teams participating in this season
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Teams
                    </div>{" "}
                    <div className="text-2xl font-bold">
                      {teams?.length || 0}
                    </div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Users className="text-amber-600 h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Top Team
                    </div>
                    <div className="text-2xl font-bold">
                      {teams && teams.length > 0 ? teams[0]?.name : "N/A"}
                    </div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Trophy className="text-amber-500 h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Most Wins
                    </div>
                    <div className="text-2xl font-bold">
                      {teams && teams.length > 0
                        ? `${teams[0]?.wins || 0} wins`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <TrendingUp className="text-red-900 h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>{" "}
          {/* Team cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {teams && teams.length > 0 ? (
              teams.map((team, index) => (
                <Card
                  key={team.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={team.logo} alt={team.name} />
                        <AvatarFallback
                          style={{ backgroundColor: team.color || "#888" }}
                          className="text-white text-lg"
                        >
                          {team.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-base">
                            {team.name}
                          </h3>
                          <Badge variant="outline" className="ml-2">
                            #{index + 1}
                          </Badge>
                        </div>                        <div className="text-sm text-muted-foreground">
                          {team.head_coach?.name ? (
                            <div>Head Coach: {team.head_coach.name}</div>
                          ) : null}
                          {team.assistant_coach?.name ? (
                            <div>Assistant Coach: {team.assistant_coach.name}</div>
                          ) : null}
                          {!team.head_coach?.name && !team.assistant_coach?.name ? (
                            <div>No coaches assigned</div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">
                            {team.wins || 0}-{team.losses || 0}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            (
                            {team.games_played > 0
                              ? `${(
                                  (team.wins / team.games_played) *
                                  100
                                ).toFixed(1)}%`
                              : "0.0%"}
                            )
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {(team.form || "")
                            .split("")
                            .slice(0, 5)
                            .map((result, idx) => (
                              <Badge
                                key={idx}
                                className={
                                  result === "W"
                                    ? "bg-green-100 text-green-800 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                    : result === "L"
                                    ? "bg-red-100 text-red-800 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                    : "bg-amber-100 text-amber-800 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                }
                              >
                                {result}
                              </Badge>
                            ))}
                          {(!team.form || team.form.length === 0) && (
                            <span className="text-muted-foreground text-xs">
                              No games
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No teams in this season</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
