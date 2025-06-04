import { useQuery } from "@tanstack/react-query";
import {
  fetchTeamOverviewMetrics,
  fetchTrainingEffectiveness,
  fetchWeeklyAggregation,
  fetchPerformanceSummary,
  fetchDashboardAnalytics
} from "@/api/teamAnalyticsApi";

export const useTeamOverviewMetrics = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["team-overview-metrics", filters],
    queryFn: () => fetchTeamOverviewMetrics(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const useTrainingEffectiveness = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["training-effectiveness", filters],
    queryFn: () => fetchTrainingEffectiveness(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const useWeeklyAggregation = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["weekly-aggregation", filters],
    queryFn: () => fetchWeeklyAggregation(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const usePerformanceSummary = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["performance-summary", filters],
    queryFn: () => fetchPerformanceSummary(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const useDashboardAnalytics = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["dashboard-analytics", filters],
    queryFn: () => fetchDashboardAnalytics(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
