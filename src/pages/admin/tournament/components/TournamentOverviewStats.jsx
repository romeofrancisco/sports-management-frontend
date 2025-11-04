import React from "react";
import { Calendar, Users, Goal, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays, parseISO } from "date-fns";

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

  const tournamentProgress = getTournamentProgress(tournament);
  const gamesProgress =
    tournament.games_played && tournament.games_count
      ? Math.round((tournament.games_played / tournament.games_count) * 100)
      : 0;
  const formattedStartDate = tournament.start_date
    ? `Started on ${formatDate(tournament.start_date)}`
    : "";
  const teamsCount = tournament?.teams_count || 0;

  const statsData = [
    {
      title: "Tournament Status",
      value: tournament.status
        ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)
        : "Upcoming",
      icon: Calendar,
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary-foreground",
      progress: tournament.status === "ongoing" ? tournamentProgress : null,
      progressLabel: formattedStartDate,
    },
    {
      title: "Teams",
      value: teamsCount,
      icon: Users,
      description: "Total teams in this tournament",
      color: "from-secondary via-secondary/90 to-secondary/80",
      iconBg: "bg-secondary",
      iconColor: "text-secondary-foreground",
    },
    {
      title: "Games Progress",
      value: `${tournament.games_played || 0}/${tournament.games_count || 0}`,
      icon: Goal,
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary-foreground",
      progress: tournament.games_played > 0 ? gamesProgress : null,
      progressLabel: "Completion Progress",
    },
    {
      title: "Avg. Points",
      value: tournament.avg_points_per_game?.toFixed(1) || "0.0",
      icon: Activity,
      description: "Per game",
      color: "from-secondary/80 via-secondary/70 to-secondary/60",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
      iconColor: "text-secondary-foreground",
    },
  ];

  return (
    <div className="animate-in fade-in-50 duration-500 delay-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-2 border-primary/20 transition-all duration-300 animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-xl ${stat.iconBg} shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-110`}
                >
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1 transition-all duration-300 group-hover:scale-105">
                  {stat.value}
                </div>
                {stat.progress !== null && stat.progress !== undefined ? (
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.progressLabel || `${stat.progress}% complete`}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentOverviewStats;
