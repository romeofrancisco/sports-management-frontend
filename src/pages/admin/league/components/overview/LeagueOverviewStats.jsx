import React from "react";
import { Users, Flag, Goal, Calendar } from "lucide-react";
import OverviewCards from "@/components/common/OverviewCards";

const LeagueOverviewStats = ({ statistics }) => {
  if (!statistics) return null;

  const {
    teams_count,
    seasons_count,
    active_seasons,
    games_count,
    current_season,
  } = statistics;

  const statsData = [
    {
      title: "Total Teams",
      value: teams_count,
      icon: Users,
      description: "Teams in league",
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Total Seasons",
      value: seasons_count,
      icon: Flag,
      description: `${active_seasons} active`,
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
    {
      title: "Total Games",
      value: games_count,
      icon: Goal,
      description: "Games played",
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Current Season",
      value: current_season
        ? current_season.name || current_season.year
        : "None",
      icon: Calendar,
      description: current_season ? current_season.status : "No active season",
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

export default LeagueOverviewStats;
