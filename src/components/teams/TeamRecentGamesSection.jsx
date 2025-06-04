import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Clock, MapPin } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";

const TeamRecentGamesSection = ({ games }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gradient">
              Recent Games
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Latest match results and performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {games?.length > 0 ? (
          <div className="space-y-4">
            {games.slice(0, 4).map((game, index) => {
              const isWin = game.result === 'win';
              const isLoss = game.result === 'loss';
              const isDraw = game.result === 'draw';
              
              return (
                <div
                  key={game.id || index}
                  className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-r from-card via-primary/5 to-secondary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/40 group"
                >                  {/* Result indicator */}
                  <div
                    className={`absolute top-0 right-0 w-3 h-full ${
                      isWin
                        ? "bg-gradient-to-b from-primary to-primary/80 shadow-lg"
                        : isLoss
                        ? "bg-gradient-to-b from-secondary to-secondary/80 shadow-lg"
                        : isDraw
                        ? "bg-gradient-to-b from-primary/60 to-primary/40 shadow-md"
                        : "bg-gradient-to-b from-muted-foreground to-muted-foreground/80 shadow-md"
                    }`}
                  ></div>
                  
                  {/* Additional background effects */}
                  <div className="absolute top-2 right-4 w-8 h-8 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="font-semibold text-foreground text-sm">
                          {game.home_team_name}
                          <span className="text-primary font-bold"> vs </span>
                          {game.away_team_name}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatShortDate(game.date)}</span>
                          </div>
                          {game.venue && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{game.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {game.score && (
                          <div className="text-sm font-bold text-foreground">
                            {game.score}
                          </div>
                        )}                        <Badge
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all duration-300 ${
                            isWin
                              ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 border-primary/30 shadow-md"
                              : isLoss
                              ? "text-secondary-foreground bg-gradient-to-r from-secondary to-secondary/80 border-secondary/30 shadow-md"
                              : isDraw
                              ? "text-primary-foreground bg-gradient-to-r from-primary/60 to-primary/40 border-primary/20 shadow-sm"
                              : "text-muted-foreground bg-gradient-to-r from-muted to-muted/80 border-muted/30 shadow-sm"
                          }`}
                        >
                          {game.result ? game.result.toUpperCase() : 'TBD'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {games.length > 4 && (
              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:text-secondary font-bold transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-secondary/30">
                  View all games →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No recent games
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                Game results will appear here after matches are completed.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamRecentGamesSection;
