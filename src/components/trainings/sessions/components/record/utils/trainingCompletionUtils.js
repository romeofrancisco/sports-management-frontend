import { delay } from './playerMetricsRecordingUtils';

/**
 * Training completion utility functions
 */

/**
 * Create a unified training completion handler
 * @param {Object} params - Parameters object
 * @returns {Function} Training completion handler function
 */
export const createFinishTrainingHandler = ({
  hasChanges,
  savePlayerMetrics,
  onSaveSuccess,
  setIsPreparingCompletion,
  setShowCompletionModal
}) => {
  return async () => {
    try {
      // Save current player's metrics if there are changes
      if (hasChanges) {
        setIsPreparingCompletion(true);
        await savePlayerMetrics(false, true);
        
        // Brief delay to show the loading state, then show modal
        await delay(800);
        setIsPreparingCompletion(false);
        setShowCompletionModal(true);
      } else {
        // Show modal immediately if no changes to save
        setShowCompletionModal(true);
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error finishing training:", error);
      setIsPreparingCompletion(false);
    }
  };
};

/**
 * Handle completion modal close
 * @param {Object} params - Parameters object
 */
export const handleCompletionModalClose = ({
  setShowCompletionModal,
  onSaveSuccess
}) => {
  return () => {
    setShowCompletionModal(false);
    // Optional: Navigate back or refresh
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };
};

/**
 * Check if completion button should be shown
 * @param {Object} params - Parameters object
 * @returns {boolean} True if completion button should be shown
 */
export const shouldShowCompletionButton = ({
  session,
  playersWithMetrics,
  isFormDisabled
}) => {
  const hasPlayersWithMetrics = playersWithMetrics.some((playerRecord) => {
    if (!playerRecord.metric_records || playerRecord.metric_records.length === 0) {
      return false;
    }
    return playerRecord.metric_records.some(
      (record) =>
        record.value !== null &&
        record.value !== "" &&
        !isNaN(parseFloat(record.value))
    );
  });

  return session?.status === "ongoing" && hasPlayersWithMetrics && !isFormDisabled;
};
