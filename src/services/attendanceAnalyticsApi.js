// Attendance Analytics API Service
import api from './api';

export const attendanceAnalyticsApi = {
  // Get attendance overview analytics
  getAttendanceOverview: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.team_id) params.append('team_id', filters.team_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    const response = await api.get(`/trainings/attendance-analytics/overview/?${params}`);
    return response.data;
  },

  // Get attendance trends data
  getAttendanceTrends: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.team_id) params.append('team_id', filters.team_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.period) params.append('period', filters.period); // daily, weekly, monthly
    
    const response = await api.get(`/trainings/attendance-analytics/trends/?${params}`);
    return response.data;
  },

  // Get attendance heatmap data
  getAttendanceHeatmap: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.team_id) params.append('team_id', filters.team_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    const response = await api.get(`/trainings/attendance-analytics/heatmap/?${params}`);
    return response.data;
  },

  // Get individual player attendance analytics
  getPlayerAttendanceAnalytics: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.team_id) params.append('team_id', filters.team_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    const response = await api.get(`/trainings/attendance-analytics/players/?${params}`);
    return response.data;
  },
};

export default attendanceAnalyticsApi;
