import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamsInSeason } from "@/hooks/useTeams";
import { Users, Trophy, Medal, Award, Shield, Crown, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SeasonTeams = ({ seasonId, leagueId }) => {
  const { data: teams, isLoading } = useTeamsInSeason(leagueId, seasonId);
  console.log('Teams in season:', teams); 

  // Get position icon
  const getPositionIcon = (pos) => {
    switch (pos) {
      case 1:
        return Crown;
      case 2:
        return Medal;
      case 3:
        return Award;
      default:
        return Shield;
    }
  };

  // Win ratio color
  const getWinRatioColor = (ratio) => {
    if (ratio >= 0.7) return "text-green-700 dark:text-green-400";
    if (ratio >= 0.5) return "text-yellow-700 dark:text-yellow-400";
    if (ratio >= 0.3) return "text-orange-700 dark:text-orange-400";
    return "text-red-700 dark:text-red-400";
  };

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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-2 border-border/40 bg-gradient-to-r from-card via-muted/10 to-card shadow-sm animate-pulse"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full" />
                      </div>
                      <div className="relative">
                        <Skeleton className="w-12 h-12 rounded-full" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((j) => (
                            <Skeleton key={j} className="w-2 h-2 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team, index) => {
                const position = index + 1;
                const PositionIcon = getPositionIcon(position);
                const winRatio = team.win_percentage;

                return (
                  <Card
                    key={team.id}
                    className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg group bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20"
                  >
                    <CardContent className="p-4">
                      {/* Main Team Info */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* Position Badge */}
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary/80 to-primary/90 text-primary-foreground font-bold text-sm shadow-sm">
                            #{position}
                          </div>
                          <div className="absolute -bottom-1 -right-2 w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center">
                            <PositionIcon className="h-3 w-3 text-primary" />
                          </div>
                        </div>

                        {/* Team Logo */}
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-colors">
                            <AvatarImage 
                              src={team.logo} 
                              alt={team.name}
                              className="object-contain"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {team.name?.charAt(0) || "T"}
                            </AvatarFallback>
                          </Avatar>

                          {/* Championship indicator */}
                          {team.championships > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-background shadow-md flex items-center justify-center">
                              <Trophy className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Team Name and Record */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {team.name}
                            </h3>
                            <div className={`text-xs font-bold ${getWinRatioColor(winRatio)}`}>
                              {Math.round(winRatio * 100)}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {team.wins || 0}W-{team.losses || 0}L
                            </span>
                            {team.points > 0 && (
                              <span className="text-primary font-medium">{team.points} pts</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Performance Indicators */}
                      <div className="border-t border-border/40 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium">
                              STRK:
                            </span>
                            <div className="flex items-center gap-1">
                              {(team.form || "")
                                .split("")
                                .slice(0, 5)
                                .map((result, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                      result === "W"
                                        ? "bg-green-500 shadow-sm hover:bg-green-600"
                                        : result === "L"
                                        ? "bg-red-500 shadow-sm hover:bg-red-600"
                                        : result === "D"
                                        ? "bg-yellow-500 shadow-sm hover:bg-yellow-600"
                                        : "bg-gray-300"
                                    }`}
                                    title={
                                      result === "W"
                                        ? "Win"
                                        : result === "L"
                                        ? "Loss"
                                        : result === "D"
                                        ? "Draw"
                                        : "Unknown"
                                    }
                                  />
                                ))}
                              {(!team.form || team.form.length === 0) && (
                                <span className="text-xs text-muted-foreground/70 italic">
                                  No recent games
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Additional Stats */}
                          <div className="flex items-center gap-2 text-xs">
                            {team.goal_difference !== undefined && team.goal_difference !== 0 && (
                              <span
                                className={`font-medium px-1.5 py-0.5 rounded text-xs ${
                                  team.goal_difference > 0
                                    ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                                    : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                                }`}
                              >
                                {team.goal_difference > 0 ? "+" : ""}
                                {team.goal_difference}
                              </span>
                            )}
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-border/50 rounded-xl bg-gradient-to-br from-muted/20 via-background to-muted/10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No teams in this season
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Teams will appear here once they join the season
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
