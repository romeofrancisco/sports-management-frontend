import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Target, AlertCircle, Users, User } from "lucide-react";
import SessionMetricsTab from "./metrics/SessionMetricsTab";
import PlayerMetricsTab from "./metrics/PlayerMetricsTab";

const MetricsConfiguration = ({ session, onSaveSuccess }) => {
  // Get present players count for display
  const presentPlayers = session?.player_records?.filter(
    record => 
      record.attendance_status === "present" || 
      record.attendance_status === "late"
  ) || [];

  if (!session) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Target className="h-6 w-6" />
          Configure Metrics
        </h2>
        <p className="text-muted-foreground">
          Configure which metrics should be tracked for this training session. Complete both session-level and player-specific metric configuration.
        </p>
        {session.date && (
          <p className="text-sm text-muted-foreground mt-1">
            Session Date: {new Date(session.date).toLocaleDateString()}
          </p>
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
                Make sure you have completed attendance marking before configuring metrics. Only players marked as present or late can have metrics recorded.
              </p>
              {session?.player_records && (
                <div className="mt-2 text-xs text-amber-600">
                  Present players: {presentPlayers.length} / {session.player_records.length} total
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Both components visible */}
      <div className="space-y-8">
        {/* Session Metrics Section */}
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Step 1: Configure Session Metrics
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Set up metrics that will be available to all players in this session. These metrics define what performance indicators can be tracked.
            </p>
          </div>          <SessionMetricsTab 
            session={session}
            onSaveSuccess={onSaveSuccess}
          />
        </div>

        {/* Player-Specific Metrics Section */}
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Step 2: Configure Player-Specific Metrics
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Assign specific metrics to individual players based on their roles or training focus areas.
            </p>
          </div>          <PlayerMetricsTab 
            session={session}
            onSaveSuccess={onSaveSuccess}
          />
        </div>
      </div>
    </div>
  );
};export default MetricsConfiguration;
