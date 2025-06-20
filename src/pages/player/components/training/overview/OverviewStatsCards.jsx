import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Clock, CheckCircle } from "lucide-react";

const OverviewStatsCards = ({ trainingStats }) => {
  // Overview stats cards using new training overview endpoint
  const overviewStats = [
    {
      title: "Total Training Sessions",
      value: (
        <>
          <span className="text-primary font-bold">
            {trainingStats?.attended_count || 0}
          </span>
          <span className="text-muted-foreground">
            /{trainingStats?.total_sessions || 0}
          </span>
        </>
      ),
      description: "Attended / Total (all time)",
      icon: <Target className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${trainingStats?.attendance_percentage || 0}%`,
      description: "All time",
      icon: <CheckCircle className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Recent Improvement",
      value: `${trainingStats?.recent_improvement >= 0 ? "+" : ""}${
        trainingStats?.recent_improvement || 0
      }%`,
      description: "Last 90 days improvement",
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg:
        trainingStats?.recent_improvement >= 0 ? "bg-orange-500" : "bg-red-500",
      textAccent:
        trainingStats?.recent_improvement >= 0
          ? "text-orange-600"
          : "text-red-600",
    },
    {
      title: "Late Arrivals",
      value: trainingStats?.late_count || 0,
      description: "All time",
      icon: <Clock className="h-5 w-5 text-white" />,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      bgColor: "bg-red-500/8",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500",
      textAccent: "text-red-600",
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat, idx) => (
        <Card
          key={stat.title || idx}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            stat.bgColor || ""
          } ${stat.borderColor || ""} border`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              stat.color || ""
            } opacity-5`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg ${
                stat.iconBg || ""
              } shadow-lg transition-transform duration-300 hover:scale-110`}
            >
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${stat.textAccent || ""} mb-1`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStatsCards;
