import api from ".";

// Helper function to clean API parameters
const cleanParams = (params = {}) => {
  const cleanedParams = {};

  for (const [key, value] of Object.entries(params)) {
    // Skip special values used for "all" options
    if (
      value === "all_teams" ||
      value === "all_types" ||
      value === "all_players"
    ) {
      continue;
    }

    // Only include parameters with meaningful values
    if (value !== undefined && value !== null && value !== "") {
      // Ensure numeric IDs for foreign keys
      if (key === "team" || key === "coach" || key === "player") {
        // If it's a numeric string, convert to number for foreign keys
        if (!isNaN(value) && typeof value === "string") {
          cleanedParams[key] = parseInt(value, 10);
        } else if (value !== "all_teams" && value !== "") {
          cleanedParams[key] = value;
        }
      } else {
        cleanedParams[key] = value;
      }
    }
  }  return cleanedParams;
};

// Helper function to wrap API calls with consistent error handling
const handleApiCall = async (apiCall) => {
  try {
    const { data } = await apiCall();
    return data;
  } catch (error) {
    throw error;
  }
};

// Utility function to format unit display
export const formatMetricUnit = (metric) => {  if (!metric || !metric.metric_unit) return "-";
  return `${metric.metric_unit.name} (×${metric.metric_unit.normalization_weight})`;
};

// Utility function to normalize improvement percentage
export const normalizeImprovement = (improvement, metric) => {  if (improvement === null || improvement === undefined) return null;
  if (!metric.metric_unit) return improvement;
  return improvement * (parseFloat(metric.metric_unit.normalization_weight) || 1.0);
};

// Metric Units
export const fetchMetricUnits = async (params = {}) => 
  handleApiCall(() => api.get("trainings/metric-units/", { params: cleanParams(params) }));

export const fetchMetricUnit = async (id) => 
  handleApiCall(() => api.get(`trainings/metric-units/${id}/`));

export const createMetricUnit = async (unitData) => 
  handleApiCall(() => api.post("trainings/metric-units/", unitData));

export const updateMetricUnit = async ({ id, ...unitData }) => 
  handleApiCall(() => api.patch(`trainings/metric-units/${id}/`, unitData));

export const deleteMetricUnit = async (id) => 
  handleApiCall(() => api.delete(`trainings/metric-units/${id}/`));

// Training Categories
export const fetchTrainingCategories = async () => 
  handleApiCall(() => api.get("trainings/categories/"));

export const fetchTrainingCategory = async (id) => 
  handleApiCall(() => api.get(`trainings/categories/${id}/`));

export const createTrainingCategory = async (categoryData) => 
  handleApiCall(() => api.post("trainings/categories/", categoryData));

export const updateTrainingCategory = async ({ id, ...categoryData }) => 
  handleApiCall(() => api.patch(`trainings/categories/${id}/`, categoryData));

export const deleteTrainingCategory = async (id) => 
  handleApiCall(() => api.delete(`trainings/categories/${id}/`));

// Training Metrics
export const fetchTrainingMetrics = async (params = {}) => 
  handleApiCall(() => api.get("trainings/metrics/", { params: cleanParams(params) }));

export const fetchTrainingMetric = async (id) => 
  handleApiCall(() => api.get(`trainings/metrics/${id}/`));

export const createTrainingMetric = async (metricData) => 
  handleApiCall(() => api.post("trainings/metrics/", metricData));

export const updateTrainingMetric = async ({ id, ...metricData }) => 
  handleApiCall(() => api.patch(`trainings/metrics/${id}/`, metricData));

export const deleteTrainingMetric = async (id) => 
  handleApiCall(() => api.delete(`trainings/metrics/${id}/`));

