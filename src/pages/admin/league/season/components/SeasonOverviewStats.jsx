import React from "react";
import { Calendar, Users, Goal, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSeasonProgress,
  formatDate,
  getStatusColor,
} from "@/utils/seasonUtils";

const SeasonOverviewStats = ({ seasonDetails }) => {
  if (!seasonDetails) return null;

  const seasonProgress = getSeasonProgress(seasonDetails);
  const gamesProgress = seasonDetails.games_played
    ? Math.round((seasonDetails.games_played / seasonDetails.games_count) * 100)
    : 0;
  const formattedStartDate = seasonDetails.start_date
    ? `Started on ${formatDate(seasonDetails.start_date)}`
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
      color: "from-primary via-primary/90 to-primary/80",
      iconBg: "bg-primary",
      iconColor: "text-primary",
      progress: seasonDetails.status === "ongoing" ? seasonProgress : null,
      progressLabel: formattedStartDate,
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
      color: "from-primary/80 via-primary/70 to-primary/60",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      iconColor: "text-primary",
      progress: seasonDetails.games_played > 0 ? gamesProgress : null,
      progressLabel: "Completion Progress",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Enhanced Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
              ></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl opacity-40"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-xl ${stat.iconBg} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </CardHeader>{" "}
              <CardContent className="relative z-10">
                <div
                  className={`text-2xl md:text-3xl font-bold ${stat.iconColor} drop-shadow-sm tracking-tight`}
                >
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide">
                  {stat.description}
                </p>
                {/* Progress bar for applicable stats */}
                {stat.progress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{stat.progressLabel}</span>
                      <span>{stat.progress}%</span>
                    </div>
                    <div className="w-full bg-muted border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}{" "}
                {/* Badge for status */}
                {stat.badge && stat.title === "Season Status" && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${
                        stat.badge === "ongoing"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : stat.badge === "upcoming"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : stat.badge === "completed"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {stat.badge}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonOverviewStats;
