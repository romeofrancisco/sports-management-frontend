import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAssignMetricsToPlayersInSession, useAssignMetricsToSinglePlayer } from "@/hooks/useTrainings";

export const usePlayerMetrics = (session, onSaveSuccess) => {
  const { mutate: assignPlayerMetrics } = useAssignMetricsToPlayersInSession();
  const { mutate: assignSinglePlayerMetrics } = useAssignMetricsToSinglePlayer();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedPlayerMetrics, setSelectedPlayerMetrics] = useState({});
  const [metricsToRemove, setMetricsToRemove] = useState({}); // Track metrics marked for removal

  // Get present players
  const presentPlayers = useMemo(() => {
    return session?.player_records?.filter(
      record => 
        record.attendance_status === "present" || 
        record.attendance_status === "late"
    ) || [];
  }, [session?.player_records]);
  // Get player-level assigned metrics
  const playerAssignedMetrics = useMemo(() => {
    const playerMetrics = new Map();
    session?.player_records?.forEach(record => {
      const playerId = record.player?.id;
      // Extract assigned metrics from metric_records
      const assignedMetrics = record.metric_records?.map(metricRecord => ({
        id: metricRecord.metric,
        name: metricRecord.metric_name,
        metric_unit: {
          code: metricRecord.metric_unit_code,
          name: metricRecord.metric_unit_name
        },
        value: metricRecord.value,
        recorded_at: metricRecord.recorded_at,
        notes: metricRecord.notes
      })) || [];
      
      if (playerId) {
        playerMetrics.set(playerId, assignedMetrics);
      }
    });
    return playerMetrics;
  }, [session?.player_records]);

  // Handle assigning metrics to specific players
  const handleAssignToPlayers = useCallback((metricIds, playerIds) => {
    if (playerIds.length === 0) {
      toast.error("Please select at least one player");
      return;
    }

    if (metricIds.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }

    assignPlayerMetrics(
      {
        sessionId: session.id,
        playerIds: playerIds,
        metricIds: metricIds,
      },      {
        onSuccess: () => {
          onSaveSuccess?.();
        },
      }
    );  }, [
    assignPlayerMetrics,
    session?.id,
    onSaveSuccess,
  ]);

  // Handle player selection for bulk assignment
  const handleTogglePlayer = useCallback((playerId) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  }, []);

  // Handle selecting all present players
  const handleSelectAllPresentPlayers = useCallback(() => {
    setSelectedPlayers(presentPlayers.map((record) => record.player.id));
  }, [presentPlayers]);  // Handle toggling metric selection for individual players
  const handleTogglePlayerMetric = useCallback((playerId, metricId) => {
    const assignedMetrics = playerAssignedMetrics.get(playerId) || [];
    const isAlreadyAssigned = assignedMetrics.some(pm => pm.id === metricId);
    
    if (isAlreadyAssigned) {
      // For assigned metrics, track them for removal
      setMetricsToRemove(prev => {
        const playerRemovals = prev[playerId] || [];
        const isMarkedForRemoval = playerRemovals.includes(metricId);
        
        return {
          ...prev,
          [playerId]: isMarkedForRemoval 
            ? playerRemovals.filter(id => id !== metricId)
            : [...playerRemovals, metricId]
        };
      });
    } else {
      // Handle normal selection for unassigned metrics
      setSelectedPlayerMetrics(prev => {
        const playerMetrics = prev[playerId] || [];
        const isSelected = playerMetrics.includes(metricId);
        
        return {
          ...prev,
          [playerId]: isSelected 
            ? playerMetrics.filter(id => id !== metricId)
            : [...playerMetrics, metricId]
        };
      });
    }
  }, [playerAssignedMetrics]);  // Handle removing a specific metric from a player
  const handleRemoveMetricFromPlayer = useCallback((playerId, metricId) => {
    const assignedMetrics = playerAssignedMetrics.get(playerId) || [];
    const remainingMetricIds = assignedMetrics
      .filter(metric => metric.id !== metricId)
      .map(metric => metric.id);
    
    // Use single player endpoint to reassign only the remaining metrics
    assignSinglePlayerMetrics(
      {
        sessionId: session.id,
        playerId: playerId,
        metricIds: remainingMetricIds
      },      {
        onSuccess: () => {
          toast.success("Metric removed successfully");
        },
        onError: () => {
          toast.error("Failed to remove metric");
        }
      }
    );
  }, [playerAssignedMetrics, assignSinglePlayerMetrics, session?.id]);// Handle assigning selected metrics to a specific player
  const handleAssignPlayerMetrics = useCallback((playerId) => {
    const metricsToAssign = selectedPlayerMetrics[playerId] || [];
    const metricsToRemoveList = metricsToRemove[playerId] || [];
    
    // Calculate final metrics: current assigned - removed + newly selected
    const currentAssigned = playerAssignedMetrics.get(playerId) || [];
    const finalMetrics = [
      ...currentAssigned.filter(m => !metricsToRemoveList.includes(m.id)).map(m => m.id),
      ...metricsToAssign
    ];
    
    if (finalMetrics.length === 0 && metricsToAssign.length === 0 && metricsToRemoveList.length === 0) {
      toast.error("Please select metrics to assign or remove");
      return;
    }

    // Use single player endpoint instead of bulk assignment
    assignSinglePlayerMetrics(
      {
        sessionId: session.id,
        playerId: playerId,
        metricIds: finalMetrics,
      },
      {        onSuccess: () => {
          onSaveSuccess?.();
          
          // Clear selected metrics and removal list for this player after assignment
          setSelectedPlayerMetrics(prev => ({
            ...prev,
            [playerId]: []
          }));
          setMetricsToRemove(prev => ({
            ...prev,
            [playerId]: []
          }));
        },
      }
    );  }, [selectedPlayerMetrics, metricsToRemove, playerAssignedMetrics, assignSinglePlayerMetrics, session?.id, onSaveSuccess]);

  // Function to clear selected metrics and removal state for a specific player
  const clearPlayerState = useCallback((playerId) => {
    setSelectedPlayerMetrics(prev => ({
      ...prev,
      [playerId]: []
    }));
    setMetricsToRemove(prev => ({
      ...prev,
      [playerId]: []
    }));
  }, []);

  return {
    presentPlayers,
    playerAssignedMetrics,
    selectedPlayers,
    selectedPlayerMetrics,
    metricsToRemove,
    handleAssignToPlayers,
    handleTogglePlayer,
    handleSelectAllPresentPlayers,
    handleTogglePlayerMetric,
    handleAssignPlayerMetrics,
    clearPlayerState,
  };
};
