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
        <div className="bg-gradient-to-r from-card via-secondary/8 to-primary/8 rounded-xl p-4 md:p-6 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl animate-in fade-in-50 duration-500 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              {/* University Logo with enhanced styling */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-60"></div>
                <div className="relative bg-card p-2 rounded-lg shadow-lg border-2 border-secondary/30">
                  <img
                    src="/UPHSD-logo.png"
                    alt="University of Perpetual Help System DALTA"
                    className="h-10 sm:h-12 md:h-16 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="sm:border-l-2 sm:border-primary/40 sm:pl-4 md:pl-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gradient break-words">
                  Welcome Coach {user?.first_name || ""}!
                </h1>
                <p className="text-foreground mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold">
                  University of Perpetual Help System DALTA
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                  Manage your teams and track player progress
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-6 mt-4 lg:mt-0">
              <div className="flex items-center gap-2 md:gap-3 bg-card/80 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border-2 border-secondary/30 shadow-lg">
                <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse shadow-sm"></div>
                <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                  Dashboard Active
                </span>
              </div>
              {/* Enhanced University Colors Indicator */}
              <div className="flex gap-2 items-center bg-card/80 backdrop-blur-md rounded-full px-2 md:px-3 py-2 border-2 border-primary/30 shadow-lg">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-md border border-white/30"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-md border border-white/30"></div>
                <span className="text-xs font-semibold text-muted-foreground ml-1 whitespace-nowrap">
                  UPHSD
                </span>
              </div>
            </div>
          </div>
        </div>
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
