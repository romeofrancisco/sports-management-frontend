import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Activity, 
  Target, 
  Calculator,
  TrendingUp,
  Users,
  Award,
  Zap
} from "lucide-react";
import { useSportStatsOverview } from "@/hooks/useStats";
import { useParams } from "react-router";

const StatsOverview = ({ className = "" }) => {
  const { sport } = useParams();
  const { data: overview, isLoading } = useSportStatsOverview(sport);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Statistics Overview</h3>
          </div>
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const overviewCards = [
    {
      title: "Total Stats",
      value: overview.total_stats,
      description: "All statistics",
      icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Basic Stats",
      value: overview.stat_types?.recording || 0,
      description: "Recording stats",
      icon: <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Advanced Stats",
      value: overview.stat_types?.calculated || 0,
      description: "Calculated stats",
      icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
    },
    {
      title: "Scoring Stats",
      value: overview.categories?.scoring || 0,
      description: "Point-based stats",
      icon: <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      color: "from-red-500 via-red-500/90 to-red-500/80",
      bgColor: "bg-red-500/8",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500",
      textAccent: "text-red-600",
    }
  ];

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Overview Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((stat, idx) => (
          <Card
            key={stat.title || idx}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              stat.bgColor || ""
            } ${stat.borderColor || ""} border`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                stat.color || ""
              } opacity-5`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-1.5 sm:p-2 rounded-lg ${
                  stat.iconBg || ""
                } shadow-lg transition-transform duration-300 hover:scale-110`}
              >
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-xl sm:text-2xl font-bold ${stat.textAccent || ""} mb-1`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;
