import React from "react";
import { Users, Flag, Goal, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      description: current_season
        ? current_season.status
        : "No active season",
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
              className="group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] animate-in fade-in-50 duration-500 bg-gradient-to-br backdrop-blur-sm"
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
              </CardHeader>

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
                {stat.title === "Current Season" && current_season && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        current_season.status === "ongoing"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {current_season.status}
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

export default LeagueOverviewStats;
