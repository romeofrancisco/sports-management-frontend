import React from "react";
import {
  Calendar,
  Clock,
  Target,
  MapPin,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ClockIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const SessionCard = ({ sessionGroup }) => {
  const {
    session,
    metrics: sessionMetrics,
    attendance_status,
    completion_status,
  } = sessionGroup;
  const completedCount = sessionMetrics.filter(
    (m) => m.status === "completed"
  ).length;
  const totalCount = sessionMetrics.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0; // Determine session status for styling based on attendance
  const getSessionStatusInfo = () => {
    const attendanceStatus = attendance_status?.toLowerCase();
    const sessionStatus = session.status?.toLowerCase();

    // In progress sessions always use secondary color
    if (
      sessionStatus === "in_progress" ||
      sessionStatus === "active" ||
      sessionStatus === "ongoing"
    ) {
      return {
        gradient: "from-secondary/10 to-secondary/20",
        strip: "bg-secondary",
        borderColor: "border-secondary",
        icon: AlertCircle,
        textColor: "text-secondary",
        bgColor: "bg-secondary/10",
      };
    } // For completed sessions, use attendance status
    else if (attendanceStatus === "present" || attendanceStatus === "late") {
      return {
        gradient: "from-primary/10 to-primary/20",
        strip: "bg-primary",
        borderColor: "border-primary",
        icon: attendanceStatus === "late" ? ClockIcon : CheckCircle2,
        textColor: "text-primary",
        bgColor: "bg-primary/10",
      };
    } else if (
      attendanceStatus === "absent" ||
      attendanceStatus === "excused"
    ) {
      return {
        gradient: "from-destructive/10 to-destructive/20",
        strip: "bg-destructive",
        borderColor: "border-destructive",
        icon: attendanceStatus === "late" ? ClockIcon : CheckCircle2,
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
      };
    } else {
      // Default fallback for any other status (no attendance recorded yet)
      return {
        gradient: "from-orange-500/10 to-orange-500/20",
        strip: "bg-orange-500",
        borderColor: "border-orange-500",
        icon: Clock,
        textColor: "text-orange-600",
        bgColor: "bg-orange-500/10",
      };
    }
  };

  const statusInfo = getSessionStatusInfo();
  const StatusIcon = statusInfo.icon;
  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${statusInfo.gradient} hover:shadow-lg transition-all duration-300 border ${statusInfo.borderColor} shadow-sm h-full flex flex-col`}
    >
      {/* Status Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.strip}`}
      />
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          {/* Left side - Session info */}
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-4 w-4 ${statusInfo.textColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                {session.title}
              </CardTitle>{" "}
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    attendance_status?.toLowerCase() === "absent" ||
                    attendance_status?.toLowerCase() === "excused"
                      ? "destructive"
                      : attendance_status?.toLowerCase() === "present" ||
                        attendance_status?.toLowerCase() === "late"
                      ? "default"
                      : "secondary"
                  }
                  className={`text-xs font-medium border-0 px-2 py-0.5 relative ${
                    attendance_status?.toLowerCase() === "present" ||
                    attendance_status?.toLowerCase() === "late"
                      ? "bg-primary/10 text-primary"
                      : attendance_status?.toLowerCase() === "absent" ||
                        attendance_status?.toLowerCase() === "excused"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {attendance_status?.toLowerCase() === "late" && (
                    <ClockIcon className="w-3 h-3 mr-1" />
                  )}
                  {attendance_status?.toUpperCase() || "PENDING"}
                  {attendance_status?.toLowerCase() === "late" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(session.date), "MMM dd, yyyy")} •{" "}
                  {session.start_time}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Completion stats */}
          <div className="text-right">
            <div className="text-xl font-bold text-foreground leading-tight">
              {completedCount}
              <span className="text-sm text-muted-foreground">
                /{totalCount}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">completed</div>
            <div className="w-16 mt-1">
              <Progress value={completionPercentage} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardHeader>{" "}
      <CardContent className="space-y-3 pt-0">
        {/* Metrics Section Header */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground text-sm">
              Metrics ({sessionMetrics.length})
            </span>
          </div>
          {session.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{session.location}</span>
            </div>
          )}
        </div>{" "}
        {/* Compact Metrics Grid */}
        <div className="space-y-2">
          {sessionMetrics.map((metric) => {
            const getMetricStatusInfo = () => {
              const status = metric.status?.toLowerCase();
              const attendanceStatus = attendance_status?.toLowerCase();
              const sessionStatus = session.status?.toLowerCase();

              // Use session-level colors based on attendance/status
              if (
                sessionStatus === "in_progress" ||
                sessionStatus === "active" ||
                sessionStatus === "ongoing"
              ) {
                return {
                  bgClass:
                    "bg-gradient-to-r from-secondary/5 to-secondary/10 border-secondary/20",
                  badgeVariant: "secondary",
                  badgeClass:
                    "bg-secondary/10 text-secondary border-secondary/20",
                  valueClass: "text-secondary font-semibold",
                };
              } else if (
                attendanceStatus === "present" ||
                attendanceStatus === "late"
              ) {
                return {
                  bgClass:
                    "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20",
                  badgeVariant: "default",
                  badgeClass: "bg-primary/10 text-primary border-primary/20",
                  valueClass: "text-primary font-semibold",
                };
              } else if (
                attendanceStatus === "absent" ||
                attendanceStatus === "excused"
              ) {
                return {
                  bgClass:
                    "bg-gradient-to-r from-red-500/5 to-red-500/10 border-red-500/20",
                  badgeVariant: "destructive",
                  badgeClass: "bg-red-500/10 text-red-600 border-red-500/20",
                  valueClass: "text-red-600 font-semibold",
                };
              } else {
                return {
                  bgClass:
                    "bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-orange-500/20",
                  badgeVariant: "outline",
                  badgeClass:
                    "bg-orange-500/10 text-orange-600 border-orange-500/20",
                  valueClass: "text-orange-600 font-semibold",
                };
              }
            };

            const metricStatusInfo = getMetricStatusInfo();

            return (
              <div
                key={metric.id}
                className={`flex p-2 rounded border items-start min-h-[60px] ${metricStatusInfo.bgClass}`}
              >
                {/* Metric Info - Fixed minimum width */}
                <div className="w-48 flex-shrink-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm line-clamp-1">
                      {metric.metric_name}
                    </span>
                  </div>{" "}
                  <div className="text-xs text-muted-foreground ml-5 line-clamp-1">
                    {metric.metric_category} • {metric.metric_unit?.name}
                  </div>
                </div>

                {/* Metric Data - Flexible width */}
                <div className="flex-1 px-3">
                  {metric.is_recorded ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${metricStatusInfo.valueClass}`}
                        >
                          {metric.recorded_value} {metric.metric_unit?.code}
                        </span>
                        {metric.improvement_percentage !== null && (
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            {metric.improvement_percentage >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                              className={
                                metric.improvement_percentage >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {metric.improvement_percentage >= 0 ? "+" : ""}
                              {metric.improvement_percentage.toFixed(1)}%
                            </span>

                            {metric.is_lower_better && (
                              <span className="text-xs text-muted-foreground">
                                Lower is better
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {metric.improvement_from_last !== null && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          <span className="font-medium">Change: </span>
                          {metric.improvement_percentage >= 0 ? (
                            <span className="text-green-600">
                              Improved by{" "}
                              {Math.abs(metric.improvement_from_last).toFixed(
                                2
                              )}{" "}
                              {metric.metric_unit?.code || ""}
                              {metric.is_lower_better
                                ? " (faster)"
                                : " (higher)"}
                            </span>
                          ) : (
                            <span className="text-red-600">
                              Declined by{" "}
                              {Math.abs(metric.improvement_from_last).toFixed(
                                2
                              )}{" "}
                              {metric.metric_unit?.code || ""}
                              {metric.is_lower_better
                                ? " (slower)"
                                : " (lower)"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Not recorded
                    </span>
                  )}
                </div>

                {/* Status Badge - Fixed width */}
                <div className="w-24 flex-shrink-0 flex justify-end">
                  <Badge
                    variant={metricStatusInfo.badgeVariant}
                    className={`text-xs font-medium border ${metricStatusInfo.badgeClass}`}
                  >
                    {metric.status?.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
