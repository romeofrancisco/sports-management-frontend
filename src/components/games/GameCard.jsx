import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ClockIcon,
  MapPinIcon,
  Calendar,
  Trophy,
  Clock,
  Medal,
  MapPinned,
  Dumbbell,
  AlertTriangle,
} from "lucide-react";
import { TeamsDisplay } from "./TeamsDisplay";
import { GameActions } from "./GameActions";
import { ScoreSummary } from "./ScoreSummary";
import { ViewResultButton } from "./ViewResultButton";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useGameScoreWebSocket } from "@/hooks/useGameScoreWebSocket";
import { formatTo12HourTime } from "@/utils/formatTime";

export const GameCard = React.memo(
  ({ game, onEditGame }) => {
    // Get current user from auth state
    const { user } = useSelector((state) => state.auth);
    
    // Local state for real-time updates
    const [liveGameData, setLiveGameData] = useState(game);
    const [showScoreNotification, setShowScoreNotification] = useState(false);

    const homeTeam = liveGameData.home_team || {};
    const awayTeam = liveGameData.away_team || {};
    const isCompleted =
      liveGameData.status === "completed" ||
      liveGameData.status === "forfeited";
    const isLive = liveGameData.status === "in_progress";
    const isScheduled = liveGameData.status === "scheduled";
    const isDefault =
      liveGameData.status === "default_home_win" ||
      liveGameData.status === "default_away_win" ||
      liveGameData.status === "double_default";
    const isForfeited = liveGameData.status === "forfeited";


    const homeScore =
      liveGameData.sport_scoring_type === "points"
        ? liveGameData.home_team_score || 0
        : liveGameData.score_summary?.total?.home || 0;
    const awayScore =
      liveGameData.sport_scoring_type === "points"
        ? liveGameData.away_team_score || 0
        : liveGameData.score_summary?.total?.away || 0;
    const winnerTeamId = liveGameData.winner; // WebSocket connection for real-time updates (connect for live and scheduled games)
    const shouldConnect = isLive || isScheduled;
    const { isConnected } = useGameScoreWebSocket(
      shouldConnect ? liveGameData.id : null,
      (scoreData) => {
        // Update local game data with real-time score changes
        setLiveGameData((prev) => ({
          ...prev,
          home_team_score: scoreData.homeScore,
          away_team_score: scoreData.awayScore,
          status: scoreData.status,
          current_period: scoreData.currentPeriod,
          sport_scoring_type:
            scoreData.sportScoringType || prev.sport_scoring_type,
        }));

        // Show score update notification
        setShowScoreNotification(true);
        setTimeout(() => setShowScoreNotification(false), 3000);
      },
      (statusData) => {
        // Update local game data with real-time status changes
        setLiveGameData((prev) => ({
          ...prev,
          status: statusData.status,
          current_period: statusData.currentPeriod,
          started_at: statusData.startedAt,
          ended_at: statusData.endedAt,
        }));
      }
    );

    // Update local state when prop changes
    useEffect(() => {
      setLiveGameData(game);
    }, [game]);
    // Get lineup status for scheduled games
    const lineupStatus = liveGameData.lineup_status || {
      home_ready: false,
      away_ready: false,
    };
    const homeReady = lineupStatus.home_ready;
    const awayReady = lineupStatus.away_ready;
    const bothReady = homeReady && awayReady;

    const formatDate = (dateString) => {
      if (!dateString) return "TBA";
      // dateString is expected to be in 'YYYY-MM-DD' format
      const date = new Date(dateString + "T00:00:00");
      return format(date, "MMM d, yyyy");
    };

    const getStatusConfig = () => {
      if (isLive) {
        return {
          badge: (
            <div className="flex items-center gap-2">
              <Badge
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 animate-pulse border-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-400"
              >
                <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
          ),
          cardClass:
            "border-red-200 shadow-red-100/50 bg-gradient-to-br from-red-50/30 to-background ring-1 ring-red-100 dark:border-red-800 dark:shadow-red-900/20 dark:from-red-950/20 dark:ring-red-800/50",
        };
      }

      if (isDefault) {
        return {
          badge: (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-150 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              DEFAULT
            </Badge>
          ),
          cardClass:
            "border-amber-200 shadow-amber-100/50 bg-gradient-to-br from-amber-50/30 to-background ring-1 ring-amber-100 dark:border-amber-800 dark:shadow-amber-900/20 dark:from-amber-950/20 dark:ring-amber-800/50",
        };
      }

      if (isForfeited) {
        return {
          badge: (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-150 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              FORFEITED
            </Badge>
          ),
          cardClass:
            "border-orange-200 shadow-orange-100/50 bg-gradient-to-br from-orange-50/30 to-background ring-1 ring-orange-100 dark:border-orange-800 dark:shadow-orange-900/20 dark:from-orange-950/20 dark:ring-orange-800/50",
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
    
    // Check if current coach is assigned to this game
    const isAssignedCoach = () => {
      if (!isCoach() || !user || !liveGameData.assigned_coaches) return false;
      return liveGameData.assigned_coaches.some(coach => coach.id === user.id);
    };
    
    // Determine if user can see game actions
    const canSeeGameActions = isAdmin() || isAssignedCoach();
    
    // Determine if we are on the /games page
    const isGamesPage =
      typeof window !== "undefined" && window.location.pathname === "/games";
    const isLeagueGame =
      liveGameData.type === "league" &&
      liveGameData.league &&
      liveGameData.season;
    const isTournamentGame =
      liveGameData.type === "tournament" && liveGameData.tournament;

    const gameTypeDisplay = () => {
      switch (liveGameData.type) {
        case "league":
          return (
            <Badge>
              <Trophy />
              {liveGameData.league.name} - {liveGameData.season.name}
            </Badge>
          );
        case "tournament":
          return (
            <Badge>
              <Medal />
              {liveGameData.tournament.name}
            </Badge>
          );
        default:
          return (
            <Badge>
              <Dumbbell />
              Practice Game
            </Badge>
          );
      }
    };

    return (
      <Card
        className={`
      group relative overflow-hidden transition-all duration-300 
      hover:shadow-lg hover:shadow-primary/20
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
        <CardHeader>{isGamesPage && gameTypeDisplay()}</CardHeader>
        <CardContent>
          {/* Teams Display */}
          <div className="relative">
            {" "}
            <TeamsDisplay
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              isCompleted={isCompleted}
              isLive={isLive}
              isScheduled={isScheduled}
              isDefault={isDefault}
              homeScore={homeScore}
              awayScore={awayScore}
              winnerTeamId={winnerTeamId}
              homeReady={homeReady}
              awayReady={awayReady}
              game={liveGameData}
            />
          </div>

          <div className="flex items-center mt-3 border-y py-2 border-primary/20 border-dashed justify-between gap-2">
            <div className="flex items-center  gap-1 text-sm">
              <Calendar className="size-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {liveGameData.date ? formatDate(liveGameData.date) : "TBA"}
              </span>
            </div>

            <div className="flex items-center  gap-1 text-sm">
              <Clock className="size-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {liveGameData.start_time
                  ? formatTo12HourTime(liveGameData.start_time)
                  : "TBA"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MapPinned className="size-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {liveGameData.location || "TBA"}
              </span>
            </div>
          </div>

          {/* Game Actions and Score Summary Section */}
          <div className="border-primary/10 space-y-4">
            {/* Game Actions */}

            {/* Score Summary and View Result for Completed Games */}
            {(isCompleted || isForfeited) && liveGameData.score_summary?.periods && (
              <div className="space-y-4 mt-4">
                <ScoreSummary
                  game={liveGameData}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                />
                <ViewResultButton game={liveGameData} />
              </div>
            )}
          </div>
        </CardContent>

        {canSeeGameActions && (
          <CardFooter>
            <GameActions
              game={liveGameData}
              isDefault={isDefault}
              isCompleted={isCompleted}
              isLive={isLive}
              isScheduled={isScheduled}
              bothReady={bothReady}
              onEditGame={onEditGame}
            />
          </CardFooter>
        )}
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if game ID, status, or scores change
    return (
      prevProps.game.id === nextProps.game.id &&
      prevProps.game.status === nextProps.game.status &&
      prevProps.game.home_team_score === nextProps.game.home_team_score &&
      prevProps.game.away_team_score === nextProps.game.away_team_score &&
      prevProps.game.current_period === nextProps.game.current_period &&
      prevProps.onEditGame === nextProps.onEditGame
    );
  }
);
