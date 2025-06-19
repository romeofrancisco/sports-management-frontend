/**
 * Utility functions for transforming session data to match SessionCard format
 */

/**
 * Transform a single session data object to match SessionCard format
 * @param {Object} sessionData - Raw session data from API
 * @returns {Object} Transformed session group object
 */
export const transformSessionData = (sessionData) => {
  return {
    // Session info
    session: {
      id: sessionData.session,
      title: sessionData.session_title,
      date: sessionData.session_date,
      start_time: sessionData.session_start_time,
      end_time: sessionData.session_end_time,
      location: sessionData.session_location,
      status: sessionData.session_status,
      description: sessionData.session_description,
    },
    // Transform assigned metrics with their records
    metrics: sessionData.assigned_metrics?.map(assignedMetric => {
      // Find the corresponding metric record
      const metricRecord = sessionData.metric_records?.find(
        record => record.metric === assignedMetric.id
      );
      
      return {
        id: assignedMetric.id,
        metric_name: assignedMetric.name,
        metric_description: assignedMetric.description,
        metric_category: assignedMetric.category_name,
        metric_unit: {
          code: metricRecord?.metric_unit_code || assignedMetric.metric_unit_data?.code,
          name: metricRecord?.metric_unit_name || assignedMetric.metric_unit_data?.name,
        },
        is_lower_better: assignedMetric.is_lower_better,
        weight: assignedMetric.weight,
        // Status based on recording and session status
        status: metricRecord?.value !== null && metricRecord?.value !== undefined ? "completed" : 
               sessionData.session_status === "completed" ? "missed" :
               sessionData.session_status === "in_progress" ? "in_progress" : "assigned",
        is_recorded: metricRecord?.value !== null && metricRecord?.value !== undefined,
        recorded_value: metricRecord?.value,
        recorded_at: metricRecord?.recorded_at,
        recorded_by: metricRecord?.recorded_by,
        notes: metricRecord?.notes || "",
        // Improvement data from the backend calculation
        improvement_from_last: metricRecord?.improvement_from_last,
        improvement_percentage: metricRecord?.improvement_percentage,
        // Include session info for individual metric cards
        session_title: sessionData.session_title,
        session_date: sessionData.session_date,
        session_start_time: sessionData.session_start_time,
        session_end_time: sessionData.session_end_time,
        session_location: sessionData.session_location,
        session_status: sessionData.session_status,
        attendance_status: sessionData.attendance_status,
      };
    }) || [],
    // Session metadata
    attendance_status: sessionData.attendance_status,
    completion_status: sessionData.metrics_completion_status,
    can_record_metrics: sessionData.can_record_metrics,
  };
};

/**
 * Transform multiple session data objects to match SessionCard format
 * @param {Array} sessionsData - Array of raw session data from API
 * @returns {Array} Array of transformed session group objects
 */
export const transformSessionsData = (sessionsData) => {
  if (!Array.isArray(sessionsData)) {
    return [];
  }
  
  return sessionsData.map(sessionData => transformSessionData(sessionData));
};
