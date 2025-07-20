import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSessionPlayersMetrics, fetchPlayerMetricsData } from "@/api/trainingsApi";

/**
 * Hook for fetching player metrics data
 */
export const usePlayerMetricsData = (session, currentPlayerIndex) => {
  // Fetch session players with metrics
  const {
    data: sessionPlayersData,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useQuery({
    queryKey: ["session-players-metrics", session?.id],
    queryFn: () => fetchSessionPlayersMetrics(session?.id),
    enabled: !!session?.id,
  });

  // Extract players from the API response
  const playersWithMetrics = sessionPlayersData?.players_with_metrics || [];

  // Get current player from the lightweight data
  const currentPlayer = useMemo(() => {
    if (playersWithMetrics.length === 0 || currentPlayerIndex >= playersWithMetrics.length) {
      return null;
    }
    return playersWithMetrics[currentPlayerIndex];
  }, [playersWithMetrics, currentPlayerIndex]);

  // Fetch specific player metrics data
  const { 
    data: currentPlayerData,
    isLoading: isLoadingCurrentPlayer,
    refetch: refetchCurrentPlayerData,
  } = useQuery({
    queryKey: ["player-metrics-data", currentPlayer?.id, currentPlayerIndex],
    queryFn: () => fetchPlayerMetricsData(currentPlayer?.id),
    enabled: !!currentPlayer?.id,
    staleTime: 0,
    cacheTime: 0,
  });

  // Extract metrics from the current player data
  const metricsToShow = useMemo(() => {
    if (!currentPlayerData?.player_training?.metric_records) return [];

    return currentPlayerData.player_training.metric_records.map((record) => ({
      id: record.metric,
      name: record.metric_name,
      description: record.metric_description,
      metric_unit: {
        code: record.metric_unit_code,
        name: record.metric_unit_name,
      },
      is_lower_better: record.metric_name.toLowerCase().includes("time"),
      existing_record_id: record.id,
      current_value: record.value,
      notes: record.notes || "",
    }));
  }, [currentPlayerData]);

  return {
    // Data
    playersWithMetrics,
    currentPlayer,
    metricsToShow,
    
    // Loading states
    isLoadingPlayers,
    isLoadingCurrentPlayer,
    
    // Error states
    playersError,
    
    // Actions
    refetchCurrentPlayerData,
  };
};
