import { useState } from "react";
import { useNavigate } from "react-router";
import { useModal } from "@/hooks/useModal";
import DataTable from "@/components/common/DataTable";
import PageError from "@/pages/PageError";
import { useGames } from "@/hooks/useGames";
import { GAME_STATUS_VALUES, GAME_TYPE_VALUES } from "@/constants/game";
import GameModal from "@/components/modals/GameModal";
import DeleteGameModal from "@/components/modals/DeleteGameModal";
import StartingLineupModal from "@/components/modals/StartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";
import TablePagination from "@/components/ui/table-pagination";
import { Button } from "@/components/ui/button";
import { Table2, LayoutGrid, Calendar, Filter } from "lucide-react";
import { DateNavigationBar } from "@/components/ui/date-navigation";
import { format, isSameDay, parseISO } from "date-fns";
import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";
import { GameCard, StatusSection, GameTableSkeleton, GameCardsSkeletons, StatusSectionSkeleton } from "@/components/games";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const GameTable = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [filterMode, setFilterMode] = useState("date"); // "date" or "filter"
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { isAdmin } = useRolePermissions();
  const [filter, setFilter] = useState({
    search: "",
    team_name: "",
    status: "",
    type: "",
    sport: "",
    league: "",
    season: "",
    start_date: "",
    end_date: "",
  });

  // Create filter for API based on mode
  const apiFilter =
    filterMode === "date"
      ? {
          ...filter,
          start_date: format(selectedDate, "yyyy-MM-dd"),
          end_date: format(selectedDate, "yyyy-MM-dd"),
        }
      : filter;

  const { isLoading, isError, data } = useGames(
    apiFilter,
    currentPage,
    pageSize
  );

  // Also fetch all games for date navigation
  const { data: allGamesData } = useGames({}, 1, 1000); // Get all games for date navigation
  const allGames = allGamesData?.results || [];

  const games = data?.results || [];
  const totalGames = data?.count || 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const modals = {
    delete: useModal(),
    update: useModal(),
    startingLineup: useModal(),
    startGame: useModal(),
  };

  if (isError) return <PageError />;
  const columns = getGameTableColumns({
    filterStatus: filter.status,
    navigate,
    setSelectedGame,
    modals,
  });
  // Handle card actions - adapt for season games GameCard
  const handleEditGame = (game) => {
    setSelectedGame(game);
    modals.update.openModal();
  };

  // Reset filters and switch modes
  const handleFilterModeToggle = () => {
    if (filterMode === "date") {
      // Switch to filter mode - reset filters
      setFilter({
        search: "",
        team_name: "",
        status: "",
        type: "",
        sport: "",
        league: "",
        season: "",
        start_date: "",
        end_date: "",
      });
      setFilterMode("filter");
    } else {
      // Switch to date mode - reset to today
      setSelectedDate(new Date());
      setFilterMode("date");
    }
    setCurrentPage(1);
  };

  // Get games count for a specific date (used by DateNavigationBar)
  const getGamesCountForDate = (date) => {
    if (!allGames || allGames.length === 0) return 0;
    return allGames.filter((game) => {
      const gameDate = parseISO(game.date);
      return isSameDay(gameDate, date);
    }).length;
  };

  // Separate games by status
  const separateGamesByStatus = (games) => {
    const liveGames = games.filter((game) => game.status === "in_progress");
    const scheduledGames = games.filter((game) => game.status === "scheduled");
    const completedGames = games.filter((game) => game.status === "completed");
    const otherGames = games.filter(
      (game) => !["in_progress", "scheduled", "completed"].includes(game.status)
    );

    return { liveGames, scheduledGames, completedGames, otherGames };
  };
  const { liveGames, scheduledGames, completedGames, otherGames } =
    separateGamesByStatus(games);
  return (
    <div className="space-y-6">
      {/* Filter Mode Toggle and Filter/Date Bar */}
      <div className="space-y-4">
        {/* Mode Toggle */}
        {isAdmin() && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={filterMode === "date" ? "default" : "outline"}
                size="sm"
                onClick={handleFilterModeToggle}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Date View
              </Button>

              <Button
                variant={filterMode === "filter" ? "default" : "outline"}
                size="sm"
                onClick={handleFilterModeToggle}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter View
              </Button>
            </div>
          </div>
        )}

        {/* Conditional Filter/Date Bar */}
        {filterMode === "filter" ? (
          <GameFilterBar
            filter={filter}
            setFilter={(newFilter) => {
              setFilter(newFilter);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          />
        ) : (
          <div className="bg-card rounded-xl shadow-md p-1">
            <DateNavigationBar
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                setCurrentPage(1); // Reset to first page when date changes
              }}
              data={allGames}
              dateProperty="date"
              getDataCountForDate={getGamesCountForDate}
              countLabel="Game"
              className="overflow-x-auto"
            />
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl rounded-xl p-4 md:p-6 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

        <div className="relative space-y-6">
          {/* View Mode Toggle Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Games</h3>
              <div className="px-2 py-1 bg-primary/10 rounded-full flex">
                <span className="text-xs font-medium text-primary">
                  {totalGames} games
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <Table2 className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </Button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === "table" ? (
            <>
              {isLoading ? (
                <GameTableSkeleton rows={pageSize} />
              ) : (
                <DataTable
                  columns={columns}
                  data={games}
                  loading={false}
                  className="text-xs md:text-sm"
                  showPagination={false} // Disable built-in pagination
                  pageSize={pageSize} // Still pass pageSize for row rendering
                />
              )}
            </>
          ) : (
            <div className="space-y-8">
              {isLoading ? (
                <>
                  <StatusSectionSkeleton title="Live Games" count={3} />
                  <StatusSectionSkeleton title="Scheduled Games" count={6} />
                  <StatusSectionSkeleton title="Completed Games" count={3} />
                </>
              ) : (
                <>
                  {/* Live Games */}
                  <StatusSection
                    status="in_progress"
                    games={liveGames}
                    variant="default"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {liveGames.map((game, index) => (
                        <div
                          key={game.id}
                          className="animate-in fade-in-50 duration-500"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <GameCard game={game} onEditGame={handleEditGame} />
                        </div>
                      ))}
                    </div>
                  </StatusSection>

                  {/* Scheduled Games */}
                  <StatusSection
                    status="scheduled"
                    games={scheduledGames}
                    variant="default"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {scheduledGames.map((game, index) => (
                        <div
                          key={game.id}
                          className="animate-in fade-in-50 duration-500"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <GameCard game={game} onEditGame={handleEditGame} />
                        </div>
                      ))}
                    </div>
                  </StatusSection>

                  {/* Completed Games */}
                  <StatusSection
                    status="completed"
                    games={completedGames}
                    variant="default"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {completedGames.map((game, index) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onEditGame={handleEditGame}
                        />
                      ))}
                    </div>
                  </StatusSection>

                  {/* Other Status Games */}
                  <StatusSection
                    status="other"
                    games={otherGames}
                    variant="default"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {otherGames.map((game, index) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onEditGame={handleEditGame}
                        />
                      ))}
                    </div>
                  </StatusSection>

                  {/* No games message */}
                  {games.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-lg font-medium">No games found</p>
                      <p className="text-sm">
                        Try adjusting your filters or create a new game.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {totalGames > 0 && (
            <TablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalGames}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              itemName="games"
              pageSizeOptions={
                viewMode === "cards" ? [12, 24, 36, 48] : [10, 25, 50, 100]
              }
            />
          )}
        </div>
      </div>

      <GameModal
        isOpen={modals.update.isOpen}
        onClose={modals.update.closeModal}
        game={selectedGame}
      />
      <DeleteGameModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        game={selectedGame}
      />
      <StartingLineupModal
        isOpen={modals.startingLineup.isOpen}
        onClose={modals.startingLineup.closeModal}
        game={selectedGame}
      />
      <StartGameConfirmation
        isOpen={modals.startGame.isOpen}
        onClose={modals.startGame.closeModal}
        game={selectedGame}
      />
    </div>
  );
};

export default GameTable;
