import React from "react";
import {
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

// Table columns for assigned metrics
export const getAssignedMetricsTableColumns = () => [
  {
    accessorKey: "metric_name",
    header: "Metric",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {row.original.metric_name}
          </span>
        </div>
        <span className="text-xs text-muted-foreground ml-6">
          {row.original.metric_category || "General"}
        </span>
        {row.original.metric_description && (
          <span className="text-xs text-muted-foreground italic ml-6">
            {row.original.metric_description}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "session_info",
    header: "Training Session",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {row.original.session_title}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(row.original.session_date), "MMM dd, yyyy")}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {row.original.session_start_time} - {row.original.session_end_time}
        </div>
        {row.original.session_location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {row.original.session_location}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "metric_target",
    header: "Target/Unit",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {row.original.metric_unit?.name || "No unit"}
        </span>
        <span className="text-xs text-muted-foreground">
          ({row.original.metric_unit?.code || "N/A"})
        </span>
        {row.original.is_lower_better && (
          <Badge variant="outline" className="text-xs mt-1 w-fit">
            Lower is better
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "recorded_value",
    header: "Recorded Value",
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.original.is_recorded ? (
          <>
            <span className="font-medium text-green-600">
              {row.original.recorded_value}{" "}
              {row.original.metric_unit?.code || ""}
            </span>
            {row.original.recorded_at && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(row.original.recorded_at), "MMM dd, HH:mm")}
              </span>
            )}
            {row.original.recorded_by && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {row.original.recorded_by}
              </div>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">Not recorded</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "improvement",
    header: "Improvement",
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.original.is_recorded &&
        row.original.improvement_percentage !== null ? (
          <>
            {" "}
            <div className="flex items-center gap-1">
              {row.original.improvement_percentage >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span
                className={`font-medium text-xs ${
                  row.original.improvement_percentage >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {row.original.improvement_percentage >= 0 ? "+" : ""}
                {row.original.improvement_percentage.toFixed(1)}%
              </span>
            </div>{" "}
            {row.original.improvement_from_last !== null && (              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Change: </span>
                {row.original.improvement_percentage >= 0 ? (
                  <span className="text-green-600">
                    Improved by{" "}
                    {Math.abs(row.original.improvement_from_last).toFixed(2)}{" "}
                    {row.original.metric_unit?.code || ""}
                    {row.original.is_lower_better ? " (faster)" : " (higher)"}
                  </span>
                ) : (
                  <span className="text-red-600">
                    Declined by{" "}
                    {Math.abs(row.original.improvement_from_last).toFixed(2)}{" "}
                    {row.original.metric_unit?.code || ""}
                    {row.original.is_lower_better ? " (slower)" : " (lower)"}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">No comparison</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
          case "completed":
            return "default";
          case "in_progress":
            return "secondary";
          case "assigned":
            return "outline";
          case "missed":
            return "destructive";
          default:
            return "outline";
        }
      };

      const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
          case "completed":
            return "COMPLETED";
          case "in_progress":
            return "IN PROGRESS";
          case "assigned":
            return "ASSIGNED";
          case "missed":
            return "MISSED";
          default:
            return "UNKNOWN";
        }
      };

      const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
          case "completed":
            return <CheckCircle className="h-3 w-3" />;
          case "in_progress":
            return <Clock className="h-3 w-3" />;
          case "assigned":
            return <Target className="h-3 w-3" />;
          case "missed":
            return <XCircle className="h-3 w-3" />;
          default:
            return <AlertCircle className="h-3 w-3" />;
        }
      };

      return (
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <Badge variant={getStatusVariant(status)} className="text-xs">
            {getStatusText(status)}
          </Badge>
        </div>
      );
    },
  },
];

// Table columns for session-based view
export const getSessionTableColumns = () => [
  {
    accessorKey: "session_info",
    header: "Training Session",
    cell: ({ row }) => {
      const sessionGroup = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-base">
            {sessionGroup.session.title}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(sessionGroup.session.date), "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {sessionGroup.session.start_time} - {sessionGroup.session.end_time}
          </div>
          {sessionGroup.session.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {sessionGroup.session.location}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "metrics",
    header: "Assigned Metrics",
    cell: ({ row }) => {
      const sessionGroup = row.original;
      return (
        <div className="space-y-2">
          {" "}          {sessionGroup.metrics.map((metric, index) => (
            <div
              key={index}
              className="flex p-2 bg-muted rounded border items-start min-h-[60px]"
            >
              {/* Metric Info - Fixed minimum width */}
              <div className="w-48 flex-shrink-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm line-clamp-1">
                    {metric.metric_name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground ml-5 line-clamp-1">
                  {metric.metric_category} • {metric.metric_unit?.name}
                </div>
              </div>

              {/* Metric Data - Flexible width */}
              <div className="flex-1 px-3">
                {metric.is_recorded ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="text-xs font-medium text-green-600 whitespace-nowrap">
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
                        </div>
                      )}
                    </div>
                    {metric.improvement_from_last !== null && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        <span className="font-medium">Change: </span>
                        {metric.improvement_percentage >= 0 ? (
                          <span className="text-green-600">
                            Improved by{" "}
                            {Math.abs(metric.improvement_from_last).toFixed(2)}{" "}
                            {metric.metric_unit?.code || ""}
                            {metric.is_lower_better ? " (faster)" : " (higher)"}
                          </span>
                        ) : (
                          <span className="text-red-600">
                            Declined by{" "}
                            {Math.abs(metric.improvement_from_last).toFixed(2)}{" "}
                            {metric.metric_unit?.code || ""}
                            {metric.is_lower_better ? " (slower)" : " (lower)"}
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
                  variant={
                    metric.status === "completed"
                      ? "default"
                      : metric.status === "in_progress"
                      ? "secondary"
                      : metric.status === "assigned"
                      ? "outline"
                      : metric.status === "missed"
                      ? "destructive"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {metric.status?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "session_status",
    header: "Status & Progress",
    cell: ({ row }) => {
      const sessionGroup = row.original;
      const completedCount = sessionGroup.metrics.filter(
        (m) => m.status === "completed"
      ).length;
      const totalCount = sessionGroup.metrics.length;
      const completionPercentage =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;      // Determine the combined status based on attendance and session completion
      const getCombinedStatus = () => {
        // Handle attendance-based statuses first
        if (sessionGroup.attendance_status === "absent") {
          return { text: "ABSENT", variant: "destructive" };
        }
        if (sessionGroup.attendance_status === "excused") {
          return { text: "EXCUSED", variant: "outline" };
        }
        
        // Handle present/late with completion status
        if (sessionGroup.attendance_status === "present" || sessionGroup.attendance_status === "late") {
          const lateText = sessionGroup.attendance_status === "late" ? " (LATE)" : "";
          
          if (completionPercentage === 100) {
            return { text: `COMPLETED${lateText}`, variant: sessionGroup.attendance_status === "late" ? "secondary" : "default" };
          } else if (completionPercentage > 0) {
            return { text: `PARTIAL${lateText}`, variant: "secondary" };
          } else {
            return { text: `ATTENDED${lateText}`, variant: "secondary" };
          }
        }

        // Fallback for sessions without explicit attendance data
        if (sessionGroup.session.status === "completed") {
          const missedCount = sessionGroup.metrics.filter((m) => m.status === "missed").length;

          if (completionPercentage === 100) {
            return { text: "COMPLETED", variant: "default" };
          } else if (completionPercentage > 0) {
            return { text: "PARTIAL", variant: "secondary" };
          } else if (missedCount === totalCount && totalCount > 0) {
            return { text: "ABSENT", variant: "destructive" };
          } else {
            return { text: "NO RECORDS", variant: "secondary" };
          }
        }

        if (sessionGroup.session.status === "in_progress") {
          return { text: "IN PROGRESS", variant: "secondary" };
        }

        return { text: "SCHEDULED", variant: "outline" };
      };

      const status = getCombinedStatus();

      return (
        <div className="flex flex-col space-y-2">
          <Badge variant={status.variant} className="text-xs w-fit">
            {status.text}
          </Badge>
          
          <div className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} metrics completed
          </div>
          <Progress value={completionPercentage} className="h-1" />
          <span className="text-xs text-muted-foreground">
            {completionPercentage}%
          </span>
        </div>
      );
    },
  },
];
