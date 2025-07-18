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
      // Reset showConfirmation when modal is opened
      setShowConfirmation(true);
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

  // Reset showConfirmation when modal closes completely
  React.useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(true);
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen && showConfirmation} onOpenChange={handleCloseAll}>
      <AlertDialogContent className="max-w-lg overflow-hidden p-0 border-2 border-primary/20 shadow-2xl">
        <AlertDialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg border border-green-400/30">
              <Trophy className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {isSessionCompleted ? "Training Session Completed" : "Training Complete!"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1 font-medium">
                {isSessionCompleted 
                  ? "This training session has been completed. View the detailed training summary."
                  : "All players have finished recording their metrics"
                }
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="px-6 py-6">
          <div className="rounded-2xl border-2 border-primary/20 p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
            <div className="text-center space-y-3">
              <div className="text-lg font-semibold text-foreground">
                {isSessionCompleted ? "🎯 Session Analysis Ready" : "🎉 Congratulations!"}
              </div>
              <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                {isSessionCompleted ? (
                  "Review the comprehensive training analysis and player improvements from this completed session. All metrics have been recorded and analyzed."
                ) : (
                  "All players have successfully recorded their training metrics. Would you like to end this training session and view the detailed summary with performance insights?"
                )}
              </AlertDialogDescription>
              
              {/* Stats section */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-sm"></div>
                    <span className="font-medium text-muted-foreground">
                      {playersWithMetrics.length} Players
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm"></div>
                    <span className="font-medium text-muted-foreground">
                      Metrics Recorded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="px-6 pb-6 pt-0 gap-3">
          {isSessionCompleted ? (
            // For completed sessions, only show View Summary and Close options
            <>
              <AlertDialogCancel 
                onClick={handleCloseAll}
                className="flex-1 border-2 border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
              >
                Close
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleViewSummary}
                disabled={isFetchingSummary}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {isFetchingSummary ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading Summary...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    View Training Summary
                  </div>
                )}
              </AlertDialogAction>
            </>
          ) : (
            // For ongoing sessions, show Keep Open and End Training options
            <>
              <AlertDialogCancel 
                disabled={isEnding} 
                onClick={handleCloseAll}
                className="flex-1 border-2 border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 disabled:opacity-50"
              >
                Keep Session Open
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleCompleteTraining}
                disabled={isEnding}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50"
              >
                {isEnding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Ending Session...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    End & View Training
                  </div>
                )}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrainingCompletionModal;
