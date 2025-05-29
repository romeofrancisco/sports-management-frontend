import React from "react";
import { Users, Target } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import TeamModal from "@/components/modals/TeamModal";
import PageHeader from "@/components/common/PageHeader";

const TeamsListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>      <PageHeader
        icon={Users}
        title="Team Management"
        description="Create and manage teams for your sports leagues"
        descriptionIcon={Target}
        buttonText="Create Team"
        buttonIcon={Users}
        onButtonClick={openModal}
      />
      
      <TeamModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default TeamsListHeader;
