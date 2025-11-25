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
import Modal from "@/components/common/Modal";

const TrainingSessionFormDialog = ({ open, onOpenChange, sessionId }) => {
  const { user } = useSelector((state) => state.auth);
  const isCoach = user?.role?.includes("coach");

  // Fetch session details if editing
  const {
    data: session,
    isLoading,
    error,
  } = useTrainingSession(sessionId, Boolean(open && sessionId));

  const { data: teamsData = [], isLoading: isLoadingTeams } = useAllTeams(
    Boolean(open && !isCoach)
  );

  // Teams are already in array format from useAllTeams
  const teams = teamsData;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={sessionId ? "Update Training Session" : "Create Training Session"}
      icon={Dumbbell}
      isLoading={isLoading || isLoadingTeams}
      error={error}
    >
      <TrainingSessionForm
        open={open}
        session={sessionId ? session : null}
        teams={!isCoach ? teams : undefined}
        onClose={() => onOpenChange(false)}
      />
    </Modal>
  );
};

export default TrainingSessionFormDialog;
