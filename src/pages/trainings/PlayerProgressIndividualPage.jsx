import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { subMonths } from "date-fns";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import PlayerProgressIndividualView from "@/components/trainings/players/PlayerProgressIndividualView";
import { usePlayers } from "@/hooks/usePlayers";

const PlayerProgressIndividualPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  // Create default date range (3 months from now)
  const createDefaultDateRange = () => {
    const today = new Date();
    return {
      from: subMonths(today, 3), // 3 months ago
      to: today, // today
    };
  };

  const [dateRange, setDateRange] = useState(createDefaultDateRange());

  // Fetch player data to get player name
  const { data: playersData } = usePlayers({}, 1, 1000);
  const players = playersData?.results || [];
  const currentPlayer = players.find((p) => p.id === parseInt(playerId));
  const playerName = currentPlayer?.full_name || "Player";

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/trainings/progress/individual");
  };

  // Format date range for API requests
  const dateRangeParams = useMemo(() => {
    return {
      date_from: dateRange?.from
        ? dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: dateRange?.to
        ? dateRange.to.toISOString().split("T")[0]
        : undefined,
    };
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        <UniversityPageHeader
          title={`${playerName}'s Progress`}
          subtitle="Training Management"
          description="Individual performance analysis and progress tracking"
          showBackButton={true}
          backButtonText="Back to Player List"
          onBackClick={handleBackClick}
        >
          {/* Date Controls in header with enhanced styling */}
          <div className="flex items-center gap-3">
            <DateRangePickerWithPresets
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Select date range..."
              className="w-auto min-w-36 justify-center bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg border-primary/20"
            />
          </div>
        </UniversityPageHeader>

        <PlayerProgressIndividualView
          playerId={parseInt(playerId)}
          playerName={playerName}
          dateRangeParams={dateRangeParams}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default PlayerProgressIndividualPage;
