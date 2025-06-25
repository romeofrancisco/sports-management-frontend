import React from "react";
import { Users, CheckCircle, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickStatsOverview = ({ attendanceSummary, metricsSummary, playerImprovements }) => {
  const cards = [
    {
      title: "Total Players",
      value: attendanceSummary.total_players,
      description: "Total players in the training session",
      icon: <Users className="h-5 w-5 text-primary-foreground" />,
      color: "from-primary via-primary/90 to-primary/80",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
      textAccent: "text-primary",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceSummary.attendance_rate}%`,
      description: "Percentage of players who attended",
      icon: <CheckCircle className="h-5 w-5 text-secondary-foreground" />,
      color: "from-secondary via-secondary/90 to-secondary/80",
      bgColor: "bg-secondary/8",
      borderColor: "border-secondary/30",
      iconBg: "bg-secondary",
      textAccent: "text-secondary",
    },
    {
      title: "Metrics Recorded",
      value: metricsSummary.total_metrics_recorded,
      description: "Total performance metrics captured",
      icon: <Target className="h-5 w-5 text-white" />,
      color: "from-orange-500 via-orange-500/90 to-orange-500/80",
      bgColor: "bg-orange-500/8",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500",
      textAccent: "text-orange-600",
    },
    {
      title: "Players Improved",
      value: playerImprovements
        ? playerImprovements.filter(
            (p) => p.overall_improvement_percentage > 0
          ).length
        : 0,
      description: "Players showing performance improvement",
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      color: "from-green-500 via-green-500/90 to-green-500/80",
      bgColor: "bg-green-500/8",
      borderColor: "border-green-500/30",
      iconBg: "bg-green-500",
      textAccent: "text-green-600",
    },
  ];

  return (
    <div className="animate-in fade-in-50 duration-500 delay-100">
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
    </div>
  );
};

export default QuickStatsOverview;
