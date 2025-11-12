import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";

// Hooks
import { useTeamDetails, useTeamScoringAnalytics } from "@/hooks/useTeams";
import { useTeamAnalyticsData } from "@/hooks/useTeamAnalyticsData";
import { useCoachPlayerProgress } from "@/api/dashboardApi";
import { useRolePermissions } from "@/hooks/useRolePermissions";

// Components
import { Button } from "@/components/ui/button";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import TeamModal from "@/components/modals/TeamModal";
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
const ANALYTICS_PERIOD = 90;

const processLastGamesForScoring = (games, maxGames = 10) => {
  if (!games?.results && !Array.isArray(games)) return [];

  const gamesList = games?.results || games || [];
  const completedGames = gamesList
    .filter((game) => game.status === "completed" || game.status === "finished")
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
    .slice(0, maxGames); // Take last maxGames games

  if (completedGames.length === 0) return [];

  // Group games by individual games for the chart
  const periods = [];

  completedGames.reverse().forEach((game, index) => {
    const gameDate = new Date(game.date);
    const periodLabel = gameDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Determine if this is a home or away game and extract relevant scores
    const isHomeGame = game.home_team_name || game.is_home;
    const pointsScored = isHomeGame
      ? game.home_team_score
      : game.away_team_score;
    const pointsConceded = isHomeGame
      ? game.away_team_score
      : game.home_team_score;

    periods.push({
      period: periodLabel,
      avg_points_scored: pointsScored || 0,
      avg_points_conceded: pointsConceded || 0,
      point_differential: (pointsScored || 0) - (pointsConceded || 0),
      games_played: 1,
      date: game.date,
    });
  });

  return periods;
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
    (training) => training.status === "upcoming"
  );

  const recent = trainingsArray.filter(
    (training) => training.status === "completed"
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
  teamGamesForScoring,
}) => {
  const { hasRole } = useRolePermissions();

  // Get scoring data, with fallback to last games if recent analytics is empty
  const getScoringData = () => {
    const processedScoringData = processGameScoringData(scoringAnalytics);

    // If we have no data from recent period, use last completed games
    if (!processedScoringData || processedScoringData.length === 0) {
      return processLastGamesForScoring(teamGamesForScoring);
    }

    return processedScoringData;
  };

  const scoringData = getScoringData();

  return (
    <div className="space-y-6">
      <div>
        <TeamScoringBarChart
          data={scoringData}
          title="Scoring Performance Analysis"
          subtitle={
            scoringData.length > 0 && scoringAnalytics?.scoring_data
              ? "Points scored vs conceded by period"
              : "Points scored vs conceded in recent games"
          }
        />
      </div>
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
    <div className="grid xl:block md:grid-cols-2 xl:col-span-1 gap-6 xl:space-y-6">
      {/* Hide QuickActions if user is player */}
      {/* {!hasRole("Player") && <QuickActions team={teamSlug} />} */}
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  
  // Use optimized coach endpoint with team filtering on server-side
  const { data: playerProgress, isLoading: progressLoading } =
    useCoachPlayerProgress(team);

  // Fetch team scoring analytics from backend
  const { data: scoringAnalytics, isLoading: scoringLoading } =
    useTeamScoringAnalytics(team, { days: ANALYTICS_PERIOD }, !!team);

  // Also get team details which includes all games for fallback scoring data
  const { data: teamDetailsForGames, isLoading: teamDetailsLoading } =
    useTeamDetails(team);

  const isLoading =
    analyticsLoading || progressLoading || scoringLoading || teamDetailsLoading;

  // Memoized computations
  const { games, trainings } = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];
    const gameFilters = filterGamesByDate(teamGames, todayString);
    const trainingFilters = filterTrainingsByDate(teamTrainings, todayString);

    return {
      games: gameFilters,
      trainings: trainingFilters,
    };
  }, [teamGames, teamTrainings]);

  if (isLoading) return <TeamDetailsSkeleton />;

  if (!teamDetails) {
    return <TeamNotFound onBack={() => navigate("/teams")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      {/* Team Header */}
      <section className="container mx-auto p-1 md:p-6 space-y-6">
        <UniversityPageHeader
          title={teamDetails.name}
          description="Monitor team performance, manage players, and track training progress"
          buttonText="Edit Team"
          buttonIcon={Edit}
          onButtonClick={() => setIsEditModalOpen(true)}
          showBackButton
          backButtonText="Back to Teams"
          backButtonPath="/teams"
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
      <section className="p-4 md:p-6 pt-0 md:pt-0">
        <QuickStatsCards stats={quickStats} />
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-6">
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
              transformedPlayerProgress={playerProgress}
              scoringAnalytics={scoringAnalytics}
              teamGamesForScoring={teamDetailsForGames?.games || teamGames}
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

      {/* Team Edit Modal */}
      <TeamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={teamDetails}
      />
    </div>
  );
};

export default TeamDetails;
