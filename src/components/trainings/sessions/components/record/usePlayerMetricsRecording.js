import React, { useState, useEffect, useCallback } from "react";
import { useRecordPlayerMetrics } from "@/hooks/useTrainings";
import { useRealTimeImprovement } from "@/hooks/useRealTimeImprovement";
import { toast } from "sonner";
import { ATTENDANCE_STATUS } from "@/constants/trainings";

export const usePlayerMetricsRecording = (session) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});
  
  const { mutate: recordMetrics, isLoading } = useRecordPlayerMetrics();
  const { fetchImprovement, getImprovementData, clearImprovementData } = useRealTimeImprovement();

  // Get players from session with metrics configured
  const playersWithMetrics = React.useMemo(() => {
    const players = session?.player_records || [];
    return players.filter(
      (player) =>
        (player.attendance_status === ATTENDANCE_STATUS.PRESENT ||
          player.attendance_status === ATTENDANCE_STATUS.LATE) &&
        player.metric_records &&
        player.metric_records.length > 0
    );
  }, [session?.player_records]);

  const currentPlayer = playersWithMetrics[currentPlayerIndex];  // Get metrics for current player
  const metricsToShow = React.useMemo(() => {
    if (!currentPlayer?.metric_records) return [];
    return currentPlayer.metric_records.map((record) => ({
      id: record.metric,
      name: record.metric_name,
      description: "",
      metric_unit: {
        code: record.metric_unit_code,
        name: record.metric_unit_name,
      },
      is_lower_better: record.metric_name.toLowerCase().includes("time"),
      existing_record_id: record.id,
      current_value: record.value,  // This can now be null for newly assigned metrics
      notes: record.notes || "",
    }));
  }, [currentPlayer]);

  // Validation functions
  const hasChanges = useCallback(() => {
    return metricsToShow.some((metric) => {
      const currentValue = metricValues[metric.id] || "";
      const hasValue = currentValue !== "" && !isNaN(parseFloat(currentValue));
      return hasValue;
    });
  }, [metricsToShow, metricValues]);

  const hasActualChanges = useCallback(() => {
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

  const hasValidMetrics = useCallback(() => {
    if (metricsToShow.length === 0) return false;

    return metricsToShow.every((metric) => {
      const currentValue = metricValues[metric.id] || "";
      const numericValue = parseFloat(currentValue);
      return currentValue !== "" && !isNaN(numericValue) && numericValue > 0;
    });
  }, [metricsToShow, metricValues]);

  // Save function
  const savePlayerMetrics = useCallback(async (shouldNavigate = false, skipChangeCheck = false) => {
    if (!skipChangeCheck && !hasActualChanges()) {
      toast.info("No changes detected", {
        description: "Metrics and notes are unchanged from the last recording.",
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
    if (skipChangeCheck && !hasActualChanges()) {
      return { saved: false, reason: "no_changes_skip_check" };
    }

    return new Promise((resolve, reject) => {
      recordMetrics(
        {
          id: currentPlayer.id,
          metrics: metricsData,
        },
        {
          onSuccess: (data) => {
            resolve({ saved: true, data });
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  }, [hasActualChanges, metricsToShow, metricValues, notes, currentPlayer, recordMetrics]);

  // Navigation handlers
  const handlePreviousPlayer = useCallback(async () => {
    if (currentPlayer && hasActualChanges()) {
      await savePlayerMetrics(false);
    }
    setCurrentPlayerIndex((prev) => Math.max(0, prev - 1));
  }, [currentPlayer, hasActualChanges, savePlayerMetrics]);

  const handleNextPlayer = useCallback(async () => {
    const isLastPlayer = currentPlayerIndex === playersWithMetrics.length - 1;

    if (isLastPlayer) {
      return;
    }

    if (currentPlayer && hasActualChanges() && !hasValidMetrics()) {
      return;
    }

    if (currentPlayer && hasActualChanges()) {
      await savePlayerMetrics(false);
    }

    setCurrentPlayerIndex((prev) =>
      Math.min(playersWithMetrics.length - 1, prev + 1)
    );
  }, [currentPlayerIndex, playersWithMetrics.length, currentPlayer, hasActualChanges, hasValidMetrics, savePlayerMetrics]);

  // Value change handlers
  const handleMetricChange = useCallback((metricId, value) => {
    setMetricValues(prev => ({ ...prev, [metricId]: value }));
  }, []);

  const handleNotesChange = useCallback((metricId, noteValue) => {
    setNotes(prev => ({ ...prev, [metricId]: noteValue }));
  }, []);

  // Initialize form values when player changes
  useEffect(() => {
    if (!currentPlayer) return;    const initialValues = {};
    const initialNotes = {};
    
    // Placeholder text patterns that should be treated as empty
    const placeholderPatterns = [
      "metric assigned - awaiting value input",
      "awaiting value input",
      "metric assigned",
      "no notes",
      "n/a",
      "-"
    ];

    metricsToShow.forEach((metric) => {
      // For newly assigned metrics, current_value will be null
      if (
        metric.current_value !== null &&
        metric.current_value !== undefined
      ) {
        // Include 0 as a valid recorded value - only exclude null/undefined
        initialValues[metric.id] = metric.current_value.toString();
      } else {
        // For newly assigned metrics or metrics with no recorded value, start with empty
        initialValues[metric.id] = "";
      }

      // Check if notes contain placeholder text
      const noteText = (metric.notes || "").toLowerCase().trim();
      const isPlaceholder = placeholderPatterns.some(pattern => 
        noteText === pattern || noteText.includes(pattern)
      );
      
      initialNotes[metric.id] = isPlaceholder ? "" : (metric.notes || "");
    });

    // Immediately update state - no async timeout
    setMetricValues(initialValues);
    setNotes(initialNotes);
    
    clearImprovementData();
  }, [currentPlayer?.id, currentPlayerIndex, JSON.stringify(metricsToShow), clearImprovementData]); // Include stringified metricsToShow to detect value changes

  return {
    // State
    currentPlayerIndex,
    currentPlayer,
    playersWithMetrics,
    metricsToShow,
    metricValues,
    notes,
    isLoading,

    // Validation functions
    hasChanges,
    hasActualChanges,
    hasValidMetrics,

    // Handlers
    handlePreviousPlayer,
    handleNextPlayer,
    handleMetricChange,
    handleNotesChange,
    savePlayerMetrics,

    // Real-time improvement
    fetchImprovement,
    getImprovementData,
  };
};
