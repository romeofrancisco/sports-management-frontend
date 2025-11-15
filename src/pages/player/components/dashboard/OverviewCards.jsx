import React from "react";
import CommonOverviewCards from "@/components/common/OverviewCards";
import { Calendar, Activity, TrendingUp, Clock } from "lucide-react";

/**
 * Player dashboard OverviewCards wrapper — prepares card data and delegates
 * rendering to the shared `CommonOverviewCards` component.
 */
const OverviewCards = ({ overview, personalStats }) => {
  const cards = [
    {
      title: "Upcoming Games",
      value: overview?.upcoming_games?.length || 0,
      description: "Games scheduled",
      icon: Calendar,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Training Sessions",
      value: personalStats?.total_sessions_last_30_days || 0,
      description: "Sessions attended (last 30 days)",
      icon: Activity,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
    {
      title: "Attendance Rate",
      value: `${personalStats?.attendance_rate?.toFixed(1) || 0}%`,
      description: "Training attendance rate",
      icon: TrendingUp,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Attended Sessions",
      value: personalStats?.attended_sessions || 0,
      description: "Sessions attended overall",
      icon: Clock,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
  ];

  return <CommonOverviewCards stats={cards} />;
};

export default OverviewCards;
