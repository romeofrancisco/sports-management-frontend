import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import TeamCard from "./TeamCard";
import TeamSearchFilter from "./TeamSearchFilter";
import ContentLoading from "@/components/common/ContentLoading";

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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Teams</CardTitle>
        <CardDescription>
          Select a team to compare players
        </CardDescription>
      </CardHeader>
      {/* Team Filters - Always visible */}
      <div className="px-6 pb-4">
        <TeamSearchFilter
          sports={sports}
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
        ) : teams.length === 0 || filteredTeams.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No teams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
