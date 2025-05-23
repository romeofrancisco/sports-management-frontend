import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Award, 
  Calendar, 
  Clock,
  LineChart
} from "lucide-react";
import { formatMetricValue } from "@/utils/formatters";

export const PerformanceAnalysis = ({ metricData }) => {
  try {
    // Check if we have valid metric data and performance analysis from backend
    if (!metricData) {
      return <p>No metric data available.</p>;
    }
    
    // Use backend performance analysis
    if (!metricData.performance_analysis) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            Performance analysis data not available. Please try another metric or different date range.
          </p>
        </div>
      );
    }
    
    const analysis = metricData.performance_analysis;
    const isOverallMetric = metricData.metric_id === "overall";
    
    if (isOverallMetric) {
      // For overall performance, show summary data across all metrics
      const { overall_improvement, recent_improvement, data_points_count, stats } = analysis;
        return (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Overall improvement */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" /> 
                  <span>Overall Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    overall_improvement.is_positive ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {overall_improvement.is_positive ? (
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      overall_improvement.is_positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}>
                      {overall_improvement.is_positive ? "+" : ""}{overall_improvement.percentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {overall_improvement.is_positive ? "Improvement" : "Decline"} across all metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent improvement */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  <span>Recent Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    recent_improvement.is_positive ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {recent_improvement.is_positive ? (
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      recent_improvement.is_positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}>
                      {recent_improvement.is_positive ? "+" : ""}{recent_improvement.percentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Last {recent_improvement.sessions_count} sessions ({recent_improvement.metric_count} metric{recent_improvement.metric_count !== 1 ? 's' : ''})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Statistics */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Best Performance</p>
                    <p className="text-lg font-bold">{stats.max.toFixed(1)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your highest achievement</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Average Performance</p>
                    <p className="text-lg font-bold">{stats.mean.toFixed(1)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your typical level</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Training Sessions</p>
                    <p className="text-lg font-bold">{data_points_count}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total sessions recorded</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // For individual metrics, show detailed analysis
      const {
        first_record,
        last_record,
        best_record,
        overall_improvement,
        recent_improvement,
        stats
      } = analysis;
        const isImproved = overall_improvement.is_positive;
      
      return (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Absolute improvement card */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span>Total Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    isImproved ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {isImproved ? (
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div className="text-center">                    <div className={`text-3xl font-bold ${
                      isImproved ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}>
                      {formatMetricValue(overall_improvement.absolute, metricData.unit)} {metricData.unit}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {isImproved ? "Improvement" : "Decline"} from first record
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Percentage improvement card */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  <span>Percentage Change</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    isImproved ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {isImproved ? (
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      isImproved ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}>
                      {isImproved ? "+" : ""}{overall_improvement.percentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Overall percentage change
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent improvement analysis */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-600" />
                <span>Recent Progress</span>
              </CardTitle>
              <CardDescription>
                Last {recent_improvement.sessions_count} sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className={`mr-4 p-3 rounded-full ${
                    recent_improvement.is_positive ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {recent_improvement.is_positive ? (
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${
                      recent_improvement.is_positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}>
                      {recent_improvement.is_positive ? "+" : ""}{recent_improvement.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Recent {recent_improvement.is_positive ? "improvement" : "decline"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-sm">Start:</span> 
                    <span className="font-bold text-base">{formatMetricValue(first_record.value, metricData.unit)} {metricData.unit}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-sm">Latest:</span> 
                    <span className="font-bold text-base">{formatMetricValue(last_record.value, metricData.unit)} {metricData.unit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium text-sm">Best:</span> 
                    <span className="font-bold text-base">{formatMetricValue(best_record.value, metricData.unit)} {metricData.unit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional performance metrics */}
            <Card className="pt-0">
              <CardHeader className="bg-muted/30 py-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span>Performance Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Personal Best</p>
                    <p className="text-lg font-bold">{formatMetricValue(stats.max, metricData.unit)} {metricData.unit}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your top performance</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Average</p>
                    <p className="text-lg font-bold">{formatMetricValue(stats.mean, metricData.unit)} {metricData.unit}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your typical level</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-500 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">Starting Point</p>
                    <p className="text-lg font-bold">{formatMetricValue(stats.min, metricData.unit)} {metricData.unit}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your baseline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  } catch (err) {
    console.error("Error in PerformanceAnalysis:", err);
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Performance analysis data not available. Please try another metric or different date range.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          If this problem persists, contact the system administrator.
        </p>
      </div>
    );
  }
};
