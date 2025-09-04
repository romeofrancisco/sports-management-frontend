import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

/**
 * A reusable chart wrapper component for consistent chart styling
 * @param {Object} props - Component properties
 * @param {string} props.title - Chart title
 * @param {string} [props.description] - Chart description/subtitle
 * @param {React.ReactNode} props.children - Chart content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.action] - Optional action component in header
 * @param {React.ReactNode} [props.icon] - Optional icon component
 * @param {number} [props.height] - Optional height for the chart container in pixels
 * @param {React.ReactNode} [props.emptyMessage] - Message to show when no data is available
 * @param {boolean} [props.hasData] - Whether the chart has data to display
 * @returns {React.ReactElement} ChartCard component
 */
const ChartCard = ({ 
  title, 
  description,
  children, 
  className = "", 
  action,
  icon,
  height = 300,
  emptyMessage = "Chart data will appear here once information is available.",
  hasData = true
}) => {
  const IconComponent = icon || BarChart3;

  return (
    <Card className={`border-2 border-primary/20 overflow-hidden ${className}`}>
      <CardHeader className="relative">
        <div className="flex md:flex-row flex-col justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <IconComponent className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action && <div className="lg:ml-auto">{action}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div style={{ height: `${height}px` }} className="w-full">
            {children}
          </div>
        ) : (
          <div className="text-center content-center py-12" style={{ minHeight: `${height}px` }}>
            <div className="p-4 bg-muted rounded-full mb-4 mx-auto w-fit">
              <IconComponent className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Data Available
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {emptyMessage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;