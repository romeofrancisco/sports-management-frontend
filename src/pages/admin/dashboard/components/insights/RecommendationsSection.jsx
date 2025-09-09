import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
} from "lucide-react";

// Utility function to safely render content
const safeRender = (content, fallback = "No data available") => {
  if (typeof content === "string") return content;
  if (typeof content === "number") return content.toString();
  if (content === null || content === undefined) return fallback;
  if (typeof content === "object") {
    // Try to extract meaningful content from object
    if (content.message) return content.message;
    if (content.description) return content.description;
    if (content.text) return content.text;
    return fallback;
  }
  return fallback;
};

const getInsightIcon = (type) => {
  switch (type) {
    case "warning":
      return AlertCircle;
    case "success":
      return CheckCircle2;
    case "trend_up":
      return TrendingUp;
    case "trend_down":
      return TrendingDown;
    default:
      return Lightbulb;
  }
};

const getInsightColor = (type) => {
  switch (type) {
    case "warning":
      return "from-card to-secondary/10 border-secondary/20";
    case "success":
      return "from-card to-primary/10 border-primary/20";
    case "trend_up":
      return "from-card to-primary/10 border-primary/20";
    case "trend_down":
      return "from-card to-destructive/10 border-destructive/20";
    default:
      return "from-card to-secondary/10 border-secondary/20";
  }
};

const getIconColor = (type) => {
  switch (type) {
    case "warning":
      return "text-secondary-foreground";
    case "success":
      return "text-primary";
    case "trend_up":
      return "text-primary";
    case "trend_down":
      return "text-destructive";
    default:
      return "text-secondary-foreground";
  }
};

const RecommendationsSection = ({ recommendations }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_DISPLAY_LIMIT = 4;

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const displayRecommendations = isExpanded ? recommendations : recommendations.slice(0, INITIAL_DISPLAY_LIMIT);
  const shouldShowMoreButton = recommendations.length > INITIAL_DISPLAY_LIMIT;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Recommendations</h3>
        <Badge variant="secondary" className="text-xs">
          {recommendations.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {displayRecommendations.map((recommendation, index) => {
          const IconComponent = getInsightIcon(recommendation.type || "info");
          const colorClass = getInsightColor(recommendation.type || "info");
          const iconColor = getIconColor(recommendation.type || "info");

          return (
            <Card
              key={`recommendation-${index}`}
              className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-in fade-in-50 duration-500 bg-gradient-to-br ${colorClass}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>

              <CardHeader className="pb-3 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recommendation
                    </CardTitle>
                    {recommendation.source === "ai" && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-md text-xs font-medium">
                        <Brain className="h-3 w-3" />
                        AI
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-white/20 ${iconColor}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-2">
                  {recommendation.title && (
                    <h4 className="font-medium text-sm">
                      {recommendation.title}
                    </h4>
                  )}                  <div className="text-sm leading-relaxed">
                    {(() => {
                      const content = safeRender(
                        recommendation.description ||
                          recommendation.message ||
                          recommendation,
                        "No description available"
                      );
                      
                      // Check if content has bullet points
                      if (content.includes('•')) {
                        // Split by bullet points and newlines, then filter out empty items
                        const items = content
                          .split(/\n?\s*•\s*/)
                          .filter(item => item.trim())
                          .map(item => item.trim());
                        
                        return (
                          <div className="space-y-1">
                            {items.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span className="flex-1">{item}</span>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return <span>{content}</span>;
                      }
                    })()}
                  </div>
                  {recommendation.category && (
                    <div className="text-xs text-muted-foreground capitalize">
                      Category: {recommendation.category}
                    </div>
                  )}
                </div>
                {recommendation.priority && (
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        recommendation.priority === "high"
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : recommendation.priority === "medium"
                          ? "bg-secondary/10 text-secondary border-secondary/30"
                          : "bg-primary/10 text-primary border-primary/30"
                      }`}
                    >
                      {recommendation.priority.charAt(0).toUpperCase() +
                        recommendation.priority.slice(1)}
                      Priority
                    </Badge>
                  </div>
                )}                {recommendation.suggested_actions &&
                  recommendation.suggested_actions.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Suggested Actions:
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {recommendation.suggested_actions.map(
                          (action, actionIndex) => {
                            // Parse bullet points from the action string
                            const actionText = action || '';
                            
                            // Split by bullet points and newlines, then filter out empty items
                            let actionItems = [];
                            
                            if (actionText.includes('•')) {
                              // Handle bullet points with newlines: "• item1\n• item2\n• item3"
                              actionItems = actionText
                                .split(/\n?\s*•\s*/)
                                .filter(item => item.trim())
                                .map(item => item.trim());
                            } else {
                              // Handle as single action if no bullet points
                              actionItems = [actionText.trim()];
                            }
                            
                            return actionItems.map((item, itemIndex) => (
                              <div
                                key={`${actionIndex}-${itemIndex}`}
                                className="flex items-start gap-2 mb-1"
                              >
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span className="flex-1">{item}</span>
                              </div>
                            ));
                          }
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Show More Button */}
      {shouldShowMoreButton && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {recommendations.length - INITIAL_DISPLAY_LIMIT} More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;
