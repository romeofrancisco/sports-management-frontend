/**
 * Utility functions for PlayerMetricsRecording component
 */

/**
 * Calculate progress percentage based on players with recorded data
 * @param {Array} playersWithMetrics - Array of player records with metrics
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressPercentage = (playersWithMetrics = []) => {
  if (playersWithMetrics.length === 0) return 0;

  // Count players who have at least one recorded metric
  const playersWithData = playersWithMetrics.filter((playerRecord) => {
    if (
      !playerRecord.metric_records ||
      playerRecord.metric_records.length === 0
    ) {
      return false;
    }
    // Check if any metric record has a valid value
    return playerRecord.metric_records.some(
      (record) =>
        record.value !== null &&
        record.value !== "" &&
        !isNaN(parseFloat(record.value))
    );
  }).length;

  return (playersWithData / playersWithMetrics.length) * 100;
};

/**
 * Check if any players have recorded metrics
 * @param {Array} playersWithMetrics - Array of player records with metrics
 * @returns {boolean} True if at least one player has recorded metrics
 */
export const hasPlayersWithRecordedMetrics = (playersWithMetrics = []) => {
  return playersWithMetrics.some((playerRecord) => {
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
};

/**
 * Determine if the current player is the last one
 * @param {number} currentPlayerIndex - Current player index
 * @param {Array} playersWithMetrics - Array of players
 * @returns {boolean} True if current player is the last one
 */
export const isLastPlayer = (currentPlayerIndex, playersWithMetrics = []) => {
  return currentPlayerIndex === playersWithMetrics.length - 1;
};

/**
 * Check if the session is completed
 * @param {Object} session - Session object
 * @returns {boolean} True if session status is completed
 */
export const isSessionCompleted = (session) => {
  return session?.status === "completed";
};

/**
 * Get form disabled state from workflow data
 * @param {Object} workflowData - Workflow data object
 * @returns {boolean} True if form should be disabled
 */
export const getFormDisabledState = (workflowData) => {
  const recordMetricsStep = workflowData?.steps?.find(
    (step) => step.id === "record-metrics"
  );
  return recordMetricsStep?.isFormDisabled ?? false;
};

/**
 * Create a delay promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Handle session completion navigation logic
 * @param {Object} params - Parameters object
 * @param {Object} params.session - Session object
 * @param {boolean} params.isLastPlayer - Whether current player is last
 * @param {Function} params.navigate - Navigation function
 * @param {Function} params.handleNextPlayer - Handle next player function
 * @returns {Promise<boolean>} True if handled, false if should continue with normal flow
 */
export const handleCompletedSessionNavigation = async ({
  session,
  isLastPlayer,
  navigate,
  handleNextPlayer
}) => {
  if (!isSessionCompleted(session)) {
    return false; // Not a completed session, continue with normal flow
  }

  if (isLastPlayer) {
    // For completed sessions on last player, navigate directly to summary
    navigate(`/trainings/sessions/${session.id}/summary`);
    return true;
  } else {
    // Just navigate to next player without saving
    await handleNextPlayer();
    return true;
  }
};

/**
 *  next player navigation handler
 * @param {Object} params - Parameters object
 * @returns {Promise<void>}
 */
export const createNextPlayerHandler = ({
  session,
  isFormDisabled,
  currentPlayerIndex,
  playersWithMetrics,
  hasValidMetrics,
  handleFinishTraining,
  handleNextPlayer,
  navigate
}) => {
  return async () => {
    const isLast = isLastPlayer(currentPlayerIndex, playersWithMetrics);
    
    // Handle completed session navigation
    const wasHandled = await handleCompletedSessionNavigation({
      session,
      isLastPlayer: isLast,
      navigate,
      handleNextPlayer
    });
    
    if (wasHandled) return;

    // If form is disabled (non-admin on completed session), just navigate without saving
    if (isFormDisabled) {
      await handleNextPlayer(); // Just navigate, don't save
      return;
    }

    // Always allow navigation to next player, regardless of form completion
    if (isLast) {
      // Only show completion modal if there are valid metrics
      if (hasValidMetrics()) {
        await handleFinishTraining();
      } else {
        // Navigate to next player even without valid metrics
        await handleNextPlayer();
      }
    } else {
      // Always navigate to next player
      await handleNextPlayer();
    }
  };
};
