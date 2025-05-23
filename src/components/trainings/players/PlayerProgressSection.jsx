import React, { useState, useMemo, useEffect } from "react";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";
import "./player-progress-styles.css";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";
import { usePlayers } from "@/hooks/usePlayers";

// Import the components
import PlayerProgressQuickActions from "./PlayerProgressQuickActions";
import PlayerProgressIndividualView from "./PlayerProgressIndividualView";
import SectionHeader from "./SectionHeader";
import ViewToggle from "./ViewToggle";
import PlayerCardList from "./PlayerCardList";
import TeamCardList from "./TeamCardList";
import LoadingCard from "./LoadingCard";
import TeamPlayerView from "./TeamPlayerView";

const PlayerProgressSection = () => {
  const [filter, setFilter] = useState({
    selectedPlayer: null,
    selectedTeam: null,
    dateRange: {
      from: null,
      to: null,
    },
    viewType: "individual",
  });

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

  // Fetch teams
  const { data: teams = [], isLoading: isTeamsLoading } = useTeams({
    sport: playerFilters.sport,
  });

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
    setFilter((prev) => ({
      ...prev,
      selectedPlayer: playerId,
    }));
  };

  // Handle team selection (for compare view)
  const handleTeamSelect = (teamSlug) => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: teamSlug,
    }));
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
  };

  // Handle back button from team view
  const handleBackToTeamList = () => {
    setFilter((prev) => ({
      ...prev,
      selectedTeam: null,
    }));
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
      
      return (
        <>
          <PlayerProgressQuickActions
            openModal={() => handleOpenMetricRecorder(filter.selectedPlayer, null)}
            playerId={filter.selectedPlayer}
          />
          <PlayerProgressIndividualView
            playerId={filter.selectedPlayer}
            playerName={selectedPlayerName}
            dateRangeParams={dateRangeParams}
            handleBackToCompare={handleBackToList}
            openModal={() => handleOpenMetricRecorder(filter.selectedPlayer, null)}
          />
        </>
      );
    }
    
    return (
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
      />
    );
  };

  // Render compare view content based on selected team
  const renderCompareContent = () => {
    if (filter.selectedTeam) {
      return (
        <TeamPlayerView 
          teamSlug={filter.selectedTeam}
          dateRange={dateRangeParams}
          onBackClick={handleBackToTeamList}
        />
      );
    }
    
    return (
      <TeamCardList
        teams={teams}
        filteredTeams={filteredTeams}
        sports={sports}
        filters={playerFilters}
        onFilterChange={handlePlayerFilterChange}
        onTeamSelect={handleTeamSelect}
        isLoading={isTeamsLoading}
      />
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Player Progress Tracking"
        description="Track and analyze player performance metrics over time"
        actionComponent={
          <ViewToggle 
            activeView={filter.viewType} 
            onViewChange={handleViewTypeChange} 
          />
        }
      />
      
      <div className="space-y-6">
        {filter.viewType === "individual" ? renderIndividualContent() : renderCompareContent()}
      </div>
    </div>
  );
};

export default PlayerProgressSection;
