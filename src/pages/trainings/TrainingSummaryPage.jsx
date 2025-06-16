import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrainingSummary } from "@/hooks/useTrainings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import ContentLoading from "@/components/common/ContentLoading";
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
  Shield,
  MessageSquare,
} from "lucide-react";

const TrainingSummaryPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    data: trainingSummary,
    isLoading,
    error,
  } = useTrainingSummary(sessionId);
  // Debug: Check what we're getting from the API
  console.log("Raw API response:", trainingSummary);

  // Extract the actual training summary data - backend wraps it in training_summary
  const actualSummary = trainingSummary?.training_summary || null;
  console.log("Extracted summary:", actualSummary);

  // Additional check for session status
  if (
    trainingSummary &&
    !trainingSummary.training_summary &&
    trainingSummary.detail
  ) {
    console.log("API returned error:", trainingSummary.detail);
  }

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
  };
  // Get priority color for recommendations
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
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="p-4 md:p-6 space-y-8">
          <UniversityPageHeader
            title="Training Summary"
            subtitle="Training Management"
            description="Loading training session analysis..."
            showBackButton={true}
            backButtonText="Back to Sessions"
            backButtonPath="/trainings/sessions"
            showUniversityColors={true}
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <ContentLoading />
          </div>
        </div>
      </div>
    );
  }
  if (error || !trainingSummary) {
    console.log("Error or no training summary:", { error, trainingSummary });

    // Check if it's a permission or status error
    const errorMessage =
      error?.message ||
      "The training summary could not be loaded. Please try again.";

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
        <div className="p-4 md:p-6 space-y-8">
          <UniversityPageHeader
            title="Training Summary"
            subtitle="Training Management"
            description="Error loading training session analysis"
            showBackButton={true}
            backButtonText="Back to Sessions"
            backButtonPath="/trainings/sessions"
            showUniversityColors={true}
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Trophy className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Unable to Load Training Summary
              </h3>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <Button onClick={() => navigate("/trainings/sessions")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sessions
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Use trainingSummary directly since API now returns unwrapped data
  const {
    session_info,
    attendance_summary,
    metrics_summary,
    player_improvements,
    recommendations,
    effectiveness_score,
  } = trainingSummary;

  // Add safety checks for effectiveness_score
  const safeEffectivenessScore = effectiveness_score || {
    level: "good",
    score: 0,
    components: {
      attendance: 0,
      metrics_completion: 0,
      player_improvement: 0,
      engagement: 0,
    },
  };
  // Add safety checks for other objects
  const safeAttendanceSummary = attendance_summary || {
    total_players: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    attendance_rate: 0,
  };

  const safeMetricsSummary = metrics_summary || {
    total_metrics_recorded: 0,
    completion_rate: 0,
    unique_metrics: 0,
    players_with_metrics: 0,
    metrics_breakdown: [],
  };

  const safePlayerImprovements = player_improvements || [];
  const safeRecommendations = recommendations || {};
  const safeSessionInfo = session_info || {
    title: "Training Session",
    date: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Training Session Summary"
          subtitle={safeSessionInfo?.title || "Training Analysis"}
          description="Complete analysis and insights from your training session"
          showBackButton={true}
          backButtonText="Back to Sessions"
          backButtonPath="/trainings/sessions"
          showUniversityColors={true}
          rightElement={
            <Badge
              variant="outline"
              className={`${getEffectivenessColor(
                safeEffectivenessScore.level
              )} text-sm px-3 py-1 border-2 font-semibold`}
            >
              {safeEffectivenessScore.level.replace("_", " ").toUpperCase()}
            </Badge>
          }
        />

        {/* Quick Stats Overview Cards - Enhanced Design */}
        <div className="animate-in fade-in-50 duration-500 delay-100">
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
                      {safeAttendanceSummary.total_players}
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
                      {safeAttendanceSummary.attendance_rate}%
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
                      {safeMetricsSummary.total_metrics_recorded}
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
                      {safePlayerImprovements
                        ? safePlayerImprovements.filter(
                            (p) => p.overall_improvement_percentage > 0
                          ).length
                        : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid - 3 Column Layout */}
        <div className="animate-in fade-in-50 duration-500 delay-200">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-6">
              {" "}{/* Metrics Section */}
              <div className="animate-in fade-in-50 duration-500 delay-400">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-secondary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-secondary shadow-sm">
                        <Target className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle>Metrics Summary</CardTitle>
                        <CardDescription>
                          Performance metrics captured and analysis breakdown
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 relative">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          Total Records
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {safeMetricsSummary.total_metrics_recorded}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-secondary/8 to-secondary/4 rounded-lg p-4 border border-secondary/20">
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          Completion Rate
                        </p>
                        <p className="text-2xl font-bold text-secondary">
                          {safeMetricsSummary.completion_rate}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg p-4 border border-primary/20">
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          Unique Metrics
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {safeMetricsSummary.unique_metrics}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-secondary/8 to-secondary/4 rounded-lg p-4 border border-secondary/20">
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          Players Recorded
                        </p>
                        <p className="text-2xl font-bold text-secondary">
                          {safeMetricsSummary.players_with_metrics}
                        </p>
                      </div>
                    </div>                    {safeMetricsSummary.metrics_breakdown &&
                      safeMetricsSummary.metrics_breakdown.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Metrics Breakdown
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {safeMetricsSummary.metrics_breakdown.map(
                              (metric, index) => (
                                <div
                                  key={index}
                                  className="bg-gradient-to-br from-card via-card/95 to-muted/20 border border-border/50 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                                >
                                  {/* Background decoration */}
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-60"></div>
                                  
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-4 relative">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-foreground text-lg mb-1">
                                        {metric.metric__name}
                                      </h5>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/15 text-primary border-primary/40 font-medium"
                                        >
                                          {metric.records_count} records
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="bg-secondary/15 text-secondary border-secondary/40 font-medium"
                                        >
                                          {metric.unique_players} players
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className={`p-2 rounded-lg ${
                                      metric.metric__is_lower_better 
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                      {metric.metric__is_lower_better ? (
                                        <TrendingDown className="h-4 w-4" />
                                      ) : (
                                        <TrendingUp className="h-4 w-4" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Statistics Grid */}
                                  <div className="grid grid-cols-3 gap-3 relative">
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                        Average
                                      </p>
                                      <p className="text-lg font-bold text-primary">
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
                                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
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
                                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                        {Number(metric.metric__is_lower_better ? metric.max_value : metric.min_value).toFixed(2)}
                                        <span className="text-xs text-muted-foreground ml-1">
                                          {metric.metric__metric_unit__code}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Progress indicator */}
                                  <div className="mt-4 relative">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                      <span>Participation</span>
                                      <span>{Math.round((metric.unique_players / safeMetricsSummary.players_with_metrics) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-muted/50 rounded-full h-2 relative overflow-hidden">
                                      <div 
                                        className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ 
                                          width: `${Math.min(100, (metric.unique_players / safeMetricsSummary.players_with_metrics) * 100)}%` 
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
                  </CardContent>
                </Card>
              </div>{" "}              {/* Player Improvements Section */}
              <div className="animate-in fade-in-50 duration-500 delay-500">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-primary shadow-sm">
                        <Award className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>                        <CardTitle>Player Improvements</CardTitle>
                        <CardDescription>
                          Individual progress tracking and attendance status for all players
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 relative">
                    {safePlayerImprovements &&
                    safePlayerImprovements.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">                        {safePlayerImprovements.map((player, index) => (
                          <Card
                            key={index}
                            className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg backdrop-blur-sm relative overflow-hidden"
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
                                          player.attendance_status === 'present' 
                                            ? 'bg-primary/10 text-primary border-primary/30' 
                                            : player.attendance_status === 'late'
                                            ? 'bg-secondary/10 text-secondary border-secondary/30'
                                            : player.attendance_status === 'excused'
                                            ? 'bg-muted/20 text-muted-foreground border-muted-foreground/30'
                                            : 'bg-destructive/10 text-destructive border-destructive/30'
                                        }`}
                                      >
                                        {player.attendance_status === 'present' ? '✓ Present' :
                                         player.attendance_status === 'late' ? '⏰ Late' :
                                         player.attendance_status === 'excused' ? '🛡️ Excused' :
                                         '❌ Absent'}
                                      </Badge>
                                      {player.metrics_recorded > 0 && (
                                        <span className="text-sm text-muted-foreground font-medium">
                                          {player.metrics_recorded} metrics recorded
                                        </span>
                                      )}
                                    </div>
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
                                      {player.overall_improvement_percentage > 0
                                        ? "+"
                                        : ""}
                                      {player.overall_improvement_percentage}%
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {player.metric_improvements &&
                                player.metric_improvements.length > 0 && (
                                  <div className="space-y-2">
                                    {player.metric_improvements.map(
                                      (metric, metricIndex) => (                                        <div
                                          key={metricIndex}
                                          className="space-y-2 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
                                        >
                                          <div className="flex justify-between items-center text-sm">
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
                                          </div>                                          {metric.notes && (
                                            <div className="flex items-start gap-2 mt-2 p-2 bg-primary/5 rounded border border-primary/10 text-xs">
                                              <MessageSquare className="h-3 w-3 text-primary/70 mt-0.5 flex-shrink-0" />
                                              <span className="text-muted-foreground leading-relaxed">
                                                {metric.notes}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )                                    )}                                  </div>
                                )}                              {/* Show message for players with no metrics */}
                              {(!player.metric_improvements || player.metric_improvements.length === 0) && (
                                <div className={`p-3 rounded-lg border ${
                                  player.attendance_status === 'absent' || player.attendance_status === 'excused'
                                    ? 'bg-muted/10 border-muted-foreground/20'
                                    : 'bg-secondary/10 border-secondary/20'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    {player.attendance_status === 'absent' ? (
                                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                    ) : player.attendance_status === 'excused' ? (
                                      <Shield className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Target className="h-4 w-4 text-secondary" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                      player.attendance_status === 'absent' || player.attendance_status === 'excused'
                                        ? 'text-muted-foreground'
                                        : 'text-secondary'
                                    }`}>
                                      {player.attendance_status === 'absent' 
                                        ? 'No metrics recorded - Player was absent'
                                        : player.attendance_status === 'excused'
                                        ? 'No metrics recorded - Excused absence'
                                        : 'No metrics recorded for this session'
                                      }
                                    </span>
                                  </div>
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
              </div>
            </div>            {/* Right Sidebar - Session Info & Recommendations */}
            <div className="xl:col-span-1 space-y-6">
              {" "}              {/* Attendance Summary - Moved to Sidebar */}
              <div className="animate-in fade-in-50 duration-500 delay-300">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-primary shadow-sm">
                        <Users className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle>Attendance Summary</CardTitle>
                        <CardDescription>
                          Complete attendance overview and participation rates
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 relative">
                    <div className="space-y-3">
                      {/* Present Card */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/15 to-green-600/10 border border-green-500/30 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Present
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {safeAttendanceSummary.present}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300 text-xs">
                            {((safeAttendanceSummary.present / safeAttendanceSummary.total_players) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Late Card */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/15 to-yellow-600/10 border border-yellow-500/30 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Late
                          </p>
                          <p className="text-xl font-bold text-yellow-600">
                            {safeAttendanceSummary.late}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300 text-xs">
                            {((safeAttendanceSummary.late / safeAttendanceSummary.total_players) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>                      {/* Absent Card */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-500/15 to-red-600/10 border border-red-500/30 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Absent
                          </p>
                          <p className="text-xl font-bold text-red-600">
                            {safeAttendanceSummary.absent}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-300 text-xs">
                            {((safeAttendanceSummary.absent / safeAttendanceSummary.total_players) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Excused Card */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/15 to-blue-600/10 border border-blue-500/30 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            Excused
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {safeAttendanceSummary.excused}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300 text-xs">
                            {((safeAttendanceSummary.excused / safeAttendanceSummary.total_players) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>{" "}{/* Session Details */}
              <div className="animate-in fade-in-50 duration-500 delay-600">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-primary shadow-sm">
                        <FileText className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>
                          Training session information and logistics
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 relative">
                    <div className="space-y-3">
                      {safeSessionInfo.date && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Date
                            </p>
                            <p className="font-semibold text-foreground text-sm">
                              {formatDate(safeSessionInfo.date)}
                            </p>
                          </div>
                        </div>
                      )}

                      {safeSessionInfo.time && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/8 to-secondary/4 border border-secondary/20">
                          <Clock className="h-4 w-4 text-secondary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Time
                            </p>
                            <p className="font-semibold text-foreground text-sm">
                              {safeSessionInfo.time}
                            </p>
                          </div>
                        </div>
                      )}                      {safeSessionInfo.location && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20">
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">
                              Location
                            </p>
                            <p className="font-semibold text-foreground text-sm">
                              {safeSessionInfo.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {safeSessionInfo.notes && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/8 to-blue-600/4 border border-blue-500/20">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground font-medium mb-1">
                              Session Notes
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {safeSessionInfo.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>{" "}              {/* Effectiveness Score */}
              <div className="animate-in fade-in-50 duration-500 delay-700">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-secondary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-2xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-secondary shadow-sm">
                        <Star className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle>Effectiveness</CardTitle>
                        <CardDescription>
                          Overall training session performance rating and
                          breakdown
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 relative">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {safeEffectivenessScore.score}%
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1 border-2 font-semibold"
                      >
                        {safeEffectivenessScore.level
                          .replace("_", " ")
                          .toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">
                            Attendance
                          </span>
                          <span className="font-semibold text-foreground">
                            {safeEffectivenessScore.components.attendance}%
                          </span>
                        </div>
                        <Progress
                          value={safeEffectivenessScore.components.attendance}
                          className="h-2 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">
                            Metrics
                          </span>
                          <span className="font-semibold text-foreground">
                            {
                              safeEffectivenessScore.components
                                .metrics_completion
                            }
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            safeEffectivenessScore.components.metrics_completion
                          }
                          className="h-2 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">
                            Improvement
                          </span>
                          <span className="font-semibold text-foreground">
                            {
                              safeEffectivenessScore.components
                                .player_improvement
                            }
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            safeEffectivenessScore.components.player_improvement
                          }
                          className="h-2 bg-muted/50"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground font-medium">
                            Engagement
                          </span>
                          <span className="font-semibold text-foreground">
                            {safeEffectivenessScore.components.engagement}%
                          </span>
                        </div>
                        <Progress
                          value={safeEffectivenessScore.components.engagement}
                          className="h-2 bg-muted/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>{" "}              {/* Training Recommendations */}
              <div className="animate-in fade-in-50 duration-500 delay-800">
                <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl gap-0 shadow-xl border-2 border-secondary/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-secondary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-2xl opacity-60"></div>{" "}
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-secondary shadow-sm">
                        <Lightbulb className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle>Recommendations</CardTitle>
                        <CardDescription>
                          AI-powered insights and actionable improvement
                          suggestions
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 relative">
                    <ScrollArea className="h-80 pr-2">
                      <div className="space-y-3">
                        {Object.entries(safeRecommendations).length > 0 ? (
                          Object.entries(safeRecommendations).map(
                            ([category, items]) =>
                              items.length > 0 && (
                                <div key={category}>
                                  <h4 className="font-semibold mb-2 capitalize text-sm text-foreground">
                                    {category.replace("_", " ")}
                                  </h4>
                                  <div className="space-y-2">
                                    {items.map((recommendation, index) => (
                                      <Card
                                        key={index}
                                        className="border border-border/50 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-muted/20 to-muted/10"
                                      >
                                        <CardContent className="p-3">
                                          <div className="flex items-start gap-2">
                                            <div className="mt-0.5">
                                              {recommendation.priority ===
                                                "high" && (
                                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                              )}
                                              {recommendation.priority ===
                                                "positive" && (
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                              )}
                                              {recommendation.priority ===
                                                "medium" && (
                                                <Target className="h-3 w-3 text-yellow-600" />
                                              )}
                                              {recommendation.priority ===
                                                "low" && (
                                                <Lightbulb className="h-3 w-3 text-blue-600" />
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium text-xs mb-1 leading-relaxed">
                                                {recommendation.message}
                                              </p>
                                              {recommendation.suggestion && (
                                                <p className="text-xs opacity-90 text-muted-foreground leading-relaxed">
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
                          )
                        ) : (
                          <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
                            <CardContent className="p-6 text-center">
                              <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                              <p className="text-muted-foreground">
                                No recommendations available for this session.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSummaryPage;
