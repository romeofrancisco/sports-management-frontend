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
  }
  return cleanedParams;
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
export const fetchMetricUnits = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/metric-units/", {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMetricUnit = async (id) => {
  try {
    const { data } = await api.get(`trainings/metric-units/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createMetricUnit = async (unitData) => {
  try {
    const { data } = await api.post("trainings/metric-units/", unitData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateMetricUnit = async ({ id, ...unitData }) => {
  try {
    const { data } = await api.patch(`trainings/metric-units/${id}/`, unitData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteMetricUnit = async (id) => {
  try {
    const { data } = await api.delete(`trainings/metric-units/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Training Categories
export const fetchTrainingCategories = async () => {
  try {
    const { data } = await api.get("trainings/categories/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTrainingCategory = async (id) => {
  try {
    const { data } = await api.get(`trainings/categories/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTrainingCategory = async (categoryData) => {
  try {
    const { data } = await api.post("trainings/categories/", categoryData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainingCategory = async ({ id, ...categoryData }) => {
  try {
    const { data } = await api.patch(
      `trainings/categories/${id}/`,
      categoryData
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainingCategory = async (id) => {
  try {
    const { data } = await api.delete(`trainings/categories/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Training Metrics
export const fetchTrainingMetrics = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/metrics/", {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTrainingMetric = async (id) => {
  try {
    const { data } = await api.get(`trainings/metrics/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTrainingMetric = async (metricData) => {
  try {
    const { data } = await api.post("trainings/metrics/", metricData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainingMetric = async ({ id, ...metricData }) => {
  try {
    const { data } = await api.patch(`trainings/metrics/${id}/`, metricData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainingMetric = async (id) => {
  try {
    const { data } = await api.delete(`trainings/metrics/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Training Sessions
export const fetchTrainingSessions = async (params = {}) => {
  try {
    try {
      const { data } = await api.get("trainings/sessions/", { params });
      return data;
    } catch (requestError) {
      throw requestError;
    }
  } catch (error) {
    console.error(
      "Error fetching training sessions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTrainingSession = async (id) => {
  try {
    const { data } = await api.get(`trainings/sessions/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTrainingSession = async (sessionData) => {
  try {
    const { data } = await api.post("trainings/sessions/", sessionData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainingSession = async ({ id, ...sessionData }) => {
  try {
    const { data } = await api.patch(`trainings/sessions/${id}/`, sessionData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainingSession = async (id) => {
  try {
    const { data } = await api.delete(`trainings/sessions/${id}/`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addPlayersToSession = async ({ id, ...requestData }) => {
  try {
    const { data } = await api.post(
      `trainings/sessions/${id}/add_players/`,
      requestData
    );
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
    console.log("Sending bulk update request with:", { sessionId, playerRecords });
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

export const fetchSessionAnalytics = async (id) => {
  try {
    const { data } = await api.get(`trainings/sessions/${id}/analytics/`);
    return data;
  } catch (error) {
    throw error;
  }
};

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
