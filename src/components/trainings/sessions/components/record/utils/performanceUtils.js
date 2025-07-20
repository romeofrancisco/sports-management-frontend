import { PERFORMANCE_STYLES } from '../styles/performanceStyles';

/**
 * Determines the performance status based on improvement data
 * @param {Object} improvementData - The improvement data from the API
 * @param {boolean} hasValue - Whether the input has a value
 * @param {string} value - The current input value
 * @returns {Object|null} The performance status object or null
 */
export const getPerformanceStatus = (improvementData, hasValue, value) => {
  if (
    !improvementData ||
    !hasValue ||
    typeof improvementData.normalizedPercentage !== "number" ||
    parseFloat(value) === 0
  )
    return null;

  const improvement = improvementData.normalizedPercentage;
  if (improvement > 1) return PERFORMANCE_STYLES.excellent;
  if (improvement > -1) return PERFORMANCE_STYLES.stable;
  return PERFORMANCE_STYLES["needs-attention"];
};
