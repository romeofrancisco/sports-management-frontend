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
          <span className="text-primary font-bold">
            {trainingStats?.attended_count || 0}
          </span>
          <span className="">
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
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
    {
      title: "Recent Improvement",
      value: `${trainingStats?.recent_improvement >= 0 ? "+" : ""}${
        trainingStats?.recent_improvement || 0
      }%`,
      description: "Last 90 days improvement",
      icon: TrendingUp,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      iconBg:
        trainingStats?.recent_improvement >= 0 ? "bg-orange-500" : "bg-red-500",
      iconColor:
        trainingStats?.recent_improvement >= 0 ? "text-orange-600" : "text-red-600",
    },
    {
      title: "Late Arrivals",
      value: trainingStats?.late_count || 0,
      description: "All time",
      icon: Clock,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      iconBg: "bg-red-500",
      iconColor: "text-red-600",
    },
  ];

  return <CommonOverviewCards stats={overviewStats} />;
};

export default OverviewStatsCards;
