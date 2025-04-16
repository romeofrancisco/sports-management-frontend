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
import UpdateTeamForm from "../forms/UpdateTeamForm";
import Loading from "../common/FullLoading";

const UpdateTeamModal = ({ isOpen, onClose, team }) => {
  const { data: coaches, isLoading: isCoachesLoading } = useCoaches(isOpen);
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  if (isCoachesLoading || isSportsLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Team Info</DialogTitle>
          <DialogDescription>
            Add team for a specific sport and assign a coach.
          </DialogDescription>
          <UpdateTeamForm
            coaches={coaches}
            sports={sports}
            team={team}
            onClose={onClose}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeamModal;
