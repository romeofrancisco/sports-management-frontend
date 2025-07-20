import React, { useImperativeHandle, forwardRef } from "react";
import { useRealTimeImprovement } from "../../../../../hooks/useRealTimeImprovement";
import { usePlayerMetricsData } from "./hooks/usePlayerMetricsData";
import { useFormState } from "./hooks/useFormState";
import { useFormValidation } from "./hooks/useFormValidation";
import { useSaveOperations } from "./hooks/useSaveOperations";
import { usePlayerNavigation } from "./hooks/usePlayerNavigation";
import { createNextPlayerHandler } from "./utils/playerMetricsRecordingUtils";
import MetricsProgressHeader from "./MetricsProgressHeader";
import MetricsStatusMessage from "./MetricsStatusMessage";
import InputWarning from "./InputWarning";
import MetricInputField from "./MetricInputField";
import FullPageLoading from "../../../../common/FullPageLoading";
import MetricsRecordingFormSkeleton from "./MetricsRecordingFormSkeleton";

const MetricsRecordingForm = forwardRef(({
  session,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  playersWithMetrics,
  onSessionUpdate,
  navigate,
  isFormDisabled = false,
  onFinishTraining,
  isNavigating,
  setIsNavigating,
  isSavingForNavigation,
  setIsSavingForNavigation,
  onFormStateChange,
  allPlayersComplete = false,
}, ref) => {
  // Get improvement functions
  const { fetchImprovement, getImprovementData, clearImprovementData } = useRealTimeImprovement();

  // Get current player data
  const {
    currentPlayer,
    metricsToShow,
    isLoadingCurrentPlayer,
    refetchCurrentPlayerData,
  } = usePlayerMetricsData(session, currentPlayerIndex);

  // Form state
  const { metricValues, notes, handleMetricChange, handleNotesChange } = useFormState(
    currentPlayer,
    metricsToShow,
    clearImprovementData
  );

  // Form validation
  const {
    hasChanges,
    hasActualChanges,
    hasValidMetrics,
    hasZeroValues,
  } = useFormValidation(metricsToShow, metricValues, notes);

  // Save operations
  const { savePlayerMetrics, isSaving } = useSaveOperations(
    session,
    currentPlayer,
    metricsToShow,
    metricValues,
    notes,
    hasActualChanges,
    onSessionUpdate,
    refetchCurrentPlayerData,
    hasZeroValues
  );

  // Navigation handlers
  const navigation = usePlayerNavigation(
    playersWithMetrics,
    currentPlayer,
    hasActualChanges,
    hasValidMetrics,
    savePlayerMetrics,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    isNavigating,
    setIsNavigating,
    isSavingForNavigation,
    setIsSavingForNavigation,
    hasZeroValues
  );

  // Enhanced next player handler
  const handleEnhancedNextPlayer = React.useCallback(
    createNextPlayerHandler({
      session,
      isFormDisabled,
      currentPlayerIndex,
      playersWithMetrics,
      handleNextPlayer: navigation.handleNextPlayer,
      handleFinishTraining: onFinishTraining
    }),
    [session, isFormDisabled, currentPlayerIndex, playersWithMetrics, navigation.handleNextPlayer, onFinishTraining]
  );

  // Enhanced finish training handler that saves current player first
  const handleSaveAndFinishTraining = React.useCallback(async () => {
    if (hasActualChanges && hasValidMetrics && !hasZeroValues) {
      // Save current player's metrics first, then finish training
      try {
        await savePlayerMetrics();
        onFinishTraining();
      } catch (error) {
        console.error('Failed to save metrics before finishing training:', error);
        // Still call finish training even if save fails
        onFinishTraining();
      }
    } else {
      // No changes to save, directly finish training
      onFinishTraining();
    }
  }, [hasActualChanges, hasValidMetrics, hasZeroValues, savePlayerMetrics, onFinishTraining]);

  // Expose navigation function to parent
  useImperativeHandle(ref, () => ({
    navigateToPlayer: navigation.navigateToPlayer,
    saveAndFinishTraining: handleSaveAndFinishTraining,
  }), [navigation.navigateToPlayer, handleSaveAndFinishTraining]);

  // Function to focus on first field with zero value
  const handleFocusFirstZeroField = React.useCallback((metricId) => {
    const inputElement = document.querySelector(`input[data-metric-id="${metricId}"]`);
    if (inputElement) {
      inputElement.focus();
      inputElement.select();
    }
  }, []);

  const completedMetrics = metricsToShow.filter((metric) => {
    const value = metricValues[metric.id] || "";
    if (value === "" || value === ".") return false;
    
    const numericValue = parseFloat(value);
    return !isNaN(numericValue) && numericValue !== 0;
  }).length;

  // Consider form "complete" if user has made changes AND has no zero values
  const isAllMetricsCompleted = (completedMetrics === metricsToShow.length && metricsToShow.length > 0) || (hasActualChanges && !hasZeroValues);

  // Check if current player has empty metrics (all inputs are empty or invalid)
  const hasEmptyCurrentPlayer = React.useMemo(() => {
    if (metricsToShow.length === 0) return false;
    
    // Check if all metric inputs are empty or invalid
    const allEmpty = metricsToShow.every((metric) => {
      const value = metricValues[metric.id] || "";
      if (value === "" || value === ".") return true;
      
      const numericValue = parseFloat(value);
      return isNaN(numericValue) || numericValue === 0;
    });
    
    return allEmpty;
  }, [metricsToShow, metricValues]);

  // Notify parent component about form state changes
  React.useEffect(() => {
    if (onFormStateChange && metricsToShow.length > 0) {
      onFormStateChange({
        hasCompletedMetrics: isAllMetricsCompleted,
        totalMetrics: metricsToShow.length,
        completedCount: completedMetrics,
        hasEmptyCurrentPlayer
      });
    }
  }, [isAllMetricsCompleted, metricsToShow.length, completedMetrics, hasEmptyCurrentPlayer, onFormStateChange]);

  // Show skeleton while loading
  if (isLoadingCurrentPlayer) {
    return <MetricsRecordingFormSkeleton metricsCount={4} />;
  }

  return (
    <div className="h-full bg-card rounded-xl border-2 border-primary/20 overflow-hidden relative">
      {/* Saving overlay */}
      {isSavingForNavigation || isSaving && (
        <FullPageLoading
          message="Saving metrics..."
        />
      )}
      
      {isNavigating ? (
        <MetricsRecordingFormSkeleton metricsCount={4} />
      ) : (
        <div className="h-full flex flex-col">
          {/* Metrics Progress Header */}
          <MetricsProgressHeader 
            completedMetrics={completedMetrics}
            totalMetrics={metricsToShow.length}
            currentPlayer={currentPlayer}
            metricsToShow={metricsToShow}
            metricValues={metricValues}
            hasChanges={hasChanges}
            playersWithMetrics={playersWithMetrics}
          />

          {/* Metrics List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {metricsToShow.map((metric) => (
              <MetricInputField
                key={`${currentPlayer?.id}-${metric.id}-input`}
                metric={metric}
                value={metricValues[metric.id] || ""}
                onChange={(value) => handleMetricChange(metric.id, value)}
                notes={notes[metric.id] || ""}
                onNotesChange={(noteValue) => handleNotesChange(metric.id, noteValue)}
                playerTrainingId={currentPlayer?.id}
                fetchImprovement={fetchImprovement}
                getImprovementData={getImprovementData}
                isFormDisabled={isFormDisabled}
              />
            ))}
          </div>

          {/* Status Message - Shows both complete and incomplete states */}
          {!hasZeroValues && (
            <div className="p-3 sm:p-6">
              <MetricsStatusMessage
                currentPlayerIndex={currentPlayerIndex}
                playersWithMetrics={playersWithMetrics}
                onPreviousPlayer={navigation.handlePreviousPlayer}
                onNextPlayer={handleEnhancedNextPlayer}
                onFinishTraining={handleSaveAndFinishTraining}
                session={session}
                navigate={navigate}
                completedMetrics={completedMetrics}
                totalMetrics={metricsToShow.length}
                hasChanges={hasChanges}
                isComplete={isAllMetricsCompleted}
                hasValidMetrics={hasValidMetrics}
                hasZeroValues={hasZeroValues}
                allPlayersComplete={allPlayersComplete}
                hasEmptyCurrentPlayer={hasEmptyCurrentPlayer}
              />
            </div>
          )}

          {/* Invalid Input Warning */}
          {hasZeroValues && (
            <div className="p-3 sm:p-6">
              <InputWarning
                metricsToShow={metricsToShow}
                metricValues={metricValues}
                onFocusFirstZeroField={handleFocusFirstZeroField}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

MetricsRecordingForm.displayName = 'MetricsRecordingForm';

export default MetricsRecordingForm;
