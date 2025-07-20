import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing form state (metric values and notes)
 */
export const useFormState = (currentPlayer, metricsToShow, clearImprovementData) => {
  const [metricValues, setMetricValues] = useState({});
  const [notes, setNotes] = useState({});

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
        initialValues[metric.id] = metric.current_value.toString();
      } else {
        initialValues[metric.id] = "";
      }

      // Check if notes contain placeholder text
      const noteText = (metric.notes || "").toLowerCase().trim();
      const isPlaceholder = placeholderPatterns.some(
        (pattern) => noteText === pattern || noteText.includes(pattern)
      );

      initialNotes[metric.id] = isPlaceholder ? "" : metric.notes || "";
    });

    setMetricValues(initialValues);
    setNotes(initialNotes);
    clearImprovementData();
  }, [
    currentPlayer?.id,
    metricsToShow,
    clearImprovementData,
  ]);

  return {
    metricValues,
    notes,
    handleMetricChange,
    handleNotesChange,
  };
};
