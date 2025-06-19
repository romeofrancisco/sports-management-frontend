import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon } from "lucide-react";
import { TeamLogo } from "./TeamLogo.jsx";

export const TeamsDisplay = ({
  homeTeam,
  awayTeam,
  isCompleted,
  isLive,
  isScheduled,
  homeScore,
  awayScore,
  winnerTeamId,
  homeReady,
  awayReady,
  game,
}) => {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Home Team */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative flex-shrink-0">
          <TeamLogo
            team={homeTeam}
            isScheduled={isScheduled}
            isReady={homeReady}
            lineupType="home"
          />
          {isCompleted && winnerTeamId === homeTeam.id && (
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
              <TrophyIcon className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-base truncate leading-tight">
            {homeTeam.name || "Home"}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {homeTeam.abbreviation || "HOME"}
          </div>
        </div>
      </div>

      {/* Score/Status - Centered */}
      <div className="flex items-center justify-center flex-shrink-0 px-4">
        {isCompleted ? (
          <div className="text-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span
                className={
                  winnerTeamId === homeTeam.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {homeScore}
              </span>
              <span className="text-muted-foreground text-lg">-</span>
              <span
                className={
                  winnerTeamId === awayTeam.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {awayScore}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-green-50 text-green-700 border-green-200 mt-1"
            >
              Final
            </Badge>
          </div>
        ) : isLive ? (
          <div className="text-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-primary">{game.home_team_score || 0}</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-primary">{game.away_team_score || 0}</span>
            </div>
            <Badge variant="destructive" className="text-xs animate-pulse mt-1">
              Live
            </Badge>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary text-lg font-semibold">VS</span>
          </div>
        )}
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
        <div className="min-w-0 text-right flex-1">
          <div className="font-semibold text-base truncate leading-tight">
            {awayTeam.name || "Away"}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {awayTeam.abbreviation || "AWAY"}
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <TeamLogo
            team={awayTeam}
            isScheduled={isScheduled}
            isReady={awayReady}
            lineupType="away"
          />
          {isCompleted && winnerTeamId === awayTeam.id && (
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
              <TrophyIcon className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsDisplay;
