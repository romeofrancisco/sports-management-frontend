import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Replace, Settings, ChartColumn } from "lucide-react";
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

const GameSettings = () => {
  const { isOpen: isStatsOpen, openModal: openStatsModal, closeModal: closeStatsModal } = useModal();
  const { isOpen: isNextPeriodOpen, openModal: openNextPeriodModal, closeModal: closeNextPeriodModal } = useModal();

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-10 p-0 absolute top-0 right-0">
          <Settings className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openStatsModal()}>
          <ChartColumn />
          Summary Stats
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Replace />
          Substitution
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openNextPeriodModal()}>
          <Clock />
          Next Period
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <SummaryStatsModal isOpen={isStatsOpen} onClose={closeStatsModal}/>
    <NextPeriodConfirmation isOpen={isNextPeriodOpen} onClose={closeNextPeriodModal} />
    </>
  );
};

export default GameSettings;
