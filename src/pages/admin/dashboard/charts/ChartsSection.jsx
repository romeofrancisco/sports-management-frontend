import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardService } from "@/api/dashboardApi";
import useChartSummaryModal from "@/hooks/useChartSummaryModal";
import ChartSummaryModal from "@/components/charts/ChartSummaryModal";
import {
  SystemActivityChart,
  UserActivityChart,
  TrainingAttendanceChart,
  TopTeamsChart,
  CoachEffectivenessChart,
  SystemHealthChart,
  TrainingTrendChart,
  SportsDistributionChart,
} from "@/components/charts/AdminDashboardCharts";

const SummaryChartWrapper = ({
  onOpen,
  enabled = true,
  className = "",
  children,
}) => {
  const handleKeyDown = (event) => {
    if (!enabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      onClick={enabled ? onOpen : undefined}
      onKeyDown={handleKeyDown}
      role={enabled ? "button" : undefined}
      tabIndex={enabled ? 0 : undefined}
      className={`${enabled ? "cursor-pointer" : ""} ${className}`}
      aria-label={enabled ? "Open chart summary" : undefined}
    >
      {children}
    </div>
  );
};

const ChartsSection = ({ overview, analytics }) => {
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading,
    openSummary,
  } = useChartSummaryModal({
    fetchSummary: (chartType) => dashboardService.getAdminChartSummary(chartType),
  });

  const hasTopTeams = (analytics?.performance_analytics?.top_teams || []).length > 0;
  const hasUserActivity = !!overview?.user_activity;
  const hasTrainingTrend =
    (analytics?.training_analytics?.monthly_trend?.values || []).length > 0;
  const hasTrainingAttendance =
    (analytics?.training_analytics?.overall_attendance_rate || 0) > 0;
  const hasSportsDistribution =
    (overview?.distribution_stats?.teams_by_sport || []).length > 0;
  const hasCoachEffectiveness = (analytics?.coach_analytics || []).length > 0;
  const hasSystemActivity = !!overview?.recent_activity;

  return (
    <div className= "space-y-6">
      {/* Primary Charts Row - 4 Column Grid */}
      <div className= "grid gap-6 lg:grid-cols-3">
        {/* System Health Chart - 1 column */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "system_health",
              fallbackTitle: "System Health",
            })
          }
          enabled={true}
          className= "lg:col-span-1"
        >
          <SystemHealthChart
            score={overview?.insights?.system_health_score || 50}
          />
        </SummaryChartWrapper>
        {/* System Activity Chart - 3 columns (wider) */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "system_activity",
              fallbackTitle: "System Activity",
            })
          }
          enabled={hasSystemActivity}
          className= "lg:col-span-2"
        >
          <SystemActivityChart
            data={{
              games_this_month:
                overview?.recent_activity?.games_this_month || 0,
              completed_games_month:
                overview?.recent_activity?.completed_games_month || 0,
              training_sessions_month:
                analytics?.training_analytics?.monthly_sessions || 0,
              games_scheduled: analytics?.game_analytics?.scheduled_games || 0,
              upcoming_trainings:
                overview?.recent_activity?.upcoming_trainings || 0,
            }}
          />
        </SummaryChartWrapper>
      </div>
      {/* Secondary Charts Row - 2 Column Grid */}
      <div className= "grid gap-6 lg:grid-cols-2">
        {/* Top Teams Chart - swapped to first position */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "top_teams",
              fallbackTitle: "Top Performing Teams",
            })
          }
          enabled={hasTopTeams}
        >
          <TopTeamsChart
            data={analytics?.performance_analytics?.top_teams || []}
          />
        </SummaryChartWrapper>

        {/* User Activity Chart */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "user_activity",
              fallbackTitle: "User Activity & Engagement",
            })
          }
          enabled={hasUserActivity}
        >
          <UserActivityChart
            data={{
              active_users_today:
                overview?.user_activity?.active_users_today || 0,
              active_users_week: overview?.user_activity?.active_users_week || 0,
              new_users_month: overview?.user_activity?.new_users_month || 0,
              new_users_week: overview?.user_activity?.new_users_week || 0,
            }}
          />
        </SummaryChartWrapper>
      </div>

      <div className= "flex items-center justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowAdvancedCharts((prev) => !prev)}
          className= "gap-2 w-full"
        >
          {showAdvancedCharts ? "Hide detailed analytics" : "Show detailed analytics"}
          {showAdvancedCharts ? <ChevronUp className= "h-4 w-4" /> : <ChevronDown className= "h-4 w-4" />}
        </Button>
      </div>

      {!showAdvancedCharts ? (
        <p className= "text-xs text-muted-foreground text-center">
          Showing essential charts only. Expand detailed analytics to see trends, distribution, and coach performance.
        </p>
      ) : (
        <>
      {/* Additional Charts Row - 2 Column Grid */}
      <div className= "grid gap-6 lg:grid-cols-3">
        {/* Training Trend Chart */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "training_trend",
              fallbackTitle: "Training Trend",
            })
          }
          enabled={hasTrainingTrend}
          className= "lg:col-span-2"
        >
          <TrainingTrendChart
            data={{
                monthly_sessions:
                  analytics?.training_analytics?.monthly_sessions || 0,
                training_trend:
                  analytics?.training_analytics?.training_trend || "stable",
                // Pass backend-provided monthly trend for chart labels/values
                monthly_trend: analytics?.training_analytics?.monthly_trend || null,
            }}
          />
        </SummaryChartWrapper>

        {/* Training Attendance Chart */}
        <SummaryChartWrapper
          onOpen={() =>
            openSummary({
              chartType: "training_attendance",
              fallbackTitle: "Training Attendance",
            })
          }
          enabled={hasTrainingAttendance}
        >
          <TrainingAttendanceChart
            data={{
              overall_attendance_rate:
                analytics?.training_analytics?.overall_attendance_rate || 0,
            }}
          />
        </SummaryChartWrapper>
      </div>
      {/* Coach Analytics Row */}

      <SummaryChartWrapper
        onOpen={() =>
          openSummary({
            chartType: "sports_distribution",
            fallbackTitle: "Sports Distribution",
          })
        }
        enabled={hasSportsDistribution}
      >
        <SportsDistributionChart data={overview?.distribution_stats} />
      </SummaryChartWrapper>

      <SummaryChartWrapper
        onOpen={() =>
          openSummary({
            chartType: "coach_effectiveness",
            fallbackTitle: "Coach Effectiveness",
          })
        }
        enabled={hasCoachEffectiveness}
      >
        <CoachEffectivenessChart data={analytics?.coach_analytics || []} />
      </SummaryChartWrapper>
        </>
      )}

      <ChartSummaryModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        isLoading={isLoading}
        error={error}
        analysis={analysis}
        summaryLines={summaryLines}
      />
    </div>
  );
};

export default ChartsSection;
