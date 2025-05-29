import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react";
import { formatShortDate } from "@/utils/formatDate";


const UpcomingGamesSection = ({ overview }) => {
  return (
    <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Upcoming Games
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your teams' scheduled matches
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {overview?.upcoming_games?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {overview.upcoming_games.slice(0, 6).map((game, index) => (
              <div
                key={index}
                className="relative overflow-hidden border-2 border-secondary/20 rounded-xl p-4 bg-gradient-to-r from-secondary/5 to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
              >
                {/* Enhanced priority indicator */}
                <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-primary to-secondary"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-60"></div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground text-sm">
                        {game.home_team}
                        <span className="text-primary font-bold"> vs </span>
                        {game.away_team}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span>{formatShortDate(game.date)}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-secondary/15 text-secondary border-secondary/30 font-semibold"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {game.time || "TBD"}
                    </Badge>
                  </div>

                  {game.venue && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                      <MapPin className="h-3 w-3" />
                      <span>{game.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {overview.upcoming_games.length > 5 && (
              <div className="text-center pt-2">
                <button className="text-sm text-perpetual-gold hover:text-perpetual-gold-dark font-medium">
                  View all {overview.upcoming_games.length} games →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
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
  );
};

export default UpcomingGamesSection;
