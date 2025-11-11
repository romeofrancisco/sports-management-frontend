import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  usePlayerOverviewById,
  usePlayerProgressById,
} from "@/api/dashboardApi";
import { usePlayerDetails } from "@/hooks/usePlayers";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";

// Import reusable components from PlayerDashboard
import {
  DashboardSkeleton,
  OverviewCards,
  PlayerProfileSection,
  UpcomingActivitiesSection,
  RecentMetricsSection,
  PersonalProgressSection,
  ProgressSummarySection,
} from "@/pages/player/components/dashboard";
import { ChartsSection } from "@/pages/player/charts";

const PlayerDetails = () => {
  const { player } = useParams(); // This is now the player ID
  const navigate = useNavigate();

  // Parse the player ID from URL params (it should be numeric)
  const userId = parseInt(player, 10);
  // Get player details using the ID (backend supports lookup by both ID and slug)
  // The fetchPlayerDetails API can accept either player ID or slug for lookup
  const {
    data: playerDetailsData,
    isLoading: playerDetailsLoading,
    error: playerDetailsError,
  } = usePlayerDetails(player, !!player && !isNaN(userId));

  // Get date range (last 3 months)
  const dateRange = useMemo(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 90);
    return {
      date_from: from.toISOString().split("T")[0],
      date_to: to.toISOString().split("T")[0],
    };
  }, []);
  // Fetch player dashboard data using the user ID (we have it directly from URL)
  const {
    data: playerOverview,
    isLoading: overviewLoading,
    error: overviewError,
  } = usePlayerOverviewById(userId, !!userId && !isNaN(userId));

  const {
    data: playerProgress,
    isLoading: progressLoading,
    error: progressError,
  } = usePlayerProgressById(userId, !!userId && !isNaN(userId));
  // Handle loading states
  if (playerDetailsLoading || overviewLoading || progressLoading) {
    return <DashboardSkeleton />;
  }

  // Handle invalid player ID
  if (isNaN(userId) || userId <= 0) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">Invalid Player ID</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The player ID provided in the URL is not valid.
          </p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (playerDetailsError || overviewError || progressError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">
            Error Loading Player Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {playerDetailsError?.message ||
              overviewError?.message ||
              progressError?.message ||
              "Failed to load player data"}
          </p>
        </div>
      </div>
    );
  } // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Transform dashboard data to match component expectations
  // The dashboard API returns data in the correct structure already
  const personalStats = {
    // Use data from player overview
    attendance_rate: playerOverview?.personal_stats?.attendance_rate || 0,
    total_sessions_last_30_days:
      playerOverview?.personal_stats?.total_sessions_last_30_days || 0,
    attended_sessions: playerOverview?.personal_stats?.attended_sessions || 0,
    jersey_number: playerOverview?.personal_stats?.jersey_number,
    positions: playerOverview?.personal_stats?.positions || [],
    height: playerOverview?.personal_stats?.height,
    weight: playerOverview?.personal_stats?.weight,
  };

  const teamInfo = playerOverview?.team_info || {};
  // Create user object from player details data
  const user = {
    first_name: playerDetailsData?.first_name || "",
    last_name: playerDetailsData?.last_name || "",
    full_name:
      playerDetailsData?.full_name ||
      `${playerDetailsData?.first_name || ""} ${
        playerDetailsData?.last_name || ""
      }`.trim(),
    id: userId, // The user ID
  };

  // Create overview structure for components
  const overview = {
    personal_stats: personalStats,
    team_info: teamInfo,
    recent_metrics: playerOverview?.recent_metrics || [],
    upcoming_games: playerOverview?.upcoming_games || [],
    upcoming_sessions: playerOverview?.upcoming_sessions || [],
    recent_stats: playerOverview?.recent_stats || {},
    training_summary: playerOverview?.training_summary || {},
  };

  // Progress data structure
  const progressData = {
    progress_summary: playerProgress?.progress_summary || {},
    metric_trends: playerProgress?.metric_trends || {},
    progress_metrics: playerProgress?.progress_metrics || [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        {/* Enhanced Header */}
        <UniversityPageHeader
          title={user?.full_name || "Player"}
          subtitle="Player Management"
          description="View comprehensive player performance and progress data"
          backButton={true}
          backButtonText="Back to Players"
          backButtonPath="/players"
          showOnlineStatus={false}
          showUniversityColors={true}
        />

        {/* Overview Cards */}
        <div className="animate-in fade-in-50 duration-500 delay-150">
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
                <ProgressSummarySection
                  progress={progressData}
                  playerId={player}
                />
              </div>
            </div>

            {/* Charts Section */}
            <div className="animate-in fade-in-50 duration-500 delay-500">
              <ChartsSection user={user} overview={overview} />
            </div>

            {/* Personal Progress Section */}
            <div className="animate-in fade-in-50 duration-500 delay-300">
              <PersonalProgressSection progress={progressData} />
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

export default PlayerDetails;
