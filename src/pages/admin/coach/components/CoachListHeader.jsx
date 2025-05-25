import React from "react";
import { Link } from "react-router";
import { ChevronLeft, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import CreateCoachModal from "@/components/modals/CoachModal";
import PageHeader from "@/components/common/PageHeader";

const CoachListHeader = () => {
  const { openModal, closeModal, isOpen } = useModal();

  const actionComponent = (
    <Button
      onClick={openModal}
      className="w-full sm:w-auto"
      size="sm"
    >
      <CalendarPlus />
      Register Coach
    </Button>
  );

  return (
    <div className="border-b p-4">
      <PageHeader 
        title="Coach Management"
        description="Register and manage coaches for your teams"
        actionComponent={actionComponent}
      />
      <CreateCoachModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default CoachListHeader;
