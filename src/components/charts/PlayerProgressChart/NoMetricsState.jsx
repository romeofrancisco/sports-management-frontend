import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, PlusCircle } from "lucide-react";

/**
 * No metrics available component
 * Displays when player has no metrics recorded
 */
export const NoMetricsState = () => (
  <Card className="border-0 shadow-none">
    <CardContent className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon with background */}
        <div className="bg-muted p-4 rounded-full">
          <BarChart3 className="size-8 text-muted-foreground/60" />
        </div>
        
        {/* Title and description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-muted-foreground">
            No Metrics Available
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This player doesn't have any training metrics recorded yet. Start tracking their performance by recording their first training session.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
