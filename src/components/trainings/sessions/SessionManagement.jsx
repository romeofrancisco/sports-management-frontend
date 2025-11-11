import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import WorkflowStepper from "@/components/common/WorkflowStepper";
import {
  useTrainingSessionWorkflow,
  useEndTrainingSession,
} from "@/hooks/useTrainings";
import { useSessionWorkflow } from "@/hooks/useSessionWorkflow";
import { useSessionStatus } from "@/hooks/useSessionStatus";
import { toast } from "sonner";

// Import components
import SessionHeader from "./components/SessionHeader";
import ContentRenderer from "./components/ContentRenderer";
import SessionErrorBoundary from "./components/SessionErrorBoundary";
import FullPageLoading from "@/components/common/FullPageLoading";

// Memoized components for performance
const MemoizedWorkflowStepper = React.memo(WorkflowStepper);
const MemoizedContentRenderer = React.memo(ContentRenderer);

const SessionManagement = () => {
  const { sessionId } = useParams();

  // Data fetching - using workflow-specific endpoint
  const {
    data: sessionDetails,
    isLoading,
    isError,
    refetch,
  } = useTrainingSessionWorkflow(sessionId);

  const { mutate: endTraining, isPending: isEndingTraining } =
    useEndTrainingSession();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Custom hooks for business logic - these handle null/undefined sessionDetails gracefully
  const sessionStatus = useSessionStatus(sessionDetails);
  const { currentPage, workflowData, handleAutoAdvance, handleStepNavigation } =
    useSessionWorkflow(sessionId, sessionDetails);

  // Handlers - these also must be defined before early returns
  const handleEndTraining = useCallback(async () => {
    if (!sessionDetails?.id) return;

    try {
      endTraining(sessionDetails.id, {
        onSuccess: () => {
          toast.success("Training session ended successfully!");
          refetch();
        },
      });
    } catch (error) {
      console.error("Error ending training session:", error);
      toast.error("Failed to end training session");
    }
  }, [endTraining, sessionDetails?.id, refetch]);

  const handleError = useCallback((error, errorInfo) => {
    console.error("Session Management Error:", error, errorInfo);
    toast.error("An unexpected error occurred. Please refresh the page.");
  }, []);

  // Memoized workflow data for performance
  const memoizedWorkflowData = useMemo(() => workflowData, [workflowData]);

  // Early returns MUST come after all hooks are called
  if (isLoading) return <FullPageLoading />;

  return (
    <SessionErrorBoundary onError={handleError}>
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        <SessionHeader
          sessionDetails={sessionDetails}
          sessionStatus={sessionStatus}
          onEndTraining={handleEndTraining}
          isEndingTraining={isEndingTraining}
        />

        <div className="container mx-auto py-6">
          <MemoizedWorkflowStepper
            steps={memoizedWorkflowData.steps}
            currentStep={memoizedWorkflowData.currentStep}
            className="mb-6"
            onNext={handleStepNavigation}
            onPrevious={handleStepNavigation}
          />

          <MemoizedContentRenderer
            currentPage={currentPage}
            sessionDetails={sessionDetails}
            onAutoAdvance={handleAutoAdvance}
            workflowData={memoizedWorkflowData}
          />
        </div>
      </div>
    </SessionErrorBoundary>
  );
};

export default SessionManagement;
