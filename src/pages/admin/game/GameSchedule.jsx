import React from "react";
import { CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import GameModal from "@/components/modals/GameModal";
import GameTable from "./components/GameTable";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useSelector } from "react-redux";

const GameSchedule = () => {
  const { openModal, closeModal, isOpen } = useModal();
  const { isPlayer, isAdmin, isCoach } = useRolePermissions();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const canCreateGame = isAuthenticated && (isAdmin() || isCoach());

  return (
    <div className= "min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className= "p-1 md:p-6 space-y-6">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          showBackButton={false}
          title={isPlayer() ? "Game Schedule" : "Game Management"}
          description={
            isPlayer()
              ? "View your upcoming games and match details."
              : "Manage game schedules, scores, and details."
          }
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
