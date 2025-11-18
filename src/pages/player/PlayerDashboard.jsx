import React from "react";
import { useSelector } from "react-redux";
import { usePlayerOverview, usePlayerProgress } from "@/api/dashboardApi";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

// Import refactored components using index files for cleaner imports
import {
  DashboardSkeleton,
  OverviewCards,
  PlayerProfileSection,
  UpcomingActivitiesSection,
  RecentMetricsSection,
  PersonalProgressSection,
  ProgressSummarySection,
} from "./components/dashboard";
import { ChartsSection } from "./charts";

const PlayerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = usePlayerOverview();
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = usePlayerProgress();

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

  const personalStats = overview?.personal_stats;
  const teamInfo = overview?.team_info;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header with University Logo */}
        <UniversityPageHeader
          title={`Welcome ${user?.first_name || "Player"}!`}
          subtitle="Player Portal"
          description="Track your performance and upcoming activities"
          showOnlineStatus={true}
          showUniversityColors={true}
        />

        {/* Overview Cards */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <OverviewCards overview={overview} personalStats={personalStats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Player Profile Section */}
            <div className="animate-in fade-in-50 duration-500 delay-200 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <PlayerProfileSection
                user={user}
                personalStats={personalStats}
                teamInfo={teamInfo}
              />
              {/* Progress Summary */}
              <div className="animate-in fade-in-50 duration-500 delay-400">
                <ProgressSummarySection progress={progress} />
              </div>
            </div>
            {/* Charts Section */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <ChartsSection user={user} overview={overview} />
            </div>

            {/* Personal Progress Section */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <PersonalProgressSection progress={progress} />
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-1 space-y-6">
            {/* Upcoming Activities */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <UpcomingActivitiesSection overview={overview} />
            </div>

            {/* Recent Metrics */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <RecentMetricsSection overview={overview} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
