import React, { useState } from "react";
import { Target } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TrainingSessionsList from "@/components/trainings/sessions/TrainingSessionsList";
import { useSelector } from "react-redux";
import { useTeams } from "@/hooks/useTeams";

const TrainingSessionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const isCoach = user?.roles?.includes("coach");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);

  
  // Fetch teams for the filter dropdown
  const { data: teamsData } = useTeams({}, 1,); // Large page size to get all teams
  const teams = teamsData?.results || []; // Extract results array from paginated response

  const handleEditSession = (session) => {
    setSelectedSession(session);
    sessionModal.openModal();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
          <UniversityPageHeader
            title="Training Sessions"
            subtitle="Training Management"
            description="Manage and organize training sessions"
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
        {/* Dialog moved into TrainingSessionsList */}
    </div>
  );
};

export default TrainingSessionsPage;
