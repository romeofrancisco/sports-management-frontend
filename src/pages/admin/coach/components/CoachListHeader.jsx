import React from "react";
import { Link } from "react-router";
import { ChevronLeft, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import CreateCoachModal from "@/components/modals/CoachModal";

const CoachListHeader = () => {
  const { openModal, closeModal, isOpen } = useModal();

  return (
    <header className="border-b p-4 grid grid-cols-2 grid-rows-2 items-center">
      <span className="font-medium text-sm row-start-2 md:text-lg">
        Coach Management
      </span>
      <Button
        onClick={openModal}
        className="ml-auto row-span-2 col-start-2 md:py-5"
        size="sm"
      >
        <CalendarPlus />
        Register Coach
      </Button>
      <CreateCoachModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
};

export default CoachListHeader;
