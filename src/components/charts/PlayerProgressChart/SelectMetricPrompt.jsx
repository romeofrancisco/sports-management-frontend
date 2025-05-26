import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, MousePointer } from "lucide-react";

/**
 * Select Metric Prompt component
 * Displays a message asking the user to select a metric
 */
export const SelectMetricPrompt = () => (
  <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
    <CardContent className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon with background */}
        <div className="bg-muted/20 p-4 rounded-full">
          <BarChart3 className="h-12 w-12 text-muted-foreground/60" />
        </div>
        
        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Select a Metric to View Progress
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Choose a training metric from the dropdown above to visualize this player's performance trends and improvements over time.
          </p>
        </div>
        
        {/* Call to action hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
          <MousePointer className="h-3 w-3" />
          <span>Use the metric selector above to get started</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
