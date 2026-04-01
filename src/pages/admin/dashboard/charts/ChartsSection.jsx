import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ChartsSection = ({ overview, analytics }) => {
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

  return (
    <div className="space-y-6">
      {/* Primary Charts Row - 4 Column Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Health Chart - 1 column */}
        <div className="lg:col-span-1">
          <SystemHealthChart
            score={overview?.insights?.system_health_score || 50}
          />
        </div>
        {/* System Activity Chart - 3 columns (wider) */}
        <div className="lg:col-span-2">
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
        </div>
      </div>
      {/* Secondary Charts Row - 2 Column Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Teams Chart - swapped to first position */}
        <TopTeamsChart
          data={analytics?.performance_analytics?.top_teams || []}
        />

        {/* User Activity Chart */}
        <UserActivityChart
          data={{
            active_users_today:
              overview?.user_activity?.active_users_today || 0,
            active_users_week: overview?.user_activity?.active_users_week || 0,
            new_users_month: overview?.user_activity?.new_users_month || 0,
            new_users_week: overview?.user_activity?.new_users_week || 0,
          }}
        />
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowAdvancedCharts((prev) => !prev)}
          className="gap-2 w-full"
        >
          {showAdvancedCharts ? "Hide detailed analytics" : "Show detailed analytics"}
          {showAdvancedCharts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {!showAdvancedCharts ? (
        <p className="text-xs text-muted-foreground text-center">
          Showing essential charts only. Expand detailed analytics to see trends, distribution, and coach performance.
        </p>
      ) : (
        <>
      {/* Additional Charts Row - 2 Column Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Training Trend Chart */}
        <div className="lg:col-span-2">
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
        </div>

        {/* Training Attendance Chart */}
        <TrainingAttendanceChart
          data={{
            overall_attendance_rate:
              analytics?.training_analytics?.overall_attendance_rate || 0,
          }}
        />
      </div>
      {/* Coach Analytics Row */}

      <SportsDistributionChart data={overview?.distribution_stats} />

      <CoachEffectivenessChart data={analytics?.coach_analytics || []} />
        </>
      )}
    </div>
  );
};

export default ChartsSection;
