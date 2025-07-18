import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../ui/card";
import { usePlayerMetricsRecording } from "./record/usePlayerMetricsRecording";
import EmptyPlayersState from "./metrics/EmptyPlayersState";
import TrainingCompletionModal from "../../../modals/trainings/TrainingCompletionModal";
import FullPageLoading from "../../../common/FullPageLoading";
import PlayerMetricsHeader from "./record/PlayerMetricsHeader";
import PlayerNavigation from "./record/PlayerNavigation";
import PlayerMetricsForm from "./record/PlayerMetricsForm";

const PlayerMetricsRecording = ({ session, onSaveSuccess, workflowData }) => {
  const navigate = useNavigate();
  const [showSuccessAnimation, setShowSuccessAnimation] = React.useState(false);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  const [isPreparingCompletion, setIsPreparingCompletion] = React.useState(false);

  // Get form disabled state from workflow
  const recordMetricsStep = workflowData?.steps?.find(
    (step) => step.id === "record-metrics"
  );
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
      // Skip change check when completing session to avoid "no changes" message
      const saveResult = await savePlayerMetrics(false, true);
      
      // Only show success animation if something was actually saved
      if (saveResult?.saved) {
        setShowSuccessAnimation(true);
      }

      // If this is the last player and they have valid metrics, show completion modal
      if (isLastPlayer && hasValidMetrics()) {
        if (saveResult?.saved) {
          // Show loading while preparing completion modal
          setIsPreparingCompletion(true);
          // Brief delay to show the loading state, then show modal
          setTimeout(() => {
            setIsPreparingCompletion(false);
            setShowCompletionModal(true);
          }, 800);
        } else {
          // Show immediately if nothing was saved
          setShowCompletionModal(true);
        }
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
      setIsPreparingCompletion(false);
    }
  }, [savePlayerMetrics, isLastPlayer, hasValidMetrics, onSaveSuccess]); 
  
  // Enhanced next player handler
  const handleEnhancedNextPlayer = React.useCallback(async () => {
    // Check if session is already completed
    if (session?.status === "completed") {
      if (isLastPlayer) {
        // For completed sessions on last player, show completion modal directly
        setShowCompletionModal(true);
        return;
      } else {
        // Just navigate to next player without saving
        await handleNextPlayer();
        return;
      }
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
      <PlayerMetricsHeader 
        session={session}
        setShowCompletionModal={setShowCompletionModal}
      />
      <CardContent className="space-y-6 flex flex-col h-full p-6 bg-background">
        {/* Enhanced Player Navigation & Statistics Dashboard */}
        <PlayerNavigation
          currentPlayerIndex={currentPlayerIndex}
          playersWithMetrics={playersWithMetrics}
          currentPlayer={currentPlayer}
          metricsToShow={metricsToShow}
          metricValues={metricValues}
          hasChanges={hasChanges}
          progressPercentage={progressPercentage}
          canProceed={canProceed}
          session={session}
          handlePreviousPlayer={handlePreviousPlayer}
          handleEnhancedNextPlayer={handleEnhancedNextPlayer}
          setShowCompletionModal={setShowCompletionModal}
        />
        {/* Metrics Recording Form */}
        <PlayerMetricsForm
          metricsToShow={metricsToShow}
          metricValues={metricValues}
          notes={notes}
          handleMetricChange={handleMetricChange}
          handleNotesChange={handleNotesChange}
          currentPlayer={currentPlayer}
          fetchImprovement={fetchImprovement}
          getImprovementData={getImprovementData}
          currentPlayerIndex={currentPlayerIndex}
          playersWithMetrics={playersWithMetrics}
          handlePreviousPlayer={handlePreviousPlayer}
          handleEnhancedNextPlayer={handleEnhancedNextPlayer}
          session={session}
          setShowCompletionModal={setShowCompletionModal}
          isFormDisabled={isFormDisabled}
        />
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
      
      {/* Loading overlay for completion preparation */}
      <FullPageLoading 
        message="Preparing training summary..." 
        isVisible={isPreparingCompletion}
      />
    </Card>
  );
};

export default PlayerMetricsRecording;
