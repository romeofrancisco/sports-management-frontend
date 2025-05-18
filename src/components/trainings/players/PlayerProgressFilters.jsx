import React from "react";
import {
  SportFilter,
  TeamFilter,
  DateFilter,
  PlayerFilter,
} from "../dashboard/TrainingDashboardFilter";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PlayerProgressFilters = ({
  filter,
  sports,
  teams,
  players,
  handleSportChange,
  handleTeamChange,
  handlePlayerChange,
  handleDateRangeChange,
  resetFilters,
}) => {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-md font-semibold">Filters</h3>
          </div>
          {filter.selectedSport && filter.selectedTeam && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Sport</label>
            <SportFilter
              sports={sports}
              selectedSport={filter.selectedSport}
              setSelectedSport={handleSportChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Team</label>
            <TeamFilter
              teams={teams}
              selectedTeam={filter.selectedTeam}
              setSelectedTeam={handleTeamChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              {filter.viewType === "individual" ? "Player" : "Date Range"}
            </label>
            {filter.viewType === "individual" ? (
              <PlayerFilter
                players={players}
                selectedPlayer={filter.selectedPlayer}
                setSelectedPlayer={handlePlayerChange}
                className="w-full"
              />
            ) : (
              <DateFilter
                dateRange={filter.dateRange}
                setDateRange={handleDateRangeChange}
                className="w-full"
              />
            )}
          </div>
          <div className="space-y-2">
            {filter.viewType === "individual" && (
              <>
                <label className="text-sm font-medium block">
                  Date Range
                </label>
                <DateFilter
                  dateRange={filter.dateRange}
                  setDateRange={handleDateRangeChange}
                  className="w-full"
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProgressFilters;
