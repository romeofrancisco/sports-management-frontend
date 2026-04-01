import React from "react";
import PlayerForm from "../forms/PlayerForm";
import { useSports } from "@/hooks/useSports";
import { UserPlus2, UserPen } from "lucide-react";
import Modal from "../common/Modal";

const PlayerModal = ({ isOpen, onClose, player }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={player ? "Edit Player" : "Create New Player"}
      description={
        player
          ? "Update player details"
          : "Enter details to create a new player"
      }
      icon={player ? UserPen : UserPlus2}
      size="sm"
    >
      <PlayerForm sports={sports} onClose={onClose} player={player} />
    </Modal>
  );
};

export default PlayerModal;
