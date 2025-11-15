import React from "react";
import { Calendar, Users, Goal, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays, parseISO } from "date-fns";
import OverviewCards from "@/components/common/OverviewCards";

const getTournamentProgress = (tournament) => {
  if (!tournament.start_date) return 0;

  const startDate = parseISO(tournament.start_date);
  const endDate = tournament.end_date
    ? parseISO(tournament.end_date)
    : new Date();
  const today = new Date();

  if (today < startDate) return 0;
  if (tournament.end_date && today > parseISO(tournament.end_date)) return 100;

  const totalDays = differenceInDays(endDate, startDate);
  const elapsedDays = differenceInDays(today, startDate);

  return totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return format(parseISO(dateString), "MMM d, yyyy");
};

const TournamentOverviewStats = ({ tournament }) => {
  if (!tournament) return null;

  const formattedStartDate = tournament.start_date
    ? `Started on ${formatDate(tournament.start_date)}`
    : "";
  const formattedEndDate = tournament.end_date
    ? `Ended on ${formatDate(tournament.end_date)}`
    : "No end date set";
  const teamsCount = tournament?.teams_count || 0;

  const statsData = [
    {
      title: "Tournament Status",
      value: tournament.status
        ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)
        : "Upcoming",
      icon: Calendar,
      description:
        tournament.status === "ongoing" ? formattedStartDate : formattedEndDate,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Teams",
      value: teamsCount,
      icon: Users,
      description: "Total teams in this tournament",
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
    {
      title: "Games Progress",
      description: "Total games played",
      value: `${tournament.games_played || 0}/${tournament.games_count || 0}`,
      icon: Goal,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
    },
    {
      title: "Avg. Points",
      value: tournament.avg_points_per_game?.toFixed(1) || "0.0",
      icon: Activity,
      description: "Per game",
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary",
    },
  ];

  return <OverviewCards stats={statsData} />;
};

export default TournamentOverviewStats;
