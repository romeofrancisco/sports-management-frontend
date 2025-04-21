import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Replace, Settings, ChartColumn, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModal";
import SummaryStatsModal from "@/components/modals/SummaryStatsModal";
import NextPeriodConfirmation from "@/components/modals/NextPeriodConfirmation";
import { useDispatch, useSelector } from "react-redux";
import CompleteGameConfirmation from "@/components/modals/CompleteGameConfirmation";
import SubstitutionModal from "@/components/modals/SubstitutionModal";
import { reset } from "@/store/slices/playerStatSlice";

const GameSettings = () => {
  const { max_period } = useSelector((state) => state.sport);
  const { current_period } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const modals = {
    stats: useModal(),
    substitute: useModal(),
    nextPeriod: useModal(),
    completeGame: useModal(),
  };

  return (
    <>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            dispatch(reset());
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-10 p-0 absolute top-0 right-0"
            onClick={() => dispatch(reset())}
          >
            <Settings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => modals.stats.openModal()}>
            <ChartColumn />
            Summary Stats
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => modals.substitute.openModal()}>
            <Replace />
            Substitution
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => modals.nextPeriod.openModal()}>
            <Clock />
            Next Period
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => modals.completeGame.openModal()}
            disabled={current_period < max_period}
          >
            <Flag />
            Complete Game
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SummaryStatsModal
        isOpen={modals.stats.isOpen}
        onClose={modals.stats.closeModal}
      />
      <SubstitutionModal
        isOpen={modals.substitute.isOpen}
        onClose={modals.substitute.closeModal}
      />
      <NextPeriodConfirmation
        isOpen={modals.nextPeriod.isOpen}
        onClose={modals.nextPeriod.closeModal}
      />
      <CompleteGameConfirmation
        isOpen={modals.completeGame.isOpen}
        onClose={modals.completeGame.closeModal}
      />
    </>
  );
};

export default GameSettings;
