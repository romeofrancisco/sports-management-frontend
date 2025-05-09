import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * A reusable chart wrapper component for consistent chart styling
 * @param {Object} props - Component properties
 * @param {string} props.title - Chart title
 * @param {React.ReactNode} props.children - Chart content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.action] - Optional action component in header
 * @param {number} [props.height] - Optional height for the chart container in pixels
 * @param {React.ReactNode} [props.emptyMessage] - Message to show when no data is available
 * @param {boolean} [props.hasData] - Whether the chart has data to display
 * @returns {React.ReactElement} ChartCard component
 */
const ChartCard = ({ 
  title, 
  children, 
  className = "", 
  action,
  height = 300,
  emptyMessage = "No data available",
  hasData = true
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
          {action && <div className="ml-auto">{action}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div style={{ height: `${height}px` }} className="w-full">
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;