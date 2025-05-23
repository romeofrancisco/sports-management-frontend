import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/**
 * Loading state component
 * Displays a loading spinner when data is being fetched
 */
export const LoadingState = () => (
  <Card className="w-full">
    <CardContent className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p>Loading player progress data...</p>
      </div>
    </CardContent>
  </Card>
);
