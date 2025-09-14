import React from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    </div>
  );
};

export default ChartsSection;
