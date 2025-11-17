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

    if (aiEnabled) {
      // When AI is enabled, only show NoInsights if we have insights data but no AI analysis
      // If insights is null or undefined, we should show loading or error state instead
      if (insights && !insights?.ai_insights?.ai_analysis) {
        // Check if there's an error in the AI analysis
        const hasAiError =
          insights?.ai_insights?.fallback_used ||
          insights?.insights?.some?.((i) =>
            i.title?.includes("AI Analysis Error")
          );

        // Only show "no insights" if there's no error and no AI analysis
        return !hasAiError;
      }
      return false;
    } else {
      // When AI is disabled, check if any built-in insights are available
      const hasSystemWarnings =
        insights.system_health_warnings &&
        insights.system_health_warnings.length > 0;
      const hasInsights = insights.insights && insights.insights.length > 0;
      const hasRecommendations =
        insights.recommendations && insights.recommendations.length > 0;
      const hasAttendanceTrends = insights.attendance_trends;

      return (
        !hasSystemWarnings &&
        !hasInsights &&
        !hasRecommendations &&
        !hasAttendanceTrends
      );
    }
  };
  // Check if AI analysis failed or is using fallback
  const hasAiError =
    aiEnabled &&
    insights &&
    (insights?.ai_insights?.fallback_used ||
      insights?.insights?.some?.((i) =>
        i.title?.includes("AI Analysis Error")
      ));

      console.log(hasAiError);
      console.log(error);
      console.log(insights);

  // If there's an API error, show error state
  if (hasAiError) {
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
            {/* AI Analysis Section - Show when AI is enabled and analysis is available */}
            {aiEnabled && insights?.ai_insights?.ai_analysis && (
              <AIAnalysisSection insights={insights} />
            )}
            {/* Show error message if AI analysis failed but still show other insights */}
            {hasAiError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  <span className="font-medium">AI Analysis Unavailable:</span>
                  {insights?.ai_insights?.fallback_used
                    ? " Using fallback analysis. AI insights will resume automatically."
                    : " AI analysis encountered an error. Showing standard insights below."}
                </p>
              </div>
            )}
            {/* System Health Warnings - Show when AI is disabled OR when AI fails */}
            {(!aiEnabled || hasAiError) && (
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
              <NoInsightsState aiEnabled={aiEnabled && !hasAiError} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
