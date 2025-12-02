import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "use-debounce";
import { usePlayers, useReactivatePlayer } from "@/hooks/usePlayers";
import { useModal } from "@/hooks/useModal";
import DeletePlayerModal from "@/components/modals/DeletePlayerModal";
import PlayerModal from "@/components/modals/PlayerModal";
import PlayersFiltersBar from "./PlayersFiltersBar";
import PlayerCard from "./PlayerCard";
import PlayersTableView from "./PlayersTableView";
import { Separator } from "@/components/ui/separator";
import { PlayersListSkeleton } from "@/components/players";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import { Users, User, Table2, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    section: null,
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
  const playerModal = useModal();
  const navigate = useNavigate();

  const reactivatePlayerMutation = useReactivatePlayer();

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleReactivatePlayer = (player) => {
    reactivatePlayerMutation.mutate({ playerId: player.id });
  };

  const handleRegisterPlayer = () => {
    setSelectedPlayer(null);
    playerModal.openModal();
  };

  return (
    <Card className="border-2 border-primary/20 gap-0">
      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <User className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">Players</h2>
                <Badge className="h-6 text-[11px]">
                  {totalPlayers} players
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Register, manage, and track student athlete profiles and
                statistics for your sports team.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <Table2 />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("cards")}
              className="flex items-center gap-2"
            >
              <LayoutGrid />
            </Button>
          </div>
        </div>

        <PlayersFiltersBar
          filter={filter}
          setFilter={handleFilterChange}
          setViewMode={setViewMode}
          viewMode={viewMode}
          registerPlayer={handleRegisterPlayer}
        />
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <PlayersListSkeleton viewMode={viewMode} itemCount={pageSize} />
        ) : players && players.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {players.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onView={() => navigate(`/players/${player.id}`)}
                    onEdit={() => {
                      setSelectedPlayer(player);
                      playerModal.openModal();
                    }}
                    onDelete={() => {
                      setSelectedPlayer(player);
                      deleteModal.openModal();
                    }}
                    onReactivate={() => handleReactivatePlayer(player)}
                  />
                ))}
              </div>
              <div className="px-6">
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
              </div>
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
                playerModal.openModal();
              }}
              onDeletePlayer={(player) => {
                setSelectedPlayer(player);
                deleteModal.openModal();
              }}
              onReactivatePlayer={handleReactivatePlayer}
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
              </p>
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

        <DeletePlayerModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.closeModal}
          player={selectedPlayer}
        />
        <PlayerModal
          isOpen={playerModal.isOpen}
          onClose={playerModal.closeModal}
          player={selectedPlayer}
        />
      </CardContent>
    </Card>
  );
};

export default PlayersContainer;
