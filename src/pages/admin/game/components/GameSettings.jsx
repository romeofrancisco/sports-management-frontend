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
import { getPeriodLabel } from "@/constants/sport";

const GameSettings = () => {
  const dispatch = useDispatch();
  const { scoring_type } = useSelector((state) => state.sport);
  const period = getPeriodLabel(scoring_type);

  const modals = {
    stats: useModal(),
    substitute: useModal(),
    nextPeriod: useModal(),
    completeGame: useModal(),
  };

  const [open, setOpen] = React.useState(false);

  const handleStatAction = (modalType) => {
    dispatch(reset());  // Reset stats before opening any stat-related modal
    modals[modalType].openModal();
    setOpen(false); // Close the dropdown menu when opening a modal
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-10 p-0 absolute top-0 right-0"
          >
            <Settings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatAction("stats")}>
            <ChartColumn />
            Summary Stats
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatAction("substitute")}>
            <Replace />
            Substitution
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatAction("nextPeriod")}>
            <Clock />
            Next {period}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatAction("completeGame")}>
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
