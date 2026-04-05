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
      link: `teams`,
    },
    {
      title: "Total Seasons",
      value: seasons_count,
      icon: Flag,
      description: `${active_seasons} active`,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
      link: `seasons`,
    },
    {
      title: "Total Games",
      value: games_count,
      icon: Goal,
      description: "Games played",
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
      link: `seasons`,
    },
    {
      title: "Current Season",
      value: current_season
        ? current_season.name || current_season.year
        : "None",
      icon: Calendar,
      description: current_season ? current_season.status : "No active season",
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
      link: current_season ? `seasons/${current_season.id}` : `seasons`,
    },
  ];

  return (
    <div className= "animate-in fade-in-50 duration-500 delay-100">
      <div className= "px-0">
        <OverviewCards stats={statsData} />
      </div>
    </div>
  );
};

export default LeagueOverviewStats;
