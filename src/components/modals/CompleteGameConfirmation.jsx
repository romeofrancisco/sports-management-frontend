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
import { useSelector } from "react-redux";
import { GAME_ACTIONS } from "@/constants/game";
import { useNavigate, useParams } from "react-router";

const CompleteGameConfirmation = ({ isOpen, onClose }) => {
  const { gameId } = useParams();
  const { mutate: completeGame } = useManageGame(gameId);
  const navigate = useNavigate();

  const handleCompleteGame = () => {
    completeGame(GAME_ACTIONS.COMPLETE, {
      onSuccess: () => {
        navigate(`/games/${gameId}/game-summary`);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finish the game?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to finish the game?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCompleteGame}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteGameConfirmation;
