import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart } from "lucide-react";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { useTeamPlayers } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";
import "./player-progress-styles.css";
import ContentLoading from "@/components/common/ContentLoading";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";

// Import the new components
import PlayerProgressFilters from "./PlayerProgressFilters";
import PlayerProgressQuickActions from "./PlayerProgressQuickActions";
import PlayerProgressStats from "./PlayerProgressStats";
import PlayerProgressIndividualView from "./PlayerProgressIndividualView";
import PlayerProgressCompareView from "./PlayerProgressCompareView";
import PlayerQuickSelect from "./PlayerQuickSelect";
import EmptyStateView from "./EmptyStateView";

const PlayerProgressSection = () => {
  const [filter, setFilter] = useState(
    // Initial state for the player progress filters
    {
      selectedSport: "",
      selectedTeam: "",
      selectedPlayer: "",
      dateRange: {
        from: null,
        to: null,
      },
      viewType: "individual",
    }
  );
  const { open: openModal } = useModal();

  // Fetch sports
  const { data: sports = [], isLoading: isSportsLoading } = useSports();

  // Fetch teams based on selected sport
  const { data: teams = [], isLoading: isTeamsLoading } = useTeams({
    sport: filter.selectedSport,
  });

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

  // Reset filters
  const resetFilters = () => {
    setFilter(initialProgressFilter);
  };

  // Handle opening the player metric recorder modal
  const handleOpenMetricRecorder = (playerId, teamSlug) => {
    openModal(PlayerMetricRecorderModal, {
      playerId,
      teamSlug,
    });
  };

  // Handle switching back from individual to compare view
  const handleBackToCompare = () => {
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: null,
      viewType: "compare",
    }));
  };

  // Loading state
  const isLoading = isSportsLoading || isTeamsLoading || isPlayersLoading;

  // Find selected player name
  const selectedPlayerName =
    players.find((p) => p.id === filter.selectedPlayer)?.name || "Player";

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Player Progress Tracking
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and analyze player performance metrics over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter.viewType === "individual" ? "default" : "outline"}
            size="sm"
            className="shadow-sm"
            onClick={() => handleViewTypeChange("individual")}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Individual
          </Button>
          <Button
            variant={filter.viewType === "compare" ? "default" : "outline"}
            size="sm"
            className="shadow-sm"
            onClick={() => handleViewTypeChange("compare")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <PlayerProgressFilters
        filter={filter}
        sports={sports}
        teams={teams}
        players={players}
        handleSportChange={handleSportChange}
        handleTeamChange={handleTeamChange}
        handlePlayerChange={handlePlayerChange}
        handleDateRangeChange={handleDateRangeChange}
        resetFilters={resetFilters}
      />

      {/* Progress Visualization */}
      {isLoading ? (
        <Card className="border shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <ContentLoading />
            </div>
            <div className="w-full max-w-md space-y-3">
              <div className="h-2 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-4/5"></div>
              <div className="h-2 bg-muted rounded w-3/5"></div>
            </div>
          </div>
        </Card>
      ) : !filter.selectedTeam ? (
        <EmptyStateView
          sports={sports}
          handleSportChange={handleSportChange}
          openModal={() => handleOpenMetricRecorder(null, filter.selectedTeam)}
          teamSlug={filter.selectedTeam}
        />
      ) : (
        <div className="space-y-6">
          {/* Quick Actions and Stats Overview */}
          {filter.viewType === "individual" && filter.selectedPlayer && (
            <>
              <PlayerProgressQuickActions
                openModal={() =>
                  handleOpenMetricRecorder(
                    filter.selectedPlayer,
                    filter.selectedTeam
                  )
                }
                playerId={filter.selectedPlayer}
                teamSlug={filter.selectedTeam}
              />
              <PlayerProgressStats />
            </>
          )}

          {filter.viewType === "individual" && filter.selectedPlayer ? (
            <PlayerProgressIndividualView
              playerId={filter.selectedPlayer}
              playerName={selectedPlayerName}
              dateRangeParams={dateRangeParams}
              handleBackToCompare={handleBackToCompare}
              openModal={() =>
                handleOpenMetricRecorder(
                  filter.selectedPlayer,
                  filter.selectedTeam
                )
              }
              teamSlug={filter.selectedTeam}
            />
          ) : (
            <div className="space-y-6">
              <PlayerProgressCompareView
                players={players}
                teamSlug={filter.selectedTeam}
                dateRangeParams={dateRangeParams}
              />
              <PlayerQuickSelect
                players={players}
                selectedPlayerId={filter.selectedPlayer}
                handlePlayerSelect={(playerId) => {
                  handlePlayerChange(playerId);
                  handleViewTypeChange("individual");
                }}
                openModal={() =>
                  handleOpenMetricRecorder(null, filter.selectedTeam)
                }
                teamSlug={filter.selectedTeam}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerProgressSection;
