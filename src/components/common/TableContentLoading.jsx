import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TableContentLoading = ({ rowCount = 5, columnCount = 5 }) => {
  return (
    <div className="w-full overflow-hidden">
      {/* Header row */}
      <div className="grid gap-4 mb-4 px-4" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {Array(columnCount)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-6 w-full rounded" />
          ))}
      </div>
      
      {/* Data rows */}
      {Array(rowCount)
        .fill(0)
        .map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`}
            className="grid gap-4 mb-4 px-4 py-3 border rounded-md" 
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {Array(columnCount)
              .fill(0)
              .map((_, colIndex) => {
                // Make the first column wider for name/title
                const isFirstCol = colIndex === 0;
                // Make some columns shorter for badges or small text
                const isShortCol = colIndex === columnCount - 1 || colIndex === columnCount - 2;
                
                return (
                  <div key={`cell-${rowIndex}-${colIndex}`} className="flex items-center">
                    {isFirstCol && (
                      <Skeleton className="h-10 w-10 rounded-full mr-2" />
                    )}
                    <Skeleton 
                      className={`h-5 rounded ${
                        isFirstCol ? 'w-24' : isShortCol ? 'w-12' : 'w-16'
                      }`} 
                    />
                  </div>
                );
              })}
          </div>
        ))}
    </div>
  );
};

export default TableContentLoading;