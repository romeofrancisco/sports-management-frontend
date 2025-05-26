import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, PlusCircle } from "lucide-react";

/**
 * No metrics available component
 * Displays when player has no metrics recorded
 */
export const NoMetricsState = () => (
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
            No Metrics Available
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This player doesn't have any training metrics recorded yet. Start tracking their performance by recording their first training session.
          </p>
        </div>
        
        {/* Call to action hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
          <PlusCircle className="h-3 w-3" />
          <span>Use the quick actions above to record new training data</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
