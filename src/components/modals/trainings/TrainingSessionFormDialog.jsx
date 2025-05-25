import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TrainingSessionForm from "@/components/forms/TrainingSessionForm";
import { useTrainingSession } from "@/hooks/useTrainings";
import { useSelector } from "react-redux";
import { useCoaches } from "@/hooks/useCoaches";
import { useTeams } from "@/hooks/useTeams";
import { useTrainingCategories } from "@/hooks/useTrainings";
import ContentLoading from "@/components/common/ContentLoading";

const TrainingSessionFormDialog = ({
  open,
  onOpenChange,
  sessionId,
}) => {
  const { user } = useSelector((state) => state.auth);
  const isCoach = user?.role?.includes("coach");

  // Fetch session details if editing
  const {
    data: session,
    isLoading,
    error,
  } = useTrainingSession(sessionId, open && !!sessionId);
  const { data: categories = [] } =
    useTrainingCategories(open);

  // Only fetch coaches and teams if user is not a coach
  const { data: coaches = [], isLoading: isLoadingCoaches } = useCoaches({
    enabled: open && !isCoach,
  });
  const { data: teams = [], isLoading: isLoadingTeams } = useTeams({
    enabled: open && !isCoach,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            {sessionId ? "Edit" : "Create"} Training Session
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          {sessionId && isLoading ? (
            <ContentLoading className="p-4" />
          ) : error ? (
            <div className="p-4 text-red-500 text-sm">
              Failed to load session details.
            </div>
          ) : (
            <TrainingSessionForm
              session={sessionId ? session : null}
              coaches={!isCoach ? coaches : undefined}
              categories={categories}
              isLoadingCoaches={!isCoach ? isLoadingCoaches : false}
              teams={!isCoach ? teams : undefined}
              isLoadingTeams={!isCoach ? isLoadingTeams : false}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSessionFormDialog;
