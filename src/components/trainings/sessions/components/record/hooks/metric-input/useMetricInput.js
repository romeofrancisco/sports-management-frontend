import { useEffect, useState } from "react";
import { getPerformanceStatus } from "../../utils/performanceUtils";

/**
 * Custom hook for managing metric input field state and logic
 */
export const useMetricInput = ({
  value,
  playerTrainingId,
  metric,
  fetchImprovement,
  getImprovementData,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasValue = value !== "" && !isNaN(parseFloat(value)) && parseFloat(value) !== 0;
  const numericValue = hasValue ? parseFloat(value) : null;

  // Get real-time improvement data
  const { data: improvementData, loading: improvementLoading } = getImprovementData(playerTrainingId, metric.id);

  // Debounced improvement calculation
  useEffect(() => {
    if (hasValue) {
      const timeoutId = setTimeout(() => {
        fetchImprovement(playerTrainingId, metric.id, value);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [value, playerTrainingId, metric.id, fetchImprovement, hasValue]);

  // Get performance status
  const performanceStatus = getPerformanceStatus(improvementData, hasValue, value);

  return {
    isFocused,
    setIsFocused,
    isHovered,
    setIsHovered,
    hasValue,
    numericValue,
    improvementData,
    improvementLoading,
    performanceStatus,
  };
};
