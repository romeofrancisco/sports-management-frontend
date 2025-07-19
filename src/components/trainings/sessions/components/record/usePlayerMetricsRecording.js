import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecordPlayerMetrics } from "@/hooks/useTrainings";
import { useRealTimeImprovement } from "@/hooks/useRealTimeImprovement";
import { toast } from "sonner";
import { ATTENDANCE_STATUS } from "@/constants/trainings";

export const usePlayerMetricsRecording = (session) => {
  const queryClient = useQueryClient();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});

  const { mutate: recordMetrics, isLoading } = useRecordPlayerMetrics(
    session?.id
  );
  const { fetchImprovement, getImprovementData, clearImprovementData } =
    useRealTimeImprovement();

  // Use TanStack Query to derive players with metrics
  const {
    data: playersWithMetrics = [],
    isLoading: isLoadingPlayers,
    error: playersError,
    refetch: refetchPlayersWithMetrics,
  } = useQuery({
    queryKey: ["session-players-with-metrics", session?.id, session?.player_records],
    queryFn: () => {
      if (!session?.player_records) return [];

      return session.player_records.filter(
        (player) =>
          (player.attendance_status === ATTENDANCE_STATUS.PRESENT ||
            player.attendance_status === ATTENDANCE_STATUS.LATE) &&
          player.metric_records &&
          player.metric_records.length > 0
      );
    },
    enabled: !!session?.player_records,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the results
  });

  // Use TanStack Query to derive current player data
  const { 
    data: currentPlayer, 
    isLoading: isLoadingCurrentPlayer,
    refetch: refetchCurrentPlayer,
  } = useQuery({
    queryKey: ["current-player", currentPlayerIndex, playersWithMetrics.length, JSON.stringify(playersWithMetrics)],
    queryFn: () => playersWithMetrics[currentPlayerIndex] || null,
    enabled:
      playersWithMetrics.length > 0 &&
      currentPlayerIndex < playersWithMetrics.length,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the results
  });

  // Use TanStack Query to derive metrics for current player
  const { 
    data: metricsToShow = [], 
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: [
      "player-metrics",
      currentPlayer?.id,
      JSON.stringify(currentPlayer?.metric_records),
    ],
    queryFn: () => {
      if (!currentPlayer?.metric_records) return [];

      return currentPlayer.metric_records.map((record) => ({
        id: record.metric,
        name: record.metric_name,
        description: record.metric_description,
        metric_unit: {
          code: record.metric_unit_code,
          name: record.metric_unit_name,
        },
        is_lower_better: record.metric_name.toLowerCase().includes("time"),
        existing_record_id: record.id,
        current_value: record.value, // This can now be null for newly assigned metrics
        notes: record.notes || "",
      }));
    },
    enabled: !!currentPlayer?.metric_records,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the results
  });

  // Memoized validation functions using TanStack Query derived data
  const hasChanges = useMemo(() => {
    return metricsToShow.some((metric) => {
      const currentValue = metricValues[metric.id] || "";
      const hasValue = currentValue !== "" && !isNaN(parseFloat(currentValue));
      return hasValue;
    });
  }, [metricsToShow, metricValues]);

  const hasActualChanges = useMemo(() => {
    return metricsToShow.some((metric) => {
      const currentValue = metricValues[metric.id] || "";
      const currentNotes = notes[metric.id] || "";

      const originalValue = metric.current_value?.toString() || "";
      const originalNotes = metric.notes || "";

      const valueChanged = currentValue !== originalValue;
      const notesChanged = currentNotes !== originalNotes;

      return valueChanged || notesChanged;
    });
  }, [metricsToShow, metricValues, notes]);

  const hasValidMetrics = useMemo(() => {
    if (metricsToShow.length === 0) return false;

    return metricsToShow.every((metric) => {
      const currentValue = metricValues[metric.id] || "";
      const numericValue = parseFloat(currentValue);
      return currentValue !== "" && !isNaN(numericValue) && numericValue > 0;
    });
  }, [metricsToShow, metricValues]);

  // Save function with TanStack Query integration
  const savePlayerMetrics = useCallback(
    async (shouldNavigate = false, skipChangeCheck = false) => {
      if (!skipChangeCheck && !hasActualChanges) {
        toast.info("No changes detected", {
          description:
            "Metrics and notes are unchanged from the last recording.",
        });
        return { saved: false, reason: "no_changes" };
      }

      const metricsData = metricsToShow
        .map((metric) => ({
          metric_id: metric.id,
          value: parseFloat(metricValues[metric.id] || "0"),
          notes: notes[metric.id] || "",
          record_id: metric.existing_record_id,
        }))
        .filter((data) => !isNaN(data.value) && data.value > 0);

      if (metricsData.length === 0) {
        return { saved: false, reason: "no_valid_metrics" };
      }

      // If skipChangeCheck is true but there are no actual changes, don't save
      if (skipChangeCheck && !hasActualChanges) {
        return { saved: false, reason: "no_changes_skip_check" };
      }

      return new Promise((resolve, reject) => {
        recordMetrics(
          {
            id: currentPlayer.id,
            metrics: metricsData,
            sessionId: session?.id, // Pass session ID for better invalidation
          },
          {
            onSuccess: (data) => {
              // Invalidate all relevant queries to refresh the data
              queryClient.invalidateQueries({
                queryKey: ["training-session", session?.id],
              });
              queryClient.invalidateQueries({
                queryKey: ["session-players-with-metrics", session?.id],
              });
              queryClient.invalidateQueries({
                queryKey: ["player-training", currentPlayer.id],
              });
              queryClient.invalidateQueries({
                queryKey: ["current-player"],
              });
              queryClient.invalidateQueries({
                queryKey: ["player-metrics"],
              });
              
              // Force refetch of session data first (the source of truth)
              queryClient.refetchQueries({
                queryKey: ["training-session", session?.id],
              });
              
              // Then refetch derived queries
              queryClient.refetchQueries({
                queryKey: ["session-players-with-metrics", session?.id],
              });

              resolve({ saved: true, data });
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    [
      hasActualChanges,
      metricsToShow,
      metricValues,
      notes,
      currentPlayer,
      recordMetrics,
      queryClient,
      session?.id,
    ]
  );

  // Direct navigation to specific player with TanStack Query integration
  const navigateToPlayer = useCallback(
    async (targetIndex) => {
      if (targetIndex < 0 || targetIndex >= playersWithMetrics.length) return;
      if (targetIndex === currentPlayerIndex) return;

      // Save current player data if there are changes
      if (currentPlayer && hasActualChanges) {
        await savePlayerMetrics(false);
      }

      // Update the player index
      setCurrentPlayerIndex(targetIndex);
      
      // Use setTimeout to ensure state update happens first, then refetch
      setTimeout(() => {
        refetchPlayersWithMetrics();
        refetchCurrentPlayer();
        refetchMetrics();
      }, 100);
    },
    [
      currentPlayerIndex,
      playersWithMetrics.length,
      currentPlayer,
      hasActualChanges,
      savePlayerMetrics,
      refetchPlayersWithMetrics,
      refetchCurrentPlayer,
      refetchMetrics,
    ]
  );

  // Navigation handlers with TanStack Query integration
  const handlePreviousPlayer = useCallback(async () => {
    if (currentPlayer && hasActualChanges) {
      await savePlayerMetrics(false);
    }
    
    // Update the player index
    setCurrentPlayerIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      
      // Use setTimeout to ensure state update happens first, then refetch
      setTimeout(() => {
        refetchPlayersWithMetrics();
        refetchCurrentPlayer();
        refetchMetrics();
      }, 100);
      
      return newIndex;
    });
  }, [
    currentPlayer,
    hasActualChanges,
    savePlayerMetrics,
    refetchPlayersWithMetrics,
    refetchCurrentPlayer,
    refetchMetrics,
  ]);

  const handleNextPlayer = useCallback(async () => {
    const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;

    if (isLastPlayer) {
      return;
    }

    if (currentPlayer && hasActualChanges && !hasValidMetrics) {
      return;
    }

    if (currentPlayer && hasActualChanges) {
      await savePlayerMetrics(false);
    }

    // Update the player index
    setCurrentPlayerIndex((prev) => {
      const newIndex = Math.min(playersWithMetrics.length - 1, prev + 1);
      
      // Use setTimeout to ensure state update happens first, then refetch
      setTimeout(() => {
        refetchPlayersWithMetrics();
        refetchCurrentPlayer();
        refetchMetrics();
      }, 100);
      
      return newIndex;
    });
  }, [
    currentPlayerIndex,
    playersWithMetrics.length,
    currentPlayer,
    hasActualChanges,
    hasValidMetrics,
    savePlayerMetrics,
    refetchPlayersWithMetrics,
    refetchCurrentPlayer,
    refetchMetrics,
  ]);

  // Value change handlers
  const handleMetricChange = useCallback((metricId, value) => {
    setMetricValues((prev) => ({ ...prev, [metricId]: value }));
  }, []);

  const handleNotesChange = useCallback((metricId, noteValue) => {
    setNotes((prev) => ({ ...prev, [metricId]: noteValue }));
  }, []);

  // Initialize form values when player changes
  useEffect(() => {
    if (!currentPlayer || metricsToShow.length === 0) return;
    
    const initialValues = {};
    const initialNotes = {};

    // Placeholder text patterns that should be treated as empty
    const placeholderPatterns = [
      "metric assigned - awaiting value input",
      "awaiting value input",
      "metric assigned",
      "no notes",
      "n/a",
      "-",
    ];

    metricsToShow.forEach((metric) => {
      // For newly assigned metrics, current_value will be null
      if (metric.current_value !== null && metric.current_value !== undefined) {
        // Include 0 as a valid recorded value - only exclude null/undefined
        initialValues[metric.id] = metric.current_value.toString();
      } else {
        // For newly assigned metrics or metrics with no recorded value, start with empty
        initialValues[metric.id] = "";
      }

      // Check if notes contain placeholder text
      const noteText = (metric.notes || "").toLowerCase().trim();
      const isPlaceholder = placeholderPatterns.some(
        (pattern) => noteText === pattern || noteText.includes(pattern)
      );

      initialNotes[metric.id] = isPlaceholder ? "" : metric.notes || "";
    });

    // Immediately update state - no async timeout
    setMetricValues(initialValues);
    setNotes(initialNotes);

    clearImprovementData();
  }, [
    currentPlayer?.id,
    currentPlayerIndex,
    metricsToShow,
    clearImprovementData,
  ]); // Watch the actual objects, not JSON stringified versions

  return {
    // State
    currentPlayerIndex,
    currentPlayer,
    playersWithMetrics,
    metricsToShow,
    metricValues,
    notes,

    // Loading states
    isLoading:
      isLoading ||
      isLoadingPlayers ||
      isLoadingCurrentPlayer ||
      isLoadingMetrics,
    isLoadingPlayers,
    isLoadingCurrentPlayer,
    isLoadingMetrics,

    // Error states
    playersError,

    // Validation functions (now memoized values)
    hasChanges,
    hasActualChanges,
    hasValidMetrics,

    // Handlers
    handlePreviousPlayer,
    handleNextPlayer,
    navigateToPlayer,
    handleMetricChange,
    handleNotesChange,
    savePlayerMetrics,

    // Refetch functions for manual data refresh
    refetchPlayersWithMetrics,
    refetchCurrentPlayer,
    refetchMetrics,

    // Real-time improvement
    fetchImprovement,
    getImprovementData,
  };
};
