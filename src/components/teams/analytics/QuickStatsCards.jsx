import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target, Users } from "lucide-react";
import OverviewCards from "@/components/common/OverviewCards";

const QuickStatsCards = ({ stats }) => {
  const {
    total_games = 0,
    win_rate = 0,
    total_trainings = 0,
    active_players = 0,
  } = stats;

  const statCards = [
    {
      title: "Total Games",
      value: total_games,
      description: "Games played",
      icon: Trophy,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Win Rate",
      value: `${win_rate}%`,
      description: "Success rate",
      icon: TrendingUp,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
    {
      title: "Training Sessions",
      value: total_trainings,
      description: "Sessions completed",
      icon: Target,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Active Players",
      value: active_players,
      description: "Team members",
      icon: Users,
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
  ];

  return <OverviewCards stats={statCards} />;
};

export default QuickStatsCards;
