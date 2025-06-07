import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

/**
 * Upcoming games section for player dashboard
 */
const UpcomingGamesSection = ({ overview }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-secondary/3 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary shadow-lg">
            <Calendar className="h-4 w-4 text-secondary-foreground" />
          </div>
          Upcoming Games
        </CardTitle>
        <CardDescription>Your scheduled matches</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {overview?.upcoming_games?.length > 0 ? (
          <div className="space-y-3">
            {overview.upcoming_games.slice(0, 5).map((game, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/80"
              >
                <div>
                  <div className="font-medium">
                    {game.is_home
                      ? `vs ${game.away_team}`
                      : `@ ${game.home_team}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(game.date).toLocaleDateString()} •{" "}
                    {game.location || "TBD"}
                  </div>
                </div>
                <Badge variant={game.is_home ? "default" : "outline"}>
                  {game.is_home ? "Home" : "Away"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming games scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingGamesSection;
