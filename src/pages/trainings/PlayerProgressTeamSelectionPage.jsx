import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import TeamCardList from "@/components/trainings/players/TeamCardList";

const PlayerProgressTeamSelectionPage = () => {
  const navigate = useNavigate();
  // Filters for teams
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

  // Filter teams based on search and sport filters
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const searchMatch =
        !filters.search ||
        team.name.toLowerCase().includes(filters.search.toLowerCase());

      const sportMatch =
        !filters.sport ||
        team.sport === filters.sport ||
        team.sport_id === filters.sport;

      return searchMatch && sportMatch;
    });
  }, [teams, filters.search, filters.sport]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle team selection - navigate to team page
  const handleTeamSelect = (teamSlug) => {
    navigate(`/trainings/progress/team/${teamSlug}`);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/trainings/progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Team Comparison"
          subtitle="Training Management"
          description="Select a team to compare player performance and progress across the roster"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Progress Overview"
          onBackClick={handleBackClick}
        />
        <TeamCardList
          teams={teams}
          filteredTeams={filteredTeams}
          sports={sports}
          filters={filters}
          onFilterChange={handleFilterChange}
          onTeamSelect={handleTeamSelect}
          isLoading={isTeamsLoading}
          viewType="team"
        />
      </div>
    </div>
  );
};

export default PlayerProgressTeamSelectionPage;
