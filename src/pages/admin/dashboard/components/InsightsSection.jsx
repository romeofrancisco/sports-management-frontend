import React from "react";
import InsightsHeader from "./insights/InsightsHeader";
import AIAnalysisSection from "./insights/AIAnalysisSection";
import SystemWarningsSection from "./insights/SystemWarningsSection";
import InsightsListSection from "./insights/InsightsListSection";
import RecommendationsSection from "./insights/RecommendationsSection";
import AttendanceTrendsSection from "./insights/AttendanceTrendsSection";
import NoInsightsState from "./insights/NoInsightsState";
import LoadingState from "./insights/LoadingState";

const InsightsSection = ({ insights, isLoading, aiEnabled, onAiToggle }) => {
  if (isLoading) {
    return <LoadingState />;
  }

  // Helper function to determine if we should show the "No Insights" state
  const shouldShowNoInsights = () => {
    if (!insights) return true;
    
    if (aiEnabled) {
      // When AI is enabled, check if AI analysis is available
      return !insights?.ai_insights?.ai_analysis;
    } else {
      // When AI is disabled, check if any built-in insights are available
      const hasSystemWarnings = insights.system_health_warnings && insights.system_health_warnings.length > 0;
      const hasInsights = insights.insights && insights.insights.length > 0;
      const hasRecommendations = insights.recommendations && insights.recommendations.length > 0;
      const hasAttendanceTrends = insights.attendance_trends;
      
      return !hasSystemWarnings && !hasInsights && !hasRecommendations && !hasAttendanceTrends;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Toggle */}
      <InsightsHeader aiEnabled={aiEnabled} onAiToggle={onAiToggle} />
      
      {/* AI Analysis Section - Only show when AI is enabled */}
      {aiEnabled && <AIAnalysisSection insights={insights} />}
      
      {/* System Health Warnings - Only show when AI is disabled */}
      {!aiEnabled && (
        <SystemWarningsSection warnings={insights?.system_health_warnings} />
      )}

      {/* Regular Insights Section - Show when insights are available */}
      <InsightsListSection insights={insights?.insights} />

      {/* Recommendations Section - Show when recommendations are available */}
      <RecommendationsSection recommendations={insights?.recommendations} />
      
      {/* Attendance Trends - Show when available */}
      <AttendanceTrendsSection attendanceTrends={insights?.attendance_trends} />

      {/* No Insights State - Show when no relevant content is available */}
      {shouldShowNoInsights() && <NoInsightsState aiEnabled={aiEnabled} />}
    </div>
  );
};

export default InsightsSection;
