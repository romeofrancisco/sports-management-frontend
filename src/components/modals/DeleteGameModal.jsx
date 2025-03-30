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
import { useDeleteGame } from "@/hooks/mutations/game/useDeleteGame";
import { Loader2 } from "lucide-react";

const DeleteGameModal = ({ isOpen, onClose, game }) => {
  const { mutate: deleteGame, isPending } = useDeleteGame();

  const handleDeleteGame = () => {
    deleteGame({
      id: game?.id,
      home_team: game?.home_team.name,
      away_team: game?.away_team.name,
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
              {game?.home_team.name} vs {game?.away_team.name}'s
            </span>{" "}
            game and it's recorded stats and data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isPending ? (
            <>
              <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled>
                <Loader2 className="animate-spin" />
                Please Wait
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGame}>
                Confirm
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGameModal;
