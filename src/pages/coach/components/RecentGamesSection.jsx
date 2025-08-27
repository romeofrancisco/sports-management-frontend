import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Target, MapPin } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";
import { formatTo12HourTime } from "@/utils/formatTime";

const RecentGamesSection = ({ overview }) => {
  return (
    <Card className=" border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Recent Games
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest match results and performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {overview?.recent_games?.length > 0 ? (
          <div className="space-y-4">
            {overview.recent_games.slice(0, 4).map((game, index) => {
              return (
                <div
                  key={game.id || index}
                  className="relative overflow-hidden border border-primary/20 rounded-lg p-3 bg-gradient-to-r from-primary/5 to-primary/5 transition-all duration-300 hover:shadow-md hover:scale-[1.01] group"
                >
                  {/* Primary indicator */}
                  <div className="absolute top-0 right-0 w-2 h-full bg-primary"></div>

                  <div className="space-y-2">
                    {/* Header section with teams and score */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {game.home_team} vs {game.away_team}
                          </p>
                          <div className="space-y-1">
                            {game.result && (
                              <div className="flex items-center text-sm gap-1">
                                <Trophy className="h-3 w-3 text-primary" />
                                <p>{game.result.toUpperCase()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        <Target className="h-3 w-3" />
                        {`${game.home_team_score || 0} - ${
                          game.away_team_score || 0
                        }`}
                      </Badge>
                    </div>

                    {/* Content section */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {/* Left column */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span>{formatShortDate(game.date)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{game.location || "N/A"}</span>
                        </div>
                      </div>

                      {/* Right column */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No recent games</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Game results will appear here after matches are completed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentGamesSection;
