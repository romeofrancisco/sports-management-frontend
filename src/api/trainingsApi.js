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
    return data;
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

// Team Analytics
export const fetchTeamTrainingAnalytics = async (params = {}) => {
  try {
    const { data } = await api.get("trainings/team-analytics/", {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamTrainingAnalyticsById = async ({ id, ...params }) => {
  try {
    const { data } = await api.get(`trainings/team-analytics/${id}/`, {
      params: cleanParams(params),
    });
    return data;
  } catch (error) {
    throw error;
  }
};
