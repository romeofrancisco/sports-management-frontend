import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PlayerCard from "./PlayerCard";
import PlayerSearchFilter from "./PlayerSearchFilter";
import TablePagination from "@/components/ui/table-pagination";
import PlayerCardListSkeleton from "./PlayerCardListSkeleton";

const PlayerCardList = ({
  players,
  totalPlayers,
  sports,
  teams,
  filters,
  onFilterChange,
  onPlayerSelect,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
}) => {
  return (
    <Card className="overflow-hidden border-0 shadow-none">
      <CardHeader className="pb-4 px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">Players</CardTitle>
            <CardDescription className="text-sm">
              Select a player to view individual progress
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalPlayers} total players
          </div>
        </div>
      </CardHeader>

      {/* Player Filters - Mobile responsive */}
      <div className="pb-4">
        <PlayerSearchFilter
          sports={sports}
          teams={teams}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <CardContent className="px-0">
        {isLoading ? (
          <PlayerCardListSkeleton count={pageSize} />
        ) : players.length === 0 ? (
          <div className="text-center py-8">
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                No players found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Responsive grid with better spacing */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onClick={onPlayerSelect}
                />
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="border-t pt-4">
              <TablePagination
                currentPage={page}
                pageSize={pageSize}
                totalItems={totalPlayers}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                isLoading={isLoading}
                pageSizeOptions={[12, 24, 36, 48]}
                itemName="players"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCardList;
