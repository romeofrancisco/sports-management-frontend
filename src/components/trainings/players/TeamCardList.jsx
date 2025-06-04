import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import TeamCard from "./TeamCard";
import EnhancedTeamFilter from "./EnhancedTeamFilter";
import TeamCardListSkeleton from "./TeamCardListSkeleton";
import ViewToggle from "./ViewToggle";

const TeamCardList = ({
  teams,
  filteredTeams,
  sports,
  filters,
  onFilterChange,
  onTeamSelect,
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
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-0">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Team Comparison
                  </CardTitle>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-full border border-primary/20 whitespace-nowrap">
                      {filteredTeams.length}{" "}
                      {filteredTeams.length === 1 ? "team" : "teams"}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Choose a team to compare player performance and progress
                  across the roster
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
      </Card>{" "}
      {/* Enhanced Filters */}
      <EnhancedTeamFilter
        sports={sports}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      {/* Teams Grid Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10 overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <TeamCardListSkeleton count={8} />
          ) : teams.length === 0 || filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  No teams found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search filters to find teams
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} onClick={onTeamSelect} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCardList;
