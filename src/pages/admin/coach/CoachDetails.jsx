import React from "react";
import { useParams } from "react-router-dom";
import { useCoach } from "@/hooks/useCoaches";
import { useCoachOverviewById, useCoachPlayerProgressById } from "@/api/dashboardApi";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, User, Trophy, Users, Target, Calendar, MapPin } from "lucide-react";

// Import coach dashboard components for reuse
import {
  DashboardSkeleton,
  OverviewCards,
  PerformanceSummary,
  MyTeamsSection,
  UpcomingGamesSection,
  RecentTrainingSection,
  PlayerProgressSection,
  TrainingSummarySection,
  RecentGamesSection,
  UpcomingTrainingSection,
} from "@/pages/coach/components";
import { ChartsSection } from "@/pages/coach/charts";

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

const CoachDetails = () => {
  const { coach: coachParam } = useParams();

  // Fetch specific coach data by ID
  const {
    data: coach,
    isLoading: coachLoading,
    error: coachError,
  } = useCoach(coachParam);

  // Get dashboard data for the specific coach
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useCoachOverviewById(coachParam);
  
  const {
    data: playerProgress,
    isLoading: progressLoading,
    error: progressError,
  } = useCoachPlayerProgressById(coachParam);

  if (coachLoading || overviewLoading || progressLoading) {
    return <DashboardSkeleton />;
  }

  if (coachError || overviewError || progressError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-4">
          <h3 className="text-destructive font-semibold">
            Error Loading Coach Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {coachError?.message ||
              overviewError?.message ||
              progressError?.message ||
              "Failed to load coach data"}
          </p>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="p-6">
        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Coach Not Found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            The requested coach could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        {/* Enhanced Header */}
        <UniversityPageHeader
          showBackButton={true}
          backButtonText="Back to Coaches"
          title={`Coach ${coach.full_name}`}
          description="Detailed view of coach profile and performance metrics"
          showUniversityColors={true}
        />

        {/* Dashboard Data Section (if available) */}
        {overview && (
          <>
            {/* Overview Cards */}
            <div className="animate-in fade-in-50 duration-500 delay-200">
              <OverviewCards overview={overview} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Primary Content */}
              <div className="xl:col-span-2 space-y-6">
                {/* Performance Summary Section */}
                {playerProgress && (
                  <div className="animate-in fade-in-50 duration-500 delay-300">
                    <PerformanceSummary playerProgress={playerProgress} />
                  </div>
                )}

                {/* Charts Section */}
                <div className="animate-in fade-in-50 duration-500 delay-400">
                  <ChartsSection
                    overview={overview}
                    playerProgress={playerProgress}
                  />
                </div>

                {/* Player Progress */}
                {playerProgress && (
                  <div className="animate-in fade-in-50 duration-500 delay-500">
                    <PlayerProgressSection playerProgress={playerProgress} />
                  </div>
                )}
              </div>

              {/* Right Column - Secondary Content */}
              <div className="xl:col-span-1 space-y-6">
                {/* My Teams */}
                <div className="animate-in fade-in-50 duration-500 delay-300">
                  <MyTeamsSection overview={overview} />
                </div>

                {/* Upcoming Games */}
                <div className="animate-in fade-in-50 duration-500 delay-350">
                  <UpcomingGamesSection overview={overview} />
                </div>

                {/* Upcoming Training Sessions */}
                <div className="animate-in fade-in-50 duration-500 delay-400">
                  <UpcomingTrainingSection overview={overview} />
                </div>

                {/* Recent Training Sessions */}
                <div className="animate-in fade-in-50 duration-500 delay-450">
                  <RecentTrainingSection overview={overview} />
                </div>

                {/* Recent Games */}
                <div className="animate-in fade-in-50 duration-500 delay-500">
                  <RecentGamesSection overview={overview} />
                </div>

                {/* Training Summary */}
                <div className="animate-in fade-in-50 duration-500 delay-550">
                  <TrainingSummarySection overview={overview} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* If no dashboard data, show basic info message */}
        {!overview && !overviewLoading && (
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4 mx-auto w-fit">
                <Users className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Coach Profile View
              </h3>
              <p className="text-muted-foreground">
                This is a view-only profile for {coach?.full_name}. Dashboard metrics and detailed analytics are only available when coaches view their own profile.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoachDetails;
