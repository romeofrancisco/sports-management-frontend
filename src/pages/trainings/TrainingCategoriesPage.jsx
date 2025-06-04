import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TrainingCategoriesList from "@/components/trainings/categories/TrainingCategoriesList";

const TrainingCategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">        <UniversityPageHeader
          title="Training Categories"
          subtitle="Training Management"
          description="Manage and organize training categories"
          showOnlineStatus={true}
          showUniversityColors={true}
          showBackButton={true}
          backButtonText="Back to Training"
          backButtonPath="/trainings"
        />
          <div className="animate-in fade-in-50 duration-500 delay-100">
          <div className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden rounded-xl">
            {/* Enhanced background effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>
            
            <div className="relative">
              <TrainingCategoriesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCategoriesPage;
