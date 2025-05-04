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
            size="icon"
            className="h-9 w-9"
            title="Game Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Game Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatAction("stats")}>
            <ChartColumn className="mr-2 h-4 w-4" />
            <span>Summary Stats</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatAction("substitute")}>
            <Replace className="mr-2 h-4 w-4" />
            <span>Substitution</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleStatAction("nextPeriod")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Next {period}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatAction("completeGame")}>
            <Flag className="mr-2 h-4 w-4" />
            <span>Complete Game</span>
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
