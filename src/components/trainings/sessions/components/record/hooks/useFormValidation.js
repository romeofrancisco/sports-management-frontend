import { useMemo } from "react";

/**
 * Hook for form validation logic
 */
export const useFormValidation = (metricsToShow, metricValues, notes) => {
  // Check if user has entered any values
  const hasChanges = useMemo(() => {
    return metricsToShow.some((metric) => {
      const currentValue = metricValues[metric.id] || "";
      // Don't count "." or "0" as valid values
      const hasValue = currentValue !== "" && currentValue !== "." && !isNaN(parseFloat(currentValue)) && parseFloat(currentValue) !== 0;
      return hasValue;
    });
  }, [metricsToShow, metricValues]);

  // Check if values differ from original data
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

  // Check if all metrics have valid values (for completion validation)
  const hasValidMetrics = useMemo(() => {
    if (metricsToShow.length === 0) return false;

    return metricsToShow.every((metric) => {
      const currentValue = metricValues[metric.id] || "";
      
      // Allow empty values (user might want to clear a metric)
      if (currentValue === "") return true;
      
      // Reject "." and zero values
      if (currentValue === ".") return false;
      
      const numericValue = parseFloat(currentValue);
      return !isNaN(numericValue) && numericValue !== 0;
    });
  }, [metricsToShow, metricValues]);

  // Check if any metric has zero value (which is invalid)
  const hasZeroValues = useMemo(() => {
    return metricsToShow.some((metric) => {
      const currentValue = metricValues[metric.id] || "";
      if (currentValue === "") return false; // Empty is not zero
      
      // Check for "." or zero values
      if (currentValue === ".") return true;
      
      const numericValue = parseFloat(currentValue);
      return !isNaN(numericValue) && numericValue === 0;
    });
  }, [metricsToShow, metricValues]);

  return {
    hasChanges,
    hasActualChanges,
    hasValidMetrics,
    hasZeroValues,
  };
};
