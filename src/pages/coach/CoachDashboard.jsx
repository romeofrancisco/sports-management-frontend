import React from "react";
import { useCoachOverview, useCoachPlayerProgress } from "@/api/dashboardApi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

// Import refactored components using index files for cleaner imports
import {
  DashboardSkeleton,
  OverviewCards,
  PerformanceSummary,
  MyTeamsSection,
  UpcomingGamesSection,
  RecentTrainingSection,
  PlayerProgressSection,
  TrainingSummarySection,
} from "./components";
import { ChartsSection } from "./charts";
import { useSelector } from "react-redux";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const CoachDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useCoachOverview();
  const {
    data: playerProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useCoachPlayerProgress();

  if (overviewLoading || progressLoading) {
    return <DashboardSkeleton />;
  }

  if (overviewError || progressError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">
            Error Loading Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {overviewError?.message ||
              progressError?.message ||
              "Failed to load dashboard data"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8"> 
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title={`Welcome Coach ${user?.first_name || ""}!`}
          description="Manage your teams and track player progress"
          showOnlineStatus={true}
          showUniversityColors={true}
        />
        {/* Overview Cards */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <OverviewCards overview={overview} />
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Performance Summary Section */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <PerformanceSummary playerProgress={playerProgress} />
            </div>

            {/* Charts Section */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <ChartsSection
                overview={overview}
                playerProgress={playerProgress}
              />
            </div>

            {/* Player Progress */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <PlayerProgressSection playerProgress={playerProgress} />
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-1 space-y-6">
            {/* My Teams */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <MyTeamsSection overview={overview} />
            </div>

            {/* Upcoming Games */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <UpcomingGamesSection overview={overview} />
            </div>

            {/* Recent Training Sessions */}
            <div className="animate-in fade-in-50 duration-500 delay-400">
              <RecentTrainingSection overview={overview} />
            </div>

            {/* Training Summary */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <TrainingSummarySection overview={overview} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
