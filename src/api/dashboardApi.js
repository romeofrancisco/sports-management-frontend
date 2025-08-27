// Dashboard API service for frontend
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from './index';

export const dashboardService = {
  // Admin endpoints
  getAdminOverview: () => api.get('dashboard/admin_overview/'),
  getAdminAnalytics: () => api.get('dashboard/admin_analytics/'),
  getAdminInsights: (aiEnabled = true) => api.get(`dashboard/admin_insights/?ai=${aiEnabled}`),
  getAdminReports: (reportType) => api.get(`dashboard/admin_reports/?type=${reportType || 'summary'}`),

  // Coach endpoints
  getCoachOverview: () => api.get('dashboard/coach_overview/'),
  getCoachPlayerProgress: (teamSlug = null) => {
    const params = teamSlug ? `?team_slug=${teamSlug}` : '';
    return api.get(`dashboard/coach_player_progress/${params}`);
  },

  // Player endpoints
  getPlayerOverview: () => api.get('dashboard/player_overview/'),
  getPlayerProgress: () => api.get('dashboard/player_progress/'),

  // Admin/Coach access to specific player data (for PlayerDetails component)
  getPlayerOverviewById: (playerId) => api.get(`dashboard/player_overview/?player_id=${playerId}`),
  getPlayerProgressById: (playerId) => api.get(`dashboard/player_progress/?player_id=${playerId}`),

  // New Summary Service Endpoints
  getDashboardSummary: (days = 30) => api.get(`dashboard/dashboard_summary/?days=${days}`),
  getTrainingSummary: (days = 30, weeks = 8) => api.get(`dashboard/training_summary/?days=${days}&weeks=${weeks}`),
  getLeagueSummary: (days = 30, limit = 10) => api.get(`dashboard/league_summary/?days=${days}&limit=${limit}`),
  getGameSummary: (days = 30, weeks = 8, limit = 10) => api.get(`dashboard/game_summary/?days=${days}&weeks=${weeks}&limit=${limit}`),
  getAnalyticsSummary: (days = 30, months = 12, heatmapDays = 30) => api.get(`dashboard/analytics_summary/?days=${days}&months=${months}&heatmap_days=${heatmapDays}`),
  getSystemSummary: (days = 7) => api.get(`dashboard/system_summary/?days=${days}`),
  getChartData: (chartType, days = 30) => api.get(`dashboard/chart_data/?chart_type=${chartType}&days=${days}`),
};

// Role-based dashboard data fetcher
export const getDashboardData = async (userRole) => {
  try {
    switch (userRole?.toLowerCase()) {
      case 'admin':
        const [adminOverview, adminAnalytics] = await Promise.all([
          dashboardService.getAdminOverview(),
          dashboardService.getAdminAnalytics(),
        ]);
        return {
          overview: adminOverview.data,
          analytics: adminAnalytics.data,
          type: 'admin'
        };

      case 'coach':
        const [coachOverview, coachProgress] = await Promise.all([
          dashboardService.getCoachOverview(),
          dashboardService.getCoachPlayerProgress(), // No team parameter = all teams
        ]);
        return {
          overview: coachOverview.data,
          playerProgress: coachProgress.data,
          type: 'coach'
        };

      case 'player':
        const [playerOverview, playerProgress] = await Promise.all([
          dashboardService.getPlayerOverview(),
          dashboardService.getPlayerProgress(),
        ]);
        return {
          overview: playerOverview.data,
          progress: playerProgress.data,
          type: 'player'
        };

      default:
        throw new Error(`Invalid user role: ${userRole}`);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Custom hooks using React Query for better caching and state management
export const useAdminOverview = () => {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const response = await dashboardService.getAdminOverview();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const response = await dashboardService.getAdminAnalytics();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useCoachOverview = () => {
  return useQuery({
    queryKey: ['coach', 'overview'],
    queryFn: async () => {
      const response = await dashboardService.getCoachOverview();
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
  });
};

export const useCoachPlayerProgress = (teamSlug = null) => {
  return useQuery({
    queryKey: ['coach', 'player-progress', teamSlug],
    queryFn: async () => {
      const response = await dashboardService.getCoachPlayerProgress(teamSlug);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

export const usePlayerOverview = () => {
  return useQuery({
    queryKey: ['player', 'overview'],
    queryFn: async () => {
      const response = await dashboardService.getPlayerOverview();
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
  });
};

export const usePlayerProgress = () => {
  return useQuery({
    queryKey: ['player', 'progress'],
    queryFn: async () => {
      const response = await dashboardService.getPlayerProgress();
      return response.data;
    },
  });
};

export const useAdminInsights = (aiEnabled = true) => {
  return useQuery({
    queryKey: ['admin', 'insights', aiEnabled],
    queryFn: async () => {
      const response = await dashboardService.getAdminInsights(aiEnabled);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for AI analysis)
    retry: 2, // Retry up to 2 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    timeout: 30000, // 30 second timeout
    refetchOnWindowFocus: false, // Prevent refetch on window focus for expensive AI calls
  });
};

export const useAdminReports = (reportType = 'summary') => {
  return useQuery({
    queryKey: ['admin', 'reports', reportType],
    queryFn: async () => {
      const response = await dashboardService.getAdminReports(reportType);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!reportType, // Only run if reportType is provided
  });
};

// Admin/Coach hooks for viewing any player's dashboard data
export const usePlayerOverviewById = (playerId, enabled = true) => {
  return useQuery({
    queryKey: ['player', 'overview', playerId],
    queryFn: async () => {
      const response = await dashboardService.getPlayerOverviewById(playerId);
      return response.data;
    },
    enabled: enabled && !!playerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
  });
};

export const usePlayerProgressById = (playerId, enabled = true) => {
  return useQuery({
    queryKey: ['player', 'progress', playerId],
    queryFn: async () => {
      const response = await dashboardService.getPlayerProgressById(playerId);
      return response.data;
    },
    enabled: enabled && !!playerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
  });
};

// Legacy custom hook (keeping for backward compatibility)
export const useDashboardData = (userRole) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getDashboardData(userRole);
      setData(dashboardData);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  React.useEffect(() => {
    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole, fetchDashboardData]);

  const refetch = () => {
    if (userRole) {
      fetchDashboardData();
    }
  };

  return { data, loading, error, refetch };
};

export default dashboardService;
