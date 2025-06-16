import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useEndTrainingSession, useTrainingSummary, useTrainingSession } from "@/hooks/useTrainings";
import { Trophy } from "lucide-react";

const TrainingCompletionModal = ({ 
  isOpen, 
  onClose, 
  session, 
  playersWithMetrics = [], 
  onComplete 
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const { mutate: endTraining, isPending: isEnding } = useEndTrainingSession();
  
  // Get fresh session data to ensure we have the latest status
  const { data: freshSessionData, refetch: refetchSession } = useTrainingSession(session?.id, isOpen && !!session?.id);
  
  // Refetch session data when modal opens to ensure we have the latest status
  React.useEffect(() => {
    if (isOpen && session?.id) {
      refetchSession();
    }
  }, [isOpen, session?.id, refetchSession]);
  
  // Use fresh session data if available, otherwise fall back to the passed session
  const currentSession = freshSessionData || session;
  
  // Check if session is already completed using the most up-to-date data
  const isSessionCompleted = currentSession?.status === 'completed';
  
  // Debug logging to track session status changes
  React.useEffect(() => {
    if (isOpen && currentSession) {
      console.log('TrainingCompletionModal - Session status:', {
        sessionId: currentSession.id,
        status: currentSession.status,
        isSessionCompleted,
        freshSessionData: !!freshSessionData,
        passedSession: session?.status
      });
    }
  }, [isOpen, currentSession?.status, isSessionCompleted, freshSessionData, session?.status]);

  // Fetch training summary for completed sessions
  const { 
    data: completedSummaryData, 
    isLoading: isFetchingSummary 
  } = useTrainingSummary(currentSession?.id, isSessionCompleted);

  // Debug the API response structure
  React.useEffect(() => {
    if (completedSummaryData) {
      console.log('Training Summary API Response:', completedSummaryData);
    }
  }, [completedSummaryData]);

  const handleCompleteTraining = () => {
    if (!currentSession?.id) return;

    if (isSessionCompleted) {
      // If session is already completed, just navigate to summary
      handleViewSummary();
      return;
    }

    endTraining(currentSession.id, {
      onSuccess: (data) => {
        // Close confirmation dialog and navigate to summary
        setShowConfirmation(false);
        onClose();
        
        // Navigate to training summary page
        navigate(`/trainings/sessions/${currentSession.id}/summary`);
        
        if (onComplete) {
          onComplete();
        }
      },
    });
  };

  const handleViewSummary = () => {
    // Close confirmation dialog
    setShowConfirmation(false);
    onClose();
    
    // Navigate to training summary page
    navigate(`/trainings/sessions/${currentSession.id}/summary`);
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleCloseAll = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen && showConfirmation} onOpenChange={handleCloseAll}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-500 rounded-full">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-foreground">
                {isSessionCompleted ? "Training Session Completed" : "Training Complete!"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                {isSessionCompleted 
                  ? "This training session has been completed. View the detailed training summary."
                  : "All players have finished recording their metrics"
                }
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-center text-muted-foreground py-4">
          {isSessionCompleted ? (
            "🎯 Review the comprehensive training analysis and player improvements from this completed session."
          ) : (
            "🎉 Congratulations! All players have successfully recorded their training metrics. Would you like to end this training session and view the detailed summary?"
          )}
        </AlertDialogDescription>

        <AlertDialogFooter className="gap-2">
          {isSessionCompleted ? (
            // For completed sessions, only show View Summary and Close options
            <>
              <AlertDialogCancel onClick={handleCloseAll}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleViewSummary}
                disabled={isFetchingSummary}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isFetchingSummary ? "Loading Summary..." : "View Training Summary"}
              </AlertDialogAction>
            </>
          ) : (
            // For ongoing sessions, show Keep Open and End Training options
            <>
              <AlertDialogCancel disabled={isEnding} onClick={handleCloseAll}>
                Keep Session Open
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCompleteTraining}
                disabled={isEnding}
                className="bg-green-600 hover:bg-green-700"
              >
                {isEnding ? "Ending Session..." : "End & View Training"}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrainingCompletionModal;
