import React, { useState, useMemo, useEffect } from "react";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";
import { subMonths } from "date-fns";
import "./player-progress-styles.css";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";
import { usePlayers } from "@/hooks/usePlayers";
import PlayerProgressIndividualView from "./PlayerProgressIndividualView";
import ViewToggle from "./ViewToggle";
import PlayerCardList from "./PlayerCardList";
import TeamCardList from "./TeamCardList";
import LoadingCard from "./LoadingCard";
import TeamPlayerView from "./TeamPlayerView";

const PlayerProgressSection = ({ 
  initialDateRange, 
  onDateRangeChange, 
  onViewContextUpdate 
}) => {
  // Create default date range (1 month from now)
  const createDefaultDateRange = () => {
    const today = new Date();
    return {
      from: subMonths(today, 1), // 1 month ago
      to: today, // today
    };
  };
  const [filter, setFilter] = useState({
    selectedPlayer: null,
    selectedTeam: null,
    dateRange: initialDateRange || createDefaultDateRange(),
    viewType: "individual",
  });

  // Sync dateRange with parent when initialDateRange changes
  useEffect(() => {
    if (initialDateRange) {
      setFilter((prev) => ({
        ...prev,
        dateRange: initialDateRange,
      }));
    }
  }, [initialDateRange]);

  // Filters for player list
  const [playerFilters, setPlayerFilters] = useState({
    search: "",
    team: null,
    sport: null,
  });

  // Pagination state for players
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { open: openModal } = useModal();
  // Fetch sports
  const { data: sports = [], isLoading: isSportsLoading } = useSports();
  // Fetch teams - get all teams by setting a high page size
  const { data: teamsData = { results: [] }, isLoading: isTeamsLoading } = useTeams(
    {
      sport: playerFilters.sport,
    },
    1, // page
    1000 // pageSize - set high to get all teams
  );
  
  // Extract teams array from paginated response
  const teams = teamsData.results || [];

  // Fetch all players with pagination for Individual tab
  const {
    data: playersData = { results: [], count: 0 },
    isLoading: isPlayersLoading,
  } = usePlayers(
    {
      search: playerFilters.search,
      team: playerFilters.team,
      sport: playerFilters.sport,
    },
    page,
    pageSize
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [playerFilters]);

  // Player data with pagination
  const players = playersData.results || [];
  const totalPlayers = playersData.count || 0;

  // Filter teams based on search and sport filters
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Filter by search term
      const searchMatch =
        !playerFilters.search ||
        team.name.toLowerCase().includes(playerFilters.search.toLowerCase());

      // Filter by sport
      const sportMatch =
        !playerFilters.sport ||
        team.sport === playerFilters.sport ||
        team.sport_id === playerFilters.sport;

      return searchMatch && sportMatch;
    });
  }, [teams, playerFilters.search, playerFilters.sport]);

  // Format date range for API requests
  const dateRangeParams = useMemo(() => {
    return {
      date_from: filter.dateRange?.from
        ? filter.dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: filter.dateRange?.to
        ? filter.dateRange.to.toISOString().split("T")[0]
        : undefined,
    };
  }, [filter.dateRange]);
  // Handle player selection (for individual view)
  const handlePlayerSelect = (playerId) => {
    const selectedPlayer = players.find((p) => p.id === playerId);
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: playerId,
    }));

    // Update parent view context
    if (onViewContextUpdate && selectedPlayer) {
      onViewContextUpdate({
        showBackButton: true,
        backButtonText: "Back to Compare",
        onBackClick: () => handleBackToList(),
        playerName: selectedPlayer.full_name,
        teamName: null,
      });
    }
  };
  // Handle team selection (for compare view)
  const handleTeamSelect = (teamSlug) => {
    const selectedTeam = teams.find((t) => t.slug === teamSlug);
    setFilter((prev) => ({
      ...prev,
      selectedTeam: teamSlug,
    }));

    // Update parent view context
    if (onViewContextUpdate && selectedTeam) {
      onViewContextUpdate({
        showBackButton: true,
        backButtonText: "Back to Teams",
        onBackClick: () => handleBackToTeamList(),
        playerName: null,
        teamName: selectedTeam.name,
      });
    }
  };

  // Handle view type change
  const handleViewTypeChange = (type) => {
    setFilter((prev) => ({
      ...prev,
      viewType: type,
      // Reset selections when switching views
      selectedPlayer: null,
      selectedTeam: null,
    }));

    // Reset filters when switching views
    setPlayerFilters({
      search: "",
      team: "",
      sport: "",
    });

    // Reset to first page when switching to individual view
    if (type === "individual") {
      setPage(1);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when page size changes
  };

  // Handle player filter changes
  const handlePlayerFilterChange = (key, value) => {
    setPlayerFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle opening the player metric recorder modal
  const handleOpenMetricRecorder = (playerId, teamSlug) => {
    openModal(PlayerMetricRecorderModal, {
      playerId,
      teamSlug,
    });
  };
  // Handle back button from individual view
  const handleBackToList = () => {
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: null,
    }));

    // Reset parent view context
    if (onViewContextUpdate) {
      onViewContextUpdate({
        showBackButton: false,
        backButtonText: "Back to Compare",
        onBackClick: null,
        playerName: null,
        teamName: null,
      });
    }
  };  // Handle back button from team view
  const handleBackToTeamList = () => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: null,
    }));

    // Reset parent view context
    if (onViewContextUpdate) {
      onViewContextUpdate({
        showBackButton: false,
        backButtonText: "Back to Teams",
        onBackClick: null,
        playerName: null,
        teamName: null,
      });
    }
  };
  // Handle date range change - use parent handler if available
  const handleDateRangeChange = (newDateRange) => {
    setFilter((prev) => ({
      ...prev,
      dateRange: newDateRange,
    }));

    // Notify parent about date range change
    if (onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }
  };

  // Loading state
  const isLoading = isSportsLoading || isTeamsLoading || isPlayersLoading;

  // Find selected player name
  const selectedPlayerName =
    players.find((p) => p.id === filter.selectedPlayer)?.full_name || "Player";

  // Render individual view content based on selected player
  const renderIndividualContent = () => {
    if (filter.selectedPlayer) {
      if (isLoading) {
        return <LoadingCard />;
      }

      return (        <>
          <PlayerProgressIndividualView
            playerId={filter.selectedPlayer}
            playerName={selectedPlayerName}
            dateRangeParams={dateRangeParams}
            dateRange={filter.dateRange}
            openModal={() =>
              handleOpenMetricRecorder(filter.selectedPlayer, null)
            }
          />
        </>
      );
    }    return (
      <PlayerCardList
        players={players}
        totalPlayers={totalPlayers}
        sports={sports}
        teams={teams}
        filters={playerFilters}
        onFilterChange={handlePlayerFilterChange}
        onPlayerSelect={handlePlayerSelect}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isPlayersLoading}
        viewType={filter.viewType}
        onViewChange={handleViewTypeChange}
      />
    );
  };

  // Render compare view content based on selected team
  const renderCompareContent = () => {
    if (filter.selectedTeam) {
      return (        <TeamPlayerView
          teamSlug={filter.selectedTeam}
          dateRange={filter.dateRange}
        />
      );
    }    return (
      <TeamCardList
        teams={teams}
        filteredTeams={filteredTeams}
        sports={sports}
        filters={playerFilters}
        onFilterChange={handlePlayerFilterChange}
        onTeamSelect={handleTeamSelect}
        isLoading={isTeamsLoading}
        viewType={filter.viewType}
        onViewChange={handleViewTypeChange}
      />
    );
  };  return (
    <div className="space-y-6">
      {/* Main Content with Combined Headers */}
      <div className="animate-in fade-in-50 duration-500 delay-100">
        {filter.viewType === "individual"
          ? renderIndividualContent()
          : renderCompareContent()}
      </div>
    </div>
  );
};

export default PlayerProgressSection;
