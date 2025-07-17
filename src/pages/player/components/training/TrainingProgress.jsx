import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { subMonths } from "date-fns";
import { DateRangePickerWithPresets } from "@/components/ui/date-range-picker-with-presets";
import PlayerProgressIndividualView from "@/components/trainings/players/PlayerProgressIndividualView";

const TrainingProgress = () => {
  const { user } = useSelector((state) => state.auth);

  // Create default date range (1 month from now)
  const createDefaultDateRange = () => {
    const today = new Date();
    return {
      from: subMonths(today, 3), // 3 months ago
      to: today, // today
    };
  };

  const [dateRange, setDateRange] = useState(createDefaultDateRange());
  
  // Get player ID from auth user - for players, user.id is the player ID
  const playerId = user?.id;
  const playerName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : "Your";

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
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
    <div className="space-y-6">
      {/* Date Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Progress</h2>
          <p className="text-muted-foreground">Track your individual performance and training progress</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePickerWithPresets
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Select date range..."
            className="w-auto"
          />
        </div>
      </div>

      {/* Progress Content */}
      {playerId ? (
        <PlayerProgressIndividualView
          playerId={playerId}
          playerName={playerName}
          dateRangeParams={dateRangeParams}
          dateRange={dateRange}
        />
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unable to Load Progress
            </h3>
            <p className="text-muted-foreground">
              Could not retrieve your player information. Please contact support if this issue persists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgress;
