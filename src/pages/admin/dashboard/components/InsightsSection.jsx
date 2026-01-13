import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InsightsHeader from "./insights/InsightsHeader";
import AIAnalysisSection from "./insights/AIAnalysisSection";
import SystemWarningsSection from "./insights/SystemWarningsSection";
import InsightsListSection from "./insights/InsightsListSection";
import RecommendationsSection from "./insights/RecommendationsSection";
import AttendanceTrendsSection from "./insights/AttendanceTrendsSection";
import NoInsightsState from "./insights/NoInsightsState";
import LoadingState from "./insights/LoadingState";
import { Button } from "@/components/ui/button";

const InsightsSection = ({
  insights,
  isLoading,
  error,
  aiEnabled,
  onAiToggle,
}) => {
  // Check if there's an API error (network, timeout, etc.)
  const hasApiError = !!error;

  // Helper function to determine if we should show the "No Insights" state
  const shouldShowNoInsights = () => {
    if (!insights) return true;

    // Check if any content is available
    const hasSystemWarnings =
      insights.system_health_warnings &&
      insights.system_health_warnings.length > 0;
    const hasInsights = insights.insights && insights.insights.length > 0;
    const hasRecommendations =
      insights.recommendations && insights.recommendations.length > 0;
    const hasAttendanceTrends = insights.attendance_trends;
    const hasAiAnalysis = insights?.ai_insights?.ai_analysis;

    // Show "no insights" only if there's truly no content
    return (
      !hasSystemWarnings &&
      !hasInsights &&
      !hasRecommendations &&
      !hasAttendanceTrends &&
      !hasAiAnalysis
    );
  };
  // Check if AI analysis is using fallback (not a complete failure, just degraded)
  const hasAiFallback =
    aiEnabled &&
    insights &&
    insights?.ai_insights?.fallback_used;

  // Check if there's a complete API failure (no data at all)
  if (hasApiError && !insights) {
    return (
      <Card>
        <CardContent>
          <InsightsHeader aiEnabled={aiEnabled} onAiToggle={onAiToggle} />
          <div className="p-6 mt-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <h3 className="font-medium text-destructive mb-2">
              Failed to Load Insights
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message ||
                "There was an error loading the insights data. Please try refreshing the page."}
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <InsightsHeader aiEnabled={aiEnabled} onAiToggle={onAiToggle} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            {/* Show warning if AI is using fallback mode */}
            {hasAiFallback && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <span className="font-medium">AI Analysis Limited:</span>
                  {" "}Using fallback analysis due to API quota limits. AI insights will resume automatically when quota resets.
                </p>
              </div>
            )}
            {/* AI Analysis Section - Show when AI is enabled and analysis is available */}
            {aiEnabled && insights?.ai_insights?.ai_analysis && (
              <AIAnalysisSection insights={insights} />
            )}
            {/* System Health Warnings - Show when AI is disabled OR when AI is using fallback */}
            {(!aiEnabled || hasAiFallback) && (
              <SystemWarningsSection
                warnings={insights?.system_health_warnings}
              />
            )}
            {/* Regular Insights Section - Always show when insights are available */}
            <InsightsListSection insights={insights?.insights} />
            {/* Recommendations Section - Always show when recommendations are available */}
            <RecommendationsSection
              recommendations={insights?.recommendations}
            />
            {/* Attendance Trends - Always show when available */}
            <AttendanceTrendsSection
              attendanceTrends={insights?.attendance_trends}
            />
            {/* No Insights State - Show when no relevant content is available */}
            {shouldShowNoInsights() && (
              <NoInsightsState aiEnabled={aiEnabled && !hasAiFallback} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
