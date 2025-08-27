import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { usePlayerRadarChart } from "@/hooks/useTrainings";

/**
 * Enhanced Progress summary section for player dashboard
 */
const ProgressSummarySection = ({ progress }) => {

  
  const summaryCards = [
    {
      title: "Training Sessions",
      value: progress?.progress_summary?.training_sessions || 0,
      description: "Sessions attended in last 90 days",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
    },
    {
      title: "Recent Improvement",
      value: `${
        progress?.progress_summary?.recent_improvement?.toFixed(1) || 0
      }%`,
      description: "Last 90 days progress",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      iconBg: "bg-primary",
    },
  ];

  if (!progress?.progress_summary) {
    return null;
  }

  return (
    <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gradient">
              Progress Summary
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Overview of your development progress
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {" "}
        <div className="grid gap-4 md:grid-cols-2">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden border-2 ${card.borderColor} rounded-xl p-4 ${card.bgColor} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
            >
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className={`text-2xl font-bold ${card.color} mb-1`}>
                  {card.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {card.title}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummarySection;
