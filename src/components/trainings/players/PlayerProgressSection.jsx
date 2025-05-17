import React, { useState, useEffect, useMemo } from "react";
import {
  SportFilter,
  TeamFilter,
  DateFilter,
  PlayerFilter,
} from "../dashboard/TrainingDashboardFilter";
import { Button } from "@/components/ui/button";
import {
  PlayerProgressChart,
  PlayerProgressMultiView,
} from "./player-progress-components";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";
import { useSports } from "@/hooks/useSports";
import { useSportTeams } from "@/hooks/useTeams";
import { useTeamPlayers } from "@/hooks/useTeams";
import { useTrainingMetrics } from "@/hooks/useTrainings";
import { Loader2, BarChart, LineChart, PlusCircle, Users } from "lucide-react";
import { useModal } from "@/hooks/useModal";

const initialState = {
  selectedSport: "",
  selectedTeam: "",
  selectedPlayer: "",
  dateRange: {
    from: null,
    to: null,
  },
  viewType: "individual", // "individual" or "compare"
};

const PlayerProgressSection = () => {
  const [filter, setFilter] = useState(initialState);
  const [activeTab, setActiveTab] = useState("chart");

  // Fetch sports
  const { data: sports = [], isLoading: isSportsLoading } = useSports();

  // Fetch teams based on selected sport
  const { data: teams = [], isLoading: isTeamsLoading } = useSportTeams(
    filter.selectedSport
  );

  // Fetch players based on selected team
  const { data: players = [], isLoading: isPlayersLoading } = useTeamPlayers(
    filter.selectedTeam
  );

  // Format date range for API requests
  const dateRangeParams = useMemo(() => {
    return {
      date_from: filter.dateRange.from
        ? filter.dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: filter.dateRange.to
        ? filter.dateRange.to.toISOString().split("T")[0]
        : undefined,
    };
  }, [filter.dateRange]);

  // Handle sport selection
  const handleSportChange = (sportId) => {
    setFilter((prev) => ({
      ...prev,
      selectedSport: sportId,
      selectedTeam: null,
      selectedPlayer: null,
    }));
  };
  // Handle team selection
  const handleTeamChange = (teamSlug) => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: teamSlug,
      selectedPlayer: null,
    }));
  };

  // Handle player selection
  const handlePlayerChange = (playerId) => {
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: playerId,
      viewType: "individual",
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setFilter((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  // Handle view type change
  const handleViewTypeChange = (type) => {
    setFilter((prev) => ({
      ...prev,
      viewType: type,
      // If switching to compare, clear selected player
      selectedPlayer: type === "compare" ? null : prev.selectedPlayer,
    }));
  };

  // Loading state
  const isLoading = isSportsLoading || isTeamsLoading || isPlayersLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Player Progress Tracking</h2>
        <div className="flex gap-2">
          <Button
            variant={filter.viewType === "individual" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewTypeChange("individual")}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Individual
          </Button>
          <Button
            variant={filter.viewType === "compare" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewTypeChange("compare")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Sport</label>
              <SportFilter
                sports={sports}
                selectedSport={filter.selectedSport}
                setSelectedSport={handleSportChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Team</label>
              <TeamFilter
                teams={teams}
                selectedTeam={filter.selectedTeam}
                setSelectedTeam={handleTeamChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                {filter.viewType === "individual" ? "Player" : "Date Range"}
              </label>
              {filter.viewType === "individual" ? (
                <PlayerFilter
                  players={players}
                  selectedPlayer={filter.selectedPlayer}
                  setSelectedPlayer={handlePlayerChange}
                />
              ) : (
                <DateFilter
                  dateRange={filter.dateRange}
                  setDateRange={handleDateRangeChange}
                />
              )}
            </div>
            <div>
              {filter.viewType === "individual" && (
                <>
                  <label className="text-sm font-medium mb-1 block">
                    Date Range
                  </label>
                  <DateFilter
                    dateRange={filter.dateRange}
                    setDateRange={handleDateRangeChange}
                  />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Visualization */}
      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
        </div>
      ) : !filter.selectedTeam ? (
        <div className="text-center py-10 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Select a team to view player progress</p>
        </div>
      ) : (
        <div>
          {filter.viewType === "individual" && filter.selectedPlayer ? (
            <Tabs
              defaultValue="chart"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Progress Chart</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                {" "}
                <PlayerProgressChart
                  playerId={filter.selectedPlayer}
                  dateRange={dateRangeParams}
                  teamSlug={filter.selectedTeam}
                />
              </TabsContent>
              <TabsContent value="data">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">
                      Detailed player metrics data table coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <PlayerProgressMultiView
              players={players.map((p) => ({
                id: p.id,
                user_id: p.user_id,
                name: p.name,
              }))}
              teamSlug={filter.selectedTeam}
              dateRange={dateRangeParams}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerProgressSection;
