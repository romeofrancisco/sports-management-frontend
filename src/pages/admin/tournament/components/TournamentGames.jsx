import React, { useState, useEffect, useCallback } from "react";
import { useTournamentGames } from "@/hooks/useTournaments";
import { useModal } from "@/hooks/useModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateNavigationBar } from "@/components/ui/date-navigation";
import { format, isSameDay, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  GameCard,
  StatusSection,
  StatusSectionSkeleton,
} from "@/components/games";
import GameModal from "@/components/modals/GameModal";

const TournamentGames = ({ tournamentId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingGame, setEditingGame] = useState(null);

  const {
    isOpen: showEditModal,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  // First, fetch all games to determine the initial date
  const { data: allGames = [], isLoading: isLoadingAllGames } =
    useTournamentGames(tournamentId);

  // Initialize date when all games data is available
  useEffect(() => {
    if (!selectedDate && !isLoadingAllGames) {
      // Start with today
      let initialDate = new Date();

      if (allGames && allGames.length > 0) {
        const todayGames = allGames.filter((game) =>
          isSameDay(parseISO(game.date), initialDate)
        );

        if (todayGames.length === 0) {
          // If no games today, find the first available game date
          const sortedGames = [...allGames].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          initialDate = parseISO(sortedGames[0].date);
        }
      }
      // Set the date regardless of whether there are games or not
      setSelectedDate(initialDate);
    }
  }, [allGames, selectedDate, isLoadingAllGames]);

  // Format the selected date as YYYY-MM-DD for API filtering (only when date is set)
  const formattedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  // Fetch filtered games only when we have a selected date
  const { data: filteredGames = [], isLoading: isLoadingFilteredGames } =
    useTournamentGames(
      tournamentId,
      formattedDate ? { date: formattedDate } : {}
    );

  // Combined loading state - show loading until we have both data and selected date
  const isLoading =
    isLoadingAllGames || isLoadingFilteredGames || !selectedDate;

  // Get games count for a specific date
  const getGamesCountForDate = useCallback(
    (date) => {
      if (!allGames || allGames.length === 0) return 0;
      return allGames.filter((game) => {
        const gameDate = parseISO(game.date);
        return isSameDay(gameDate, date);
      }).length;
    },
    [allGames]
  );

  // Handle edit game modal
  const handleEditGame = useCallback(
    (game) => {
      setEditingGame(game);
      openEditModal();
    },
    [openEditModal]
  );

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Background effects */}
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
                Tournament games and matchups
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative px-6">
          {/* Date Navigation Bar */}
          {selectedDate && (
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
            </div>
          )}

          {/* Games List */}
          {isLoading ? (
            <div className="space-y-6">
              <StatusSectionSkeleton title="Live Games" count={2} />
              <StatusSectionSkeleton title="Scheduled Games" count={4} />
              <StatusSectionSkeleton title="Completed Games" count={3} />
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="space-y-6">
              {/* Live Games Section */}
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
              </StatusSection>

              {/* Scheduled Games Section */}
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
              </StatusSection>

              {/* Completed Games Section */}
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
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "selected date"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Game Modal */}
      <GameModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        game={editingGame}
        isTournamentGame={true}
      />
    </div>
  );
};

export default TournamentGames;
