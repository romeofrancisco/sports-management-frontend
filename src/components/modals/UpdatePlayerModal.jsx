import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdatePlayerForm from "../forms/UpdatePlayerForm";
import { useSports } from "@/hooks/queries/useSports";
import { useTeams } from "@/hooks/queries/useTeams";
import { usePositions } from "@/hooks/queries/usePositions";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import Loading from "../common/Loading";

const UpdatePlayerModal = ({ isOpen, onClose, player }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  const { data: teams, isLoading: isTeamsLoading } = useTeams(isOpen);
  const { data: positions, isLoading: isPositionsLoading } = usePositions(isOpen);

  const isLoading = isSportsLoading || isTeamsLoading || isPositionsLoading;

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Player Info</DialogTitle>
          <DialogDescription>
            Modify player details, including personal and team information.
          </DialogDescription>
          <Separator className="min-h-px" />
          <ScrollArea className="max-h-[75vh]">
            <UpdatePlayerForm
              sports={sports}
              teams={teams}
              onClose={onClose}
              player={player}
              positions={positions}
            />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePlayerModal;
