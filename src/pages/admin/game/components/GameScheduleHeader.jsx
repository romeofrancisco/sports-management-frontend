import React from "react";
import GameModal from "@/components/modals/GameModal";
import { Link } from "react-router";
import { ChevronLeft, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import PageHeader from "@/components/common/PageHeader";

const GameScheduleHeader = () => {
  const { openModal, closeModal, isOpen } = useModal();

  const actionComponent = (
    <Button onClick={openModal} className="w-full sm:w-auto" size="sm">
      <CalendarPlus />
      Create Game
    </Button>
  );

  return (
    <div className="border-b p-4">
      <PageHeader 
        title="Game Management"
        description="Schedule and manage games for your leagues"
        actionComponent={actionComponent}
      />
      <GameModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default GameScheduleHeader;
