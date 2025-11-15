import React from "react";
import { Users, CheckCircle, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewCards from "@/components/common/OverviewCards";

const QuickStatsOverview = ({
  attendanceSummary,
  metricsSummary,
  playerImprovements,
}) => {
  const statsData = [
    {
      title: "Total Players",
      value: attendanceSummary.total_players,
      description: "Total players in the training session",
      icon: Users,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceSummary.attendance_rate}%`,
      description: "Percentage of players who attended",
      icon: CheckCircle,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
    {
      title: "Metrics Recorded",
      value: metricsSummary.total_metrics_recorded,
      description: "Total performance metrics captured",
      icon: Target,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Players Improved",
      value: playerImprovements
        ? playerImprovements.filter((p) => p.overall_improvement_percentage > 0)
            .length
        : 0,
      description: "Players showing improvement",
      icon: TrendingUp,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="animate-in fade-in-50 duration-500 delay-100">
      <div className="px-0">
        <OverviewCards stats={statsData} />
      </div>
    </div>
  );
};

export default QuickStatsOverview;
