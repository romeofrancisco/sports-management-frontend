import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreatePlayerForm from "../forms/PlayerForm";
import { useSportTeams, useTeams } from "@/hooks/useTeams";
import { useSportPositions, useSports } from "@/hooks/useSports";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Loading from "../common/FullLoading";

const PlayerModal = ({ isOpen, onClose, player }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  const isLoading = isSportsLoading

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
            onClose={onClose}
            player={player}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerModal;
