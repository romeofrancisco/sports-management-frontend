import React from "react";
import { useLeagueTeamForm } from "@/hooks/useLeagues";
import LeagueTeamsList from "./LeagueTeamsList";

/**
 * TopTeamsCards - A minimal component that displays only the top teams cards
 * without any container, header, or additional styling. Perfect for embedding
 * in overview sections or other layouts.
 */
const TopTeamsCards = ({ 
  league, 
  maxTeams = 3, 
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  className = "",
  showEmptyState = false
}) => {
  const { data: teamFormData, isLoading } = useLeagueTeamForm(league);
  const teams = teamFormData?.teams || [];

  return (
    <LeagueTeamsList
      teams={teams}
      formData={teamFormData?.form || {}}
      isLoading={isLoading}
      maxTeams={maxTeams}
      gridCols={gridCols}
      className={className}
      showEmptyState={showEmptyState}
      skeletonCount={maxTeams}
    />
  );
};

export default TopTeamsCards;
