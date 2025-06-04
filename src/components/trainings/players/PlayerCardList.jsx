import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User } from "lucide-react";
import PlayerCard from "./PlayerCard";
import EnhancedPlayerFilter from "./EnhancedPlayerFilter";
import TablePagination from "@/components/ui/table-pagination";
import PlayerCardListSkeleton from "./PlayerCardListSkeleton";
import ViewToggle from "./ViewToggle";

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
  viewType,
  onViewChange,
}) => {
  return (
    <div className="space-y-6">      {/* Enhanced Header Card */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/8 to-primary/5 shadow-lg overflow-hidden">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">            {/* Title and Description Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0 self-start sm:self-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-0">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Individual Analysis
                  </CardTitle>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
                      {totalPlayers} {totalPlayers === 1 ? "player" : "players"}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Select a player to view their individual progress and
                  performance metrics
                </CardDescription>
              </div>
            </div>
              {/* Toggle Section - Hide since using tabs in parent */}
            {viewType && onViewChange && false && (
              <div className="flex justify-start sm:justify-center lg:justify-end items-center mt-2 lg:mt-0">
                <ViewToggle activeView={viewType} onViewChange={onViewChange} />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
      {/* Enhanced Filters */}
      <EnhancedPlayerFilter
        sports={sports}
        teams={teams}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      {/* Players Grid Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10 overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <PlayerCardListSkeleton count={pageSize} />
          ) : players.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  No players found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search filters to find players
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Enhanced Grid with better spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onClick={onPlayerSelect}
                  />
                ))}
              </div>

              {/* Enhanced Pagination */}
              <div className="border-t pt-6">
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
    </div>
  );
};

export default PlayerCardList;
