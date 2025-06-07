import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Activity, TrendingUp, Clock } from "lucide-react";

/**
 * Overview cards component displaying key player metrics with enhanced UI
 */
const OverviewCards = ({ overview, personalStats }) => {
  const cards = [
    {
      title: "Upcoming Games",
      value: overview?.upcoming_games?.length || 0,
      description: "Games scheduled",
      icon: <Calendar className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Training Sessions",
      value: personalStats?.total_sessions_last_30_days || 0,
      description: "Last 30 days",
      icon: <Activity className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Attendance Rate",
      value: `${personalStats?.attendance_rate?.toFixed(1) || 0}%`,
      description: "Training attendance",
      icon: <TrendingUp className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary/80 via-primary/70 to-primary/60",
      bgColor: "bg-primary/6",
      borderColor: "border-primary/25",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
      textAccent: "text-primary/90",
    },
    {
      title: "Sessions Attended",
      value: personalStats?.attended_sessions || 0,
      description: `Out of ${personalStats?.total_sessions_last_30_days || 0}`,
      icon: <Clock className="h-5 w-5 text-accent-foreground" />,
      color: "from-accent via-accent/90 to-accent/80",
      bgColor: "bg-accent/8",
      borderColor: "border-accent/30",
      iconBg: "bg-accent",
      textAccent: "text-accent",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${card.bgColor} ${card.borderColor} border`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg ${card.iconBg} shadow-lg transition-transform duration-300 hover:scale-110`}
            >
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${card.textAccent} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;
