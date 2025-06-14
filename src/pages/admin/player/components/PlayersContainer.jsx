import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "use-debounce";
import { usePlayers } from "@/hooks/usePlayers";
import { useModal } from "@/hooks/useModal";
import PageError from "@/pages/PageError";
import DeletePlayerModal from "@/components/modals/DeletePlayerModal";
import PlayerModal from "@/components/modals/PlayerModal";
import PlayersFiltersBar from "./PlayersFiltersBar";
import PlayerCard from "./PlayerCard";
import PlayersTableView from "./PlayersTableView";
import { Separator } from "@/components/ui/separator";
import { PlayersListSkeleton } from "@/components/players";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import { Users, Table2, LayoutGrid } from "lucide-react";

const PlayersContainer = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filter, setFilter] = useState({
    search: "",
    sex: null,
    sport: null,
    year_level: null,
    course: null,
  });

  const [debouncedSearch] = useDebounce(filter.search, 500);
  const debouncedFilter = { ...filter, search: debouncedSearch };
  const { data, isLoading, isError } = usePlayers(
    debouncedFilter,
    currentPage,
    pageSize
  );
  const players = data?.results || [];
  const totalPlayers = data?.count || 0;
  const totalPages = Math.ceil(totalPlayers / pageSize);

  const deleteModal = useModal();
  const updateModal = useModal();
  const navigate = useNavigate();

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (isError) return <PageError />;
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

      <div className="relative p-4 md:p-6">
        {/* Enhanced Header with View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              Student Athletes
            </h2>
            <div className="px-2 py-1 bg-primary/10 rounded-full">
              <span className="text-xs font-medium text-primary">
                {totalPlayers} players
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
        <PlayersFiltersBar filter={filter} setFilter={handleFilterChange} />
        <Separator className="max-h-[0.5px] mb-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />{" "}
        {isLoading ? (
          <PlayersListSkeleton viewMode={viewMode} itemCount={pageSize} />
        ) : players && players.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="animate-in fade-in-50 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >                    <PlayerCard
                      player={player}
                      onView={() => navigate(`/players/${player.id}`)}
                      onEdit={() => {
                        setSelectedPlayer(player);
                        updateModal.openModal();
                      }}
                      onDelete={() => {
                        setSelectedPlayer(player);
                        deleteModal.openModal();
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination for cards view */}
              <TablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalPlayers}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                itemName="players"
              />
            </>
          ) : (
            <PlayersTableView
              players={players}
              totalItems={totalPlayers}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              onUpdatePlayer={(player) => {
                setSelectedPlayer(player);
                updateModal.openModal();
              }}
              onDeletePlayer={(player) => {
                setSelectedPlayer(player);
                deleteModal.openModal();
              }}
            />
          )
        ) : (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No players found
              </p>{" "}
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                {filter.search ||
                filter.sport ||
                filter.year_level ||
                filter.course
                  ? "Try adjusting your filters to find players"
                  : "Register your first player to get started with player management"}
              </p>
            </div>
          </div>
        )}
      </div>

      <DeletePlayerModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        player={selectedPlayer}
      />
      <PlayerModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        player={selectedPlayer}
      />
    </Card>
  );
};

export default PlayersContainer;
