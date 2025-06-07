import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

/**
 * Progress summary section for player dashboard
 */
const ProgressSummarySection = ({ progress }) => {
  const summaryCards = [
    {
      title: "Metrics Tracked",
      value: progress?.progress_summary?.total_metrics || 0,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Avg Improvement",
      value: `${progress?.progress_summary?.average_improvement?.toFixed(1) || 0}%`,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Goals Achieved",
      value: progress?.progress_summary?.goals_achieved || 0,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  if (!progress?.progress_summary) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-secondary/3 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary shadow-lg">
            <TrendingUp className="h-4 w-4 text-secondary-foreground" />
          </div>
          Progress Summary
        </CardTitle>
        <CardDescription>Overview of your development</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`text-center p-4 border rounded-lg ${card.bgColor} backdrop-blur-sm transition-all duration-200 hover:scale-105`}
            >
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <div className="text-sm text-muted-foreground">{card.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummarySection;
