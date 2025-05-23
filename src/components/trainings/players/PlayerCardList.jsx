import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import PlayerCard from "./PlayerCard";
import PlayerSearchFilter from "./PlayerSearchFilter";
import TablePagination from "@/components/ui/table-pagination";
import ContentLoading from "@/components/common/ContentLoading";

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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Players</CardTitle>
        <CardDescription>
          Select a player to view individual progress
        </CardDescription>
      </CardHeader>
      {/* Player Filters - Always visible */}
      <div className="px-6 pb-4">
        <PlayerSearchFilter
          sports={sports}
          teams={teams}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
      <CardContent>
        {isLoading ? (
          <div className="p-4 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <ContentLoading />
            </div>
            <div className="w-full max-w-md space-y-3">
              <div className="h-2 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-4/5"></div>
              <div className="h-2 bg-muted rounded w-3/5"></div>
            </div>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              No players found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((player) => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  onClick={onPlayerSelect}
                />
              ))}
            </div>

            {/* Pagination */}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCardList;
