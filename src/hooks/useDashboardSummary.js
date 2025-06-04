import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboardApi';

export const useDashboardSummary = (days = 30) => {
  return useQuery({
    queryKey: ['dashboard-summary', days],
    queryFn: () => dashboardService.getDashboardSummary(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTrainingSummary = (days = 30, weeks = 8) => {
  return useQuery({
    queryKey: ['training-summary', days, weeks],
    queryFn: () => dashboardService.getTrainingSummary(days, weeks),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useGameSummary = (days = 30, weeks = 8, limit = 10) => {
  return useQuery({
    queryKey: ['game-summary', days, weeks, limit],
    queryFn: () => dashboardService.getGameSummary(days, weeks, limit),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useLeagueSummary = (days = 30, limit = 10) => {
  return useQuery({
    queryKey: ['league-summary', days, limit],
    queryFn: () => dashboardService.getLeagueSummary(days, limit),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useAnalyticsSummary = (days = 30, months = 12, heatmapDays = 30) => {
  return useQuery({
    queryKey: ['analytics-summary', days, months, heatmapDays],
    queryFn: () => dashboardService.getAnalyticsSummary(days, months, heatmapDays),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useSystemSummary = (days = 7) => {
  return useQuery({
    queryKey: ['system-summary', days],
    queryFn: () => dashboardService.getSystemSummary(days),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for system health)
    cacheTime: 5 * 60 * 1000,
  });
};

export const useChartData = (chartType, days = 30) => {
  return useQuery({
    queryKey: ['chart-data', chartType, days],
    queryFn: () => dashboardService.getChartData(chartType, days),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!chartType, // Only run query if chartType is provided
  });
};

// Combined hook for getting all summary data at once
export const useCompleteDashboardSummary = (options = {}) => {
  const {
    days = 30,
    weeks = 8,
    months = 12,
    limit = 10,
    heatmapDays = 30,
    systemDays = 7,
  } = options;

  const systemSummary = useSystemSummary(systemDays);
  const trainingSummary = useTrainingSummary(days, weeks);
  const gameSummary = useGameSummary(days, weeks, limit);
  const leagueSummary = useLeagueSummary(days, limit);
  const analyticsSummary = useAnalyticsSummary(days, months, heatmapDays);

  return {
    systemSummary,
    trainingSummary,
    gameSummary,
    leagueSummary,
    analyticsSummary,
    isLoading: [
      systemSummary.isLoading,
      trainingSummary.isLoading,
      gameSummary.isLoading,
      leagueSummary.isLoading,
      analyticsSummary.isLoading,
    ].some(Boolean),
    isError: [
      systemSummary.isError,
      trainingSummary.isError,
      gameSummary.isError,
      leagueSummary.isError,
      analyticsSummary.isError,
    ].some(Boolean),
    errors: {
      system: systemSummary.error,
      training: trainingSummary.error,
      game: gameSummary.error,
      league: leagueSummary.error,
      analytics: analyticsSummary.error,
    },
  };
};
