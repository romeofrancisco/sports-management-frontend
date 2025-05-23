import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Error state component
 * Displays an error message when data fetching fails
 */
export const ErrorState = ({ error }) => (
  <Card className="w-full">
    <CardContent className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            Error loading player progress: {error.message || "Unknown error"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
