import React from "react";
import WorkflowStepper from "@/components/common/WorkflowStepper";
import ContentRenderer from "./ContentRenderer";

// Memoized components for performance
export const MemoizedWorkflowStepper = React.memo(WorkflowStepper);
export const MemoizedContentRenderer = React.memo(ContentRenderer);

// Component props comparison function for better memoization
export const workflowStepperPropsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.currentStep === nextProps.currentStep &&
    prevProps.steps?.length === nextProps.steps?.length &&
    prevProps.steps?.every((step, index) => {
      const nextStep = nextProps.steps?.[index];
      return (
        step.id === nextStep?.id &&
        step.completed === nextStep?.completed &&
        step.current === nextStep?.current &&
        step.disabled === nextStep?.disabled
      );
    })
  );
};

export const contentRendererPropsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.sessionDetails?.id === nextProps.sessionDetails?.id &&
    prevProps.sessionDetails?.player_records?.length === nextProps.sessionDetails?.player_records?.length
  );
};

// Apply custom comparison functions
MemoizedWorkflowStepper.displayName = 'MemoizedWorkflowStepper';
MemoizedContentRenderer.displayName = 'MemoizedContentRenderer';
