import React from "react";
import { CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import GameModal from "@/components/modals/GameModal";
import GameTable from "./components/GameTable";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useSelector } from "react-redux";

const GameSchedule = ({ isPublicView = false }) => {
  const { openModal, closeModal, isOpen } = useModal();
  const { isPlayer, isAdmin, isCoach } = useRolePermissions();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const canCreateGame = !isPublicView && isAuthenticated && (isAdmin() || isCoach());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          showBackButton={!isPublicView}
          title={isPublicView ? "Public Game Schedule" : isPlayer() ? "Game Schedule" : "Game Management"}
          description={isPublicView ? "Read-only game schedules for all visitors" : "Schedule and manage games for your leagues"}
          {...(canCreateGame && {
            buttonText: "Create Game",
            buttonIcon: CalendarPlus,
            onButtonClick: openModal,
          })}
        />

        <GameTable />
      </div>

      {/* Game Modal */}
      {canCreateGame && <GameModal isOpen={isOpen} onClose={closeModal} />}
    </div>
  );
};

export default GameSchedule;
