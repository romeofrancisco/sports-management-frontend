import React from "react";

/**
 * No metrics available component
 * Displays when player has no metrics recorded
 */
export const NoMetricsState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="bg-muted/20 p-3 rounded-full mb-4">
      <svg
        className="h-10 w-10 text-muted-foreground/80"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium mb-2">No Metrics Available</h3>
    <p className="text-muted-foreground max-w-md mb-6">
      This player doesn't have any training metrics recorded yet.
    </p>
  </div>
);
