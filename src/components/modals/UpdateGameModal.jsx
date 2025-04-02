import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateGameForm from "../forms/UpdateGameForm";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import Loading from "../common/Loading";

const UpdateGameModal = ({ isOpen, onClose, game }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  const { data: teams, isLoading: isTeamsLoading } = useTeams(isOpen);

  if (isSportsLoading || isTeamsLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Game Schedule</DialogTitle>
          <DialogDescription>
            Add team for a specific sport and assign a coach.
          </DialogDescription>
          <UpdateGameForm
            sports={sports}
            teams={teams}
            onClose={onClose}
            game={game}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGameModal;
