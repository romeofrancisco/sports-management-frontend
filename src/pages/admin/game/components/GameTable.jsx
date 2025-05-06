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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";

// Custom component for displaying pagination info
const PaginationInfo = ({ currentPage, pageSize, totalItems }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="text-sm text-muted-foreground">
      Showing {start} to {end} of {totalItems} games
    </div>
  );
};

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
  const totalPages = Math.ceil(totalGames / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <PaginationInfo 
            currentPage={currentPage} 
            pageSize={pageSize} 
            totalItems={totalGames} 
          />
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-[8.5rem] h-8">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show range of pages centered around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <GameModal isOpen={modals.update.isOpen} onClose={modals.update.closeModal} game={selectedGame} />
      <DeleteGameModal isOpen={modals.delete.isOpen} onClose={modals.delete.closeModal} game={selectedGame} />
      <StartingLineupModal isOpen={modals.startingLineup.isOpen} onClose={modals.startingLineup.closeModal} game={selectedGame} />
      <StartGameConfirmation isOpen={modals.startGame.isOpen} onClose={modals.startGame.closeModal} game={selectedGame} />
    </div>
  );
};

export default GameTable;
