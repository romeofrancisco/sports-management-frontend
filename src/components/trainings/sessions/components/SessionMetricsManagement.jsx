import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Target, AlertCircle, Users, SkipForward } from "lucide-react";
import SessionMetricsTab from "./metrics/SessionMetricsTab";

const SessionMetricsManagement = ({ session, onSaveSuccess }) => {
  // Get present players count for display
  const presentPlayers = session?.player_records?.filter(
    record => 
      record.attendance_status === "present" || 
      record.attendance_status === "late"
  ) || [];

  // Check if session metrics are currently configured
  const hasSessionMetrics = presentPlayers.length > 0 && presentPlayers.every(record => 
    record.metric_records && record.metric_records.length > 0
  );

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
            <Users className="h-6 w-6" />
            Configure Session Metrics
          </h2>
          <p className="text-muted-foreground">
            Configure metrics that will be available to all players in this training session. These metrics define what performance indicators can be tracked.
          </p>
          {session.date && (
            <p className="text-sm text-muted-foreground mt-1">
              Session Date: {new Date(session.date).toLocaleDateString()}
            </p>
          )}
        </div>
        
        {/* Skip Button */}
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
            You can configure metrics later or proceed to player-specific metrics
          </p>
        </div>
      </div>      {/* Prerequisites Check */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800">Prerequisites & Information</h4>
              <p className="text-sm text-amber-700 mt-1">
                Make sure you have completed attendance marking before configuring metrics. Only players marked as present or late can have metrics recorded.
              </p>
              {session?.player_records && (
                <div className="mt-2 text-xs text-amber-600">
                  Present players: {presentPlayers.length} / {session.player_records.length} total
                </div>
              )}
              {hasSessionMetrics && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Session metrics are currently configured for all present players
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Session Metrics Configuration */}
      <SessionMetricsTab 
        session={session}
        onSaveSuccess={onSaveSuccess}
      />
    </div>
  );
};

export default SessionMetricsManagement;
