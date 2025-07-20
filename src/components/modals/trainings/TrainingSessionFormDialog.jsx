import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TrainingSessionForm from "@/components/forms/TrainingSessionForm";
import { useTrainingSession } from "@/hooks/useTrainings";
import { useSelector } from "react-redux";
import { useAllTeams } from "@/hooks/useTeams";
import ContentLoading from "@/components/common/ContentLoading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Settings, Dumbbell } from "lucide-react";

const TrainingSessionFormDialog = ({ open, onOpenChange, sessionId }) => {
  const { user } = useSelector((state) => state.auth);
  const isCoach = user?.role?.includes("coach");

  // Fetch session details if editing
  const {
    data: session,
    isLoading,
    error,
  } = useTrainingSession(sessionId, Boolean(open && sessionId));

  const { data: teamsData = [], isLoading: isLoadingTeams } =
    useAllTeams(Boolean(open && !isCoach));

  // Teams are already in array format from useAllTeams
  const teams = teamsData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              {sessionId ? (
                <Settings className="h-5 w-5 text-primary" />
              ) : (
                <Dumbbell className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {sessionId
                  ? "Edit Training Session"
                  : "Schedule New Training Session"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {sessionId
                  ? "Update the training session details and schedule"
                  : "Create a new training session with teams and categories"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-140px)] px-6 pb-6">
          {sessionId && isLoading ? (
            <div className="flex items-center justify-center py-8">
              <ContentLoading className="p-4" />
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <div className="text-destructive text-sm font-medium">
                Failed to load session details
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                Please try again or contact support if the problem persists
              </div>
            </div>
          ) : (
            <TrainingSessionForm
              session={sessionId ? session : null}
              teams={!isCoach ? teams : undefined}
              onClose={() => onOpenChange(false)}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSessionFormDialog;
