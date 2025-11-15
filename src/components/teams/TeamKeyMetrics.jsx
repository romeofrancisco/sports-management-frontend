import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, Star, Activity, Info } from "lucide-react";
import { getDivisionLabel } from "@/constants/team";

const TeamKeyMetrics = ({ data }) => {
  const teamMetrics = [
    {
      label: "Coach",
      value: data.head_coach_name || "No Head Coach Assigned",
      color: "text-primary",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      icon: <UserCheck className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-primary",
      gradient: "from-primary/80 via-primary/70 to-primary/60",
      description: "Leading team strategy",
    },
    // {
    //   label: "Assistant Coach",
    //   value: data.assistant_coach_name || "No Assistant Coach Assigned",
    //   color: "text-primary",
    //   bgColor: "bg-primary/8",
    //   borderColor: "border-primary/30",
    //   icon: <UserCheck className="h-5 w-5 text-primary-foreground" />,
    //   iconBg: "bg-primary",
    //   gradient: "from-primary via-primary/90 to-primary/80",
    //   description: "Supporting team leadership",
    // },
    {
      label: "Sport",
      value: data.sport_name || "Not Specified",
      color: "text-primary",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      icon: <Activity className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-primary",
      gradient: "from-primary via-primary/90 to-primary/80",
      description: "Team sport discipline",
    },
    {
      label: "Division",
      value: getDivisionLabel(data.division),
      color: "text-primary",
      bgColor: "bg-primary/8",
      borderColor: "border-primary/30",
      icon: <Star className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-primary",
      gradient: "from-primary via-primary/90 to-primary/80",
      description: "Competition level",
    },
  ];

  return (
    <Card className="bg-card shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg">
            <Info className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gradient">
              Team Information
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Essential details about your team
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 grid-cols-1">
          {teamMetrics.map((metric, index) => (
            <div
              key={index}
              className={`relative overflow-hidden text-center p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.03] group ${metric.bgColor} ${metric.borderColor}`}
            >
              {/* Enhanced Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-8 group-hover:opacity-12 transition-opacity duration-300`}
              ></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-50"></div>

              <div className="relative z-10 space-y-3">
                <div
                  className={`mx-auto w-12 h-12 rounded-xl ${metric.iconBg} flex items-center justify-center shadow-md`}
                >
                  {metric.icon}
                </div>
                <div
                  className={`text-lg font-bold ${metric.color} drop-shadow-sm capitalize`}
                >
                  {metric.value}
                </div>
                <p className="text-sm font-medium text-muted-foreground tracking-wide">
                  {metric.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamKeyMetrics;
