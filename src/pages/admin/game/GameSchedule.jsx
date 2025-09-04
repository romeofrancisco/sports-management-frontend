import React from "react";
import { useSelector } from "react-redux";
import { CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import GameModal from "@/components/modals/GameModal";
import GameTable from "./components/GameTable";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

const GameSchedule = () => {
  const { openModal, closeModal, isOpen } = useModal();
  const { isPlayer } = useRolePermissions();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-0 md:p-4 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title={isPlayer() ? "Game Schedule" : "Game Management"}
          description="Schedule and manage games for your leagues"
          {...(!isPlayer() && {
            buttonText: "Create Game",
            buttonIcon: CalendarPlus,
            onButtonClick: openModal,
          })}
        />

        <GameTable />
      </div>

      {/* Game Modal */}
      <GameModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default GameSchedule;
