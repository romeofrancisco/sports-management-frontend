import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateGameForm from "../forms/CreateGameForm";
import { useTeams } from "@/hooks/useTeams";
import { useSports } from "@/hooks/useSports";
import Loading from "../common/FullLoading";

const CreateGameModal = ({ isOpen, onClose }) => {
  const { data: sports, isLoading: isSportsLoading, isFetched } = useSports(isOpen);
  const { data: teams, isLoading: isTeamsLoading } = useTeams(isOpen);

  if (isSportsLoading || isTeamsLoading) return <Loading/>

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Game Schedule</DialogTitle>
          <DialogDescription>
            Add team for a specific sport and assign a coach.
          </DialogDescription>
          <CreateGameForm sports={sports} teams={teams} onClose={onClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
