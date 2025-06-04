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
import { Table2, LayoutGrid } from "lucide-react";

import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";
import GameCard from "./GameCard";

const GameTable = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"

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

  const { isLoading, isError, data } = useGames(filter, currentPage, pageSize);

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

  // Handle card actions
  const handleEditGame = (game) => {
    setSelectedGame(game);
    modals.update.openModal();
  };

  const handleDeleteGame = (game) => {
    setSelectedGame(game);
    modals.delete.openModal();
  };

  const handleViewGame = (game) => {
    navigate(`/games/${game.id}`);
  };

  const handleStartGame = (game) => {
    setSelectedGame(game);
    modals.startGame.openModal();
  };

  const handleStartingLineup = (game) => {
    setSelectedGame(game);
    modals.startingLineup.openModal();
  };
  return (
    <div className="space-y-6">
      <GameFilterBar
        filter={filter}
        setFilter={(newFilter) => {
          setFilter(newFilter);
          setCurrentPage(1); // Reset to first page when filter changes
        }}
      />

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
            <DataTable
              columns={columns}
              data={games}
              loading={isLoading}
              className="text-xs md:text-sm"
              showPagination={false} // Disable built-in pagination
              pageSize={pageSize} // Still pass pageSize for row rendering
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="animate-in fade-in-50 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <GameCard
                    game={game}
                    onEdit={handleEditGame}
                    onDelete={handleDeleteGame}
                    onView={handleViewGame}
                    onStartGame={handleStartGame}
                    onStartingLineup={handleStartingLineup}
                    filterStatus={filter.status}
                  />
                </div>
              ))}
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
