import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePlayer } from "@/hooks/mutations/player/useDeletePlayer";

const DeletePlayerModal = ({ isOpen, onClose, player }) => {
    
  const deletePlayer = useDeletePlayer();
  const handleDeletePlayer = () => {
    deletePlayer.mutate({
      player: player.slug,
      first_name: player.first_name,
      last_name: player.last_name,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">
              {player?.first_name} {player?.last_name}'s
            </span>{" "}
            account and remove the data of the player.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletePlayer}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlayerModal;