// Training Sessions
export const fetchTrainingSessions = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/sessions/", { params });
    return data;
  } catch (error) {
    console.error(
      "Error fetching training sessions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTrainingSession = async (id) => 
  handleApiCall(() => api.get(`trainings/sessions/${id}/`));

export const createTrainingSession = async (sessionData) => 
  handleApiCall(() => api.post("trainings/sessions/", sessionData));

export const updateTrainingSession = async ({ id, ...sessionData }) => 
  handleApiCall(() => api.patch(`trainings/sessions/${id}/`, sessionData));

export const deleteTrainingSession = async (id) => 
  handleApiCall(() => api.delete(`trainings/sessions/${id}/`));

export const addPlayersToSession = async ({ id, ...requestData }) => 
  handleApiCall(() => api.post(`trainings/sessions/${id}/add_players/`, requestData));

export const fetchSessionAnalytics = async (id) => 
  handleApiCall(() => api.get(`trainings/sessions/${id}/analytics/`));

export const startTrainingSession = async (id) => 
  handleApiCall(() => api.post(`trainings/sessions/${id}/start_training/`));

export const endTrainingSession = async (id) => 
  handleApiCall(() => api.post(`trainings/sessions/${id}/end_training/`));

// Player Trainings
export const fetchPlayerTrainings = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/player-trainings/", {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerTraining = async (id) => {
  try {
    const { data } = await api.get(`trainings/player-trainings/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPlayerTraining = async (trainingData) => {
  try {
    const { data } = await api.post(
      "trainings/player-trainings/",
      trainingData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePlayerTraining = async ({ id, ...trainingData }) => {
  try {
    const { data } = await api.patch(
      `trainings/player-trainings/${id}/`,
      trainingData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deletePlayerTraining = async (id) => {
  try {
    const { data } = await api.delete(`trainings/player-trainings/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const recordPlayerMetrics = async ({ id, ...metricsData }) => {
  try {
    const { data } = await api.post(
      `trainings/player-trainings/${id}/record_metrics/`,
      metricsData
    );
    return {
      ...data,
      playerTrainingId: id
    };
  } catch (error) {
    throw error;
  }
};

export const fetchPreviousRecords = async (id) => {
  try {
    const { data } = await api.get(
      `trainings/player-trainings/${id}/previous_records/`
    );
    return data.previous_records || [];
  } catch (error) {
    throw error;
  }
};

// Player Progress
export const fetchPlayerProgress = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/player-progress/", {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerProgressById = async ({ id, ...params }) => {
  try {
    const { data } = await api.get(`trainings/player-progress/${id}/`, {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMultiPlayerProgress = async ({ playerIds = [], teamSlug = null, ...params }) => {
  try {
    // Use either player IDs, team slug, or both
    if (!teamSlug && (!playerIds || playerIds.length === 0)) {
      throw new Error("Either team slug or player IDs must be provided");
    }    // Prepare query parameters
    const queryParams = {
      team: teamSlug,
    };
    
    // Only add metric_id if it's provided
    if (params.metric) {
      queryParams.metric_id = params.metric;
    }
    
    // Only add date filters if they're provided
    if (params.date_from) {
      queryParams.date_from = params.date_from;
    }
    
    if (params.date_to) {
      queryParams.date_to = params.date_to;
    }
    
    // Only add player_ids if they're provided and not empty
    if (playerIds && playerIds.length > 0) {
      queryParams.player_ids = playerIds.join(',');
    }
    
    // Use GET request with query parameters
    const { data } = await api.get("trainings/player-progress/multi_player/", {
      params: queryParams
    });
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const assignMetricsToSession = async ({ sessionId, metricIds }) => {
  try {
    const { data } = await api.post(`trainings/sessions/${sessionId}/assign_metrics/`, {
      metrics: metricIds
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const assignMetricsToPlayerTraining = async ({ playerTrainingId, metricIds }) => {
  try {
    const { data } = await api.post(`trainings/player-trainings/${playerTrainingId}/assign_metrics/`, {
      metrics: metricIds
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePlayerAttendance = async ({ trainingId, attendance_status, notes }) => {
  try {
    const { data } = await api.patch(
      `trainings/player-trainings/${trainingId}/update_attendance/`,
      { 
        attendance_status: attendance_status || 'present',
        notes: notes || ''
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const bulkUpdateAttendance = async ({ sessionId, playerRecords }) => {
  try {
    const { data } = await api.post(
      `trainings/player-trainings/bulk_update_attendance/`,
      { 
        sessionId, 
        playerRecords 
      }
    );
    return data;
  } catch (error) {
    console.error("Bulk update error:", error.response?.data || error);
    throw error;
  }
};

// Player Radar Chart API
export const getPlayerRadarChartData = async (playerId, dateRange = {}) => {
  const params = {
    player_id: playerId,
    // Format dates to YYYY-MM-DD format that backend expects
    ...(dateRange.from && { 
      date_from: new Date(dateRange.from).toISOString().split('T')[0] 
    }),
    ...(dateRange.to && { 
      date_to: new Date(dateRange.to).toISOString().split('T')[0] 
    })
  };

  return handleApiCall(() => 
    api.get('trainings/player-progress/player_radar_chart/', { params })
  );
};

export const assignMetricsToPlayersInSession = async ({ sessionId, playerIds, metricIds }) => {
  try {
    const { data } = await api.post(`trainings/sessions/${sessionId}/assign_metrics_to_players/`, {
      player_ids: playerIds,
      metric_ids: metricIds
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const assignMetricsToSinglePlayer = async ({ sessionId, playerId, metricIds }) => {
  try {
    const { data } = await api.post(`trainings/sessions/${sessionId}/assign_metrics_to_single_player/`, {
      player_id: playerId,
      metric_ids: metricIds
    });
    return data;
  } catch (error) {
    throw error;
  }
};
