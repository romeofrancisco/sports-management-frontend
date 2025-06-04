import api from ".";

export const fetchTeamOverviewMetrics = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/team-analytics/health_metrics/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchTrainingEffectiveness = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/team-analytics/training_effectiveness/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchWeeklyAggregation = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/team-analytics/weekly_aggregation/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchPerformanceSummary = async (filters = {}) => {
  try {
    const { data } = await api.get("trainings/team-analytics/performance_summary/", { 
      params: filters 
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Combined analytics for dashboard use
export const fetchDashboardAnalytics = async (filters = {}) => {
  try {
    const [overviewMetrics, effectiveness, summary] = await Promise.all([
      fetchTeamOverviewMetrics(filters),
      fetchTrainingEffectiveness(filters),
      fetchPerformanceSummary(filters)
    ]);
    
    return {
      overviewMetrics,
      trainingEffectiveness: effectiveness,
      performanceSummary: summary
    };  } catch (error) {
    throw error;
  }
};
