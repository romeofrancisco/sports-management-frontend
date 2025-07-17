import { useState, useEffect, useMemo } from "react";
import { usePlayerProgressById, useTrainingMetrics } from "./useTrainings";

/**
 * Custom hook to manage player metrics data with optimized loading
 *
 * @param {string} playerId - ID of the player
 * @param {Object} dateRange - Date range for filtering data
 * @returns {Object} Player metrics data and state
 */
export function usePlayerMetrics(playerId, dateRange = null) {
  const [selectedMetric, setSelectedMetric] = useState("overall");
  const [localDateRange, setLocalDateRange] = useState({
    from: null,
    to: null,
  });

  // Keep localDateRange in sync with dateRange prop
  useEffect(() => {
    if (
      dateRange &&
      (dateRange.from !== localDateRange.from ||
        dateRange.to !== localDateRange.to)
    ) {
      setLocalDateRange(dateRange);
    }
  }, [dateRange, localDateRange.from, localDateRange.to]);
  // Format date range for API requests
  // Use external dateRange if provided (including null values for "Overall")
  const effectiveDateRange = dateRange !== null ? dateRange : localDateRange;

  const formattedDateRange = useMemo(() => {
    // Only include date parameters if dates are actually selected
    const result = {};

    if (effectiveDateRange.from) {
      result.date_from = new Date(effectiveDateRange.from)
        .toISOString()
        .split("T")[0];
    }

    if (effectiveDateRange.to) {
      result.date_to = new Date(effectiveDateRange.to)
        .toISOString()
        .split("T")[0];
    }

    return result;
  }, [effectiveDateRange]);

  // Data fetching hooks - optimized to only fetch the selected metric
  const { data: metrics = [], isLoading: metricsLoading } =
    useTrainingMetrics();
  // Prepare API parameters - only include metric_id if actually selected
  const apiParams = useMemo(() => {
    const params = {
      ...formattedDateRange,
    };

    // Only include metric_id if a metric is actually selected
    if (selectedMetric) {
      params.metric_id = selectedMetric;
    }

    return params;
  }, [formattedDateRange, selectedMetric]);

  const {
    data: playerData,
    isLoading: playerLoading,
    error,
    refetch,
  } = usePlayerProgressById(playerId, apiParams, !!playerId);
  // No automatic selection of metrics
  // User must explicitly select a metric to view data
  useEffect(() => {
    // We removed automatic metric selection to fix the issue with default metrics
    // being sent in API requests. The user needs to manually select a metric now.
  }, []);  // Find the selected metric's data
  const selectedMetricData = useMemo(() => {
    if (!playerData?.metrics_data || !Array.isArray(playerData.metrics_data)) {
      return null;
    }

    // Look for the selected metric in metrics_data array (works for both overall and specific metrics)
    return playerData.metrics_data.find(
      (m) => String(m.metric_id) === String(selectedMetric)
    );
  }, [playerData, selectedMetric]);

  // Check if we have any metrics data to display
  const hasMetricsData =
    playerData?.metrics_data &&
    Array.isArray(playerData.metrics_data) &&
    playerData.metrics_data.length > 0;  // Check if we have any data points for the selected metric
  const hasDataPoints = useMemo(() => {
    return selectedMetricData?.data_points &&
           Array.isArray(selectedMetricData.data_points) &&
           selectedMetricData.data_points.length > 0;
  }, [selectedMetricData]);

  const handleDateChange = (newDateRange) => {
    setLocalDateRange(newDateRange);
  };

  const handleMetricChange = (newMetric) => {
    setSelectedMetric(newMetric);
  };

  return {
    // Data
    playerData,
    metrics,
    selectedMetric,
    selectedMetricData,
    effectiveDateRange,

    // State flags
    isLoading: playerLoading || metricsLoading,
    error,
    hasMetricsData,
    hasDataPoints,

    // Actions
    setSelectedMetric: handleMetricChange,
    handleDateChange,
    refetchData: refetch,
  };
}
