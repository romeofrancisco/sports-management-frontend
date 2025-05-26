import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar } from "lucide-react";

/**
 * No data available component
 * Displays when no training sessions exist for the selected metric
 */
export const NoDataState = () => (
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
            No Data Available
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No training data found for the selected metric and time period. Try selecting a different metric or check if data has been recorded for this player.
          </p>
        </div>
        
        {/* Call to action hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-full">
          <Calendar className="h-3 w-3" />
          <span>Try adjusting the date range or selecting a different metric</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
