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
import UpdateTeamForm from "../forms/TeamForm";
import { ScrollArea } from "../ui/scroll-area";

const TeamModal = ({ isOpen, onClose, team }) => {
  const { data: coaches, isLoading: isCoachesLoading } = useCoaches({}, 1, 1000, isOpen);
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  // Extract coaches array from paginated response
  const coachesArray = coaches?.results || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Team Info</DialogTitle>
          <DialogDescription>
            Add team for a specific sport and assign a coach.
          </DialogDescription>
        </DialogHeader>        <ScrollArea className="max-h-[75vh]">
          <UpdateTeamForm
            coaches={coachesArray}
            sports={sports}
            team={team}
            onClose={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TeamModal;
