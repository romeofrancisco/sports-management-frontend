import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Eye, AlertCircle, Brain } from "lucide-react";

const NoInsightsState = ({ aiEnabled, hasError = false }) => {
  const getContent = () => {
    if (hasError) {
      return {
        icon: AlertCircle,
        title: "Analysis Unavailable",
        description: "There was an issue generating insights. Please try refreshing the page or contact support if the problem persists."
      };
    }
    
    if (aiEnabled) {
      return {
        icon: Brain,
        title: "AI Analysis In Progress",
        description: "AI-powered insights are being generated. This may take a few moments..."
      };
    }
    
    return {
      icon: Eye,
      title: "No Insights Available",
      description: "System insights and alerts will appear here once there's enough data to analyze."
    };
  };

  const { icon: Icon, title, description } = getContent();

  return (
    <Card className="border-2 border-muted bg-gradient-to-br from-card to-muted/10">
      <CardContent className="text-center py-12">
        <Icon className={`h-12 w-12 mx-auto mb-4 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`} />
        <h3 className={`font-medium mb-2 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
        {aiEnabled && !hasError && (
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-primary font-medium">Processing...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoInsightsState;
