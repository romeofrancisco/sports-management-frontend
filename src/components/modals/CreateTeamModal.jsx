import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoaches } from "@/hooks/useCoaches";
import { useSports } from "@/hooks/useSports";
import CreateTeamForm from "../forms/CreateTeamForm";
import Loading from "../common/FullLoading";

const CreateTeamModal = ({ isOpen, onClose }) => {
  const { data: coaches, isLoading: isCoachesLoading } = useCoaches(isOpen);
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  if (isCoachesLoading || isSportsLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Add team for a specific sport and assign a coach.
          </DialogDescription>
          <CreateTeamForm coaches={coaches} sports={sports} onClose={onClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
