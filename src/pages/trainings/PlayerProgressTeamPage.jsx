import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { subMonths } from "date-fns";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import TeamPlayerView from "@/components/trainings/players/TeamPlayerView";
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

  // Handle date range reset
  const handleDateRangeReset = () => {
    const resetRange = { from: null, to: null };
    setDateRange(resetRange);
  };

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/trainings/progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title={`${teamName} Team Progress`}
          subtitle="Training Management"
          description="Team performance comparison and analysis"
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Team List"
          onBackClick={handleBackClick}        >
          {/* Date Controls in header with enhanced styling */}
          <div className="flex items-center gap-3">
            {(dateRange?.from || dateRange?.to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDateRangeReset}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 bg-card/50 backdrop-blur-sm border border-primary/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            )}
            <DateRangePickerWithPresets
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Select date range..."
              className="w-auto"
            />
          </div>
        </UniversityPageHeader>

        <TeamPlayerView teamSlug={teamSlug} dateRange={dateRange} />
      </div>
    </div>
  );
};

export default PlayerProgressTeamPage;
