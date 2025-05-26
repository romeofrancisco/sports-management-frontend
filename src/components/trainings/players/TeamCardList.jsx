import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import TeamCard from "./TeamCard";
import TeamSearchFilter from "./TeamSearchFilter";
import TeamCardListSkeleton from "./TeamCardListSkeleton";

const TeamCardList = ({
  teams,
  filteredTeams,
  sports,
  filters,
  onFilterChange,
  onTeamSelect,
  isLoading,
}) => {
  return (
    <Card className="overflow-hidden border-0 shadow-none">
      <CardHeader className="pb-4 px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">Teams</CardTitle>
            <CardDescription className="text-sm">
              Select a team to compare players
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </CardHeader>

      {/* Team Filters - Mobile responsive */}
      <div className="pb-4">
        <TeamSearchFilter
          sports={sports}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <CardContent className="px-0">
        {isLoading ? (
          <TeamCardListSkeleton count={8} />
        ) : teams.length === 0 || filteredTeams.length === 0 ? (
          <div className="text-center py-8">
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                No teams found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onClick={onTeamSelect} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamCardList;
