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
import { useDispatch } from "react-redux";
import { incrementPeriod } from "@/store/slices/gameSlice";

const NextPeriodConfirmation = ({ isOpen, onClose }) => {
  const { id } = useSelector((state) => state.game);
  const { mutate: nextPeriod } = useManageGame(id);
  const dispatch = useDispatch()

  const handleNextPeriod = () => {
    nextPeriod(GAME_ACTIONS.NEXT_PERIOD, {
        onSuccess: () => {
            dispatch(incrementPeriod())
        }
    })
  }

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
            onClick={handleNextPeriod}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NextPeriodConfirmation;
