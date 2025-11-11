import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { subMonths } from "date-fns";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import PlayerProgressMultiView from "@/components/trainings/players/PlayerProgressMultiView";
import { useTeams } from "@/hooks/useTeams";

const PlayerProgressTeamPage = () => {
  const { teamSlug } = useParams();
  const navigate = useNavigate();

  // Create default date range (1 month from now)
  const createDefaultDateRange = () => {
    const today = new Date();
    return {
      from: subMonths(today, 1), // 1 month ago
      to: today, // today
    };
  };

  const [dateRange, setDateRange] = useState(createDefaultDateRange());

  // Fetch team data to get team name
  const { data: teamsData } = useTeams({}, 1, 1000);
  const teams = teamsData?.results || [];
  const currentTeam = teams.find((t) => t.slug === teamSlug);
  const teamName = currentTeam?.name || "Team";

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/trainings/progress/teams");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        <UniversityPageHeader
          title={`${teamName} Team Progress`}
          subtitle="Training Management"
          description="Team performance comparison and analysis"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Team List"
          onBackClick={handleBackClick}
        />

        <PlayerProgressMultiView
          teamSlug={teamSlug}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
    </div>
  );
};

export default PlayerProgressTeamPage;
