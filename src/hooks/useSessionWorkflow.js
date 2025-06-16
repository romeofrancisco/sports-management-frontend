import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Target, User, BarChart3 } from "lucide-react";

export const useSessionWorkflow = (sessionId, sessionDetails) => {
  const location = useLocation();
  const navigate = useNavigate();
    const getCurrentPage = useCallback(() => {
    const path = location.pathname;
    if (path.includes("/session-metrics")) return "session-metrics";
    if (path.includes("/player-metrics")) return "player-metrics";
    if (path.includes("/attendance")) return "attendance";
    if (path.includes("/record-metrics")) return "record-metrics";
    return "session-metrics";
  }, [location.pathname]);

  const currentPage = getCurrentPage();  const getWorkflowProgress = useCallback(() => {
    if (!sessionDetails) return { progress: 0, currentStep: 1, steps: [] };

    // Get all players for validation first
    const allPlayers = sessionDetails.player_records || [];

    const attendanceCompleted =
      sessionDetails.player_records?.some(
        (record) => record.attendance_status !== "pending"
      ) || false;

    // Check if ALL players have their attendance marked (no pending players)
    const allPlayersAttendanceMarked = allPlayers.length > 0 && allPlayers.every(
      (record) => record.attendance_status !== "pending"
    );

    // Enhanced metrics completion tracking
    const presentPlayers =
      sessionDetails.player_records?.filter(
        (record) =>
          record.attendance_status === "present" ||
          record.attendance_status === "late"
      ) || [];

    const sessionMetricsConfigured =
      presentPlayers.length > 0 &&
      presentPlayers.every(
        (record) => record.metric_records && record.metric_records.length > 0
      );

    const playerMetricsConfigured =
      sessionDetails.player_records?.some(
        (record) => record.metric_records && record.metric_records.length > 0
      ) || false;
    
    const metricsConfigured = sessionMetricsConfigured || playerMetricsConfigured;

    // Check if ALL players have at least one metric assigned
    const allPlayersHaveMetrics = allPlayers.length > 0 && allPlayers.every(
      (record) => record.metric_records && record.metric_records.length > 0
    );    // Check if session date is today (using local date, not UTC)
    const sessionDate = sessionDetails.date;
    const today = new Date();
    const localToday = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
    const isSessionToday = sessionDate === localToday;// Validation for attendance step - only require metrics for navigation
    const canNavigateToAttendance = allPlayersHaveMetrics;
    
    // Separate validation for actually marking attendance
    const canMarkAttendance = allPlayersHaveMetrics && isSessionToday;    // Validation for record-metrics step - require metrics + all attendance marked
    const canNavigateToRecordMetrics = metricsConfigured && allPlayersAttendanceMarked;

    const metricsRecorded =
      sessionDetails.player_records?.some(
        (record) => record.metric_records && record.metric_records.length > 0
      ) || false;// Define step order for sequential completion
    const stepOrder = ["session-metrics", "player-metrics", "attendance", "record-metrics"];
    const currentPageIndex = stepOrder.indexOf(currentPage);
    
    const steps = [
      {
        id: "session-metrics",
        title: "Session Metrics",
        description: "Configure metrics for all players",
        completed: currentPageIndex > 0,
        current: currentPage === "session-metrics",
        icon: Target,
        path: `/sessions/${sessionId}/manage/session-metrics`,
      },
      {
        id: "player-metrics",
        title: "Player-Specific Metrics",
        description: "Assign metrics to individual players",
        completed: playerMetricsConfigured && currentPageIndex > 1,
        current: currentPage === "player-metrics",
        icon: User,
        path: `/sessions/${sessionId}/manage/player-metrics`,
      },      {
        id: "attendance",
        title: "Mark Attendance",
        description: "Identify which players are present",
        completed: attendanceCompleted && currentPageIndex > 2,
        current: currentPage === "attendance",
        icon: Users,
        path: `/sessions/${sessionId}/manage/attendance`,
        disabled: !canNavigateToAttendance && currentPage !== "attendance",
        validationMessage: !canNavigateToAttendance ? 
          "All players must have metrics assigned before accessing attendance" : 
          (!isSessionToday ? "Attendance can only be marked on the session date" : undefined),
        canMarkAttendance: canMarkAttendance, // Additional property for the attendance component
      },      {
        id: "record-metrics",
        title: "Record Performance",
        description: "Record individual player metrics",
        completed: metricsRecorded && currentPageIndex > 3,
        current: currentPage === "record-metrics",
        icon: BarChart3,
        path: `/sessions/${sessionId}/manage/record-metrics`,
        disabled: !canNavigateToRecordMetrics && currentPage !== "record-metrics",
        validationMessage: !canNavigateToRecordMetrics ? 
          (!metricsConfigured ? "Metrics must be configured before recording performance" : 
           !allPlayersAttendanceMarked ? "All players must have their attendance marked" : undefined) : undefined,
      },
    ];

    const completedSteps = steps.filter((step) => step.completed).length;
    const currentStepIndex = steps.findIndex((step) => !step.completed);

    return {
      progress: (completedSteps / steps.length) * 100,
      currentStep: currentStepIndex === -1 ? steps.length : currentStepIndex + 1,
      steps,
      allCompleted: completedSteps === steps.length,
    };
  }, [sessionDetails, currentPage, sessionId]);  const handleAutoAdvance = useCallback(() => {
    // For session-metrics step, navigate to player-metrics
    if (currentPage === "session-metrics") {
      const nextPath = `/sessions/${sessionId}/manage/player-metrics`;
      navigate(nextPath);
      return;
    }    // For player-metrics step, check validation before proceeding to attendance
    if (currentPage === "player-metrics") {
      const workflowData = getWorkflowProgress();
      const attendanceStep = workflowData.steps.find(step => step.id === "attendance");
      
      if (attendanceStep && attendanceStep.disabled) {
        // Don't auto-advance if attendance step is disabled due to validation
        return;
      }
      
      const nextPath = `/sessions/${sessionId}/manage/attendance`;
      navigate(nextPath);
      return;
    }    // For attendance step, check validation before proceeding to record-metrics
    if (currentPage === "attendance") {
      // When auto-advancing from attendance, we can assume attendance was just saved
      // So we should proceed to record-metrics if metrics are configured
      const workflowData = getWorkflowProgress();
      const recordMetricsStep = workflowData.steps.find(step => step.id === "record-metrics");
      
      // Check if metrics are configured (the main requirement for record-metrics)
      const metricsConfigured = sessionDetails?.player_records?.some(
        (record) => record.metric_records && record.metric_records.length > 0
      ) || false;
      
      if (!metricsConfigured) {
        // Don't auto-advance if no metrics are configured
        return;
      }
      
      const nextPath = `/sessions/${sessionId}/manage/record-metrics`;
      navigate(nextPath);
      return;
    }

    // For other steps, use the workflow logic
    const workflowData = getWorkflowProgress();
    const currentIndex = workflowData.steps.findIndex((step) => step.current);
    const nextStep = workflowData.steps[currentIndex + 1];

    if (nextStep && !nextStep.disabled) {
      navigate(nextStep.path);
    }
  }, [currentPage, sessionId, navigate, getWorkflowProgress]);

  const handleStepNavigation = useCallback((step) => {
    navigate(step.path);
  }, [navigate]);

  return {
    currentPage,
    workflowData: getWorkflowProgress(),
    handleAutoAdvance,
    handleStepNavigation,
  };
};
