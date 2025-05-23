import React from "react";
import { PerformanceAnalysis } from "./PerformanceAnalysis";
import { ChartBar, BarChartBig, LineChart, TrendingUp, Award } from "lucide-react";

/**
 * Performance Analysis Section component
 * Displays the performance analysis section if data is available
 */
export const PerformanceAnalysisSection = ({ metricData, playerData, selectedMetric }) => {
  if (!metricData || !playerData) {
    return null;
  }

  // For overall metrics, we need to get the overall performance analysis from metrics_data
  const effectiveMetricData = selectedMetric === "overall" 
    ? playerData.metrics_data.find(m => m.metric_id === "overall")
    : metricData;

  if (!effectiveMetricData || !effectiveMetricData.performance_analysis) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
          <BarChartBig className="h-5 w-5 text-blue-700 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold ">
          Performance Insights
        </h3>
      </div>
      <PerformanceAnalysis metricData={effectiveMetricData} />
    </div>
  );
};
