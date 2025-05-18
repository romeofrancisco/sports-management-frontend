import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useTrainingMetrics,
  usePlayerProgressById
} from "@/hooks/useTrainings";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler,
  annotationPlugin
);

/**
 * Loading state component
 * Displays a loading spinner when data is being fetched
 */
const LoadingState = () => (
  <Card className="w-full">
    <CardContent className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p>Loading player progress data...</p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Error state component
 * Displays an error message when data fetching fails
 */
const ErrorState = ({ error }) => (
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

/**
 * Empty state component
 * Displays a message when no data is available
 */
const EmptyState = ({ message }) => (
  <Card className="w-full">
    <CardContent className="flex justify-center items-center py-12">
      <div className="text-center">
        <p className="text-muted-foreground">{message}</p>
      </div>
    </CardContent>
  </Card>
);

/**
 * No metrics available component
 * Displays when player has no metrics recorded
 */
const NoMetricsState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="bg-muted/20 p-3 rounded-full mb-4">
      <svg className="h-10 w-10 text-muted-foreground/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium mb-2">No Metrics Available</h3>
    <p className="text-muted-foreground max-w-md mb-6">
      This player doesn't have any training metrics recorded yet.
    </p>
  </div>
);

/**
 * No data available component
 * Displays when no data points exist for the selected metric 
 */
const NoDataState = () => (
  <div className="text-center py-10 text-muted-foreground">
    <div className="bg-muted/10 p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
      <svg className="h-8 w-8 text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium mb-2">No Data Available</h3>
    <p className="text-muted-foreground max-w-md mx-auto mb-6">
      No data available for the selected metric and time period. Try selecting a different metric or adjusting the date range.
    </p>
  </div>
);

/**
 * Progress Chart component
 * Renders a line chart visualization of player progress
 */
const ProgressChart = ({ selectedMetricData }) => (
  <div style={{ height: '350px' }}>
    <Line
      data={{
        labels: selectedMetricData.data_points.map(point => point.date || ''),
        datasets: [
          {
            label: selectedMetricData.metric_name || 'Value',
            data: selectedMetricData.data_points.map(point => point.value || 0),
            borderColor: '#8884d8',
            backgroundColor: 'rgba(136, 132, 216, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: true,
          }
        ]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: selectedMetricData.is_lower_better ? false : true,
            title: {
              display: true,
              text: `${selectedMetricData.metric_name} (${selectedMetricData.unit})`,
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} ${selectedMetricData.unit}`;
              }
            }
          },
          annotation: (selectedMetricData.data_points.length > 1) ? {
            annotations: {
              startingLine: {
                type: 'line',
                yMin: selectedMetricData.data_points[0].value || 0,
                yMax: selectedMetricData.data_points[0].value || 0,
                xMin: 0,
                xMax: selectedMetricData.data_points.length - 1,
                borderColor: 'green',
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  content: 'Starting Point',
                  position: 'end',
                  backgroundColor: 'rgba(0,128,0,0.7)',
                }
              }
            }
          } : {}
        }
      }}
    />
  </div>
);

/**
 * Select Metric Prompt component
 * Displays a message asking the user to select a metric
 */
const SelectMetricPrompt = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <p className="text-muted-foreground">Please select a metric to view player progress.</p>
  </div>
);

/**
 * Main PlayerProgressChart component
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.playerId - ID of the player to display progress for
 * @param {string|null} [props.teamSlug=null] - Optional team slug
 * @param {Object|null} [props.dateRange=null] - Optional date range for filtering data
 * @param {Function} [props.onDateChange] - Optional callback for date range changes
 * @returns {JSX.Element} Rendered component
 */
const PlayerProgressChart = ({ playerId, teamSlug = null, dateRange = null, onDateChange }) => {
  // State hooks
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [localDateRange, setLocalDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  // Keep localDateRange in sync with dateRange prop
  useEffect(() => {
    if (
      dateRange && 
      dateRange.from && 
      dateRange.to && 
      (dateRange.from !== localDateRange.from || dateRange.to !== localDateRange.to)
    ) {
      setLocalDateRange(dateRange);
    }
  }, [dateRange]);

  // Format date range for API requests
  const effectiveDateRange = dateRange?.from && dateRange?.to ? dateRange : localDateRange;
  const formattedDateRange = useMemo(() => ({
    date_from: effectiveDateRange.from ? new Date(effectiveDateRange.from).toISOString().split("T")[0] : undefined,
    date_to: effectiveDateRange.to ? new Date(effectiveDateRange.to).toISOString().split("T")[0] : undefined,
  }), [effectiveDateRange]);

  // Data fetching hooks
  const { data: metrics = [], isLoading: metricsLoading } = useTrainingMetrics();
  const { data: playerData, isLoading, error } = usePlayerProgressById(
    playerId,
    {
      ...formattedDateRange,
      metric: selectedMetric,
    },
    !!playerId
  );

  // Auto-select first metric if none is selected
  useEffect(() => {
    if (
      playerData?.metrics_data &&
      Array.isArray(playerData.metrics_data) &&
      playerData.metrics_data.length > 0 &&
      (
        !selectedMetric ||
        (selectedMetric && !playerData.metrics_data.some(m => String(m.metric_id) === String(selectedMetric)))
      )
    ) {
      setSelectedMetric(String(playerData.metrics_data[0].metric_id));
    }
  }, [selectedMetric, playerData]);
    // Handle loading, error, and empty states
  if (isLoading || metricsLoading) return <LoadingState />;
  
  if (error) return <ErrorState error={error} />;
  
  if (!playerData) return <EmptyState message="No player data available" />;
  
  // Find the selected metric's data
  const selectedMetricData = playerData.metrics_data && Array.isArray(playerData.metrics_data) 
    ? playerData.metrics_data.find(m => String(m.metric_id) === String(selectedMetric))
    : null;

  // Check if we have any metrics data to display
  const hasMetricsData = playerData.metrics_data && 
    Array.isArray(playerData.metrics_data) && 
    playerData.metrics_data.length > 0;
  
  // Check if we have any data points for the selected metric
  const hasDataPoints = selectedMetricData?.data_points && 
    Array.isArray(selectedMetricData.data_points) && 
    selectedMetricData.data_points.length > 0;  // Handle date range changes
  const handleDateChange = onDateChange ? onDateChange : setLocalDateRange;

  return (
    <Card>
      <ChartHeader 
        playerName={playerData.player_name}
        effectiveDateRange={effectiveDateRange}
        onDateChange={handleDateChange}
        metrics={metrics} 
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        selectedMetricData={selectedMetricData}
      />      <CardContent>
        {!hasMetricsData ? (
          <NoMetricsState />
        ) : !selectedMetric ? (
          <SelectMetricPrompt />
        ) : hasDataPoints ? (
          <ProgressChart selectedMetricData={selectedMetricData} />
        ) : (
          <NoDataState />
        )}        
        <PerformanceAnalysisSection metricData={selectedMetricData} />
      </CardContent>
    </Card>
  );
};

/**
 * Chart Header component
 * Displays title, date range picker, and metric selector
 */
const ChartHeader = ({ 
  playerName, 
  effectiveDateRange, 
  onDateChange,
  metrics, 
  selectedMetric, 
  setSelectedMetric, 
  selectedMetricData 
}) => (
  <CardHeader>
    <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
      <div>
        <CardTitle>{playerName || "Player"} Progress</CardTitle>
        <CardDescription>Track improvements over time</CardDescription>
      </div>
      <DateRangePicker
        date={effectiveDateRange}
        onDateChange={onDateChange}
      />
    </div>
    <div className="flex gap-4 items-center mt-4">
      <div className="w-full sm:w-64">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger>
            <SelectValue placeholder="Select a metric" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map(metric => (
              <SelectItem key={metric.id} value={metric.id.toString()}>
                {metric.name} ({metric.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedMetricData && (
        <Badge variant="outline">
          {selectedMetricData.is_lower_better ? "Lower is better" : "Higher is better"}
        </Badge>
      )}
    </div>
  </CardHeader>
);
const PerformanceAnalysis = ({ metricData }) => {
  if (!metricData || !Array.isArray(metricData.data_points) || metricData.data_points.length < 2) {
    return <p>Not enough data points for analysis.</p>;
  }
  
  try {
    // Get first and last data points
    const firstPoint = metricData.data_points[0] || { value: 0 };
    const lastPoint = metricData.data_points[metricData.data_points.length - 1] || { value: 0 };
    
    // Calculate raw difference and improvement
    const rawDiff = (lastPoint.value || 0) - (firstPoint.value || 0);
    let improvement = metricData.is_lower_better ? -rawDiff : rawDiff;
    
    // Calculate percentage improvement (avoid division by zero)
    const percentage = (firstPoint.value !== 0 && firstPoint.value !== null && firstPoint.value !== undefined) 
      ? (rawDiff / firstPoint.value) * 100 
      : 0;
      
    // Handle metrics where lower values are better
    const improvementPercentage = metricData.is_lower_better ? -percentage : percentage;
    const isImproved = improvement > 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Absolute improvement card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {improvement.toFixed(2)} {metricData.unit}
              </div>
              <p className={`text-sm ${isImproved ? "text-green-600" : "text-red-600"}`}>
                {isImproved ? "Improvement" : "Decline"} from first to last record
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Percentage improvement card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {improvementPercentage.toFixed(2)}%
              </div>
              <p className={`text-sm ${isImproved ? "text-green-600" : "text-red-600"}`}>
                Percentage {isImproved ? "Improvement" : "Decline"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Training period summary card */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Training Period Summary</h4>
            <ul className="space-y-1 text-sm">
              <li><span className="font-medium">Start Date:</span> {firstPoint.date}</li>
              <li><span className="font-medium">End Date:</span> {lastPoint.date}</li>
              <li><span className="font-medium">Starting Value:</span> {firstPoint.value} {metricData.unit}</li>
              <li><span className="font-medium">Latest Value:</span> {lastPoint.value} {metricData.unit}</li>
              <li>
                <span className="font-medium">Overall Trend:</span> 
                <span className={isImproved ? "text-green-600" : "text-red-600"}>
                  {isImproved ? "Positive Improvement" : "Needs Attention"}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  } catch (err) {
    console.error("Error in PerformanceAnalysis:", err);
    return <p className="text-red-500">Unable to analyze performance data.</p>;
  }
};

/**
 * Performance Analysis Section component
 * Displays the performance analysis section if data is available
 */
const PerformanceAnalysisSection = ({ metricData }) => {
  if (!metricData || !metricData.data_points || metricData.data_points.length < 2) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Performance Analysis</h3>
      <PerformanceAnalysis metricData={metricData} />
    </div>
  );
};

export default PlayerProgressChart;
