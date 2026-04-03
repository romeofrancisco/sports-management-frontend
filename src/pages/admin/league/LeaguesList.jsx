import React from "react";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import LeaguesContainer from "@/components/leagues/LeaguesContainer";
import LeagueModal from "@/components/modals/LeagueModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const LeaguesList = ({ isPublicView = false }) => {
  const { isOpen, closeModal, openModal } = useModal();
  const { isAdmin } = useRolePermissions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="animate-in fade-in-50 duration-500">
          <UniversityPageHeader
            showBackButton={isPublicView}
            backButtonText="Back to Home"
            backButtonPath={isPublicView ? "/" : undefined}
            title={isPublicView ? "Leagues" : "League Management"}
            description={
              isPublicView
                ? "Public read-only view of leagues and competitions"
                : "Create and manage sports leagues and competitions"
            }
          />
        </div>

        <LeaguesContainer />
      </div>
    </div>
  );
};

export default LeaguesList;
