import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GameForm from "../forms/GameForm";
import { useAllTeams } from "@/hooks/useTeams";
import { useSports } from "@/hooks/useSports";
import Loading from "../common/FullLoading";

const GameModal = ({ isOpen, onClose, game = null, isLeagueGame = false }) => {
  const isEdit = !!game;
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  
  // Fetch all teams for the dropdown selections
  const { data: teams, isLoading: isTeamsLoading } = useAllTeams(isOpen);

  if (isSportsLoading || isTeamsLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Game Schedule" : "Create Game Schedule"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? isLeagueGame 
                ? "Update game details. Note: Teams and sport cannot be changed for league games."
                : "Update game details for the selected teams." 
              : "Create a new game schedule between two teams."}
          </DialogDescription>
          <GameForm 
            sports={sports} 
            teams={teams} 
            onClose={onClose} 
            game={game} 
            isLeagueGame={isLeagueGame}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GameModal;