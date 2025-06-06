import React, { useState, useEffect } from "react";
import { useSeasonGames } from "@/hooks/useSeasons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContentLoading from "@/components/common/ContentLoading";
import { DateNavigationBar } from "@/components/ui/date-navigation";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, TrophyIcon } from "lucide-react";

export const SeasonGames = ({ seasonId, leagueId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Format the selected date as YYYY-MM-DD for API filtering
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Fetch only games for the selected date from the backend
  const { data: filteredGames = [], isLoading } = useSeasonGames(leagueId, seasonId, {
    date: formattedDate
  });
  
  // Also fetch all games to support the date navigation bar
  const { data: allGames = [] } = useSeasonGames(leagueId, seasonId);

  // Initialize to today or first available game date when data loads
  useEffect(() => {
    if (allGames && allGames.length > 0) {
      // Start with today
      let initialDate = new Date();
      const todayGames = allGames.filter((game) =>
        isSameDay(parseISO(game.date), initialDate)
      );

      if (todayGames.length === 0) {
        // If no games today, find the closest game date
        initialDate = parseISO(allGames[0].date);
      }

      setSelectedDate(initialDate);
    }
  }, [allGames]);

  // Get games count for a specific date (used by the DateNavigationBar)
  const getGamesCountForDate = (date) => {
    if (!allGames || allGames.length === 0) return 0;
    return allGames.filter((game) => {
      const gameDate = parseISO(game.date);
      return isSameDay(gameDate, date);
    }).length;
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header with title and view toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Game Schedule</h2>
        </div>
      </div>

      {/* Date Navigation Bar - enhanced with shadow */}
      <div className="bg-card rounded-xl shadow-md p-1">
        <DateNavigationBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          data={allGames}
          dateProperty="date"
          getDataCountForDate={getGamesCountForDate}
          countLabel="Game"
          className="overflow-x-auto"
        />
      </div>

      {/* Games List with ContentLoading */}
      <div className="grid gap-4">
        {isLoading ? (
          <ContentLoading count={3} />
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game, i) => (
            <GameRow key={game.id || i} game={game} />
          ))
        ) : (
          <div className="text-center py-16 px-4 border rounded-xl bg-card/50 flex flex-col items-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-base sm:text-lg font-medium">
              No games scheduled for {format(selectedDate, "MMMM d, yyyy")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const GameRow = ({ game }) => {
  const homeTeam = game.home_team || {};
  const awayTeam = game.away_team || {};
  const isCompleted = game.status === "completed";
  const isLive = game.status === "in_progress";
  const isScheduled = game.status === "scheduled";

  const homeScore = game.score_summary.total.home || 0;
  const awayScore = game.score_summary.total.away || 0;

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
  // Get sport information
  const sportName = game.sport_slug
    ? game.sport_slug.charAt(0).toUpperCase() + game.sport_slug.slice(1)
    : "";

  return (
    <div
      className={cn(
        "flex justify-between gap-4 border rounded-xl transition-all duration-200",
        "hover:shadow-md p-4 md:p-5"
      )}
    >
      {/* Teams section */}
      <div className="flex items-center justify-center sm:justify-start gap-4">
        {/* Home team */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {homeTeam.logo ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img
                  src={homeTeam.logo}
                  alt={homeTeam.name || ""}
                  className="max-w-[95%] max-h-[95%] object-contain"
                />
              </div>
            ) : (
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg font-bold rounded-md"
                style={{
                  backgroundColor:
                    homeTeam.color || "rgba(var(--primary), 0.1)",
                  color: homeTeam.color ? "#fff" : "var(--primary)",
                }}
              >
                {(homeTeam.name || "").charAt(0)}
              </div>
            )}
            {isCompleted && game.home_team_score > game.away_team_score && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                <TrophyIcon className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <span className="text-xs font-semibold mt-2 hidden sm:block">
            {homeTeam.abbreviation || "HOME"}
          </span>
        </div>

        {/* Center section with scores or VS */}
        <div className="flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold">{homeScore || 0}</span>
                <span className="text-sm text-muted-foreground font-medium">
                  -
                </span>
                <span className="text-xl font-bold">{awayScore || 0}</span>
              </div>
              <Badge variant="outline" className="mt-1">
                Final
              </Badge>
            </div>
          ) : isLive ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold">
                  {game.away_team_score || 0}
                </span>
                <span className="text-sm text-destructive font-medium">•</span>
                <span className="text-xl font-bold">
                  {game.home_team_score || 0}
                </span>
              </div>
              <Badge variant="destructive" className="animate-pulse mt-1">
                Live
              </Badge>
            </div>
          ) : (
            <div className="px-4 py-1 rounded-full bg-muted text-primary text-sm font-bold border shadow-sm">
              VS
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {awayTeam.logo ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <img
                  src={awayTeam.logo}
                  alt={awayTeam.name || ""}
                  className="max-w-[95%] max-h-[95%] object-contain"
                />
              </div>
            ) : (
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-lg font-bold rounded-md"
                style={{
                  backgroundColor:
                    awayTeam.color || "rgba(var(--primary), 0.1)",
                  color: awayTeam.color ? "#fff" : "var(--primary)",
                }}
              >
                {(awayTeam.name || "").charAt(0)}
              </div>
            )}
            {isCompleted && game.away_team_score > game.home_team_score && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                <TrophyIcon className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <span className="text-xs font-semibold mt-2 hidden sm:block">
            {awayTeam.abbreviation || "AWAY"}
          </span>
        </div>
      </div>

      {/* Game info section */}
      <div className="lg:flex flex-col justify-center hidden">
        {isCompleted && (
          <div className="text-center font-medium mx-5">
            <table className="hidden md:block text-[0.65rem] mt-3">
              <thead className="border-b">
                <tr>
                  <th className="px-5"></th>
                  {game.score_summary.periods.map((p, index) => (
                    <th key={index} className="text-muted-foreground px-3">
                      {p.label}
                    </th>
                  ))}
                  <th className="px-3">T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-start py-1">{homeTeam.abbreviation}</td>
                  {game.score_summary.periods.map((p, index) => (
                    <td
                      key={index}
                      className={`${
                        p.home > p.away
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p.home}
                    </td>
                  ))}
                  <td className="font-bold">{homeScore}</td>
                </tr>
                <tr>
                  <td className="text-start">{awayTeam.abbreviation}</td>
                  {game.score_summary.periods.map((p, index) => (
                    <td
                      key={index}
                      className={`${
                        p.home < p.away
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p.away}
                    </td>
                  ))}
                  <td className="font-bold">{awayScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Game time section */}
      <div className="flex justify-center sm:justify-start items-center lg:place-self-end">
        <div className="text-center sm:text-left bg-muted/50 px-3 py-2 rounded-lg">
          <div className="font-bold text-base">{formatTime(game.date)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {formatDate(game.date)}
          </div>
          {game.location && (
            <div className="text-xs font-medium mt-1">{game.location}</div>
          )}
        </div>
      </div>

      {/* Action button */}
      {isCompleted && (
        <div className="flex justify-center sm:justify-end items-center col-span-1">
          <Button variant="outline">
            Boxscore
          </Button>
        </div>
      )}
    </div>
  );
};
