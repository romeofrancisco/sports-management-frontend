import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { useMetricUnits } from "@/hooks/useMetricUnits";
import {
  BadgeInfo,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { usePlayerMetricsRecording } from "./metrics/usePlayerMetricsRecording";
import MetricsRecordingForm from "./metrics/MetricsRecordingForm";
import EmptyPlayersState from "./metrics/EmptyPlayersState";
import TrainingCompletionModal from "../../../modals/trainings/TrainingCompletionModal";

const PlayerMetricsRecording = ({ session, onSaveSuccess, workflowData }) => {
  const navigate = useNavigate();
  const [showSuccessAnimation, setShowSuccessAnimation] = React.useState(false);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  
  // Get form disabled state from workflow
  const recordMetricsStep = workflowData?.steps?.find(step => step.id === 'record-metrics');
  const isFormDisabled = recordMetricsStep?.isFormDisabled ?? false;
  const {
    currentPlayerIndex,
    currentPlayer,
    playersWithMetrics,
    metricsToShow,
    metricValues,
    notes,
    hasChanges,
    hasValidMetrics,
    handlePreviousPlayer,
    handleNextPlayer,
    handleMetricChange,
    handleNotesChange,
    fetchImprovement,
    getImprovementData,
    savePlayerMetrics,
    isLoading,
  } = usePlayerMetricsRecording(session);

  // Check if this is the last player
  const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;

  // Enhanced save handler that checks for completion
  const handleSaveAndCheckCompletion = React.useCallback(async () => {
    try {
      await savePlayerMetrics();
      setShowSuccessAnimation(true);

      // If this is the last player and they have valid metrics, show completion modal
      if (isLastPlayer && hasValidMetrics()) {
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 1500); // Show modal after success animation
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
    }
  }, [savePlayerMetrics, isLastPlayer, hasValidMetrics, onSaveSuccess]);  // Enhanced next player handler
  const handleEnhancedNextPlayer = React.useCallback(async () => {
    // Check if session is already completed
    if (session?.status === "completed" && isLastPlayer) {
      // Navigate to training summary page for completed sessions
      navigate(`/trainings/sessions/${session.id}/summary`);
      return;
    }

    // If form is disabled (non-admin on completed session), just navigate without saving
    if (isFormDisabled) {
      await handleNextPlayer(); // Just navigate, don't save
      return;
    }

    if (isLastPlayer && hasValidMetrics()) {
      await handleSaveAndCheckCompletion();
    } else {
      await handleNextPlayer();
    }
  }, [
    isLastPlayer,
    hasValidMetrics,
    handleSaveAndCheckCompletion,
    handleNextPlayer,
    session?.status,
    session?.id,
    navigate,
    isFormDisabled,
  ]);

  // Calculate progress
  const progressPercentage =
    playersWithMetrics.length > 0
      ? ((currentPlayerIndex + 1) / playersWithMetrics.length) * 100
      : 0;

  // Check if player can proceed (has metrics and valid data)
  const canProceed = hasValidMetrics() && Object.keys(metricValues).length > 0;

  // Check if there are players with metrics configured
  if (playersWithMetrics.length === 0) {
    return <EmptyPlayersState />;
  }
  return (
    <Card className="h-full pt-0 gap-0 flex flex-col shadow-xl border-2 border-primary/20 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      <CardHeader className="border-b-2 border-primary/20 shadow-lg py-5">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Player Metrics Recording
            </h2>
            <p className="text-sm font-normal">
              Step 4 of training session setup
            </p>
          </div>
        </CardTitle>
        <div className="mt-4 p-4 rounded-lg border-2 bg-primary/10 border-primary/20">
          <p className="text-sm inline-flex text-primary items-center gap-1 leading-relaxed">
            <BadgeInfo className="size-4" /> Record performance metrics for each
            player. Navigate through players to enter their training data and
            track improvements in real-time.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col h-full p-6 bg-background">
        {/* Enhanced Player Navigation & Statistics Dashboard */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <div className="rounded-2xl border-2 border-primary/20 p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Player {currentPlayerIndex + 1} of {playersWithMetrics.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Progress:</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <div className="relative mt-1">
                <Progress
                  value={progressPercentage}
                  className="h-2.5 bg-muted"
                />
              </div>
            </div>

            {/* Header with Current Player */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage
                    src={
                      currentPlayer?.player?.profile ||
                      currentPlayer?.player?.user?.profile
                    }
                    alt={`${currentPlayer?.player?.first_name} ${currentPlayer?.player?.last_name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                    {currentPlayer?.player?.profile ? (
                      <User className="h-6 w-6" />
                    ) : (
                      `${currentPlayer?.player?.first_name?.[0] || ""}${
                        currentPlayer?.player?.last_name?.[0] || ""
                      }`.toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentPlayer?.player?.first_name}
                    {currentPlayer?.player?.last_name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">
                      {metricsToShow.length} metrics to record
                    </span>
                    {Object.keys(metricValues).length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-500/20 border-green-700 text-green-600"
                      >
                        {Object.keys(metricValues).length} recorded
                      </Badge>
                    )}
                    {hasChanges() && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/20 border-blue-700 text-blue-600"
                      >
                        Has changes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Statistics */}
              <div className="flex items-center gap-5 rounded-xl px-4 py-2.5 border-2 border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {playersWithMetrics.length} Total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {
                      playersWithMetrics.filter(
                        (record) =>
                          record.metric_records &&
                          record.metric_records.length > 0
                      ).length
                    }
                    Done
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {
                      playersWithMetrics.filter(
                        (record) =>
                          !record.metric_records ||
                          record.metric_records.length === 0
                      ).length
                    }
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar with Navigation */}
            <div className="space-y-3">
              {/* Integrated Navigation Controls */}
              <div className="flex items-center justify-between">                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPlayer}
                  disabled={currentPlayerIndex === 0}
                  className="flex items-center gap-2 px-3 py-1.5 border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span className="text-xs">Previous</span>
                </Button>
                <div className="text-center">
                  {!canProceed ? (
                    <Badge
                      variant="outline"
                      className="text-sm bg-destructive/20 border-destructive text-destructive"
                    >
                      Need to record metrics
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-sm bg-green-500/20 border-green-700 text-green-600"
                    >
                      Ready to proceed
                    </Badge>
                  )}
                </div>                <Button
                  variant={canProceed ? "default" : "outline"}
                  size="sm"
                  onClick={handleEnhancedNextPlayer}
                  disabled={!canProceed}
                  className={`flex items-center py-1.5 transition-all duration-200 ${
                    canProceed
                      ? "bg-primary hover:bg-primary/90"
                      : "border-red-300 text-red-600 hover:bg-red-50"
                  }`}
                >
                  <span className="text-xs">
                    {currentPlayerIndex === playersWithMetrics.length - 1
                      ? session?.status === "completed"
                        ? "View Training Summary"
                        : "Complete"
                      : "Next"}
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Metrics Recording Form */}
        <div className="animate-in fade-in-50 duration-500 delay-200 flex-1">
          <div className="h-full bg-card rounded-xl border-2 border-primary/20 overflow-hidden">            <MetricsRecordingForm
              metricsToShow={metricsToShow}
              metricValues={metricValues}
              notes={notes}
              onMetricChange={handleMetricChange}
              onNotesChange={handleNotesChange}
              playerTrainingId={currentPlayer?.id}
              fetchImprovement={fetchImprovement}
              getImprovementData={getImprovementData}
              currentPlayerIndex={currentPlayerIndex}
              playersWithMetrics={playersWithMetrics}
              onPreviousPlayer={handlePreviousPlayer}
              onNextPlayer={handleEnhancedNextPlayer}
              session={session}
              onShowCompletionModal={() => setShowCompletionModal(true)}
              isFormDisabled={isFormDisabled}
            />
          </div>
        </div>
      </CardContent>
      {/* Training Completion Modal */}
      <TrainingCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        session={session}
        playersWithMetrics={playersWithMetrics}
        onComplete={() => {
          setShowCompletionModal(false);
          // Optional: Navigate back or refresh
          if (onSaveSuccess) {
            onSaveSuccess();
          }
        }}
      />
    </Card>
  );
};

export default PlayerMetricsRecording;
