import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEndTrainingSession } from "@/hooks/useTrainings";
import { Trophy, CheckCircle2 } from "lucide-react";

const TrainingCompletionModal = ({
  isOpen,
  onClose,
  session,
  playersWithMetrics = [],
  onComplete,
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const { mutate: endTraining, isPending: isEnding } = useEndTrainingSession();

  const handleCompleteTraining = () => {
    if (!session?.id) return;

    endTraining(session.id, {
      onSuccess: (data) => {
        setShowConfirmation(false);
        onClose();
        navigate(`/trainings/sessions/${session.id}/summary`);
        if (onComplete) onComplete();
      },
    });
  };

  const handleCloseAll = () => {
    setShowConfirmation(false);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(true);
    }
  }, [isOpen]);

  // Calculate completion statistics
  const totalPlayersWithMetrics = playersWithMetrics.filter((player) => {
    return (
      player.metric_records &&
      player.metric_records.length > 0 &&
      player.metric_records.some(
        (record) =>
          record.value !== null &&
          record.value !== "" &&
          !isNaN(parseFloat(record.value)) &&
          parseFloat(record.value) !== 0
      )
    );
  }).length;

  return (
    <Dialog open={isOpen && showConfirmation} onOpenChange={handleCloseAll}>
      <DialogContent className="w-[95vw] max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Training Session Complete!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                All player metrics have been successfully recorded
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Congratulations!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All {totalPlayersWithMetrics} players have successfully recorded
                their training metrics. End this session to view the
                comprehensive summary with performance insights.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseAll}
              disabled={isEnding}
              className="flex-1"
            >
              Keep Session Open
            </Button>

            <Button
              onClick={handleCompleteTraining}
              disabled={isEnding}
              className="flex-1"
            >
              {isEnding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Ending Session...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  End & View Summary
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCompletionModal;
