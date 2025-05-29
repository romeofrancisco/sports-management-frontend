import React from "react";
import { UserPlus, Users, GraduationCap } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import CreatePlayerModal from "@/components/modals/PlayerModal";
import PageHeader from "@/components/common/PageHeader";

const PlayersListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>      <PageHeader
        icon={Users}
        title="Players Management"
        description="Register and manage student-athletes across all teams and sports"
        descriptionIcon={GraduationCap}
        buttonText="Register Player"
        buttonIcon={UserPlus}
        onButtonClick={openModal}
      />
      
      <CreatePlayerModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default PlayersListHeader;
