import { useCallback } from "react";

/**
 * Hook for handling player navigation
 */
export const usePlayerNavigation = (
  playersWithMetrics = [], 
  currentPlayer = null, 
  hasActualChanges = false, 
  hasValidMetrics = false, 
  savePlayerMetrics = null,
  currentPlayerIndex = 0,
  setCurrentPlayerIndex = null,
  isNavigating = false,
  setIsNavigating = null,
  isSavingForNavigation = false,
  setIsSavingForNavigation = null,
  hasZeroValues = false
) => {

  // Direct navigation to specific player
  const navigateToPlayer = useCallback(
    async (targetIndex) => {
      if (!setCurrentPlayerIndex || !setIsNavigating) return;
      if (targetIndex < 0 || targetIndex >= playersWithMetrics.length) return;
      if (targetIndex === currentPlayerIndex) return;
      if (isNavigating || isSavingForNavigation) return; // Prevent multiple navigations

      // Prevent navigation if there are zero values
      if (hasZeroValues) {
        console.warn('Cannot navigate: Zero values detected');
        return;
      }

      try {
        // Save current player data if there are changes
        if (currentPlayer && hasActualChanges && savePlayerMetrics && setIsSavingForNavigation) {
          setIsSavingForNavigation(true);
          await savePlayerMetrics(false);
          setIsSavingForNavigation(false);
        }

        setIsNavigating(true);
        // Update the player index
        setCurrentPlayerIndex(targetIndex);
        
        // Small delay to allow data fetching to complete
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Navigation error:', error);
        if (setIsSavingForNavigation) setIsSavingForNavigation(false);
      } finally {
        setIsNavigating(false);
      }
    },
    [
      currentPlayerIndex,
      playersWithMetrics.length,
      currentPlayer,
      hasActualChanges,
      savePlayerMetrics,
      setCurrentPlayerIndex,
      isNavigating,
      setIsNavigating,
      isSavingForNavigation,
      setIsSavingForNavigation,
      hasZeroValues,
    ]
  );

  // Navigate to previous player
  const handlePreviousPlayer = useCallback(async () => {
    if (!setCurrentPlayerIndex || !setIsNavigating) return;
    if (isNavigating || isSavingForNavigation) return; // Prevent multiple navigations
    
    // Prevent navigation if there are zero values
    if (hasZeroValues) {
      console.warn('Cannot navigate: Zero values detected');
      return;
    }
    
    try {
      if (currentPlayer && hasActualChanges && savePlayerMetrics && setIsSavingForNavigation) {
        setIsSavingForNavigation(true);
        await savePlayerMetrics(false);
        setIsSavingForNavigation(false);
      }
      
      setIsNavigating(true);
      setCurrentPlayerIndex((prev) => Math.max(0, prev - 1));
      
      // Small delay to allow data fetching to complete
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Previous navigation error:', error);
      if (setIsSavingForNavigation) setIsSavingForNavigation(false);
    } finally {
      setIsNavigating(false);
    }
  }, [
    currentPlayer, 
    hasActualChanges, 
    savePlayerMetrics, 
    setCurrentPlayerIndex,
    isNavigating,
    setIsNavigating,
    isSavingForNavigation,
    setIsSavingForNavigation,
    hasZeroValues
  ]);

  // Navigate to next player
  const handleNextPlayer = useCallback(async () => {
    if (!setCurrentPlayerIndex || !setIsNavigating) return;
    if (isNavigating || isSavingForNavigation) return; // Prevent multiple navigations
    
    const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;

    if (isLastPlayer) {
      return;
    }

    if (currentPlayer && hasActualChanges && (!hasValidMetrics || hasZeroValues)) {
      console.warn('Cannot navigate: Invalid metrics or zero values detected');
      return;
    }

    try {
      if (currentPlayer && hasActualChanges && savePlayerMetrics && setIsSavingForNavigation) {
        setIsSavingForNavigation(true);
        await savePlayerMetrics(false);
        setIsSavingForNavigation(false);
      }

      setIsNavigating(true);
      setCurrentPlayerIndex((prev) => Math.min(playersWithMetrics.length - 1, prev + 1));
      
      // Small delay to allow data fetching to complete
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Next navigation error:', error);
      if (setIsSavingForNavigation) setIsSavingForNavigation(false);
    } finally {
      setIsNavigating(false);
    }
  }, [
    currentPlayerIndex,
    playersWithMetrics.length,
    currentPlayer,
    hasActualChanges,
    hasValidMetrics,
    savePlayerMetrics,
    setCurrentPlayerIndex,
    isNavigating,
    setIsNavigating,
    isSavingForNavigation,
    setIsSavingForNavigation,
    hasZeroValues,
  ]);

  return {
    currentPlayerIndex,
    navigateToPlayer,
    handlePreviousPlayer,
    handleNextPlayer,
  };
};
