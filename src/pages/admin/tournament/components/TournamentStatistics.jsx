import React from "react";
import {
  useTournamentStatistics,
  useTournamentLeaders,
} from "@/hooks/useTournaments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Trophy,
  Target,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TournamentStatistics = ({ tournamentId }) => {
  const { data: statistics, isLoading: statsLoading } =
    useTournamentStatistics(tournamentId);
  const { data: leaders, isLoading: leadersLoading } =
    useTournamentLeaders(tournamentId);

  const isLoading = statsLoading || leadersLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Statistics Overview */}
      {statistics && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Tournament Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Games</p>
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {statistics.total_games || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.total_points || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg Points</p>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.average_points?.toFixed(1) || "0.0"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Highest Score</p>
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {statistics.highest_score || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tournament Leaders */}
      {leaders && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Scorers */}
          {leaders.top_scorers && leaders.top_scorers.length > 0 && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Top Scorers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {leaders.top_scorers.slice(0, 5).map((player, index) => (
                    <div
                      key={player.player_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-700"
                              : index === 1
                              ? "bg-gray-400/20 text-gray-700"
                              : index === 2
                              ? "bg-orange-500/20 text-orange-700"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={player.player_image}
                            alt={player.player_name}
                          />
                          <AvatarFallback>
                            {player.player_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{player.player_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.team_name}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/40">
                        {player.total_points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Assisters */}
          {leaders.top_assisters && leaders.top_assisters.length > 0 && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Assisters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {leaders.top_assisters.slice(0, 5).map((player, index) => (
                    <div
                      key={player.player_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-700"
                              : index === 1
                              ? "bg-gray-400/20 text-gray-700"
                              : index === 2
                              ? "bg-orange-500/20 text-orange-700"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={player.player_image}
                            alt={player.player_name}
                          />
                          <AvatarFallback>
                            {player.player_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{player.player_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.team_name}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/40">
                        {player.total_assists} ast
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentStatistics;
