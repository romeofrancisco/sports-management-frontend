import { Users, Target, User, BarChart3 } from "lucide-react";
import { WORKFLOW_STEP_IDS, SESSION_ROUTES } from "@/constants/sessionRoutes";

export const WORKFLOW_CONFIG = {
  steps: [
    {
      id: WORKFLOW_STEP_IDS.SESSION_METRICS,
      title: "Session Metrics",
      description: "Configure metrics for all players",
      icon: Target,
      isOptional: true,
      order: 1,
    },
    {
      id: WORKFLOW_STEP_IDS.PLAYER_METRICS,
      title: "Player-Specific Metrics",
      description: "Assign metrics to individual players",
      icon: User,
      isOptional: false,
      order: 2,
    },
    {
      id: WORKFLOW_STEP_IDS.ATTENDANCE,
      title: "Mark Attendance",
      description: "Identify which players are present",
      icon: Users,
      isOptional: false,
      order: 3,
    },
    {
      id: WORKFLOW_STEP_IDS.RECORD_METRICS,
      title: "Record Performance",
      description: "Record individual player metrics",
      icon: BarChart3,
      isOptional: false,
      order: 4,
    },
  ],

  getStepByOrder: (order) => {
    return WORKFLOW_CONFIG.steps.find(step => step.order === order);
  },

  getNextStep: (currentStepId) => {
    const currentStep = WORKFLOW_CONFIG.steps.find(step => step.id === currentStepId);
    if (!currentStep) return null;
    
    return WORKFLOW_CONFIG.steps.find(step => step.order === currentStep.order + 1);
  },

  getPreviousStep: (currentStepId) => {
    const currentStep = WORKFLOW_CONFIG.steps.find(step => step.id === currentStepId);
    if (!currentStep) return null;
    
    return WORKFLOW_CONFIG.steps.find(step => step.order === currentStep.order - 1);
  },

  getStepRoute: (stepId, sessionId) => {
    return SESSION_ROUTES[stepId.toUpperCase().replace('-', '_')]?.(sessionId);
  },

  isStepRequired: (stepId) => {
    const step = WORKFLOW_CONFIG.steps.find(s => s.id === stepId);
    return step ? !step.isOptional : false;
  },

  canSkipStep: (stepId) => {
    const step = WORKFLOW_CONFIG.steps.find(s => s.id === stepId);
    return step ? step.isOptional : false;
  },
};

export const SESSION_CONFIG = {
  autoAdvanceEnabled: true,
  showProgressBar: true,
  allowSkipOptionalSteps: true,
  
  validation: {
    requireAttendanceBeforeMetrics: true,
    requireMetricsBeforeRecording: true,
  },
};
