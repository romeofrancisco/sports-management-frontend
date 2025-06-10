import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Target, User, BarChart3 } from "lucide-react";

export const useSessionWorkflow = (sessionId, sessionDetails) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getCurrentPage = useCallback(() => {
    const path = location.pathname;
    if (path.includes("/attendance")) return "attendance";
    if (path.includes("/session-metrics")) return "session-metrics";
    if (path.includes("/player-metrics")) return "player-metrics";
    if (path.includes("/record-metrics")) return "record-metrics";
    return "attendance";
  }, [location.pathname]);

  const currentPage = getCurrentPage();

  const getWorkflowProgress = useCallback(() => {
    if (!sessionDetails) return { progress: 0, currentStep: 1, steps: [] };

    const attendanceCompleted =
      sessionDetails.player_records?.some(
        (record) => record.attendance_status !== "pending"
      ) || false;

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

    const metricsRecorded =
      sessionDetails.player_records?.some(
        (record) => record.metric_records && record.metric_records.length > 0
      ) || false;

    // Define step order for sequential completion
    const stepOrder = ["attendance", "session-metrics", "player-metrics", "record-metrics"];
    const currentPageIndex = stepOrder.indexOf(currentPage);
    
    const steps = [
      {
        id: "attendance",
        title: "Mark Attendance",
        description: "Identify which players are present",
        completed: attendanceCompleted && currentPageIndex > 0,
        current: currentPage === "attendance",
        icon: Users,
        path: `/sessions/${sessionId}/manage/attendance`,
      },
      {
        id: "session-metrics",
        title: "Session Metrics",
        description: "Configure metrics for all players",
        completed: currentPageIndex > 1,
        current: currentPage === "session-metrics",
        icon: Target,
        path: `/sessions/${sessionId}/manage/session-metrics`,
        disabled: !attendanceCompleted && currentPage !== "session-metrics",
      },
      {
        id: "player-metrics",
        title: "Player-Specific Metrics",
        description: "Assign metrics to individual players",
        completed: playerMetricsConfigured && currentPageIndex > 2,
        current: currentPage === "player-metrics",
        icon: User,
        path: `/sessions/${sessionId}/manage/player-metrics`,
        disabled: !attendanceCompleted && currentPage !== "player-metrics",
      },
      {
        id: "record-metrics",
        title: "Record Performance",
        description: "Record individual player metrics",
        completed: metricsRecorded && currentPageIndex > 3,
        current: currentPage === "record-metrics",
        icon: BarChart3,
        path: `/sessions/${sessionId}/manage/record-metrics`,
        disabled:
          (!attendanceCompleted || !metricsConfigured) &&
          currentPage !== "record-metrics",
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
  }, [sessionDetails, currentPage, sessionId]);

  const handleAutoAdvance = useCallback(() => {
    // For attendance step, navigate to session-metrics
    if (currentPage === "attendance") {
      const nextPath = `/sessions/${sessionId}/manage/session-metrics`;
      navigate(nextPath);
      return;
    }

    // For session-metrics step, navigate to player-metrics
    if (currentPage === "session-metrics") {
      const nextPath = `/sessions/${sessionId}/manage/player-metrics`;
      navigate(nextPath);
      return;
    }

    // For player-metrics step, navigate to record-metrics
    if (currentPage === "player-metrics") {
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
