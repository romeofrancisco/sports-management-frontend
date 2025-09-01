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
import { useManageGame } from "@/hooks/useGames";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import { GAME_ACTIONS } from "@/constants/game";
import { useNavigate } from "react-router";
import { Play } from "lucide-react";

const StartGameConfirmation = ({ isOpen, onClose, game }) => {
  const { mutate: startGame } = useManageGame(game?.id);
  const { requirePermissionForAction } = useCoachPermissions();
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (!requirePermissionForAction(game, "start")) {
      onClose(); // Close the modal
      return;
    }

    startGame(GAME_ACTIONS.START, {
      onSuccess: () => {
        onClose(); // Close the modal first
        navigate(`/games/${game.id}`);
      },
      onError: (error) => {
        console.error("Failed to start game:", error);
        onClose(); // Close the modal even on error
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-1 text-primary">
            <Play className="size-5" /> Start Game
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to start the game between{" "}
            <span className="font-medium">{game?.home_team.name}</span> and{" "}
            <span className="font-medium">{game?.away_team.name}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStartGame}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StartGameConfirmation;
