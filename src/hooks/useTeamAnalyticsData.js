import { useMemo } from "react";
import {
  useTeamAnalytics,
  useTeamPerformance,
  useTeamGames,
  useAllTeamGames,
  useTeamTrainingSessions,
  useTeamStatistics,
  useTeamDetails,
} from "@/hooks/useTeams";
import {
  useAttendanceTrends,
  useAttendanceOverview,
} from "@/hooks/useAttendanceAnalytics";
import {
  useTeamOverviewMetrics,
  useTrainingEffectiveness,
  useDashboardAnalytics,
} from "@/hooks/useTeamAnalytics";

export const useTeamAnalyticsData = (teamSlug, timeRange = 30) => {
  // Prepare filters for the new team analytics services
  const analyticsFilters = {
    team_id: teamSlug, // Backend expects team_id parameter with team slug value
    days: timeRange,
  };
  // Removed team overview metrics - now directly displaying upcoming events
  const teamOverviewMetrics = null;
  const overviewMetricsLoading = false;
  const { data: trainingEffectiveness, isLoading: effectivenessLoading } =
    useTrainingEffectiveness(analyticsFilters);
  const { data: dashboardAnalytics, isLoading: dashboardAnalyticsLoading } =
    useDashboardAnalytics(analyticsFilters);

  // Fetch existing team data
  const {
    data: analytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useTeamAnalytics(teamSlug, timeRange);  const { data: performance, isLoading: performanceLoading } =
    useTeamPerformance(teamSlug);
  const { data: games, isLoading: gamesLoading } = useAllTeamGames(teamSlug);
  const { data: trainings, isLoading: trainingsLoading } =
    useTeamTrainingSessions(teamSlug, { limit: 10 });
  const { data: statistics, isLoading: statisticsLoading } =
    useTeamStatistics(teamSlug);
  const { data: teamDetails, isLoading: teamDetailsLoading } =
    useTeamDetails(teamSlug);

  // Fetch comprehensive attendance analytics data
  const { data: attendanceTrends, isLoading: attendanceTrendsLoading } =
    useAttendanceTrends({
      team_id: teamSlug, // Backend expects team_id parameter with team slug value
      period: "weekly",
    });

  const { data: attendanceOverview, isLoading: attendanceOverviewLoading } =
    useAttendanceOverview({
      team_id: teamSlug, // Backend expects team_id parameter with team slug value
    });

  const isLoading =
    analyticsLoading ||
    performanceLoading ||
    gamesLoading ||
    trainingsLoading ||
    statisticsLoading ||
    attendanceTrendsLoading ||
    attendanceOverviewLoading ||
    teamDetailsLoading ||
    overviewMetricsLoading ||
    effectivenessLoading ||
    dashboardAnalyticsLoading;

  // Quick stats calculation
  const quickStats = useMemo(() => {
    if (!analytics) return {};

    return {
      total_games: analytics.completed_games || 0,
      win_rate: analytics.win_rate || 0,
      total_trainings: analytics.total_trainings || 0,
      avg_attendance: analytics.average_attendance || 0,
      active_players: analytics.total_players || 0,
      recent_trend: "stable", // Can be calculated from performance data later
    };
  }, [analytics]);

  return {
    // Raw data
    analytics,
    performance,
    games,
    trainings,
    statistics,
    teamDetails,
    attendanceTrends,
    attendanceOverview,
    teamOverviewMetrics,
    trainingEffectiveness,
    dashboardAnalytics,

    // Processed data
    quickStats,

    // Loading states
    isLoading,

    // Actions
    refetchAnalytics,
  };
};
