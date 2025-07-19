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
import { useEndTrainingSession } from "@/hooks/useTrainings";
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
  
  const handleCompleteTraining = () => {
    if (!session?.id) return;

    endTraining(session.id, {
      onSuccess: (data) => {
        // Close confirmation dialog and navigate to summary
        setShowConfirmation(false);
        onClose();
        
        // Navigate to training summary page
        navigate(`/trainings/sessions/${session.id}/summary`);
        
        if (onComplete) {
          onComplete();
        }
      },
    });
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
                Training Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1 font-medium">
                All players have finished recording their metrics
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="px-6 py-6">
          <div className="rounded-2xl border-2 border-primary/20 p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
            <div className="text-center space-y-3">
              <div className="text-lg font-semibold text-foreground">
                 Congratulations!
              </div>
              <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                All players have successfully recorded their training metrics. Would you like to end this training session and view the detailed summary with performance insights?
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrainingCompletionModal;
