import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../ui/card";
import { usePlayerMetricsData } from "./record/hooks/usePlayerMetricsData";
import EmptyPlayersState from "./metrics/EmptyPlayersState";
import TrainingCompletionModal from "../../../modals/trainings/TrainingCompletionModal";
import FullPageLoading from "../../../common/FullPageLoading";
import PlayerMetricsHeader from "./record/PlayerMetricsHeader";
import ProgressOverview from "./record/ProgressOverview";
import MetricsRecordingForm from "./record/MetricsRecordingForm";
import PlayerMetricsRecordingSkeleton from "./record/PlayerMetricsRecordingSkeleton";
import MetricsRecordingFormSkeleton from "./record/MetricsRecordingFormSkeleton";
import {
  calculateProgressPercentage,
  getFormDisabledState,
} from "./record/utils/playerMetricsRecordingUtils";
import {
  createFinishTrainingHandler,
  handleCompletionModalClose,
} from "./record/utils/trainingCompletionUtils";

const PlayerMetricsRecording = ({
  session,
  onSaveSuccess,
  workflowData,
  onSessionUpdate,
}) => {
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isPreparingCompletion, setIsPreparingCompletion] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Shared navigation state that both child components will use
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSavingForNavigation, setIsSavingForNavigation] = useState(false);

  // Track current form completion state to show finish button on last player
  const [currentFormState, setCurrentFormState] = useState({
    hasCompletedMetrics: false,
    totalMetrics: 0,
    completedCount: 0
  });

  // Reference to get navigation functions from the form
  const formNavigationRef = useRef();

  // Get form disabled state from workflow
  const isFormDisabled = getFormDisabledState(workflowData);

  // Only get basic player data - child components will handle their own state
  const { playersWithMetrics, isLoadingPlayers, playersError } =
    usePlayerMetricsData(session, currentPlayerIndex);

  // Create a navigation handler that delegates to the form component
  const handleNavigateToPlayer = (targetIndex) => {
    if (formNavigationRef.current?.navigateToPlayer) {
      formNavigationRef.current.navigateToPlayer(targetIndex);
    } else {
      // Fallback if form navigation is not available
      setCurrentPlayerIndex(targetIndex);
    }
  };

  // Create a finish training handler that delegates to the form component
  const handleFinishTrainingWithSave = () => {
    if (formNavigationRef.current?.saveAndFinishTraining) {
      formNavigationRef.current.saveAndFinishTraining();
    } else {
      // Fallback to original handler if form method is not available
      handleFinishTraining();
    }
  };

  // Unified handler for finishing training
  const handleFinishTraining = React.useCallback(
    createFinishTrainingHandler({
      hasChanges: false, // Will be handled by child component
      savePlayerMetrics: null, // Will be handled by child component
      onSaveSuccess,
      setIsPreparingCompletion,
      setShowCompletionModal,
    }),
    [onSaveSuccess]
  );

  // Calculate progress based on players with recorded data and current form state
  const progressPercentage = React.useMemo(() => {
    if (playersWithMetrics.length === 0) return 0;

    let playersWithData = 0;
    
    playersWithMetrics.forEach((playerRecord, index) => {
      if (index === currentPlayerIndex) {
        // For current player, prioritize form state if available, otherwise check saved data
        if (currentFormState.hasCompletedMetrics) {
          playersWithData++;
        } else if (playerRecord.metric_records && playerRecord.metric_records.length > 0) {
          const hasValidMetrics = playerRecord.metric_records.some(
            (record) =>
              record.value !== null &&
              record.value !== "" &&
              !isNaN(parseFloat(record.value)) &&
              parseFloat(record.value) !== 0
          );
          if (hasValidMetrics) {
            playersWithData++;
          }
        }
      } else {
        // For other players, check saved data
        if (playerRecord.metric_records && playerRecord.metric_records.length > 0) {
          const hasValidMetrics = playerRecord.metric_records.some(
            (record) =>
              record.value !== null &&
              record.value !== "" &&
              !isNaN(parseFloat(record.value)) &&
              parseFloat(record.value) !== 0
          );
          if (hasValidMetrics) {
            playersWithData++;
          }
        }
      }
    });

    return (playersWithData / playersWithMetrics.length) * 100;
  }, [playersWithMetrics, currentPlayerIndex, currentFormState]);

  // Check if all players have completed metrics (including current form state)
  const allPlayersComplete = React.useMemo(() => {
    if (playersWithMetrics.length === 0) return false;

    return playersWithMetrics.every((playerRecord, index) => {
      if (index === currentPlayerIndex) {
        // For current player, check form state first, then saved data
        if (currentFormState.hasCompletedMetrics) {
          return true;
        }
      }
      
      // Check saved data for all players
      if (!playerRecord.metric_records || playerRecord.metric_records.length === 0) {
        return false;
      }
      return playerRecord.metric_records.some(
        (record) =>
          record.value !== null &&
          record.value !== "" &&
          !isNaN(parseFloat(record.value)) &&
          parseFloat(record.value) !== 0
      );
    });
  }, [playersWithMetrics, currentPlayerIndex, currentFormState]);

  // Reset form state when player changes
  React.useEffect(() => {
    setCurrentFormState({
      hasCompletedMetrics: false,
      totalMetrics: 0,
      completedCount: 0
    });
  }, [currentPlayerIndex]);

  // Show skeleton while initial data is loading
  if (
    isLoadingPlayers &&
    (!playersWithMetrics || playersWithMetrics.length === 0)
  ) {
    return <PlayerMetricsRecordingSkeleton />;
  }

  // Check if there are players with metrics configured
  if (playersWithMetrics.length === 0) {
    return <EmptyPlayersState />;
  }

  return (
    <Card className="h-full pt-0 gap-0 flex flex-col shadow-xl border-2 border-primary/20 bg-card transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 overflow-hidden">
      <PlayerMetricsHeader
        onFinishTraining={handleFinishTrainingWithSave}
        session={session}
        playersWithMetrics={playersWithMetrics}
        isFormDisabled={isFormDisabled}
        allPlayersComplete={allPlayersComplete}
        hasEmptyCurrentPlayer={currentFormState.hasEmptyCurrentPlayer}
      />
      <CardContent className="space-y-6 flex flex-col h-full p-6 bg-background">
        {/* Enhanced Player Navigation & Statistics Dashboard */}
        <div className="space-y-6">
          <ProgressOverview
            currentPlayerIndex={currentPlayerIndex}
            playersWithMetrics={playersWithMetrics}
            progressPercentage={progressPercentage}
            isNavigating={isNavigating}
            onNavigateToPlayer={handleNavigateToPlayer}
          />
        </div>
        {/* Metrics Recording Form */}
        <div className="animate-in fade-in-50 duration-500 delay-200 flex-1">
          <MetricsRecordingForm
            ref={formNavigationRef}
            session={session}
            currentPlayerIndex={currentPlayerIndex}
            setCurrentPlayerIndex={setCurrentPlayerIndex}
            playersWithMetrics={playersWithMetrics}
            onSessionUpdate={onSessionUpdate}
            navigate={navigate}
            isFormDisabled={isFormDisabled}
            onFinishTraining={handleFinishTraining}
            isNavigating={isNavigating}
            setIsNavigating={setIsNavigating}
            isSavingForNavigation={isSavingForNavigation}
            setIsSavingForNavigation={setIsSavingForNavigation}
            onFormStateChange={(formState) => {
              setCurrentFormState(prev => {
                if (
                  prev.hasCompletedMetrics !== formState.hasCompletedMetrics ||
                  prev.totalMetrics !== formState.totalMetrics ||
                  prev.completedCount !== formState.completedCount ||
                  prev.hasEmptyCurrentPlayer !== formState.hasEmptyCurrentPlayer
                ) {
                  return { ...formState, hasEmptyCurrentPlayer: formState.hasEmptyCurrentPlayer };
                }
                return prev;
              });
            }}
            allPlayersComplete={allPlayersComplete}
          />
        </div>
      </CardContent>
      {/* Training Completion Modal */}
      <TrainingCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        session={session}
        playersWithMetrics={playersWithMetrics}
        onComplete={handleCompletionModalClose({
          setShowCompletionModal,
          onSaveSuccess,
        })}
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
