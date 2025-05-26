import api from ".";

export const fetchAttendanceOverview = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/attendance-analytics/overview/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAttendanceTrends = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/attendance-analytics/trends/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAttendanceHeatmap = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/attendance-analytics/heatmap/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerAttendanceAnalytics = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/attendance-analytics/players/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerAttendanceDetail = async (playerId, filters = {}) => {
  try {
    const { data } = await api.get("trainings/attendance-analytics/player_detail/", { 
      params: { ...filters, player_id: playerId }
    });
    return data;
  } catch (error) {
    throw error;
  }
};
