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
import { useCoachPermissions } from "@/hooks/useCoachPermissions";

const GameModal = ({ isOpen, onClose, game = null, isLeagueGame = false }) => {
  const isEdit = !!game;
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  const { checkGamePermission } = useCoachPermissions();
  
  // Fetch all teams for the dropdown selections
  const { data: teams, isLoading: isTeamsLoading } = useAllTeams(isOpen);

  // Check permissions for editing
  const hasPermission = !isEdit || checkGamePermission(game);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Game Schedule" : "Create Game Schedule"}
          </DialogTitle>          <DialogDescription>
            {isEdit 
              ? isLeagueGame 
                ? "Update game details. Note: Teams and sport cannot be changed for league games."
                : "Update game details for the selected teams." 
              : "Create a new game schedule between two teams."}
          </DialogDescription>
          {hasPermission ? (
            <GameForm 
              sports={sports} 
              teams={teams} 
              onClose={onClose} 
              game={game} 
              isLeagueGame={isLeagueGame}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                You don't have permission to edit this game.
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Please contact an administrator to get assigned to this league game.
              </div>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GameModal;