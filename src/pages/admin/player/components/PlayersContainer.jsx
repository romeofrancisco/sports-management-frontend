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
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <User className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Student Athletes
                </h2>
                <Badge>{totalPlayers} players</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Register, manage, and track student athlete profiles and statistics for your sports team.
              </p>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PlayersListSkeleton viewMode={viewMode} itemCount={pageSize} />
        ) : players && players.length > 0 ? (
          viewMode === "cards" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map((player, index) => (
                  <PlayerCard
                    key={player.id}
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
          isOpen={updateModal.isOpen}
          onClose={updateModal.closeModal}
          player={selectedPlayer}
        />
      </CardContent>
    </Card>
  );
};

export default PlayersContainer;
