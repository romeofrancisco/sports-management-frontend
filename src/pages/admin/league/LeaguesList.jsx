import React from "react";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import LeaguesContainer from "@/components/leagues/LeaguesContainer";
import LeagueModal from "@/components/modals/LeagueModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const LeaguesList = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const { isAdmin } = useRolePermissions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="animate-in fade-in-50 duration-500">
          <UniversityPageHeader
            title="League Management"
            description="Create and manage sports leagues and competitions"
            {...(isAdmin() && {
              buttonText: "Create League",
              buttonIcon: Plus,
              onButtonClick: openModal,
            })}
          />
        </div>

        <LeaguesContainer />
      </div>

      {isAdmin && <LeagueModal isOpen={isOpen} onClose={closeModal} />}
    </div>
  );
};

export default LeaguesList;
