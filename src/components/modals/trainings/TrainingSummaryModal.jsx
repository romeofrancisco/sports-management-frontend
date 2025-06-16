import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Star,
  Award,
  Lightbulb,
  ArrowLeft,
  FileText,
} from "lucide-react";

const TrainingSummaryModal = ({ isOpen, onClose, trainingSummary }) => {
  const navigate = useNavigate();

  if (!trainingSummary) return null;

  // Add debugging to see what we're actually receiving
  console.log("Training Summary Data:", trainingSummary);

  const {
    session_info,
    attendance_summary,
    metrics_summary,
    player_improvements,
    recommendations,
    effectiveness_score,
  } = trainingSummary;

  // Additional safety check
  if (!session_info) {
    console.error(
      "session_info is missing from trainingSummary:",
      trainingSummary
    );
    return null;
  }

  const handleViewSessions = () => {
    onClose();
    navigate("/training-sessions");
  };

  // Format date and time
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get effectiveness color
  const getEffectivenessColor = (level) => {
    const colors = {
      excellent: "text-green-600 bg-green-50 border-green-200",
      very_good: "text-blue-600 bg-blue-50 border-blue-200",
      good: "text-yellow-600 bg-yellow-50 border-yellow-200",
      fair: "text-orange-600 bg-orange-50 border-orange-200",
      needs_improvement: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[level] || colors.good;
  };

  // Get improvement badge variant
  const getImprovementVariant = (percentage) => {
    if (percentage > 5) return "default";
    if (percentage > 0) return "secondary";
    return "destructive";
  }; // Get priority color for recommendations
  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-blue-600 bg-blue-50",
      positive: "text-green-600 bg-green-50",
    };
    return colors[priority] || colors.medium;
  };

  // Get player initials for avatar fallback
  const getPlayerInitials = (playerName) => {
    return playerName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-w-6xl lg:max-w-7xl xl:max-w-[90vw] 2xl:max-w-[85vw] max-h-[95vh] overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-card via-primary/8 to-secondary/8 -m-6 p-6 mb-0 border-b border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <Trophy className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Training Session Summary
              </DialogTitle>
              <p className="text-muted-foreground mt-1 font-medium">
                Complete analysis and insights from your training session
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${getEffectivenessColor(
                effectiveness_score.level
              )} text-sm px-3 py-1 border-2 font-semibold`}
            >
              {effectiveness_score.level.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>{" "}
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-8 py-6">
            {/* Quick Stats Overview Cards - Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] bg-gradient-to-br from-card via-card/95 to-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Total Players
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {attendance_summary.total_players}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-secondary/20 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 hover:scale-[1.02] bg-gradient-to-br from-card via-card/95 to-secondary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110">
                      <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Attendance Rate
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {attendance_summary.attendance_rate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] bg-gradient-to-br from-card via-card/95 to-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Target className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Metrics Recorded
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics_summary.total_metrics_recorded}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-secondary/20 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/10 hover:scale-[1.02] bg-gradient-to-br from-card via-card/95 to-secondary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110">
                      <TrendingUp className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Players Improved
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {player_improvements
                          ? player_improvements.filter(
                              (p) => p.overall_improvement_percentage > 0
                            ).length
                          : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>{" "}
            {/* Main Content Grid - Modern Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Session Info & Effectiveness */}
              <div className="space-y-6">
                {/* Session Overview */}
                <Card className="bg-gradient-to-br from-card via-card/95 to-muted/20 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-2xl opacity-60"></div>
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 relative">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
                        <Calendar className="h-5 w-5 text-primary-foreground" />
                      </div>
                      Session Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 relative">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50">
                        <Trophy className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">
                            Session
                          </p>
                          <p className="font-semibold text-foreground">
                            {session_info.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">
                            Date
                          </p>
                          <p className="font-semibold text-foreground">
                            {formatDate(session_info.date)}
                          </p>
                        </div>
                      </div>

                      {session_info.duration_minutes && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50">
                          <Clock className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">
                              Duration
                            </p>
                            <p className="font-semibold text-foreground">
                              {session_info.duration_minutes} minutes
                            </p>
                          </div>
                        </div>
                      )}

                      {session_info.location && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50">
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">
                              Location
                            </p>
                            <p className="font-semibold text-foreground">
                              {session_info.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Effectiveness Score */}
                <Card
                  className={`border-2 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${getEffectivenessColor(
                    effectiveness_score.level
                  )}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl opacity-60"></div>
                  <CardHeader className="text-center relative">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg">
                        <Star className="h-6 w-6 text-primary-foreground" />
                      </div>
                      Training Effectiveness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 relative">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {effectiveness_score.score}%
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getEffectivenessColor(
                          effectiveness_score.level
                        )} text-base px-4 py-2 border-2 font-semibold`}
                      >
                        {effectiveness_score.level
                          .replace("_", " ")
                          .toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground font-medium">
                            Attendance
                          </span>
                          <span className="font-semibold text-foreground">
                            {effectiveness_score.components.attendance}%
                          </span>
                        </div>
                        <Progress
                          value={effectiveness_score.components.attendance}
                          className="h-3 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground font-medium">
                            Metrics Completion
                          </span>
                          <span className="font-semibold text-foreground">
                            {effectiveness_score.components.metrics_completion}%
                          </span>
                        </div>
                        <Progress
                          value={
                            effectiveness_score.components.metrics_completion
                          }
                          className="h-3 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground font-medium">
                            Player Improvement
                          </span>
                          <span className="font-semibold text-foreground">
                            {effectiveness_score.components.player_improvement}%
                          </span>
                        </div>
                        <Progress
                          value={
                            effectiveness_score.components.player_improvement
                          }
                          className="h-3 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground font-medium">
                            Engagement
                          </span>
                          <span className="font-semibold text-foreground">
                            {effectiveness_score.components.engagement}%
                          </span>
                        </div>
                        <Progress
                          value={effectiveness_score.components.engagement}
                          className="h-3 bg-muted/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>{" "}
              {/* Right Column - Detailed Analysis */}
              <div>
                <Card className="bg-gradient-to-br from-card via-card/95 to-muted/20 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-60"></div>
                  <Tabs defaultValue="attendance" className="w-full relative">
                    <div className="bg-gradient-to-r from-muted/30 to-muted/20 border-b border-border/50 p-4">
                      <TabsList className="grid w-full grid-cols-4 bg-background/80 border border-border/50">
                        <TabsTrigger
                          value="attendance"
                          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Attendance</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="metrics"
                          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Target className="h-4 w-4" />
                          <span className="hidden sm:inline">Metrics</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="improvements"
                          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Award className="h-4 w-4" />
                          <span className="hidden sm:inline">Progress</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="recommendations"
                          className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Lightbulb className="h-4 w-4" />
                          <span className="hidden sm:inline">Insights</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-6">
                      {/* Attendance Tab */}
                      <TabsContent
                        value="attendance"
                        className="space-y-4 mt-0"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              Attendance Summary
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                              <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-1">
                                  {attendance_summary.present}
                                </div>
                                <p className="text-sm text-green-700 font-medium">
                                  Present
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300">
                              <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-1">
                                  {attendance_summary.late}
                                </div>
                                <p className="text-sm text-yellow-700 font-medium">
                                  Late
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
                              <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-red-600 mb-1">
                                  {attendance_summary.absent}
                                </div>
                                <p className="text-sm text-red-700 font-medium">
                                  Absent
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="text-center">
                            <Badge
                              variant="outline"
                              className="text-lg px-6 py-2 bg-primary/10 border-primary/30 text-primary font-semibold"
                            >
                              {attendance_summary.attendance_rate}% Attendance
                              Rate
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Metrics Tab */}
                      <TabsContent value="metrics" className="space-y-4 mt-0">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              Metrics Summary
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4 border border-border/50">
                              <p className="text-sm text-muted-foreground font-medium mb-1">
                                Total Records
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                {metrics_summary.total_metrics_recorded}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4 border border-border/50">
                              <p className="text-sm text-muted-foreground font-medium mb-1">
                                Completion Rate
                              </p>
                              <p className="text-2xl font-bold text-secondary">
                                {metrics_summary.completion_rate}%
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4 border border-border/50">
                              <p className="text-sm text-muted-foreground font-medium mb-1">
                                Unique Metrics
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                {metrics_summary.unique_metrics}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4 border border-border/50">
                              <p className="text-sm text-muted-foreground font-medium mb-1">
                                Players Recorded
                              </p>
                              <p className="text-2xl font-bold text-secondary">
                                {metrics_summary.players_with_metrics}
                              </p>
                            </div>
                          </div>                          {metrics_summary.metrics_breakdown &&
                            metrics_summary.metrics_breakdown.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                  <Target className="h-5 w-5 text-primary" />
                                  Metrics Breakdown
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                  {metrics_summary.metrics_breakdown.map(
                                    (metric, index) => (
                                      <div
                                        key={index}
                                        className="bg-gradient-to-br from-card via-card/95 to-muted/20 border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                                      >
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-60"></div>
                                        
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3 relative">
                                          <div className="flex-1">
                                            <h5 className="font-semibold text-foreground mb-1">
                                              {metric.metric__name}
                                            </h5>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="bg-primary/15 text-primary border-primary/40 font-medium text-xs"
                                              >
                                                {metric.records_count} records
                                              </Badge>
                                              <Badge
                                                variant="outline"
                                                className="bg-secondary/15 text-secondary border-secondary/40 font-medium text-xs"
                                              >
                                                {metric.unique_players} players
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className={`p-1.5 rounded-lg ${
                                            metric.metric__is_lower_better 
                                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                              : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                          }`}>
                                            {metric.metric__is_lower_better ? (
                                              <TrendingDown className="h-3 w-3" />
                                            ) : (
                                              <TrendingUp className="h-3 w-3" />
                                            )}
                                          </div>
                                        </div>

                                        {/* Statistics Grid */}
                                        <div className="grid grid-cols-3 gap-3 relative">
                                          <div className="text-center">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                              Average
                                            </p>
                                            <p className="text-sm font-bold text-primary">
                                              {Number(metric.avg_value).toFixed(2)}
                                              <span className="text-xs text-muted-foreground ml-1">
                                                {metric.metric__metric_unit__code}
                                              </span>
                                            </p>
                                          </div>
                                          
                                          <div className="text-center border-l border-r border-border/30 px-2">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                              {metric.metric__is_lower_better ? 'Best' : 'Highest'}
                                            </p>
                                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                              {Number(metric.metric__is_lower_better ? metric.min_value : metric.max_value).toFixed(2)}
                                              <span className="text-xs text-muted-foreground ml-1">
                                                {metric.metric__metric_unit__code}
                                              </span>
                                            </p>
                                          </div>
                                          
                                          <div className="text-center">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                              {metric.metric__is_lower_better ? 'Worst' : 'Lowest'}
                                            </p>
                                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                              {Number(metric.metric__is_lower_better ? metric.max_value : metric.min_value).toFixed(2)}
                                              <span className="text-xs text-muted-foreground ml-1">
                                                {metric.metric__metric_unit__code}
                                              </span>
                                            </p>
                                          </div>
                                        </div>

                                        {/* Progress indicator */}
                                        <div className="mt-3 relative">
                                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Participation</span>
                                            <span>{Math.round((metric.unique_players / metrics_summary.players_with_metrics) * 100)}%</span>
                                          </div>
                                          <div className="w-full bg-muted/50 rounded-full h-1.5 relative overflow-hidden">
                                            <div 
                                              className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
                                              style={{ 
                                                width: `${Math.min(100, (metric.unique_players / metrics_summary.players_with_metrics) * 100)}%` 
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </TabsContent>

                      {/* Improvements Tab */}
                      <TabsContent
                        value="improvements"
                        className="space-y-4 mt-0"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              Player Improvements
                            </h3>
                          </div>

                          {player_improvements &&
                          player_improvements.length > 0 ? (
                            <div className="space-y-4">
                              {" "}
                              {player_improvements.map((player, index) => (
                                <Card
                                  key={index}
                                  className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden"
                                >
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl opacity-60"></div>
                                  <CardContent className="p-4 relative">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
                                          <AvatarImage
                                            src={player.player_profile}
                                            alt={player.player_name}
                                          />
                                          <AvatarFallback className="bg-gradient-to-br from-primary/15 to-secondary/15 text-primary font-semibold text-sm">
                                            {getPlayerInitials(
                                              player.player_name
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-semibold text-lg text-foreground">
                                            {player.player_name}
                                          </h4>
                                          <p className="text-sm text-muted-foreground font-medium">
                                            {player.metrics_recorded} metrics
                                            recorded
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {player.overall_improvement_percentage !==
                                          0 && (
                                          <Badge
                                            variant={getImprovementVariant(
                                              player.overall_improvement_percentage
                                            )}
                                            className="text-base px-3 py-1"
                                          >
                                            {player.overall_improvement_percentage >
                                            0
                                              ? "+"
                                              : ""}
                                            {
                                              player.overall_improvement_percentage
                                            }
                                            %
                                          </Badge>
                                        )}
                                      </div>
                                    </div>{" "}
                                    {player.metric_improvements &&
                                      player.metric_improvements.length > 0 && (
                                        <div className="space-y-2">
                                          {player.metric_improvements.map(
                                            (metric, metricIndex) => (
                                              <div
                                                key={metricIndex}
                                                className="flex justify-between items-center text-sm p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
                                              >
                                                <span className="font-medium text-foreground">
                                                  {metric.metric_name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-muted-foreground font-medium">
                                                    {metric.current_value}{" "}
                                                    {metric.unit}
                                                  </span>
                                                  {metric.improvement_percentage !==
                                                    null && (
                                                    <div className="flex items-center gap-1">
                                                      {metric.improvement_percentage >
                                                      0 ? (
                                                        <TrendingUp className="h-3 w-3 text-primary" />
                                                      ) : metric.improvement_percentage <
                                                        0 ? (
                                                        <TrendingDown className="h-3 w-3 text-secondary" />
                                                      ) : null}
                                                      <span
                                                        className={
                                                          metric.improvement_percentage >
                                                          0
                                                            ? "text-primary font-semibold"
                                                            : "text-secondary font-semibold"
                                                        }
                                                      >
                                                        {metric.improvement_percentage >
                                                        0
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
                                              </div>
                                            )
                                          )}
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
                                  No improvement data available for this
                                  session.
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </TabsContent>

                      {/* Recommendations Tab */}
                      <TabsContent
                        value="recommendations"
                        className="space-y-4 mt-0"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              Training Recommendations
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {Object.entries(recommendations).map(
                              ([category, items]) =>
                                items.length > 0 && (
                                  <div key={category}>
                                    <h4 className="font-semibold mb-3 capitalize text-lg text-foreground">
                                      {category.replace("_", " ")}
                                    </h4>
                                    <div className="space-y-3">
                                      {items.map((recommendation, index) => (
                                        <Card
                                          key={index}
                                          className={`border-2 ${getPriorityColor(
                                            recommendation.priority
                                          )} hover:shadow-lg transition-all duration-300`}
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                              <div className="mt-1">
                                                {recommendation.priority ===
                                                  "high" && (
                                                  <AlertTriangle className="h-5 w-5" />
                                                )}
                                                {recommendation.priority ===
                                                  "positive" && (
                                                  <CheckCircle className="h-5 w-5" />
                                                )}
                                                {recommendation.priority ===
                                                  "medium" && (
                                                  <Target className="h-5 w-5" />
                                                )}
                                                {recommendation.priority ===
                                                  "low" && (
                                                  <Lightbulb className="h-5 w-5" />
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <p className="font-medium text-sm mb-1">
                                                  {recommendation.message}
                                                </p>
                                                {recommendation.suggestion && (
                                                  <p className="text-xs opacity-90 text-muted-foreground">
                                                    {recommendation.suggestion}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2 border-t border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 -m-6 mt-0 p-6">
          <Button
            onClick={handleViewSessions}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Training Sessions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSummaryModal;
