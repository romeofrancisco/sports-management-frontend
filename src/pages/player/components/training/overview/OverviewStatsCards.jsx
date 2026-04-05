import React from "react";
import CommonOverviewCards from "@/components/common/OverviewCards";
import { Target, TrendingUp, Clock, CheckCircle } from "lucide-react";

const OverviewStatsCards = ({ trainingStats }) => {
  // Prepare stats in the common shape expected by CommonOverviewCards
  const overviewStats = [
    {
      title: "Total Training Sessions",
      value: (
        <>
          <span className= "text-primary font-bold">
            {trainingStats?.attended_count || 0}
          </span>
          <span className= "">
            /{trainingStats?.total_sessions || 0}
          </span>
        </>
      ),
      description: "Attended / Total (all time)",
      icon: Target,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${trainingStats?.attendance_percentage || 0}%`,
      description: "All time",
      icon: CheckCircle,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Recent Improvement",
      value: `${trainingStats?.recent_improvement >= 0 ? "+" : ""}${
        trainingStats?.recent_improvement || 0
      }%`,
      description: "Last 90 days improvement",
      icon: TrendingUp,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg:
        trainingStats?.recent_improvement >= 0 ? "bg-primary" : "bg-destructive",
      iconColor:
        trainingStats?.recent_improvement >= 0 ? "text-primary" : "text-destructive-foreground",
    },
    {
      title: "Late Arrivals",
      value: trainingStats?.late_count || 0,
      description: "All time",
      icon: Clock,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
  ];

  return <CommonOverviewCards stats={overviewStats} />;
};

export default OverviewStatsCards;
