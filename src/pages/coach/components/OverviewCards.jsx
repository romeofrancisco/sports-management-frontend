import React from "react";
import { Users, User, Calendar, Clock } from "lucide-react";
import CommonOverviewCards from "@/components/common/OverviewCards";

/**
 * Coach overview wrapper that builds statsData and delegates rendering
 * to the shared `CommonOverviewCards` component for visual consistency.
 */
const OverviewCards = ({ overview }) => {
  const statsData = [
    {
      title: "My Teams",
      value: overview?.team_overview?.total_teams || 0,
      description: "Teams under management",
      icon: Users,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Total Players",
      value: overview?.team_overview?.total_players || 0,
      description: "Players in your teams",
      icon: User,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
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
      value: overview?.team_overview?.recent_training_sessions || 0,
      description: "Recent sessions",
      icon: Clock,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
  ];

  return <CommonOverviewCards stats={statsData} />;
};

export default OverviewCards;
