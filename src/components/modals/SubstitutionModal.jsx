import React from "react";
import { useCurrentGamePlayers, useGamePlayers } from "@/hooks/useGames";
import SubstitutionForm from "../forms/SubstitutionForm";
import ContentLoading from "../common/ContentLoading";
import { useParams } from "react-router";
import Modal from "../common/Modal";
import { Replace } from "lucide-react";

const SubstitutionModal = ({ isOpen, onClose }) => {
  const { gameId } = useParams();
  const { data: currentPlayers, isLoading: isCurrentPlayersLoading } =
    useCurrentGamePlayers(gameId, isOpen);
  const { data: gamePlayers, isLoading: isGamePlayersLoading } = useGamePlayers(
    gameId,
    isOpen,
  );

  const isLoading = isCurrentPlayersLoading || isGamePlayersLoading;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Manage Substitutions"
      description="Select players to substitute in and out for the current period."
      size="lg"
      icon={Replace}
    >
      {isLoading ? (
        <ContentLoading />
      ) : (
        <SubstitutionForm
          currentPlayers={currentPlayers}
          gamePlayers={gamePlayers}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default SubstitutionModal;
