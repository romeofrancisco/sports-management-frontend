import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import TeamCard from "./TeamCard";
import EnhancedTeamFilter from "./EnhancedTeamFilter";
import TablePagination from "@/components/ui/table-pagination";
import TeamCardListSkeleton from "./TeamCardListSkeleton";
import ViewToggle from "./ViewToggle";

const TeamCardList = ({
  teams,
  totalTeams,
  filters,
  onFilterChange,
  onTeamSelect,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  viewType,
  onViewChange,
}) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <Users className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex gap-1 items-center">
                <h2 className="text-2xl font-bold text-foreground">Teams</h2>
                <Badge className="h-6 p-1 text-[11px]" >{totalTeams} teams</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Select a team to view player progress and training analytics.
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <EnhancedTeamFilter
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </CardHeader>

      <CardContent>
        
        {isLoading ? (
          <TeamCardListSkeleton count={pageSize} />
        ) : teams.length === 0 ? (
          <div className="text-center py-16 relative">
            {/* Enhanced background effects for empty state */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No teams found
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                {filters.search || filters.sport
                  ? "Try adjusting your filters to find teams"
                  : "No teams are available for player progress tracking"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Grid with better spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} onClick={onTeamSelect} />
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="border-t pt-6">
              <TablePagination
                currentPage={page}
                pageSize={pageSize}
                totalItems={totalTeams}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                isLoading={isLoading}
                pageSizeOptions={[12, 24, 36, 48]}
                itemName="teams"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCardList;
