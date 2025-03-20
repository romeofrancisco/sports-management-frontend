import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useCoaches } from "@/hooks/queries/useCoaches";
import { useSports } from "@/hooks/queries/useSports";
import CreateTeamForm from "../forms/CreateTeamForm";

const CreateTeamModal = ({ isOpen, onClose }) => {
  const { data: coaches, isFetched: isCoachesFetched } = useCoaches(isOpen);
  const { data: sports, isFetched: isSportsFetched } = useSports(isOpen);

  if (!isCoachesFetched || !isSportsFetched) return null;

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
