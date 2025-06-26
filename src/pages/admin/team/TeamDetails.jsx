import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router";

// Hooks
import { useTeamDetails, useTeamScoringAnalytics } from "@/hooks/useTeams";
import { useTeamAnalyticsData } from "@/hooks/useTeamAnalyticsData";
import { useMultiPlayerProgress } from "@/hooks/useMultiPlayerProgress";
import { useRolePermissions } from "@/hooks/useRolePermissions";

// Components
import { Button } from "@/components/ui/button";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import {
  TeamKeyMetrics,
  QuickActions,
  TeamUpcomingGamesSection,
  TeamRecentGamesSection,
  TeamUpcomingTrainingSection,
  TeamRecentTrainingSection,
  TeamDetailsSkeleton,
} from "@/components/teams";
import QuickStatsCards from "@/components/teams/analytics/QuickStatsCards";
import {
  TeamStatsBreakdownChart,
  TeamPerformanceTrendsChart,
  TrainingAnalyticsChart,
  TeamScoringBarChart,
} from "@/components/charts/TeamAnalyticsCharts";
import { PlayerProgressSection } from "@/pages/coach/components";

// Utils
import {
  processStatsBreakdown,
  processPerformanceData,
  processTrainingData,
  processTrainingMetricsData,
  processGameScoringData,
  processPlayerAvailabilityData,
} from "@/utils/teamAnalyticsHelpers";

// Icons
import { ArrowLeft, Edit } from "lucide-react";

// Constants
const ANALYTICS_PERIOD = 30;

// Utility functions
const getDateRange = (days = ANALYTICS_PERIOD) => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    date_from: from.toISOString().split("T")[0],
    date_to: to.toISOString().split("T")[0],
  };
};

const transformPlayerProgress = (teamPlayerProgress) => {
  if (!teamPlayerProgress?.results) return null;

  return {
    player_progress: Object.entries(teamPlayerProgress.results).map(
      ([playerId, player]) => ({
        player_id: playerId,
        player_name: player.player_name,
        total_sessions: player.training_count || 0,
        attendance_rate: player.attendance_rate || 0,
        recent_metrics_count: player.recent_metrics_count || 0,
        last_training_date: player.last_training_date,
        recent_improvement: player.recent_improvement,
        overall_improvement: player.overall_improvement,
      })
    ),
  };
};

const filterGamesByDate = (games, todayString) => {
  const gamesArray = games?.results || games || [];

  const today = new Date(todayString);

  const upcoming = gamesArray.filter(
    (game) =>
      new Date(game.date) >= today &&
      ["scheduled", "upcoming"].includes(game.status)
  );

  const recent = gamesArray.filter(
    (game) =>
      new Date(game.date) < today &&
      ["completed", "finished"].includes(game.status)
  );

  return { upcoming, recent };
};

const filterTrainingsByDate = (trainings, todayString) => {
  const trainingsArray = trainings?.results || trainings || [];

  const upcoming = trainingsArray.filter(
    (training) => training.date >= todayString
  );

  const recent = trainingsArray.filter(
    (training) => training.date < todayString
  );

  return { upcoming, recent };
};

// Error boundary component
const TeamNotFound = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Team not found
      </h2>
      <p className="text-muted-foreground mb-4">
        The requested team could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>
    </div>
  </div>
);

// Main analytics section component
const TeamAnalyticsSection = ({
  statistics,
  trainingEffectiveness,
  teamTrainings,
  attendanceTrends,
  analytics,
  transformedPlayerProgress,
  scoringAnalytics,
}) => {
  const { hasRole } = useRolePermissions();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player Availability Chart */}
        <div className="col-span-2">
          <TrainingAnalyticsChart
            data={processTrainingData(
              trainingEffectiveness,
              teamTrainings,
              attendanceTrends,
              analytics
            )}
            title="Training Session Analysis"
          />
        </div>
        <TeamStatsBreakdownChart
          data={processStatsBreakdown(statistics)}
          title="Win/Loss Distribution"
        />
      </div>{" "}
      {/* New Training Metrics Chart */}
      <div>
        <TeamScoringBarChart
          data={processGameScoringData(scoringAnalytics)}
          title="Scoring Performance Analysis"
          subtitle="Points scored vs conceded by period"
        />
      </div>
      {/* Hide PlayerProgressSection if user is player */}
      {!hasRole("Player") && (
        <PlayerProgressSection playerProgress={transformedPlayerProgress} />
      )}
    </div>
  );
};

