import React from "react";

/**
 * No data available component
 * Displays when no data points exist for the selected metric
 */
export const NoDataState = () => (
  <div className="text-center py-10 text-muted-foreground">
    <div className="bg-muted/10 p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
      <svg
        className="h-8 w-8 text-muted-foreground/60"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium mb-2">No Data Available</h3>
    <p className="text-muted-foreground max-w-md mx-auto mb-6">
      No data available for the selected metric and time period. Try selecting a
      different metric or adjusting the date range.
    </p>
  </div>
);
