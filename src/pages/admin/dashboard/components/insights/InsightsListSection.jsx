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
  Lightbulb,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
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
      return "from-card to-secondary/5 border-secondary/30";
    case "success":
      return "from-card to-primary/5 border-primary/30";
    case "trend_up":
      return "from-card to-primary/5 border-primary/30";
    case "trend_down":
      return "from-card to-destructive/5 border-destructive/30";
    default:
      return "from-card to-secondary/5 border-secondary/30";
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

const InsightsListSection = ({ insights }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_DISPLAY_LIMIT = 4;

  if (!insights || insights.length === 0) {
    return null;
  }

  const displayInsights = isExpanded ? insights : insights.slice(0, INITIAL_DISPLAY_LIMIT);
  const shouldShowMoreButton = insights.length > INITIAL_DISPLAY_LIMIT;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">System Insights</h3>
        <Badge variant="secondary" className="text-xs">
          {insights.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {displayInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type || "info");
          const colorClass = getInsightColor(insight.type || "info");
          const iconColor = getIconColor(insight.type || "info");

          return (
            <Card
              key={`insight-${index}`}
              className={`group relative overflow-hidden border-2 gap-0 transition-all animate-in fade-in-50 duration-500 bg-gradient-to-br ${colorClass}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      System Insight
                    </CardTitle>
                    {insight.source === "ai" && (
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
                  {insight.title && (
                    <h4 className="font-medium text-sm">
                      {insight.title}
                    </h4>
                  )}
                  <p className="text-sm leading-relaxed">
                    {safeRender(
                      insight.message || insight.description,
                      "No message available"
                    )}
                  </p>
                  {insight.action && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">
                        Recommended Action:
                      </span>
                      {insight.action}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      insight.type === "warning"
                        ? "bg-secondary/10 text-secondary border-secondary/30"
                        : insight.type === "success"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted/10 text-muted-foreground border-muted/30"
                    }`}
                  >
                    {insight.type === "warning"
                      ? "Warning"
                      : insight.type === "success"
                      ? "Success"
                      : "Info"}
                  </Badge>
                </div>
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
                Show {insights.length - INITIAL_DISPLAY_LIMIT} More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsightsListSection;
