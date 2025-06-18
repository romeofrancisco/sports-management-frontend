import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrainingSummary } from "@/hooks/useTrainings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import ContentLoading from "@/components/common/ContentLoading";
import {
  QuickStatsOverview,
  MetricsSummarySection,
  PlayerImprovementsSection,
  AttendanceSummaryCard,
  SessionInfoCard,
  EffectivenessScoreCard,
  RecommendationsCard,
} from "@/components/trainings/sessions/components/summary";
import { Trophy, ArrowLeft } from "lucide-react";

const TrainingSummaryPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    data: trainingSummary,
    isLoading,
    error,
  } = useTrainingSummary(sessionId);

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

  // Get player initials for avatar fallback
  const getPlayerInitials = (playerName) => {
    return playerName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
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

        {/* Quick Stats Overview Cards */}
        <QuickStatsOverview
          attendanceSummary={safeAttendanceSummary}
          metricsSummary={safeMetricsSummary}
          playerImprovements={safePlayerImprovements}
        />

        {/* Main Content Grid - 3 Column Layout */}
        <div className="animate-in fade-in-50 duration-500 delay-200">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Metrics Section */}
              <MetricsSummarySection metricsSummary={safeMetricsSummary} />
              {/* Player Improvements Section */}
              <PlayerImprovementsSection
                playerImprovements={safePlayerImprovements}
                metricsSummary={safeMetricsSummary}
                getImprovementVariant={getImprovementVariant}
                getPlayerInitials={getPlayerInitials}
              />
            </div>

            {/* Right Sidebar - Session Info & Recommendations */}
            <div className="xl:col-span-1 space-y-6">
              {/* Session Details */}
              <SessionInfoCard
                sessionInfo={safeSessionInfo}
                formatDate={formatDate}
              />
              {/* Attendance Summary */}
              <AttendanceSummaryCard
                attendanceSummary={safeAttendanceSummary}
              />

              {/* Effectiveness Score */}
              <EffectivenessScoreCard
                effectivenessScore={safeEffectivenessScore}
              />

              {/* Training Recommendations */}
              <RecommendationsCard recommendations={safeRecommendations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSummaryPage;
