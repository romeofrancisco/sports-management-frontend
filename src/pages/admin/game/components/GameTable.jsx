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

import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";

const GameTable = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({
    search: "",
    status: GAME_STATUS_VALUES.SCHEDULED,
    type: GAME_TYPE_VALUES.NORMAL,
    sport: "all",
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

  return (
    <div className="md:px-5 md:border md:bg-muted/30 md:p-5 lg:p-8 my-5 rounded-lg sm:max-w-[calc(100vw-5.5rem)] lg:max-w-[calc(100vw-5rem)]">
      <GameFilterBar 
        filter={filter} 
        setFilter={(newFilter) => {
          setFilter(newFilter);
          setCurrentPage(1); // Reset to first page when filter changes
        }} 
      />
      
      <DataTable 
        columns={columns} 
        data={games} 
        loading={isLoading} 
        className="text-xs md:text-sm"
        showPagination={false} // Disable built-in pagination
        pageSize={pageSize} // Still pass pageSize for row rendering
      />
      
      {totalGames > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalGames}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          itemName="games"
        />
      )}
      
      <GameModal isOpen={modals.update.isOpen} onClose={modals.update.closeModal} game={selectedGame} />
      <DeleteGameModal isOpen={modals.delete.isOpen} onClose={modals.delete.closeModal} game={selectedGame} />
      <StartingLineupModal isOpen={modals.startingLineup.isOpen} onClose={modals.startingLineup.closeModal} game={selectedGame} />
      <StartGameConfirmation isOpen={modals.startGame.isOpen} onClose={modals.startGame.closeModal} game={selectedGame} />
    </div>
  );
};

export default GameTable;
