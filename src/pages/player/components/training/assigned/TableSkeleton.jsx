import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ rows = 6, columns = 6 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-border">
      <thead>
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={i} className="px-4 py-2">
              <Skeleton className="h-4 w-24 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIdx) => (
          <tr key={rowIdx} className="border-b">
            {[...Array(columns)].map((_, colIdx) => (
              <td key={colIdx} className="px-4 py-3">
                <Skeleton className="h-4 w-full rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
