// Dashboard API service for frontend
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from './index';

export const dashboardService = {
  // Admin endpoints
  getAdminOverview: () => api.get('dashboard/admin_overview/'),
  getAdminAnalytics: () => api.get('dashboard/admin_analytics/'),

  // Coach endpoints
  getCoachOverview: () => api.get('dashboard/coach_overview/'),
  getCoachPlayerProgress: () => api.get('dashboard/coach_player_progress/'),

  // Player endpoints
  getPlayerOverview: () => api.get('dashboard/player_overview/'),
  getPlayerProgress: () => api.get('dashboard/player_progress/'),
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
          dashboardService.getCoachPlayerProgress(),
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

export const useCoachPlayerProgress = () => {
  return useQuery({
    queryKey: ['coach', 'player-progress'],
    queryFn: async () => {
      const response = await dashboardService.getCoachPlayerProgress();
      return response.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
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
