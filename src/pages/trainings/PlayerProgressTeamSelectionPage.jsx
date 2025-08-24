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

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  

  const { data: teamsData = { results: [], count: 0 }, isLoading: isTeamsLoading } =
    useTeams(
      { sport: filters.sport, search: filters.search },
      page,
      pageSize
    );
  const teams = teamsData.results || [];
  const totalTeams = teamsData.count || 0;

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
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
          totalTeams={totalTeams}
          filters={filters}
          onFilterChange={handleFilterChange}
          onTeamSelect={handleTeamSelect}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isTeamsLoading}
          viewType="team"
        />
      </div>
    </div>
  );
};

export default PlayerProgressTeamSelectionPage;