// Sidebar component
const TeamSidebar = ({
  teamSlug,
  upcomingGames,
  recentGames,
  upcomingTrainings,
  recentTrainings,
}) => {
  const { hasRole } = useRolePermissions();
  return (
    <div className="xl:col-span-1 space-y-6">
      {/* Hide QuickActions if user is player */}
      {!hasRole("Player") && <QuickActions team={teamSlug} />}
      <TeamUpcomingGamesSection games={upcomingGames} />
      <TeamUpcomingTrainingSection trainings={upcomingTrainings} />
      <TeamRecentTrainingSection trainings={recentTrainings} />
      <TeamRecentGamesSection games={recentGames} />
    </div>
  );
};

const TeamDetails = () => {
  const { team } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useRolePermissions();

  // Use the existing comprehensive analytics hook
  const {
    teamDetails,
    analytics,
    performance,
    games: teamGames,
    trainings: teamTrainings,
    statistics,
    attendanceTrends,
    trainingEffectiveness,
    quickStats,
    isLoading: analyticsLoading,
  } = useTeamAnalyticsData(team, ANALYTICS_PERIOD);
  // Fetch team player progress separately
  const { data: teamPlayerProgress, isLoading: progressLoading } =
    useMultiPlayerProgress({
      teamSlug: team,
      filters: {
        metric: "overall",
        ...getDateRange(),
      },
      enabled: !!team,
    });

  // Fetch team scoring analytics from backend
  const { data: scoringAnalytics, isLoading: scoringLoading } =
    useTeamScoringAnalytics(team, { days: ANALYTICS_PERIOD }, !!team);

  const isLoading = analyticsLoading || progressLoading || scoringLoading;

  // Memoized computations
  const { games, trainings, transformedPlayerProgress } = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];
    const gameFilters = filterGamesByDate(teamGames, todayString);
    const trainingFilters = filterTrainingsByDate(teamTrainings, todayString);
    const playerProgress = transformPlayerProgress(teamPlayerProgress);

    return {
      games: gameFilters,
      trainings: trainingFilters,
      transformedPlayerProgress: playerProgress,
    };
  }, [teamGames, teamTrainings, teamPlayerProgress]);

  if (isLoading) return <TeamDetailsSkeleton />;

  if (!teamDetails) {
    return <TeamNotFound onBack={() => navigate("/teams")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      {/* Team Header */}
      <section className="p-4 md:p-6">
        <UniversityPageHeader
          title={teamDetails.name}
          description="Monitor team performance, manage players, and track training progress"
          buttonText="Edit Team"
          buttonIcon={Edit}
          onButtonClick={() => navigate(`/teams/${team}/edit`)}
          showBackButton
          backButtonText="Back to Teams"
          backButtonPath="/teams"
          showUniversityColors
          teamLogo={teamDetails.logo}
          teamName={teamDetails.name}
          // Hide Edit Team button if user is player
          {...(hasRole("Player") && {
            buttonText: undefined,
            buttonIcon: undefined,
            onButtonClick: undefined,
          })}
        />
      </section>

      {/* Quick Stats Cards */}
      <section className="p-4 md:p-6">
        <QuickStatsCards stats={quickStats} />
      </section>

      {/* Main Content */}
      <section className="p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="xl:col-span-2 space-y-6">
            <TeamKeyMetrics data={teamDetails} />
            <TeamAnalyticsSection
              statistics={statistics}
              trainingEffectiveness={trainingEffectiveness}
              teamTrainings={teamTrainings}
              attendanceTrends={attendanceTrends}
              analytics={analytics}
              transformedPlayerProgress={transformedPlayerProgress}
              scoringAnalytics={scoringAnalytics}
            />
            {/* Removed recent games and trainings from main content */}
          </div>

          {/* Sidebar */}
          <TeamSidebar
            teamSlug={team}
            upcomingGames={games.upcoming}
            recentGames={games.recent}
            upcomingTrainings={trainings.upcoming}
            recentTrainings={trainings.recent}
          />
        </div>
      </section>
    </div>
  );
};

export default TeamDetails;
