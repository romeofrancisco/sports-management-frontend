import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useTrainingOverview,
  useAssignedMetricsDetail,
} from "@/hooks/useTrainings";
import { usePlayerOverview } from "@/api/dashboardApi";
import OverviewStatsCards from "./overview/OverviewStatsCards";
import AssignedTrainingPreview from "./overview/AssignedTrainingPreview";
import Loading from "@/components/common/FullLoading";
import { ChartsSection } from "../../charts";

const TrainingOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [showAllAssigned, setShowAllAssigned] = useState(false);

  const {
    data: trainingStats,
    isLoading: isTrainingLoading,
    isError: isTrainingError,
  } = useTrainingOverview();
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = usePlayerOverview();
  const { data: assignedData, isLoading: isAssignedLoading } =
    useAssignedMetricsDetail({
      page: 1,
      page_size: showAllAssigned ? 20 : 3,
      status: "assigned",
    });

  // Fetch recent completed assigned sessions (even if absent)
  const { data: completedData, isLoading: isCompletedLoading } =
    useAssignedMetricsDetail({
      page: 1,
      page_size: 4,
      status: "completed",
    });

  const isLoading = isTrainingLoading || isOverviewLoading;
  const isError = isTrainingError || isOverviewError;

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Unable to Load Training Overview
          </h3>
          <p className="text-muted-foreground">
            Could not retrieve your training information. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Training Overview
        </h2>
        <p className="text-muted-foreground">
          Your training summary and performance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <OverviewStatsCards trainingStats={trainingStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ChartsSection user={user} overview={overview} />
          {/* Recent Completed Assigned Sessions */}
          <AssignedTrainingPreview
            assignedData={completedData}
            isAssignedLoading={isCompletedLoading}
            showAllAssigned={false}
            setShowAllAssigned={() => {}}
            hideShowAllButton={true}
            type="recent"
          />
        </div>
        {/* Side Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Assigned Training Preview */}
          <AssignedTrainingPreview
            assignedData={assignedData}
            isAssignedLoading={isAssignedLoading}
            showAllAssigned={showAllAssigned}
            setShowAllAssigned={setShowAllAssigned}
            type="assigned"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingOverview;
