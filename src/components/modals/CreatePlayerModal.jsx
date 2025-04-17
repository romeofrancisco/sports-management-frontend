import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreatePlayerForm from "../forms/CreatePlayerForm";
import { useTeams } from "@/hooks/useTeams";
import { useSportPositions, useSports } from "@/hooks/useSports";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Loading from "../common/FullLoading";

const CreatePlayerModal = ({ isOpen, onClose }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  const { data: teams, isLoading: isTeamsLoading } = useTeams(isOpen);

  const isLoading = isSportsLoading || isTeamsLoading

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Player</DialogTitle>
          <DialogDescription>
            Register new player and assign team
          </DialogDescription>
        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          <CreatePlayerForm
            sports={sports}
            teams={teams}
            onClose={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlayerModal;
