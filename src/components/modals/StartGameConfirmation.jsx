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

const StartGameConfirmation = ({ isOpen, onClose, game }) => {
  const { mutate: startGame } = useManageGame(game?.id);
  const { requirePermissionForAction } = useCoachPermissions();
  const navigate = useNavigate()

  const handleStartGame = () => {
    if (!requirePermissionForAction(game, 'start')) {
      onClose(); // Close the modal
      return;
    }
    
    startGame(GAME_ACTIONS.START,{
        onSuccess: () => {
            navigate(`/games/${game.id}`)
        }
    })
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start Game?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to start the game between{" "}
            <span className="font-medium">{game?.home_team.name}</span> and{" "}
            <span className="font-medium">{game?.away_team.name}</span>
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
