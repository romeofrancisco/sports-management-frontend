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
import Loading from "../common/FullLoading";
import StartingLineupForm from "../forms/StartingLineupForm";
import { useGamePlayers } from "@/hooks/useGames";
import { useStartingLineup } from "@/hooks/useStartingLineup";

const StartingLineupModal = ({ isOpen, onClose, game }) => {
  const { data: gamePlayers, isLoading: isGamePlayersLoading } = useGamePlayers(game?.id, isOpen);
  const {data: lineup, isLoading: isLineupLoading } = useStartingLineup(game?.id, isOpen)

  const isLoading = isGamePlayersLoading || isLineupLoading

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create starting lineup</DialogTitle>
          <DialogDescription>
            Set the starting line up for {game?.home_team.name} and{" "}
            {game?.away_team.name}
          </DialogDescription>
        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          <StartingLineupForm 
            onClose={onClose}
            teams={gamePlayers} 
            lineup={lineup}
            game={game} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StartingLineupModal;
