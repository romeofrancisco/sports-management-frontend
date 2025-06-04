import React from "react";
import { useSelector } from "react-redux";
import { CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import GameModal from "@/components/modals/GameModal";
import GameTable from "./components/GameTable";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const GameSchedule = () => {
  const { user } = useSelector((state) => state.auth);
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title="Game Management"
          description="Schedule and manage games for your leagues"
          buttonText="Create Game"
          buttonIcon={CalendarPlus}
          onButtonClick={openModal}
          showUniversityColors={true}
        />
        
        {/* Game Table */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <GameTable />
        </div>
      </div>
      
      {/* Game Modal */}
      <GameModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default GameSchedule;
