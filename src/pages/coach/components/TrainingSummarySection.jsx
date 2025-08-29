import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react";

/**
 * Enhanced Training Summary section component
 */
const TrainingSummarySection = ({ overview }) => {
  if (!overview?.training_summary) return null;

  const summaryData = [
    {
      title: "Total Sessions",
      value: overview.training_summary.total_sessions || 0,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/8 to-primary/4",
      borderColor: "border-primary/30",
      gradient: "from-primary to-primary/80",
      iconBg: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      title: "Avg Attendance",
      value: `${
        overview.training_summary.average_attendance?.toFixed(1) || 0
      }%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-secondary",
      bgColor: "bg-gradient-to-br from-secondary/8 to-secondary/4",
      borderColor: "border-secondary/30",
      gradient: "from-secondary to-secondary/80",
      iconBg: "bg-gradient-to-br from-secondary to-secondary/80",
    },
    {
      title: "Active Players",
      value: overview.training_summary.active_players || 0,
      icon: <Users className="h-5 w-5" />,
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-primary/6 via-secondary/6 to-primary/4",
      borderColor: "border-primary/25",
      gradient: "from-primary via-secondary/80 to-primary/80",
      iconBg: "bg-gradient-to-br from-primary via-secondary/50 to-primary/80",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-secondary/20 transition-all duration-300 hover:shadow-2xl hover:border-secondary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-xl opacity-50"></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg border border-secondary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <Activity className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Training Summary
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Overview of recent training activities and performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden text-center p-5 border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.03] group ${item.bgColor} ${item.borderColor}`}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                  <div
                    className={`p-3 rounded-xl ${item.iconBg} shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-110`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold ${item.color} drop-shadow-sm`}
                >
                  {item.value}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Enhanced insights section */}
        <div className="mt-6 p-5 bg-gradient-to-br from-primary/10 via-secondary/8 to-primary/5 rounded-xl border-2 border-primary/20 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-xl opacity-60"></div>

          <div className="relative text-center space-y-4">
            <p className="text-base font-bold text-foreground">
              Training Efficiency Score
            </p>
            <div className="flex justify-center items-center gap-3">
              <div className="w-full bg-muted/40 rounded-full h-3 max-w-40 shadow-inner border border-border/30">
                <div
                  className="h-3 bg-gradient-to-r from-secondary via-secondary/90 to-primary rounded-full transition-all duration-700 shadow-lg"
                  style={{
                    width: `${Math.min(
                      overview.training_summary.average_attendance || 0,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-lg font-bold text-primary min-w-[3rem]">
                {overview.training_summary.average_attendance?.toFixed(0) || 0}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Based on attendance and participation rates
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingSummarySection;
