import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Target,
  MessageSquare,
  Check,
  Clock,
  X,
} from "lucide-react";

const PlayerImprovementsSection = ({
  playerImprovements,
  metricsSummary,
  getImprovementVariant,
  getPlayerInitials,
}) => {
  // Get all available metrics from the session
  const sessionMetrics = metricsSummary?.metrics_breakdown || [];

  // Function to get missed metrics for a player
  const getMissedMetrics = (player) => {
    if (!sessionMetrics.length) return [];

    const recordedMetricIds = (player.metric_improvements || []).map(
      (m) => m.metric_id
    );
    return sessionMetrics.filter(
      (metric) => !recordedMetricIds.includes(metric.metric__id)
    );
  };
  return (
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <Award className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Player Improvements</CardTitle>
              <CardDescription>
                Individual progress tracking and attendance status for all
                players
              </CardDescription>
            </div>
          </div>
        </CardHeader>{" "}
        <CardContent className="relative">
          {playerImprovements && playerImprovements.length > 0 ? (
            <div className="columns-1 lg:columns-2 gap-4 space-y-4">
              {playerImprovements.map((player, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 backdrop-blur-sm relative overflow-hidden break-inside-avoid mb-4"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl opacity-60"></div>
                  <CardContent className="p-4 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                          <AvatarImage
                            src={player.player_profile}
                            alt={player.player_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/15 to-secondary/15 text-primary font-semibold">
                            {getPlayerInitials(player.player_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-lg text-foreground">
                            {player.player_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${
                                player.attendance_status === "present"
                                  ? "bg-primary/10 text-primary border-primary/30"
                                  : player.attendance_status === "late"
                                  ? "bg-secondary/10 text-secondary border-secondary/30"
                                  : player.attendance_status === "excused"
                                  ? "bg-muted/20 text-muted-foreground border-muted-foreground/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                              }`}
                            >
                              {player.attendance_status === "present" ? (
                                <>
                                  <Check className="h-4 w-4" /> Present
                                </>
                              ) : player.attendance_status === "late" ? (
                                <>
                                  <Clock className="h-4 w-4" /> Late
                                </>
                              ) : player.attendance_status === "excused" ? (
                                <>
                                  <Shield className="h-4 w-4" /> Excused
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4" /> Absent
                                </>
                              )}
                            </Badge>
                            {player.metrics_recorded > 0 && (
                              <span className="text-sm text-muted-foreground font-medium">
                                {player.metrics_recorded} metrics recorded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>{" "}
                      <div className="text-right">
                        {player.overall_improvement_percentage !== 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">
                              Overall Progress
                            </p>
                            <Badge
                              variant={getImprovementVariant(
                                player.overall_improvement_percentage
                              )}
                              className="text-sm px-3 py-1.5 flex items-center gap-1"
                            >
                              {player.overall_improvement_percentage > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {player.overall_improvement_percentage > 0
                                ? "+"
                                : ""}
                              {player.overall_improvement_percentage}%
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {player.metrics_recorded > 1
                                ? `Avg of ${player.metrics_recorded} metrics`
                                : player.metrics_recorded === 1
                                ? "Single metric"
                                : "No metrics"}
                            </p>
                          </div>
                        )}
                        {player.overall_improvement_percentage === 0 &&
                          player.metrics_recorded > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium">
                                Overall Progress
                              </p>
                              <Badge
                                variant="outline"
                                className="text-sm px-3 py-1.5 bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                              >
                                No Change
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {player.metrics_recorded > 1
                                  ? `Avg of ${player.metrics_recorded} metrics`
                                  : "Single metric"}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                    {player.metric_improvements &&
                      player.metric_improvements.length > 0 && (
                        <div className="space-y-2">
                          {player.metric_improvements.map(
                            (metric, metricIndex) => (
                              <div
                                key={metricIndex}
                                className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
                              >
                                {/* Header with metric name and improvement indicator */}
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-foreground text-base">
                                        {metric.metric_name}
                                      </span>
                                      {metric.is_lower_better && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-muted/20 text-muted-foreground"
                                        >
                                          Lower is Better
                                        </Badge>
                                      )}
                                    </div>
                                    {metric.has_previous_record &&
                                      metric.previous_session_date && (
                                        <p className="text-xs text-muted-foreground">
                                          Previous:{" "}
                                          {new Date(
                                            metric.previous_session_date
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </p>
                                      )}
                                  </div>
                                  {metric.improvement_percentage !== null && (
                                    <div className="flex items-center gap-1">
                                      {metric.improvement_percentage > 0 ? (
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                      ) : metric.improvement_percentage < 0 ? (
                                        <TrendingDown className="h-4 w-4 text-secondary" />
                                      ) : null}
                                      <span
                                        className={`font-bold text-sm ${
                                          metric.improvement_percentage > 0
                                            ? "text-primary"
                                            : "text-secondary"
                                        }`}
                                      >
                                        {metric.improvement_percentage > 0
                                          ? "+"
                                          : ""}
                                        {metric.improvement_percentage?.toFixed(
                                          1
                                        )}
                                        %
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {/* Current vs Previous Values */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-medium">
                                      Current Value
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                      {metric.current_value}{" "}
                                      <span className="text-sm font-normal text-muted-foreground">
                                        {metric.unit}
                                      </span>
                                    </p>
                                  </div>
                                  {metric.has_previous_record &&
                                    metric.previous_value !== null && (
                                      <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium">
                                          Previous Value
                                        </p>
                                        <p className="text-lg font-medium text-muted-foreground">
                                          {metric.previous_value}{" "}
                                          <span className="text-sm font-normal">
                                            {metric.unit}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                </div>{" "}
                                {/* Raw Difference and Improvement Status */}
                                {metric.has_previous_record &&
                                  metric.raw_difference !== null && (
                                    <div className="flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/10">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-muted-foreground">
                                          Raw Difference:
                                        </span>
                                        <span
                                          className={`text-sm font-semibold ${
                                            metric.raw_difference === 0
                                              ? "text-muted-foreground"
                                              : metric.is_improvement
                                              ? "text-primary"
                                              : "text-secondary"
                                          }`}
                                        >
                                          {metric.raw_difference > 0 ? "+" : ""}
                                          {metric.raw_difference} {metric.unit}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          metric.raw_difference === 0
                                            ? "bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                                            : metric.is_improvement
                                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                            : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                                        }`}
                                      >
                                        {metric.raw_difference === 0
                                          ? "No Change"
                                          : metric.is_improvement
                                          ? "Improved"
                                          : "Declined"}
                                      </Badge>
                                    </div>
                                  )}
                                {/* First time recording indicator */}
                                {!metric.has_previous_record && (
                                  <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                                    <div className="flex items-center gap-2">
                                      <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                        First time recording this metric -
                                        baseline established
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {/* Notes section */}
                                {metric.notes && (
                                  <div className="flex items-start gap-2 p-2 bg-primary/5 rounded border border-primary/10 text-xs">
                                    <MessageSquare className="h-3 w-3 text-primary/70 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground leading-relaxed">
                                      {metric.notes}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}{" "}
                    {/* Show message for players with no metrics */}
                    {(!player.metric_improvements ||
                      player.metric_improvements.length === 0) && (
                      <div className="space-y-3">
                        <div
                          className={`p-3 rounded-lg border ${
                            player.attendance_status === "absent" ||
                            player.attendance_status === "excused"
                              ? "bg-muted/10 border-muted-foreground/20"
                              : "bg-secondary/10 border-secondary/20"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {player.attendance_status === "absent" ? (
                              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            ) : player.attendance_status === "excused" ? (
                              <Shield className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Target className="h-4 w-4 text-secondary" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                player.attendance_status === "absent" ||
                                player.attendance_status === "excused"
                                  ? "text-muted-foreground"
                                  : "text-secondary"
                              }`}
                            >
                              {player.attendance_status === "absent"
                                ? "No metrics recorded - Player was absent"
                                : player.attendance_status === "excused"
                                ? "No metrics recorded - Excused absence"
                                : "No metrics recorded for this session"}
                            </span>
                          </div>
                        </div>{" "}
                        {/* Show missed metrics for absent/excused players */}
                        {(player.attendance_status === "absent" ||
                          player.attendance_status === "excused") &&
                          sessionMetrics.length > 0 && (
                            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                              <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                                    Missed Training Metrics (
                                    {sessionMetrics.length} total)
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {sessionMetrics.map((metric, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                                      >
                                        {metric.metric__name}
                                      </Badge>
                                    ))}
                                  </div>
                                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                    These metrics will need to be recorded
                                    during makeup sessions or future training.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        {/* Show missed metrics for present players who didn't record some metrics */}
                        {(player.attendance_status === "present" ||
                          player.attendance_status === "late") &&
                          (() => {
                            const missedMetrics = getMissedMetrics(player);
                            return (
                              missedMetrics.length > 0 && (
                                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                  <div className="flex items-start gap-2">
                                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-blue-800 mb-2">
                                        Incomplete Metrics (
                                        {missedMetrics.length} missed)
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {missedMetrics.map((metric, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs bg-blue-100 text-blue-700 border-blue-300"
                                          >
                                            {metric.metric__name}
                                          </Badge>
                                        ))}
                                      </div>
                                      <p className="text-xs text-blue-600 mt-2">
                                        Player was present but didn't record
                                        these metrics.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            );
                          })()}
                      </div>
                    )}
                    {player.notes && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-primary font-medium mb-1">
                              Player Notes
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {player.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No improvement data available for this session.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
  );
};

export default PlayerImprovementsSection;
