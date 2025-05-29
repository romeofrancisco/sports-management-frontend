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
} from "@/components/charts/AdminDashboardCharts";

const ChartsSection = ({ overview, analytics }) => {
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            Analytics Dashboard
          </h2>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
      {/* Primary Charts Row - 4 Column Grid */}
      <div className="grid gap-6 lg:grid-cols-3">        {/* System Health Chart - 1 column */}        <div className="lg:col-span-1">
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
      </div>      {/* Coach Analytics Row */}
      <div className="grid gap-6">
        <CoachEffectivenessChart data={analytics?.coach_analytics || []} />
      </div>
      </CardContent>
    </Card>
  );
};

export default ChartsSection;
