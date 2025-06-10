import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { User, AlertCircle, Users, SkipForward } from "lucide-react";
import PlayerMetricsTab from "./metrics/PlayerMetricsTab";

const PlayerMetricsManagement = ({ session, onSaveSuccess }) => {
  // Get present players count for display
  const presentPlayers = session?.player_records?.filter(
    record => 
      record.attendance_status === "present" || 
      record.attendance_status === "late"
  ) || [];  // Check if session metrics are configured (using correct logic)
  const sessionMetricsConfigured = presentPlayers.length > 0 && presentPlayers.every(record => 
    record.metric_records && record.metric_records.length > 0
  );

  // Check if any present players have empty metrics
  const hasPlayersWithEmptyMetrics = presentPlayers.some(record => 
    !record.metric_records || record.metric_records.length === 0
  );

  // Only allow skipping if all present players have at least one metric
  const canSkip = !hasPlayersWithEmptyMetrics;

  // Handle skip functionality
  const handleSkip = () => {
    if (onSaveSuccess) {
      onSaveSuccess(); // This will trigger auto-advance to next step
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6 p-6">      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <User className="h-6 w-6" />
            Configure Player-Specific Metrics
          </h2>
          <p className="text-muted-foreground">
            Assign specific metrics to individual players based on their roles or training focus areas. This allows for personalized performance tracking.
          </p>
          {session.date && (
            <p className="text-sm text-muted-foreground mt-1">
              Session Date: {new Date(session.date).toLocaleDateString()}
            </p>
          )}
        </div>
          {/* Skip Button */}
        {canSkip && (
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="h-4 w-4" />
              Skip This Step
            </Button>
            <p className="text-xs text-muted-foreground max-w-[200px] text-right">
              Proceed to record metrics with current configuration
            </p>
          </div>
        )}
        
        {/* Warning when skip is not allowed */}
        {!canSkip && (
          <div className="flex flex-col items-end gap-2">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md max-w-[300px]">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 font-medium">
                  Cannot Skip
                </span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Some players don't have any metrics assigned. Please assign metrics to all players or configure session metrics first.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prerequisites Check */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Prerequisites</h4>
              <p className="text-sm text-amber-700 mt-1">
                Make sure you have completed attendance marking and optionally configured session metrics before assigning player-specific metrics.
              </p>              {session?.player_records && (
                <div className="mt-2 text-xs text-amber-600">
                  Present players: {presentPlayers.length} / {session.player_records.length} total
                  {sessionMetricsConfigured && (
                    <span className="ml-3 text-green-600">
                      ✓ Session metrics configured
                    </span>
                  )}
                  {hasPlayersWithEmptyMetrics && (
                    <div className="mt-1 text-red-600">
                      ⚠ {presentPlayers.filter(record => !record.metric_records || record.metric_records.length === 0).length} players need metrics
                    </div>
                  )}
                </div>
              )}
              {!sessionMetricsConfigured && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Tip: Configure session metrics first to establish baseline metrics that all players can use, then add player-specific metrics as needed.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Player Metrics Configuration */}
      <PlayerMetricsTab 
        session={session}
        onSaveSuccess={onSaveSuccess}
      />
    </div>
  );
};

export default PlayerMetricsManagement;
