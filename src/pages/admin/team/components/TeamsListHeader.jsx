import React from "react";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useModal } from "@/hooks/useModal";
import TeamModal from "@/components/modals/TeamModal";
import PageHeader from "@/components/common/PageHeader";

const TeamsListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const actionComponent = (
    <Button
      onClick={openModal}
      className="w-full sm:w-auto"
      size="sm"
    >
      <Users />
      Create Team
    </Button>
  );

  return (
    <div className="border-b p-4">
      <PageHeader 
        title="Team Management"
        description="Create and manage teams for your sports leagues"
        actionComponent={actionComponent}
      />
      <TeamModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default TeamsListHeader;
