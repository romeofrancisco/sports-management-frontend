import React, { useState } from "react";
import { Target } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TrainingSessionsList from "@/components/trainings/sessions/TrainingSessionsList";
import TrainingSessionFormDialog from "@/components/modals/trainings/TrainingSessionFormDialog";
import { useModal } from "@/hooks/useModal";
import { useSelector } from "react-redux";
import { useTeams } from "@/hooks/useTeams";

const TrainingSessionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const isCoach = user?.roles?.includes("coach");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);

  const sessionModal = useModal();
  
  // Fetch teams for the filter dropdown
  const { data: teamsData } = useTeams({}, 1,); // Large page size to get all teams
  const teams = teamsData?.results || []; // Extract results array from paginated response

  const handleEditSession = (session) => {
    setSelectedSession(session);
    sessionModal.openModal();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Training Sessions"
          subtitle="Training Management"
          description="Manage and organize training sessions"
          buttonText="New Session"
          buttonIcon={Target}
          onButtonClick={() => {
            setSelectedSession(null);
            sessionModal.openModal();
          }}
          showBackButton={true}
          backButtonText="Back to Training"
          backButtonPath="/trainings"
        />
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <div className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden rounded-xl">
            <div className="relative">
              <TrainingSessionsList
                coachId={isCoach ? user?.id : null}
                onNewSession={() => sessionModal.openModal()}
                onEditSession={handleEditSession}
                teams={teams}
              />
            </div>
          </div>
        </div>
      </div>
      {/* New Session Modal */}
      <TrainingSessionFormDialog
        open={sessionModal.isOpen}
        onOpenChange={sessionModal.closeModal}
        sessionId={selectedSession?.id}
        onSuccess={() => {
          setCurrentPage(1);
          setSelectedSession(null);
        }}
      />
    </div>
  );
};

export default TrainingSessionsPage;
