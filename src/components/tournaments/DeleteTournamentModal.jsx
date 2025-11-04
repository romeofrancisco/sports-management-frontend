import React from "react";
import { useDeleteTournament } from "@/hooks/useTournaments";
import DeleteModal from "@/components/common/DeleteModal";
import { Trophy } from "lucide-react";

const DeleteTournamentModal = ({ open, onOpenChange, tournament }) => {
  const { mutate: deleteTournament, isPending } = useDeleteTournament();

  const handleConfirm = () => {
    if (tournament) {
      deleteTournament(tournament.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      itemName={tournament?.name}
      itemType="tournament"
      isLoading={isPending}
      confirmText="Delete"
      cancelText="Cancel"
      icon={Trophy}
    />
  );
};

export default DeleteTournamentModal;
