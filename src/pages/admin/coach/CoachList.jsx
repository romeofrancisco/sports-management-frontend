import React from "react";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import CoachModal from "@/components/modals/CoachModal";
import CoachContainer from "./components/CoachContainer";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const CoachList = () => {
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Coach Management"
          description="Register and manage coaches for your sports teams"
          buttonText="Register Coach"
          buttonIcon={UserCheck}
          onButtonClick={openModal}
          showUniversityColors={true}
        />

        <CoachContainer />
      </div>

      {/* Coach Modal */}
      <CoachModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default CoachList;
