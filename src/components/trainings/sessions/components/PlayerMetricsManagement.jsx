import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Target,
  AlertCircle,
  Users,
  SkipForward,
  TargetIcon,
  User,
  BadgeInfo,
  Clock,
  TrendingUp,
} from "lucide-react";
import PlayerMetricsTab from "./metrics/PlayerMetricsTab";
import { useLastSessionMissedMetrics } from "@/hooks/useTrainings";

const PlayerMetricsManagement = ({ session, onSaveSuccess, workflowData }) => {
  // Get all players for the session since we configure metrics before attendance
  const allPlayers = session?.player_records || [];

  // Get form disabled state from workflow
  const playerMetricsStep = workflowData?.steps?.find(
    (step) => step.id === "player-metrics"
  );
  const isFormDisabled = playerMetricsStep?.isFormDisabled ?? false;
  // Fetch missed metrics from the last session if we have a team
  const { data: lastSessionMissedMetrics, isLoading: isLoadingMissedMetrics } =
    useLastSessionMissedMetrics(session?.team, session?.id);
  // Check if session metrics are configured for any player
  const sessionMetricsConfigured =
    allPlayers.length > 0 &&
    allPlayers.some(
      (record) => record.assigned_metrics && record.assigned_metrics.length > 0
    );

  // Check if any players have empty assigned metrics
  const hasPlayersWithEmptyMetrics = allPlayers.some(
    (record) => !record.assigned_metrics || record.assigned_metrics.length === 0
  );

  // Allow skipping if at least one player has metrics or if there are no players
  const canSkip = !hasPlayersWithEmptyMetrics || allPlayers.length === 0;

  // Handle skip functionality
  const handleSkip = () => {
    if (onSaveSuccess) {
      onSaveSuccess(); // This will trigger auto-advance to next step
    }
  };

  if (!session) return null;

  // Empty state check - if no players at all
  if (allPlayers.length === 0) {
    return (
      <Card className="h-full pt-0 flex flex-col shadow-xl border-2 border-primary/30 bg-card">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 text-white rounded-t-xl shadow-lg py-5">
          <div className="flex flex-col justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Player Metrics Configuration
                </h2>
                <p className="text-primary-foreground/80 text-sm font-normal mt-1">
                  Step 2 of training session setup
                </p>
              </div>
            </CardTitle>
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isFormDisabled}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">
            No players found for this session
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full gap-0 pt-0 flex flex-col shadow-xl border-2 border-primary/30 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      <CardHeader className="text-foreground p-4 md:p-6 rounded-t-xl border-b-2 border-primary/30 py-5">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg text-primary-foreground">
              <User className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Player Metrics Configuration
              </h2>
              <p className="text-foreground text-sm font-normal">
                Step 2 of training session setup
              </p>
            </div>
          </CardTitle>
          {canSkip && (
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isFormDisabled}
            >
              <SkipForward className="h-4 w-4" />
              Skip Step
            </Button>
          )}
        </div>
        <div className="mt-2 p-4 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/30">
          <p className="text-sm inline-flex items-center gap-1 leading-relaxed text-primary">
            Assign specific metrics to individual players based on their roles
            or training focus areas. Configure these before the training session
            so players can prepare accordingly.
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-4 md:space-y-6 p-4 md:p-6 bg-background">
        {/* Configuration Status Card */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          {!canSkip && (
            <div className="p-4 bg-amber-500/10 text-amber-700 border border-amber-200/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-600/20 rounded-md mt-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Configuration Required</h4>
                  <p className="text-sm  mt-1">
                    Some players don't have any assigned metrics. Please assign
                    metrics to all players or configure session metrics first to
                    proceed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Player Metrics Configuration Component */}
        <div className="animate-in fade-in-50 duration-500 delay-300 flex-1">
          <PlayerMetricsTab
            session={session}
            onSaveSuccess={onSaveSuccess}
            lastSessionMissedMetrics={lastSessionMissedMetrics}
            isFormDisabled={isFormDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerMetricsManagement;
