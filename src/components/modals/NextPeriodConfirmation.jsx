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

const NextPeriodConfirmation = ({ isOpen, onClose }) => {
  const { game_id } = useSelector((state) => state.game);
  const { mutate: nextPeriod } = useManageGame(game_id);

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
