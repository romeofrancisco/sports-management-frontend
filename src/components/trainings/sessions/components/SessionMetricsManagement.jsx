import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Target,
  AlertCircle,
  Users,
  SkipForward,
  CheckCircle2,
  Calendar,
  Settings,
  BadgeInfo,
} from "lucide-react";
import SessionMetricsTab from "./metrics/SessionMetricsTab";

const SessionMetricsManagement = ({ session, onSaveSuccess, workflowData }) => {
  // Get all players for the session (no attendance filtering needed at this step)
  const allPlayers = session?.player_records || [];

  // Get form disabled state from workflow
  const sessionMetricsStep = workflowData?.steps?.find(
    (step) => step.id === "session-metrics"
  );
  const isFormDisabled = sessionMetricsStep?.isFormDisabled ?? false;

  // Check if session metrics are currently configured
  const hasSessionMetrics =
    allPlayers.length > 0 &&
    allPlayers.some(
      (record) => record.metric_records && record.metric_records.length > 0
    );

  // Handle skip functionality
  const handleSkip = () => {
    if (onSaveSuccess) {
      onSaveSuccess(); // This will trigger auto-advance to next step
    }
  };

  if (!session) return null;
  return (
    <Card className="h-full p-0 gap-0 flex shadow-xl border-2 border-primary/30 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      <CardHeader className="border-b-2 p-4 md:p-6 border-primary/30 shadow-lg py-5">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              <Settings className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Configure Session Training Excercises
              </h2>
              <p className="text-sm font-normal">
                Step 1 of training session setup
              </p>
            </div>
          </CardTitle>{" "}
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isFormDisabled}
          >
            <SkipForward className="size-4" />
            Skip Step
          </Button>
        </div>
        <div className="mt-2 p-4 rounded-lg border border-primary/30 bg-primary/10">
          <p className="text-sm inline-flex items-center gap-1 leading-relaxed text-primary">
            Configure training excercises that will be available to all players in this
            training session. These training excercises define what performance indicators
            can be tracked across the entire session.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col h-full p-2 md:p-6 bg-background">
        {/* Session Metrics Configuration */}{" "}
        <div className="animate-in fade-in-50 duration-500 delay-200 flex-1 h-full">
          <SessionMetricsTab
            session={session}
            onSaveSuccess={onSaveSuccess}
            isFormDisabled={isFormDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionMetricsManagement;
