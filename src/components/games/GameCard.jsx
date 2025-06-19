import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClockIcon, MapPinIcon, Calendar, Trophy, Clock } from "lucide-react";
import { TeamsDisplay } from "./TeamsDisplay";
import { GameActions } from "./GameActions";
import { ScoreSummary } from "./ScoreSummary";
import { ViewResultButton } from "./ViewResultButton";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export const GameCard = ({ game, onEditGame }) => {
  const homeTeam = game.home_team || {};
  const awayTeam = game.away_team || {};
  const isCompleted = game.status === "completed";
  const isLive = game.status === "in_progress";
  const isScheduled = game.status === "scheduled";

  const homeScore = game.score_summary?.total?.home || 0;
  const awayScore = game.score_summary?.total?.away || 0;
  const winnerTeamId = game.winner;

  // Get lineup status for scheduled games
  const lineupStatus = game.lineup_status || {
    home_ready: false,
    away_ready: false,
  };
  const homeReady = lineupStatus.home_ready;
  const awayReady = lineupStatus.away_ready;
  const bothReady = homeReady && awayReady;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    const parts = duration.split(":");
    return `${parts[0]}h ${parts[1]}m`;
  }; // Status configuration
  const getStatusConfig = () => {
    if (isLive) {
      return {
        badge: (
          <Badge
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 animate-pulse border-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-400"
          >
            <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
            LIVE
          </Badge>
        ),
        cardClass:
          "border-red-200 shadow-red-100/50 bg-gradient-to-br from-red-50/30 to-background ring-1 ring-red-100 dark:border-red-800 dark:shadow-red-900/20 dark:from-red-950/20 dark:ring-red-800/50",
      };
    }

    if (isCompleted) {
      return {
        badge: (
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Trophy className="w-3 h-3 mr-1" />
            COMPLETED
          </Badge>
        ),
        cardClass:
          "border-primary/20 shadow-primary/10 bg-gradient-to-br from-primary/5 to-background ring-1 ring-primary/10",
      };
    }

    if (isScheduled) {
      return {
        badge: (
          <Badge
            variant="outline"
            className={`
            border-secondary/30 text-secondary bg-secondary/10 hover:bg-secondary/15
          `}
          >
            <Clock className="w-3 h-3 mr-1" />
            SCHEDULED
          </Badge>
        ),
        cardClass:
          "border-secondary/20 shadow-secondary/10 bg-gradient-to-br from-secondary/5 to-background ring-1 ring-secondary/10",
      };
    }

    return {
      badge: null,
      cardClass: "border-border hover:border-primary/30",
    };
  };
  const statusConfig = getStatusConfig();
  const { isAdmin, isCoach } = useRolePermissions();

  // Determine if we are on the /games page
  const isGamesPage =
    typeof window !== "undefined" && window.location.pathname === "/games";
  const isLeagueGame = game.type === "league" && game.league && game.season;

  return (
    <Card
      className={`
      group relative overflow-hidden transition-all duration-300 
      hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] hover:-translate-y-1
      ${statusConfig.cardClass}
      ${isLive ? "ring-2 ring-red-200 dark:ring-red-800" : ""}
    `}
    >
      {/* Status Indicator Strip */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
      )}
      {isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
      )}
      {isScheduled && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary/60 to-secondary"></div>
      )}
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span className="font-semibold text-foreground whitespace-nowrap">
                  {formatDate(game.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="h-4 w-4 text-secondary/70" />
                <span className="font-medium whitespace-nowrap">
                  {formatTime(game.date)}
                </span>
              </div>
            </div>
            {/* Status Badge */}
            <div className="flex items-center gap-2">{statusConfig.badge}</div>
          </div>
          {/* League & Season Details for League Games on /games */}
          {isGamesPage && isLeagueGame && (
            <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">League:</span>
                <span>{game.league.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">Season:</span>
                <span>
                  {game.season.name} {game.season.year}
                </span>
              </div>
              {/* Show assigned coaches for league games */}
              {game.assigned_coaches && game.assigned_coaches.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">Coaches:</span>
                  <span>
                    {game.assigned_coaches
                      .map((coach) => coach.name)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Second Row: Location and Duration */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4 text-primary/50" />
              <span className="font-medium" title={game.location || "TBA"}>
                {game.location || "TBA"}
              </span>
            </div>

            {/* Additional completed game info */}
            {isCompleted && game.duration && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-secondary/50" />
                <span className="font-medium whitespace-nowrap">
                  {formatDuration(game.duration)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 border-t border-secondary/10 space-y-4">
        {/* Teams Display */}
        <div className="relative">
          <TeamsDisplay
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            isCompleted={isCompleted}
            isLive={isLive}
            isScheduled={isScheduled}
            homeScore={homeScore}
            awayScore={awayScore}
            winnerTeamId={winnerTeamId}
            homeReady={homeReady}
            awayReady={awayReady}
            game={game}
          />
        </div>
        {/* Game Actions and Score Summary Section */}
        <div className="pt-3 border-t border-primary/10 space-y-4">
          {/* Game Actions */}
          {(isAdmin() || isCoach()) && (
            <div className="flex items-center justify-end">
              <GameActions
                game={game}
                isCompleted={isCompleted}
                isLive={isLive}
                isScheduled={isScheduled}
                bothReady={bothReady}
                onEditGame={onEditGame}
              />
            </div>
          )}
          {/* Score Summary and View Result for Completed Games */}
          {isCompleted && game.score_summary?.periods && (
            <div className="space-y-4">
              <ScoreSummary
                game={game}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
              <ViewResultButton game={game} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
