import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { MetricUnitsManager } from "@/components/trainings/units/MetricUnitsManager";

const TrainingUnitsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Measurement Units"
          subtitle="Training Management"
          description="Manage measurement units for training metrics"
          showOnlineStatus={true}
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Training"
          backButtonPath="/trainings"
        />
        <div className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden rounded-xl">
          <MetricUnitsManager />
        </div>
      </div>
    </div>
  );
};

export default TrainingUnitsPage;
