import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy } from "lucide-react";

/**
 * Enhanced upcoming activities section for player dashboard (games and training sessions)
 */
const UpcomingActivitiesSection = ({ overview }) => {
  // Separate upcoming games and training sessions
  const upcomingGames = overview?.upcoming_games || [];
  const upcomingSessions = overview?.upcoming_sessions || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
      {/* Upcoming Games Section */}
      <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gradient">
                Upcoming Games
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your scheduled matches
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingGames.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-1">
              {upcomingGames.slice(0, 3).map((game, index) => (
                <div
                  key={`game-${game.id}-${index}`}
                  className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-r from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  {/* Enhanced background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors duration-300">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {game.is_home
                            ? `vs ${game.away_team}`
                            : `@ ${game.home_team}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString()}
                          {game.time && ` • ${game.time}`}
                          {game.venue && ` • ${game.venue}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="default">Game</Badge>
                      <Badge variant="outline" className="text-xs">
                        {game.is_home ? "Home" : "Away"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Trophy className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No upcoming games scheduled
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Game schedules will appear here when available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Training Sessions Section */}
      <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gradient">
                Upcoming Training Sessions
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your scheduled training activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-1">
              {upcomingSessions.slice(0, 3).map((session, index) => (
                <div
                  key={`training-${session.id}-${index}`}
                  className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-r from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  {/* Enhanced background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors duration-300">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {session.title || "Training Session"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                          {session.start_time && ` • ${session.start_time}`}
                          {session.location && ` • ${session.location}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="primary">Training</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No upcoming training sessions
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Training sessions will appear here when scheduled
              </p>
            </div>
          )}
        </CardContent>{" "}
      </Card>
    </div>
  );
};

export default UpcomingActivitiesSection;
