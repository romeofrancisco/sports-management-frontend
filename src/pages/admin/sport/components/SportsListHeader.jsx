import React from "react";
import { Trophy, Plus, Target } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import SportModal from "@/components/modals/SportModal";
import PageHeader from "@/components/common/PageHeader";

const SportsListHeader = () => {
  const { isOpen, closeModal, openModal } = useModal();

  return (
    <>
      <PageHeader
        icon={Trophy}
        title="Sports Management"
        description="Manage and organize sports in your system"
        descriptionIcon={Target}
        buttonText="Register Sport"
        buttonIcon={Plus}
        onButtonClick={openModal}
      />
      
      <SportModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};


export default SportsListHeader;
