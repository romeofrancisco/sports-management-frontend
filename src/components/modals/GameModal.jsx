import React from "react";
import GameForm from "../forms/GameForm";
import { useAllTeams } from "@/hooks/useTeams";
import { useSports } from "@/hooks/useSports";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import Modal from "../common/Modal";
import { Volleyball } from "lucide-react";

const GameModal = ({ isOpen, onClose, game = null, isLeagueGame = false }) => {
  const isEdit = !!game;
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);
  const { checkGamePermission } = useCoachPermissions();

  // Fetch all teams for the dropdown selections
  const { data: teams, isLoading: isTeamsLoading } = useAllTeams(isOpen);

  // Check permissions for editing
  const hasPermission = !isEdit || checkGamePermission(game);

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={isEdit ? "Edit Game" : "Create Game"}
      icon={Volleyball}
      description="Fill in the details for the game."
      size="sm"
    >
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
    </Modal>
  );
};

export default GameModal;
