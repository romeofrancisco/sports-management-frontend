import React from "react";
import { AlertTriangle, Edit3 } from "lucide-react";
import { Button } from "../../../../ui/button";

const InputWarning = ({ 
  metricsToShow = [], 
  metricValues = {},
}) => {
  // Find metrics with invalid values
  const invalidMetrics = metricsToShow.filter((metric) => {
    const currentValue = metricValues[metric.id] || "";
    if (currentValue === "") return false; // Empty is not invalid
    
    // Check for "." or zero values
    if (currentValue === ".") return true;
    
    const numericValue = parseFloat(currentValue);
    return !isNaN(numericValue) && numericValue === 0;
  });

  return (
    <div className="p-4 sm:p-6 bg-destructive/5 dark:bg-destructive/10 rounded-xl border border-destructive/20 dark:border-destructive/30">
      <div className="text-center">
        {/* Icon */}
        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive mb-3 mx-auto" />
        
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-destructive mb-2">
          Invalid Values Detected
        </h3>
        
        {/* Description */}
        <p className="text-xs sm:text-sm text-destructive/80 mb-4">
          Invalid values are not allowed for performance metrics. 
          {invalidMetrics.length === 1 
            ? ` The "${invalidMetrics[0].name}" metric needs a valid value.`
            : ` ${invalidMetrics.length} metrics need valid values.`
          }
        </p>

        {/* Main Content - Affected Metrics */}
        {invalidMetrics.length > 0 && (
          <div className="mb-4">
            <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-3 border border-destructive/20 dark:border-destructive/30">
              <h4 className="text-xs font-medium text-destructive mb-2">
                Metrics with invalid values:
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {invalidMetrics.map((metric) => (
                  <span
                    key={metric.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 dark:bg-destructive/30 text-destructive border border-destructive/30 dark:border-destructive/40"
                  >
                    {metric.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer - Help Text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Enter valid positive values or clear fields completely to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputWarning;
