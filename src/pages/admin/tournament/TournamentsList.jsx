import React from "react";
import { useModal } from "@/hooks/useModal";
import { Trophy } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TournamentsContainer from "@/components/tournaments/TournamentsContainer";
import TournamentModal from "@/components/tournaments/TournamentModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const TournamentsList = ({ isPublicView = false }) => {
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
            title={isPublicView ? "Tournaments" : "Tournament Management"}
            description={isPublicView ? "Public read-only view of tournament competitions" : "Create and manage sports tournaments and competitions"}
          />
        </div>

        <TournamentsContainer />
      </div>
    </div>
  );
};

export default TournamentsList;
