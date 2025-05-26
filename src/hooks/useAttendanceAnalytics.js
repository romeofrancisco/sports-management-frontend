import { useQuery } from "@tanstack/react-query";
import {
  fetchAttendanceOverview,
  fetchAttendanceTrends,
  fetchAttendanceHeatmap,
  fetchPlayerAttendanceAnalytics,
  fetchPlayerAttendanceDetail,
} from "@/api/attendanceAnalyticsApi";

export const useAttendanceOverview = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["attendance-overview", filters],
    queryFn: () => fetchAttendanceOverview(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const useAttendanceTrends = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["attendance-trends", filters],
    queryFn: () => fetchAttendanceTrends(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const useAttendanceHeatmap = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["attendance-heatmap", filters],
    queryFn: () => fetchAttendanceHeatmap(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const usePlayerAttendanceAnalytics = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["player-attendance-analytics", filters],
    queryFn: () => fetchPlayerAttendanceAnalytics(filters),
    enabled: options?.enabled !== false,
    keepPreviousData: true,
    ...options,
  });
};

export const usePlayerAttendanceDetail = (playerId, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["player-attendance-detail", playerId, filters],
    queryFn: () => fetchPlayerAttendanceDetail(playerId, filters),
    enabled: options?.enabled !== false && !!playerId,
    keepPreviousData: true,
    ...options,
  });
};
