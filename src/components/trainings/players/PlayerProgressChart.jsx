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

/** * Component for displaying a player's progress on metrics over time
 * @param {Object} props
 * @param {string} props.playerId - The ID of the player to show progress for
 * @param {string} props.teamSlug - Optional team slug to filter by team
 * @param {Object} props.dateRange - Optional date range to filter data
 * @param {Function} props.onDateChange - Callback for date range change
 */
const PlayerProgressChart = ({ playerId, teamSlug = null, dateRange = null, onDateChange }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [localDateRange, setLocalDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  // Keep localDateRange in sync with dateRange prop
  useEffect(() => {
    if (dateRange && (dateRange.from !== localDateRange.from || dateRange.to !== localDateRange.to)) {
      setLocalDateRange(dateRange);
    }
  }, [dateRange]);

  // Always use the effective date range for API
  const effectiveDateRange = dateRange || localDateRange;
  const formattedDateRange = useMemo(() => ({
    date_from: effectiveDateRange.from ? new Date(effectiveDateRange.from).toISOString().split("T")[0] : undefined,
    date_to: effectiveDateRange.to ? new Date(effectiveDateRange.to).toISOString().split("T")[0] : undefined,
  }), [effectiveDateRange]);

  // Get available metrics
  const { data: metrics = [], isLoading: metricsLoading } = useTrainingMetrics();

  // Get player progress data
  const { data: playerData, isLoading, error } = usePlayerProgressById(
    playerId,
    {
      ...formattedDateRange,
      metric: selectedMetric,
    },
    !!playerId
  );

  // Ensure selectedMetric is always set and valid
  useEffect(() => {
    if (
      playerData?.metrics_data &&
      (
        (!selectedMetric && playerData.metrics_data.length > 0) ||
        (selectedMetric && !playerData.metrics_data.some(m => String(m.metric_id) === String(selectedMetric)))
      )
    ) {
      setSelectedMetric(String(playerData.metrics_data[0].metric_id));
    }
  }, [selectedMetric, playerData]);

  if (isLoading || metricsLoading) return <div className="flex justify-center p-4">Loading player progress...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading player progress: {error.message}</div>;
  if (!playerData) return <div className="text-center p-4">No player data available</div>;

  // Find the selected metric's data
  const selectedMetricData = playerData.metrics_data?.find(m => String(m.metric_id) === String(selectedMetric));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div>
            <CardTitle>{playerData.player_name || "Player"} Progress</CardTitle>
            <CardDescription>Track improvements over time</CardDescription>
          </div>
          <DateRangePicker
            date={effectiveDateRange}
            onDateChange={onDateChange ? onDateChange : setLocalDateRange}
          />
        </div>
        <div className="flex gap-4 items-center mt-4">
          <div className="w-64">
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
      <CardContent>
        {selectedMetricData && selectedMetricData.data_points?.length > 0 ? (
          <div style={{ height: '350px' }}>
            <Line
              data={{
                labels: selectedMetricData.data_points.map(point => point.date),
                datasets: [
                  {
                    label: selectedMetricData.metric_name,
                    data: selectedMetricData.data_points.map(point => point.value),
                    borderColor: '#8884d8',
                    backgroundColor: 'rgba(136, 132, 216, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    tension: 0.3,
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
                  annotation: selectedMetricData.data_points.length > 1 ? {
                    annotations: {
                      startingLine: {
                        type: 'line',
                        yMin: selectedMetricData.data_points[0].value,
                        yMax: selectedMetricData.data_points[0].value,
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
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No data available for the selected metric and time period.
          </div>
        )}
        {selectedMetricData && selectedMetricData.data_points?.length > 1 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Performance Analysis</h3>
            <PerformanceAnalysis metricData={selectedMetricData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceAnalysis = ({ metricData }) => {
  if (!metricData || metricData.data_points.length < 2) {
    return <p>Not enough data points for analysis.</p>;
  }
  const firstPoint = metricData.data_points[0];
  const lastPoint = metricData.data_points[metricData.data_points.length - 1];
  const rawDiff = lastPoint.value - firstPoint.value;
  let improvement = metricData.is_lower_better ? -rawDiff : rawDiff;
  const percentage = firstPoint.value !== 0 ? (rawDiff / firstPoint.value) * 100 : 0;
  const improvementPercentage = metricData.is_lower_better ? -percentage : percentage;
  const isImproved = improvement > 0;

  console.log(metricData)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Training Period Summary</h4>
          <ul className="space-y-1 text-sm">
            <li><span className="font-medium">Start Date:</span> {firstPoint.date}</li>
            <li><span className="font-medium">End Date:</span> {lastPoint.date}</li>
            <li><span className="font-medium">Starting Value:</span> {firstPoint.value} {metricData.unit}</li>
            <li><span className="font-medium">Latest Value:</span> {lastPoint.value} {metricData.unit}</li>
            <li><span className="font-medium">Overall Trend:</span> <span className={isImproved ? "text-green-600" : "text-red-600"}>{isImproved ? "Positive Improvement" : "Needs Attention"}</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProgressChart;
