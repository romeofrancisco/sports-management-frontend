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
import { useParams } from "react-router";

const NextPeriodConfirmation = ({ isOpen, onClose }) => {
  const { gameId } = useParams();
  const { mutate: nextPeriod } = useManageGame(gameId);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Proceed to the Next Period?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to proceed to the next period?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => nextPeriod(GAME_ACTIONS.NEXT_PERIOD)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NextPeriodConfirmation;
