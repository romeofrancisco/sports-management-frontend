import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  UserX,
  Users,
  Shield,
  Activity,
  UserCheck,
  Users2,
} from "lucide-react";

const SystemHealthSection = ({ overview }) => {
  const healthIssues = [
    {
      title: "Unassigned Players",
      count: overview?.system_health?.unassigned_players || 0,
      severity: "high",
      icon: UserX,
      description: "Players without teams",
    },
    {
      title: "Teams Without Coaches",
      count: overview?.system_health?.teams_without_coaches || 0,
      severity: "high",
      icon: Users,
      description: "Teams needing coaches",
    },
    {
      title: "Understaffed Teams",
      count: overview?.system_health?.teams_with_few_players || 0,
      severity: "medium",
      icon: AlertTriangle,
      description: "Teams with few players",
    },
  ];
  const getSeverityColor = (severity, count) => {
    if (count === 0) return "text-primary bg-primary/10 border-primary/30";
    switch (severity) {
      case "high":
        return "text-destructive bg-destructive/10 border-destructive/30";
      case "medium":
        return "text-secondary bg-secondary/10 border-secondary/30";
      default:
        return "text-primary bg-primary/10 border-primary/30";
    }
  };

  const getSeverityIcon = (severity, count) => {
    if (count === 0) return CheckCircle2;
    switch (severity) {
      case "high":
        return AlertTriangle;
      case "medium":
        return Shield;
      default:
        return Activity;
    }
  };
  const totalIssues = healthIssues.reduce((sum, issue) => sum + issue.count, 0);

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
              System Health
            </CardTitle>
          </div>
          <Badge
            variant={totalIssues === 0 ? "default" : "destructive"}
            className={`px-3 py-1 text-sm font-medium border-2 ${
              totalIssues === 0
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-destructive/10 text-destructive dark:text-white border-destructive/30"
            }`}
          >
            {totalIssues === 0
              ? "All Systems Operational"
              : `${totalIssues} Issues Found`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {healthIssues.map((issue, index) => {
            const IconComponent = issue.icon;
            const StatusIcon = getSeverityIcon(issue.severity, issue.count);
            const colorClasses = getSeverityColor(issue.severity, issue.count);

            return (
              <Card
                key={issue.title}
                className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500 ${
                  issue.count === 0
                    ? "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
                    : issue.severity === "high"
                    ? "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10"
                    : "border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {issue.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg border ${colorClasses
                      .split(" ")
                      .slice(1)
                      .join(" ")}`}
                  >
                    <IconComponent
                      className={`h-4 w-4 ${colorClasses.split(" ")[0]}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {issue.count}
                    </div>
                    <div
                      className={`p-1.5 rounded-full border ${colorClasses
                        .split(" ")
                        .slice(1)
                        .join(" ")}`}
                    >
                      <StatusIcon
                        className={`h-4 w-4 ${colorClasses.split(" ")[0]}`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {issue.description}
                  </p>
                  {issue.count > 0 && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs border-2 ${
                          issue.severity === "high"
                            ? "border-destructive/30 text-destructive bg-destructive/10"
                            : "border-secondary/30 text-secondary bg-secondary/10"
                        }`}
                      >
                        Needs Attention
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthSection;
