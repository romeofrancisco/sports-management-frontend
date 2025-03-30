import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useGamePlayers } from "@/hooks/queries/game/useGamePlayers";
import Loading from "../common/Loading";
import CreateStartingLineupForm from "../forms/CreateStartingLineupForm";
import { useSportDetails } from "@/hooks/queries/useSportDetails";
import { useSportPositions } from "@/hooks/queries/useSportPositions";

const CreateStartingLineupModal = ({ isOpen, onClose, game }) => {
  const { data: gamePlayers, isLoading: isGamePlayersLoading } = useGamePlayers(game?.id, isOpen);
  const { data: positions, isLoading: isPositionsLoading } = useSportPositions(game?.sport, isOpen)

  const isLoading = isGamePlayersLoading || isPositionsLoading

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create starting lineup</DialogTitle>
          <DialogDescription>
            Set the starting line up for {game?.home_team.name} and{" "}
            {game?.away_team.name}
          </DialogDescription>
        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          <CreateStartingLineupForm 
            onClose={onClose}
            teams={gamePlayers} 
            game={game} 
            positions={positions} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStartingLineupModal;
