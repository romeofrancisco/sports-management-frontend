import { useState, useEffect, useMemo } from 'react';
import { useTeamTrainingAnalyticsById, useTrainingMetrics } from './useTrainings';

/**
 * Custom hook to manage team metrics data with optimized loading
 * 
 * @param {string} teamId - ID of the team
 * @param {Object} dateRange - Date range for filtering data
 * @returns {Object} Team metrics data and state
 */
export function useTeamMetrics(teamId, dateRange = null) {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [localDateRange, setLocalDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  // Keep localDateRange in sync with dateRange prop
  useEffect(() => {
    if (
      dateRange &&
      dateRange.from &&
      dateRange.to &&
      (dateRange.from !== localDateRange.from ||
        dateRange.to !== localDateRange.to)
    ) {
      setLocalDateRange(dateRange);
    }
  }, [dateRange]);

  // Format date range for API requests
  const effectiveDateRange =
    dateRange?.from && dateRange?.to ? dateRange : localDateRange;
  
  const formattedDateRange = useMemo(
    () => ({
      date_from: effectiveDateRange.from
        ? new Date(effectiveDateRange.from).toISOString().split('T')[0]
        : undefined,
      date_to: effectiveDateRange.to
        ? new Date(effectiveDateRange.to).toISOString().split('T')[0]
        : undefined,
    }),
    [effectiveDateRange]
  );

  // Data fetching hooks - optimized to only fetch the selected metric
  const { data: metrics = [], isLoading: metricsLoading } = useTrainingMetrics();
  
  const {
    data: teamData,
    isLoading: teamDataLoading,
    error,
    refetch,
  } = useTeamTrainingAnalyticsById(
    teamId,
    {
      ...formattedDateRange,
      metric_id: selectedMetric,
    },
    !!teamId
  );

  // Auto-select first metric if none is selected yet
  useEffect(() => {
    if (!selectedMetric && metrics && metrics.length > 0) {
      setSelectedMetric(metrics[0].id.toString());
    }
  }, [selectedMetric, metrics]);

  // Check if we have player metrics summary data
  const hasMetricsData = useMemo(() => 
    teamData?.player_metrics_summary && 
    Array.isArray(teamData.player_metrics_summary) && 
    teamData.player_metrics_summary.length > 0,
  [teamData]);

  // Check if we have attendance data
  const hasAttendanceData = useMemo(() => 
    teamData?.attendance_rate && 
    Object.keys(teamData.attendance_rate).length > 0,
  [teamData]);

  const handleDateChange = (newDateRange) => {
    setLocalDateRange(newDateRange);
  };

  const handleMetricChange = (newMetric) => {
    setSelectedMetric(newMetric);
  };

  return {
    // Data
    teamData,
    metrics,
    selectedMetric,
    effectiveDateRange,
    
    // State flags
    isLoading: teamDataLoading || metricsLoading,
    error,
    hasMetricsData,
    hasAttendanceData,
    
    // Actions
    setSelectedMetric: handleMetricChange,
    handleDateChange,
    refetchData: refetch,
  };
}
