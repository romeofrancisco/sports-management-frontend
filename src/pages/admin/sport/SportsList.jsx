import React from "react";
import SportsContainer from "./components/SportsContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import SportModal from "@/components/modals/SportModal";

const SportsList = () => {
  const { isOpen, closeModal, openModal } = useModal();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Sports Management"
          description="Manage and organize sports in your system"
          buttonText="Register Sport"
          buttonIcon={Plus}
          onButtonClick={openModal}
        />
        
        {/* Sports Container */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <SportsContainer />
        </div>
      </div>
      
      <SportModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default SportsList;
