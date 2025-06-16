import { useState, useEffect, useCallback, useMemo } from "react";
import { useAssignMetricsToPlayersInSession } from "@/hooks/useTrainings";

export const useSessionMetrics = (session, onSaveSuccess) => {
  const { mutate: assignMetricsToPlayers } = useAssignMetricsToPlayersInSession();
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  // Get session-level assigned metrics (based on what all players actually have)
  const sessionMetrics = useMemo(() => {
    if (!session?.player_records) return [];
    
    // Get all players (no attendance filtering since metrics are assigned before attendance)
    const allPlayers = session.player_records;
    
    if (allPlayers.length === 0) return [];
    
    // Find metrics that ALL players have assigned
    const allPlayerMetrics = allPlayers.map(player => {
      return player.metric_records?.map(record => ({
        id: record.metric,
        name: record.metric_name,
        metric_unit: {
          code: record.metric_unit_code,
          name: record.metric_unit_name
        }
      })) || [];
    });
      // Find metrics that are common to ALL players
    if (allPlayerMetrics.length === 0) return [];
    
    const commonMetrics = allPlayerMetrics[0].filter(metric => 
      allPlayerMetrics.every(playerMetrics => 
        playerMetrics.some(pm => pm.id === metric.id)
      )
    );
    
    // Remove duplicates by metric ID
    const uniqueMetrics = commonMetrics.filter((metric, index, self) => 
      index === self.findIndex(m => m.id === metric.id)
    );
    
    return uniqueMetrics;
  }, [session?.player_records]);
  
  const sessionMetricIds = useMemo(() => sessionMetrics.map(m => m.id), [sessionMetrics]);
  // Initialize selected metrics ONLY ONCE when session changes
  useEffect(() => {
    if (session?.id && !initialized) {
      // Use the computed sessionMetricIds based on all players
      setSelectedMetrics(sessionMetricIds);
      setInitialized(true);
    }
  }, [session?.id, sessionMetricIds, initialized]);

  // Handle toggling a metric selection for session
  const handleToggleSessionMetric = useCallback((metricId) => {
    setSelectedMetrics((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(metricId);
      
      if (isCurrentlySelected) {
        return prevSelected.filter((id) => id !== metricId);
      } else {
        return [...prevSelected, metricId];
      }
    });
  }, []);  // Handle saving session-level metrics configuration
  const handleSaveSessionMetrics = useCallback(() => {
    // Get all players (no attendance filtering since metrics are assigned before attendance)
    const allPlayers = session?.player_records || [];
    
    if (allPlayers.length === 0) {
      console.warn("No players found to assign metrics to");
      return;
    }
    
    const playerIds = allPlayers.map(player => player.player?.id).filter(Boolean);
    
    assignMetricsToPlayers(
      {
        sessionId: session.id,
        playerIds: playerIds,
        metricIds: selectedMetrics,
      },      {
        onSuccess: () => {
          onSaveSuccess?.(); // Auto-advance to next step
        },
      }
    );  }, [
    assignMetricsToPlayers,
    session?.id,
    session?.player_records,
    selectedMetrics,
    onSaveSuccess,
  ]);

  return {
    sessionMetrics,
    sessionMetricIds,
    selectedMetrics,
    selectedCategoryId,
    setSelectedCategoryId,
    handleToggleSessionMetric,
    handleSaveSessionMetrics,
    initialized,
  };
};
