import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  Calendar,
} from "lucide-react";

const ReportsSection = ({
  reports,
  selectedReportType,
  setSelectedReportType,
  isLoading,
}) => {
  const reportTypes = [
    {
      key: "summary",
      label: "Summary",
      icon: BarChart3,
      description: "Overview of key metrics",
    },
    {
      key: "attendance",
      label: "Attendance",
      icon: Users,
      description: "Training and game attendance",
    },
    {
      key: "performance",
      label: "Performance",
      icon: Trophy,
      description: "Team and player performance",
    },
    {
      key: "usage",
      label: "Usage",
      icon: TrendingUp,
      description: "System usage and activity",
    },
  ];
  const renderLoadingContent = () => {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  };
  const renderReportContent = () => {
    if (!reports) {
      return (
        <Card className="border-2 border-muted">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">
              No Report Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a report type to view detailed information.
            </p>
          </CardContent>
        </Card>
      );
    }

    switch (selectedReportType) {
      case "summary":
        // Handle summary report - key_metrics is the main data
        const summaryData = reports.key_metrics || reports;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(summaryData).map(([key, value], index) => (
              <Card
                key={key}
                className={`border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-50 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "attendance":
        // Handle attendance report - team_breakdown contains team data
        const attendanceTeams = reports.team_breakdown || [];
        const attendanceOverall = reports.overall_stats || {};

        return (
          <div className="space-y-4">
            {attendanceTeams.length > 0 && (
              <Card className="border-2 border-secondary/20">
                <CardHeader>
                  <CardTitle>Team Attendance Breakdown</CardTitle>
                  <CardDescription>Attendance rates by team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendanceTeams.map((team, index) => (
                      <div
                        key={team.team_id || index}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20"
                      >
                        <div>
                          <div className="font-medium">
                            {team.team_name || `Team ${team.team_id}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {team.sessions || team.total_sessions || 0} sessions
                          </div>
                        </div>
                        <Badge
                          variant={
                            team.attendance_rate >= 80
                              ? "default"
                              : team.attendance_rate >= 60
                              ? "secondary"
                              : "destructive"
                          }
                          className="font-medium"
                        >
                          {team.attendance_rate
                            ? `${team.attendance_rate.toFixed(1)}%`
                            : "0%"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {Object.keys(attendanceOverall).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(attendanceOverall).map(
                  ([key, value], index) => (
                    <Card
                      key={key}
                      className={`border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10 animate-in fade-in-50 duration-500`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-secondary mb-1">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : value}
                        </div>
                        <div className="text-sm text-secondary/80 capitalize">
                          {key.replace(/_/g, " ")}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}
          </div>
        );

      case "performance":
        // Handle performance report - team_performance contains the team data
        const performanceTeams = reports.team_performance || [];

        return (
          <div className="space-y-4">
            {performanceTeams.length > 0 && (
              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle>Team Performance Rankings</CardTitle>
                  <CardDescription>
                    Based on win rates and scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceTeams.map((team, index) => (
                      <div
                        key={team.team_id || index}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {team.team_name || `Team ${team.team_id}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {team.games_played || 0} games played •
                              {team.sport || "Sport"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              team.win_rate >= 70
                                ? "default"
                                : team.win_rate >= 50
                                ? "secondary"
                                : "outline"
                            }
                            className="font-medium"
                          >
                            {team.win_rate
                              ? `${team.win_rate.toFixed(1)}%`
                              : "0%"}
                            Win Rate
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            Avg Score:
                            {team.avg_score_for
                              ? team.avg_score_for.toFixed(1)
                              : "0"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Summary stats if available */}
            {reports.summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(reports.summary).map(([key, value], index) => (
                  <Card
                    key={key}
                    className={`border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 animate-in fade-in-50 duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : value}
                      </div>
                      <div className="text-sm text-primary/80 capitalize">
                        {key.replace(/_/g, " ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "usage":
        // Handle usage report - has user_activity, system_activity, etc
        const usageData = reports;
        const excludeKeys = ["report_type", "date_range", "generated_at"]; // Meta fields to exclude

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(usageData)
              .filter(([key]) => !excludeKeys.includes(key))
              .map(([category, data], index) => (
                <Card
                  key={category}
                  className={`border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10 animate-in fade-in-50 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="capitalize text-secondary">
                      {category.replace(/_/g, " ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {typeof data === "object" && data !== null ? (
                      <div className="space-y-2">
                        {Object.entries(data).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm text-secondary/80 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-secondary">
                              {typeof value === "number"
                                ? value.toLocaleString()
                                : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-secondary">
                        {typeof data === "number"
                          ? data.toLocaleString()
                          : data}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        );

      default:
        return null;
    }
  };  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
            System Reports
          </h2>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="space-y-6">
        {/* Report Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {reportTypes.map((type, index) => {
            const IconComponent = type.icon;
            const isSelected = selectedReportType === type.key;
            return (
              <Tooltip key={type.key} delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`h-auto min-h-[5rem] md:min-h-[6rem] p-2 md:p-3 flex flex-col justify-center items-center gap-1 transition-all duration-300 animate-in fade-in-50 duration-500 text-center ${
                      isSelected
                        ? "bg-gradient-to-br from-primary to-primary/80 shadow-lg scale-105"
                        : "hover:scale-105 hover:shadow-md"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedReportType(type.key)}
                  >
                    <IconComponent
                      className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mb-1 ${
                        isSelected ? "text-primary-foreground" : "text-primary"
                      }`}
                    />
                    <div className="w-full px-1">
                      <div
                        className={`font-medium text-xs md:text-sm leading-none whitespace-nowrap overflow-hidden text-ellipsis ${
                          isSelected ? "text-primary-foreground" : ""
                        }`}
                      >
                        {type.label}
                      </div>
                      <div
                        className={`text-[10px] md:text-xs leading-none mt-1 hidden md:block whitespace-nowrap overflow-hidden text-ellipsis ${
                          isSelected
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {type.description}
                      </div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={8}>
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs text-white/80">{type.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>        {/* Report Content */}
        <div className="animate-in fade-in-50 duration-500">
          {isLoading ? renderLoadingContent() : renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
