import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ContentLoading from "@/components/common/ContentLoading";
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Star,
  Sparkles,
} from "lucide-react";
import { useTrainingAIInsights } from "@/hooks/useTrainings";

const AIInsightsCard = ({ sessionId }) => {
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Only fetch AI insights when the switch is enabled
  const {
    data: aiInsights,
    isLoading,
    error,
  } = useTrainingAIInsights(sessionId, { enabled: showAIInsights });

  // Format AI insights text with bullet points
  const formatAiText = (text) => {
    if (!text) return null;

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.map((line, index) => {
      if (line.startsWith("•")) {
        return (
          <li key={index} className="flex items-start gap-2 text-sm mb-2">
            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span className="leading-relaxed">{line.substring(1).trim()}</span>
          </li>
        );
      } else {
        return (
          <p
            key={index}
            className="text-sm mb-3 leading-relaxed text-muted-foreground"
          >
            {line}
          </p>
        );
      }
    });
  };

  // Get icon for each insight category
  const getCategoryIcon = (category) => {
    const iconMap = {
      "Session Performance Analysis": TrendingUp,
      "Player Development Insights": Users,
      "Team Dynamics Assessment": Target,
      "Training Optimization": Lightbulb,
      "Strategic Recommendations": Star,
      "Coach Focus Areas": Brain,
    };

    const IconComponent = iconMap[category] || Brain;
    return <IconComponent className="h-4 w-4" />;
  };

  // Get color scheme for each category
  const getCategoryColor = (category) => {
    const colorMap = {
      "Session Performance Analysis":
        "from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200/50",
      "Player Development Insights":
        "from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-green-200/50",
      "Team Dynamics Assessment":
        "from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200/50",
      "Training Optimization":
        "from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200/50",
      "Strategic Recommendations":
        "from-indigo-50/50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/20 border-indigo-200/50",
      "Coach Focus Areas":
        "from-orange-50/50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200/50",
    };

    return (
      colorMap[category] ||
      "from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200/50"
    );
  };

  const renderAIInsightsContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <ContentLoading />
        </div>
      );
    }

    if (error) {
      return (
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">
              Unable to load AI insights at this time.
            </p>
            <p className="text-xs text-muted-foreground">
              {error?.message || "Please try again later."}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!aiInsights?.ai_analysis) {
      return (
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-2">
              AI insights are not available for this session.
            </p>
            <p className="text-xs text-muted-foreground">
              No AI analysis was generated for this training session.
            </p>
          </CardContent>
        </Card>
      );
    }

    const { ai_analysis, session_data, player_analysis } = aiInsights;

    return (
      <ScrollArea className="h-96 pr-2">
        <div className="space-y-4">
          {/* Quick AI Summary Stats */}
          {player_analysis && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {player_analysis.improving_players_count}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Improving
                </div>
              </div>
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {session_data?.effectiveness_score || 0}%
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Effectiveness
                </div>
              </div>
              <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50">
                <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  {player_analysis.declining_players_count}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Need Attention
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Sections */}
          {Object.entries(ai_analysis).map(([category, analysis]) => (
            <Card
              key={category}
              className={`border bg-gradient-to-r ${getCategoryColor(
                category
              )}`}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="text-foreground">{category}</span>
                </h4>
                <div className="space-y-2">{formatAiText(analysis)}</div>
              </CardContent>
            </Card>
          ))}

          {/* Top Performer Highlight */}
          {player_analysis?.top_performer && (
            <Card className="border-2 border-yellow-200/50 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <Star className="h-4 w-4" />
                  Top Performer
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {player_analysis.top_performer.name}
                  </span>
                  <span className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                    +{player_analysis.top_performer.improvement.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="animate-in fade-in-50 duration-500 delay-900">
      <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl shadow-xl border-2 border-secondary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-60"></div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 shadow-sm border border-blue-200/20">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Training Insights
                  {showAIInsights && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      Powered by AI
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {showAIInsights
                    ? "Intelligent analysis of training performance and strategic recommendations"
                    : "Enable AI insights for intelligent training analysis"}
                </CardDescription>
              </div>
            </div>

            {/* AI Insights Toggle */}
            <div className="flex items-center space-x-2 mt-1">
              <Label
                htmlFor="ai-insights-mode"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Insights
              </Label>
              <Switch
                id="ai-insights-mode"
                checked={showAIInsights}
                onCheckedChange={setShowAIInsights}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 relative">
          {showAIInsights ? (
            renderAIInsightsContent()
          ) : (
            <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground mb-2">
                  Enable AI insights to get intelligent analysis
                </p>
                <p className="text-xs text-muted-foreground">
                  Toggle the switch above to activate AI-powered training
                  insights
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsCard;
