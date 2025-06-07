import React, { useState, useEffect } from "react";
import { useSeasonGames } from "@/hooks/useSeasons";
import { useModal } from "@/hooks/useModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentLoading from "@/components/common/ContentLoading";
import { DateNavigationBar } from "@/components/ui/date-navigation";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { GameCard, StatusSection } from "@/components/games";
import GameModal from "@/components/modals/GameModal";

export const SeasonGames = ({ seasonId, leagueId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingGame, setEditingGame] = useState(null);

  // Use the useModal hook instead of manual state management
  const {
    isOpen: showEditModal,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  // Format the selected date as YYYY-MM-DD for API filtering
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Fetch only games for the selected date from the backend
  const { data: filteredGames = [], isLoading } = useSeasonGames(
    leagueId,
    seasonId,
    {
      date: formattedDate,
    }
  );

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
  // Handle edit game modal
  const handleEditGame = (game) => {
    setEditingGame(game);
    openEditModal();
  };

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <CalendarIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Game Schedule
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Season games and matchups
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6">
          {/* Date Navigation Bar - enhanced with shadow */}
          <div className="bg-card rounded-xl shadow-md p-1 mb-6">
            <DateNavigationBar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              data={allGames}
              dateProperty="date"
              getDataCountForDate={getGamesCountForDate}
              countLabel="Game"
              className="overflow-x-auto"
            />
          </div>{" "}
          {/* Games List with ContentLoading */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <ContentLoading key={i} count={1} />
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="space-y-6">              {/* Live Games Section */}
              <StatusSection
                status="in_progress"
                games={filteredGames.filter(
                  (game) => game.status === "in_progress"
                )}
                variant="default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredGames
                    .filter((game) => game.status === "in_progress")
                    .map((game, i) => (
                      <GameCard
                        key={game.id || `live-${i}`}
                        game={game}
                        onEditGame={handleEditGame}
                      />
                    ))}
                </div>
              </StatusSection>              {/* Scheduled Games Section */}
              <StatusSection
                status="scheduled"
                games={filteredGames.filter(
                  (game) => game.status === "scheduled"
                )}
                variant="default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredGames
                    .filter((game) => game.status === "scheduled")
                    .map((game, i) => (
                      <GameCard
                        key={game.id || `scheduled-${i}`}
                        game={game}
                        onEditGame={handleEditGame}
                      />
                    ))}
                </div>
              </StatusSection>              {/* Completed Games Section */}
              <StatusSection
                status="completed"
                games={filteredGames.filter(
                  (game) => game.status === "completed"
                )}
                variant="default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredGames
                    .filter((game) => game.status === "completed")
                    .map((game, i) => (
                      <GameCard
                        key={game.id || `completed-${i}`}
                        game={game}
                        onEditGame={handleEditGame}
                      />
                    ))}
                </div>
              </StatusSection>
            </div>
          ) : (
            <div>
              <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-base sm:text-lg font-medium">
                    No games scheduled for{" "}
                    {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}{" "}
        </CardContent>
      </Card>

      {/* Edit Game Modal */}
      <GameModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        game={editingGame}
        isLeagueGame={true}
      />
    </div>
  );
};
