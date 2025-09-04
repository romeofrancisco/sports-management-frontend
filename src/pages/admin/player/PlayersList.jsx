import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import CreatePlayerModal from "@/components/modals/PlayerModal";
import PlayersContainer from "./components/PlayersContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const PlayersList = () => {
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Players Management"
          description="Register and manage student-athletes across all teams and sports"
          buttonText="Register Player"
          buttonIcon={UserPlus}
          onButtonClick={openModal}
        />
        
        {/* Players Container */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <PlayersContainer />
        </div>
      </div>
      
      {/* Player Modal */}
      <CreatePlayerModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default PlayersList;
