import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import PlayerCardList from "@/components/trainings/players/PlayerCardList";

const PlayerProgressIndividualSelectionPage = () => {
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Filters for players
  const [filters, setFilters] = useState({
    search: "",
    team: "",
    sport: "",
  });

  // Fetch data
  const { data: sportsData = { results: [] }, isLoading: isSportsLoading } =
    useSports();
  const sports = sportsData.results || [];

  const { data: teamsData = { results: [] }, isLoading: isTeamsLoading } =
    useTeams(
      { sport: filters.sport },
      1,
      1000 // Get all teams
    );
  const teams = teamsData.results || [];

  const {
    data: playersData = { results: [], count: 0 },
    isLoading: isPlayersLoading,
  } = usePlayers(
    {
      search: filters.search,
      team: filters.team,
      sport: filters.sport,
    },
    page,
    pageSize
  );
  const players = playersData.results || [];
  const totalPlayers = playersData.count || 0;

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Handle player selection - navigate to individual page
  const handlePlayerSelect = (playerId) => {
    navigate(`/trainings/progress/player/${playerId}`);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/trainings/progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Individual Player Progress"
          subtitle="Training Management"
          description="Select a player to view detailed performance analysis and progress tracking"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Progress Overview"
          onBackClick={handleBackClick}
        />
        <PlayerCardList
          players={players}
          totalPlayers={totalPlayers}
          sports={sports}
          teams={teams}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPlayerSelect={handlePlayerSelect}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isPlayersLoading}
          viewType="individual"
        />
      </div>
    </div>
  );
};

export default PlayerProgressIndividualSelectionPage;
