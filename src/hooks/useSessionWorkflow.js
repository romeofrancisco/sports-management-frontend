import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRolePermissions } from "./useRolePermissions";
import { Users, Target, User, BarChart3 } from "lucide-react";

export const useSessionWorkflow = (sessionId, sessionDetails) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get role permissions
  const { isAdmin } = useRolePermissions();
    const getCurrentPage = useCallback(() => {
    const path = location.pathname;
    if (path.includes("/session-metrics")) return "session-metrics";
    if (path.includes("/player-metrics")) return "player-metrics";
    if (path.includes("/attendance")) return "attendance";
    if (path.includes("/record-metrics")) return "record-metrics";
    return "session-metrics";
  }, [location.pathname]);

  const currentPage = getCurrentPage();  const getWorkflowProgress = useCallback(() => {
    if (!sessionDetails) return { progress: 0, currentStep: 1, steps: [] };    // Check if session is completed and user editing permissions
    const isSessionCompleted = sessionDetails.status === "completed";
    const canEditCompletedSession = isAdmin(); // Only admins can edit completed sessions
    const isFormDisabled = isSessionCompleted && !canEditCompletedSession;
    
    // Navigation can still work for coaches to view completed sessions
    // But form inputs should be disabled for non-admins on completed sessions

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
    const isSessionToday = sessionDate === localToday;    // Validation for attendance step - only require metrics for navigation
    const canNavigateToAttendance = allPlayersHaveMetrics;
    
    // Separate validation for actually marking attendance
    // Admin users can mark attendance anytime, others only on session date
    const canMarkAttendance = allPlayersHaveMetrics && (isAdmin() || isSessionToday);// Validation for record-metrics step - require metrics + all attendance marked
    const canNavigateToRecordMetrics = metricsConfigured && allPlayersAttendanceMarked;

    const metricsRecorded =
      sessionDetails.player_records?.some(
        (record) => record.metric_records && record.metric_records.length > 0
      ) || false;// Define step order for sequential completion
    const stepOrder = ["session-metrics", "player-metrics", "attendance", "record-metrics"];
    const currentPageIndex = stepOrder.indexOf(currentPage);    const steps = [      {
        id: "session-metrics",
        title: "Session Metrics",
        description: "Configure metrics for all players",
        completed: currentPageIndex > 0,
        current: currentPage === "session-metrics",
        icon: Target,
        path: `/sessions/${sessionId}/manage/session-metrics`,
        disabled: false, // Always allow navigation for viewing
        isFormDisabled: isFormDisabled, // But disable form inputs for non-admins on completed sessions
        validationMessage: isFormDisabled ? 
          "Session is completed. Only admins can edit completed sessions." : undefined,
      },
      {
        id: "player-metrics",
        title: "Player-Specific Metrics",
        description: "Assign metrics to individual players",
        completed: playerMetricsConfigured && currentPageIndex > 1,
        current: currentPage === "player-metrics",
        icon: User,
        path: `/sessions/${sessionId}/manage/player-metrics`,
        disabled: false, // Always allow navigation for viewing
        isFormDisabled: isFormDisabled, // But disable form inputs for non-admins on completed sessions
        validationMessage: isFormDisabled ? 
          "Session is completed. Only admins can edit completed sessions." : undefined,
      },{
        id: "attendance",
        title: "Mark Attendance",
        description: "Identify which players are present",
        completed: attendanceCompleted && currentPageIndex > 2,
        current: currentPage === "attendance",
        icon: Users,
        path: `/sessions/${sessionId}/manage/attendance`,
        disabled: (!canNavigateToAttendance && currentPage !== "attendance" && !isSessionCompleted), // Allow navigation if session is completed
        isFormDisabled: isFormDisabled, // Disable form inputs for non-admins on completed sessions
        validationMessage: (!canNavigateToAttendance && !isSessionCompleted) ? 
            "All players must have metrics assigned before accessing attendance" : 
            (isFormDisabled ? 
              "Session is completed. Only admins can edit completed sessions." :
              (!isSessionToday && !isAdmin() && !isSessionCompleted ? "Attendance can only be marked on the session date" : undefined)),
        canMarkAttendance: isFormDisabled ? canEditCompletedSession : canMarkAttendance, // Respect completion status
      },      {
        id: "record-metrics",
        title: "Record Performance",
        description: "Record individual player metrics",
        completed: metricsRecorded && currentPageIndex > 3,
        current: currentPage === "record-metrics",
        icon: BarChart3,
        path: `/sessions/${sessionId}/manage/record-metrics`,
        disabled: (!canNavigateToRecordMetrics && currentPage !== "record-metrics" && !isSessionCompleted), // Allow navigation if session is completed
        isFormDisabled: isFormDisabled, // Disable form inputs for non-admins on completed sessions
        validationMessage: (!canNavigateToRecordMetrics && !isSessionCompleted) ? 
          (!metricsConfigured ? "Metrics must be configured before recording performance" : 
           !allPlayersAttendanceMarked ? "All players must have their attendance marked" : undefined) :
          (isFormDisabled ? 
            "Session is completed. Only admins can edit completed sessions." : undefined),
      },
    ];

    const completedSteps = steps.filter((step) => step.completed).length;
    const currentStepIndex = steps.findIndex((step) => !step.completed);    return {
      progress: (completedSteps / steps.length) * 100,
      currentStep: currentStepIndex === -1 ? steps.length : currentStepIndex + 1,
      steps,
      allCompleted: completedSteps === steps.length,
      isSessionCompleted,
      canEditCompletedSession,
      isFormDisabled,
    };
  }, [sessionDetails, currentPage, sessionId]);  const handleAutoAdvance = useCallback(() => {
    // Check if session is completed and user can edit
    const currentWorkflowData = getWorkflowProgress();
    if (currentWorkflowData.isFormDisabled) {
      // Don't auto-advance for completed sessions unless user is admin
      return;
    }

    // For session-metrics step, navigate to player-metrics
    if (currentPage === "session-metrics") {
      const nextPath = `/sessions/${sessionId}/manage/player-metrics`;
      navigate(nextPath);
      return;
    }    // For player-metrics step, check validation before proceeding to attendance
    if (currentPage === "player-metrics") {
      const playerMetricsWorkflowData = getWorkflowProgress();
      const attendanceStep = playerMetricsWorkflowData.steps.find(step => step.id === "attendance");
      
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
      const attendanceWorkflowData = getWorkflowProgress();
      const recordMetricsStep = attendanceWorkflowData.steps.find(step => step.id === "record-metrics");
      
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
    const finalWorkflowData = getWorkflowProgress();
    const currentIndex = finalWorkflowData.steps.findIndex((step) => step.current);
    const nextStep = finalWorkflowData.steps[currentIndex + 1];

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
