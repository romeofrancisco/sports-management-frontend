import { useMemo } from 'react';
import { useTrainingMetrics } from '@/hooks/useTrainings';
import { useMultiPlayerProgress } from '@/hooks/useMultiPlayerProgress';

/**
 * A custom hook that prepares data for the multi-player progress chart.
 * It handles data fetching, transformation, and color generation.
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.players - Array of player objects
 * @param {string} options.teamSlug - Team slug to fetch all players from
 * @param {number|string} options.selectedMetric - Selected metric ID
 * @param {Object} options.dateRange - Date range object with from/to or date_from/date_to
 * @returns {Object} Prepared chart data and related information
 */
export const useMultiPlayerChartData = ({
  players = [],
  teamSlug = null,
  selectedMetric = "overall",  // Default to "overall" metric
  dateRange = null,
  localDateRange = { from: null, to: null }
}) => {
  // Get all available metrics
  const { data: metrics, isLoading: metricsLoading } = useTrainingMetrics();

  // Extract player IDs
  const playerIds = useMemo(() => {
    return players.map((player) => player.user_id || player.id).filter(Boolean);
  }, [players]);
  // Filter params for player progress - use passed dateRange if available
  const filters = useMemo(() => {
    const baseFilters = {
      metric: selectedMetric,
    };

    if (dateRange) {
      // Convert dateRange format (from/to) to API format (date_from/date_to)
      const dateFilters = {};
      
      if (dateRange.from) {
        dateFilters.date_from = new Date(dateRange.from).toISOString().split('T')[0];
      }
      
      if (dateRange.to) {
        dateFilters.date_to = new Date(dateRange.to).toISOString().split('T')[0];
      }
      
      return {
        ...baseFilters,
        ...dateFilters,
      };
    }
    
    // Only include date params if dates are selected
    return {
      ...baseFilters,
      ...(localDateRange.from && localDateRange.to ? {
        date_from: localDateRange.from.toISOString().split('T')[0],
        date_to: localDateRange.to.toISOString().split('T')[0],
      } : {})
    };
  }, [localDateRange, dateRange, selectedMetric]);
  // Selected metric details
  const selectedMetricDetails = useMemo(() => {
    if (!selectedMetric) return null;
    
    // Handle overall metric
    if (selectedMetric === "overall") {
      return {
        id: "overall",
        name: "Overall Performance",
        unit: "%",
        is_lower_better: false
      };
    }
    
    // Handle regular metrics
    if (!metrics) return null;
    return metrics.find((m) => m.id === parseInt(selectedMetric));
  }, [selectedMetric, metrics]);

  // Fetch data for all players in a single API call
  const {
    data: multiPlayerData,
    isLoading: dataLoading,
    error,
  } = useMultiPlayerProgress({
    // Only pass playerIds if players are provided and teamSlug isn't
    ...(players.length > 0 && !teamSlug ? { players } : {}),
    teamSlug,
    filters,
    enabled: !!selectedMetric && (playerIds.length > 0 || !!teamSlug),
  });

  // Generate unique colors for each player
  const playerColors = useMemo(() => {
    const colors = {};
    const baseColors = [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff8042',
      '#0088fe',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#a4de6c',
      '#d0ed57',
    ];

    // If we have multiPlayerData, use it for player IDs
    if (multiPlayerData && multiPlayerData.results) {
      Object.keys(multiPlayerData.results).forEach((playerId, index) => {
        colors[playerId] = baseColors[index % baseColors.length];
      });
    } else {
      players.forEach((player, index) => {
        const playerId = player.user_id || player.id;
        colors[playerId] = baseColors[index % baseColors.length];
      });
    }

    return colors;
  }, [multiPlayerData, players]);
  // Transform query results for chart display
  const chartData = useMemo(() => {
    // Check if we have data and properly extract it from the API response
    if (!selectedMetric || !multiPlayerData || !multiPlayerData.results) return [];

    // Get all unique dates across all players
    const allDates = new Set();
    Object.values(multiPlayerData.results).forEach((player) => {
      if (player.metrics_data && player.metrics_data.length > 0) {
        const metricData = player.metrics_data.find(
          (m) => m.metric_id === selectedMetric || m.metric_id === parseInt(selectedMetric)
        );
        metricData?.data_points?.forEach((dataPoint) => {
          allDates.add(dataPoint.date);
        });
      }
    });

    // Create empty data structure with all dates
    const dateArray = [...allDates].sort((a, b) => new Date(a) - new Date(b));
    const formattedData = dateArray.map((date) => {
      const dataPoint = { date: new Date(date).toLocaleDateString() };

      // For each player, find data for this date
      Object.entries(multiPlayerData.results).forEach(([playerId, player]) => {
        if (player.metrics_data && player.metrics_data.length > 0) {
          const metricData = player.metrics_data.find(
            (m) => m.metric_id === selectedMetric || m.metric_id === parseInt(selectedMetric)
          );
          const record = metricData?.data_points?.find((r) => r.date === date);
          dataPoint[playerId] = record ? record.value : null;
        } else {
          dataPoint[playerId] = null;
        }
      });

      return dataPoint;
    });

    return formattedData;
  }, [multiPlayerData, selectedMetric]);

  // Loading state
  const isLoading = metricsLoading || dataLoading;

  return {
    metrics,
    chartData,
    playerColors,
    multiPlayerData,
    selectedMetricDetails,
    isLoading,
    metricsLoading,
    dataLoading,
    error,
  };
};

export default useMultiPlayerChartData;
