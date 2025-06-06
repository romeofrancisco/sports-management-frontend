import React from "react";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import LeaguesContainer from "@/components/leagues/LeaguesContainer";
import LeagueModal from "@/components/modals/LeagueModal";

const LeaguesList = () => {
  const { isOpen, closeModal, openModal } = useModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="animate-in fade-in-50 duration-500">
          <UniversityPageHeader
            title="League Management"
            description="Create and manage sports leagues and competitions"
            buttonText="Create League"
            buttonIcon={Plus}
            onButtonClick={openModal}
            showUniversityColors={true}
          />
        </div>

        {/* Leagues Container */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <LeaguesContainer />
        </div>
      </div>

      <LeagueModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default LeaguesList;
