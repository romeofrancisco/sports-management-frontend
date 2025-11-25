import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TrainingSessionsList from "@/components/trainings/sessions/TrainingSessionsList";

const TrainingSessionsPage = () => {

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
        <TrainingSessionsList />
      </div>
    </div>
  );
};

export default TrainingSessionsPage;
