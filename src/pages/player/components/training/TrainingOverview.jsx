import React from "react";
import { useSelector } from "react-redux";
import { usePlayerOverview } from "@/api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Trophy, Clock } from "lucide-react";
import Loading from "@/components/common/FullLoading";

const TrainingOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: overview, isLoading, isError } = usePlayerOverview();

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Unable to Load Training Overview
          </h3>
          <p className="text-muted-foreground">
            Could not retrieve your training information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const personalStats = overview?.personal_stats || {};
  const teamInfo = overview?.team_info || {};
  const upcomingSessions = overview?.upcoming_sessions || [];
  const recentMetrics = overview?.recent_metrics || [];

  // Overview stats cards
  const overviewStats = [
    {
      title: "Training Sessions",
      value: personalStats?.total_sessions_last_30_days || 0,
      description: "Last 30 days",
      icon: Target,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-primary",
    },
    {
      title: "Attendance Rate",
      value: `${personalStats?.attendance_rate?.toFixed(1) || 0}%`,
      description: "Overall attendance",
      icon: Trophy,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-secondary",
    },
    {
      title: "Attended Sessions",
      value: personalStats?.attended_sessions || 0,
      description: "Total attended",
      icon: Calendar,
      color: "from-primary/60 via-secondary/60 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-secondary",
    },
    {
      title: "Team Sessions",
      value: teamInfo?.total_players || 0,
      description: "Teammates",
      icon: Clock,
      color: "from-secondary/60 via-primary/60 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-primary",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Training Overview</h2>
        <p className="text-muted-foreground">Your training summary and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="bg-card shadow-lg border-2 border-primary/10 hover:shadow-xl transition-all duration-300 hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="font-semibold text-sm text-foreground">
                  {stat.title}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">Upcoming Sessions</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Your scheduled training sessions
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.slice(0, 5).map((session, index) => (
                <div
                  key={session.id || index}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
                >
                  <div>
                    <h4 className="font-medium text-foreground">
                      {session.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} at{" "}
                      {session.start_time}
                    </p>
                    {session.location && (
                      <p className="text-xs text-muted-foreground">
                        📍 {session.location}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-primary/10">
                    Scheduled
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No upcoming sessions scheduled
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="bg-card shadow-lg border-2 border-secondary/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-secondary/15 to-primary/15 rounded-lg">
                <Trophy className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <span className="text-lg font-semibold">Recent Performance</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Latest training metrics
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMetrics.length > 0 ? (
              recentMetrics.slice(0, 5).map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
                >
                  <div>
                    <h4 className="font-medium text-foreground">
                      {metric.metric_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(metric.session_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {metric.value} {metric.unit}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No recent performance data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Information */}
      {teamInfo && (
        <Card className="bg-card shadow-lg border-2 border-primary/10 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">Team Information</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Your current team details
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold text-foreground">Team</h4>
                <p className="text-muted-foreground">{teamInfo.name || "N/A"}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold text-foreground">Sport</h4>
                <p className="text-muted-foreground">{teamInfo.sport || "N/A"}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold text-foreground">Coach</h4>
                <p className="text-muted-foreground">{teamInfo.coach || "N/A"}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold text-foreground">Team Size</h4>
                <p className="text-muted-foreground">{teamInfo.total_players || 0} players</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingOverview;
