import React from "react";
import { Calendar, Users, Goal, Activity } from "lucide-react";
import OverviewCards from "@/components/common/OverviewCards";
import { getSeasonProgress, formatDate } from "@/utils/seasonUtils";

const SeasonOverviewStats = ({ seasonDetails }) => {
  if (!seasonDetails) return null;

  const seasonProgress = getSeasonProgress(seasonDetails);
  const gamesProgress = seasonDetails.games_played
    ? Math.round((seasonDetails.games_played / seasonDetails.games_count) * 100)
    : 0;
  const formattedStartDate = seasonDetails.start_date
    ? `Started on ${formatDate(seasonDetails.start_date)}`
    : "";
  const formattedEndDate = seasonDetails.end_date
    ? `Ended on ${formatDate(seasonDetails.end_date)}`
    : "";
  const teamsCount =
    seasonDetails?.teams_count || seasonDetails?.teams_list?.length || 0;
  const statsData = [
    {
      title: "Season Status",
      value: seasonDetails.status
        ? seasonDetails.status.charAt(0).toUpperCase() +
          seasonDetails.status.slice(1)
        : "Upcoming",
      icon: Calendar,
      description:
        seasonDetails.status === "ongoing"
          ? formattedStartDate
          : formattedEndDate,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      title: "Teams",
      value: teamsCount,
      icon: Users,
      description: "Total teams in this season",
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary",
    },
    {
      title: "Games Progress",
      value: `${seasonDetails.games_played || 0}/${
        seasonDetails.games_count || 0
      }`,
      icon: Goal,
      description: "Games played",
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Avg. Points",
      value: seasonDetails.avg_points_per_game?.toFixed(1) || "0.0",
      icon: Activity,
      description: "Per game",
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

export default SeasonOverviewStats;
