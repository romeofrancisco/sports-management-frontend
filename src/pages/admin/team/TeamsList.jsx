import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import TeamModal from "@/components/modals/TeamModal";
import TeamsContainer from "./components/TeamsContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const TeamsList = () => {
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Team Management"
          description="Create and manage teams for your sports leagues"
          buttonText="Create Team"
          buttonIcon={Users}
          onButtonClick={openModal}
        />
        
        {/* Teams Container */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <TeamsContainer />
        </div>
      </div>
      
      {/* Team Modal */}
      <TeamModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default TeamsList;
