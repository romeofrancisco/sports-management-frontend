import React, { useState, useMemo } from "react";
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
  usePlayerProgress
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
 * Component for displaying a player's progress on metrics over time
 *
 * @param {Object} props
 * @param {string} props.playerId - The ID of the player to show progress for
 * @param {string} props.teamId - Optional team ID to filter by team
 */
const PlayerProgressChart = ({ playerId, teamId = null }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });
  // Format date strings for API
  const formattedDateRange = useMemo(
    () => ({
      date_from: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: dateRange.to
        ? dateRange.to.toISOString().split("T")[0]
        : undefined,
    }),
    [dateRange]
  );

  // Get available metrics
  const { metrics = [] } = useTrainingMetrics();

  // Get player progress data
  const {
    data: playerData,
    isLoading,
    error,
  } = usePlayerProgress(
    playerId, 
    {
      ...formattedDateRange,
      metric_id: selectedMetric,
    }, 
    !!playerId
  );

  // If no selected metric and metrics are available, select the first one
  React.useEffect(() => {
    if (!selectedMetric && metrics.length > 0) {
      setSelectedMetric(metrics[0].id);
    }
  }, [selectedMetric, metrics]);

  if (isLoading)
    return (
      <div className="flex justify-center p-4">Loading player progress...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading player progress: {error.message}
      </div>
    );
  if (!playerData)
    return <div className="text-center p-4">No player data available</div>;

  // Find the metrics data for the selected metric
  const selectedMetricData = playerData?.metrics_data?.find(
    (m) => m.metric_id === parseInt(selectedMetric)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {playerData?.player_name || "Player"} Progress
            </CardTitle>
            <CardDescription>Track improvements over time</CardDescription>
          </div>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="flex gap-4 items-center mt-2">
          <div className="w-64">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name} ({metric.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMetricData && (
            <Badge variant="outline">
              {selectedMetricData.is_lower_better
                ? "Lower is better"
                : "Higher is better"}
            </Badge>
          )}
        </div>
      </CardHeader>      <CardContent>
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
                  legend: {
                    position: 'top',
                  },
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

        {selectedMetricData && selectedMetricData.data_points?.length > 0 && (
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

  // Calculate improvement
  const rawDiff = lastPoint.value - firstPoint.value;
  let improvement = metricData.is_lower_better ? -rawDiff : rawDiff;

  // Calculate percentage
  const percentage =
    firstPoint.value !== 0 ? (rawDiff / firstPoint.value) * 100 : 0;

  const improvementPercentage = metricData.is_lower_better
    ? -percentage
    : percentage;

  // Determine if improved
  const isImproved = improvement > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {improvement.toFixed(2)} {metricData.unit}
            </div>
            <p
              className={`text-sm ${
                isImproved ? "text-green-600" : "text-red-600"
              }`}
            >
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
            <p
              className={`text-sm ${
                isImproved ? "text-green-600" : "text-red-600"
              }`}
            >
              Percentage {isImproved ? "Improvement" : "Decline"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Training Period Summary</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-medium">Start Date:</span> {firstPoint.date}
            </li>
            <li>
              <span className="font-medium">End Date:</span> {lastPoint.date}
            </li>
            <li>
              <span className="font-medium">Starting Value:</span>{" "}
              {firstPoint.value} {metricData.unit}
            </li>
            <li>
              <span className="font-medium">Latest Value:</span>{" "}
              {lastPoint.value} {metricData.unit}
            </li>
            <li>
              <span className="font-medium">Overall Trend:</span>{" "}
              <span className={isImproved ? "text-green-600" : "text-red-600"}>
                {isImproved ? "Positive Improvement" : "Needs Attention"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Component for displaying multiple players' progress on a selected metric
 *
 * @param {Object} props
 * @param {Array} props.players - List of players to show progress for
 * @param {string} props.teamId - Optional team ID to filter by team
 */
const PlayerProgressMultiView = ({ players = [], teamId = null }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("chart");
  // Format date strings for API
  const formattedDateRange = useMemo(
    () => ({
      date_from: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : undefined,
      date_to: dateRange.to
        ? dateRange.to.toISOString().split("T")[0]
        : undefined,
    }),
    [dateRange]
  );

  // Get available metrics
  const { metrics = [] } = useTrainingMetrics();

  // If no selected metric and metrics are available, select the first one
  React.useEffect(() => {
    if (!selectedMetric && metrics.length > 0) {
      setSelectedMetric(metrics[0].id);
    }
  }, [selectedMetric, metrics]);

  // Create colors for each player
  const playerColors = useMemo(() => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#0088fe",
      "#00C49F",
    ];
    return players.reduce((acc, player, index) => {
      acc[player.id] = colors[index % colors.length];
      return acc;
    }, {});
  }, [players]);

  // Filter params for API
  const queryParams = useMemo(
    () => ({
      team: teamId,
      ...formattedDateRange,
      metric_id: selectedMetric,
    }),
    [teamId, formattedDateRange, selectedMetric]
  );
  // Get progress data for all players
  const {
    data: progressData = [],
    isLoading,
    error,
  } = usePlayerProgress(
    null, 
    queryParams, 
    selectedMetric && (players.length > 0 || teamId)
  );

  // Filter by selected players if players prop is provided
  const filteredData = useMemo(() => {
    if (players.length === 0) return progressData;
    return progressData.filter((player) =>
      players.some((p) => p.id === player.user_id)
    );
  }, [progressData, players]);

  // Get selected metric details
  const selectedMetricDetails = useMemo(
    () => metrics.find((m) => m.id === parseInt(selectedMetric)),
    [metrics, selectedMetric]
  );

  // Format data for comparison chart
  const combinedChartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    // Find all unique dates across all players
    const allDates = new Set();
    filteredData.forEach((player) => {
      const metricData = player.metrics_data?.find(
        (m) => m.metric_id === parseInt(selectedMetric)
      );

      if (metricData?.data_points) {
        metricData.data_points.forEach((point) => {
          allDates.add(point.date);
        });
      }
    });

    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date with values from each player
    return sortedDates.map((date) => {
      const dataPoint = { date };

      filteredData.forEach((player) => {
        const metricData = player.metrics_data?.find(
          (m) => m.metric_id === parseInt(selectedMetric)
        );

        if (metricData?.data_points) {
          const point = metricData.data_points.find((p) => p.date === date);
          if (point) {
            dataPoint[player.player_name] = point.value;
          }
        }
      });

      return dataPoint;
    });
  }, [filteredData, selectedMetric]);

  if (isLoading)
    return (
      <div className="flex justify-center p-4">Loading player progress...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading player progress: {error.message}
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Player Comparison</CardTitle>
            <CardDescription>
              Compare performance across players
            </CardDescription>
          </div>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="flex gap-4 items-center mt-2">
          <div className="w-64">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name} ({metric.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMetricDetails && (
            <Badge variant="outline">
              {selectedMetricDetails.is_lower_better
                ? "Lower is better"
                : "Higher is better"}
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="chart">Chart Comparison</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>        <TabsContent value="chart" className="mt-0">
          {combinedChartData.length > 0 ? (
            <div style={{ height: '400px' }}>
              <Line
                data={{
                  labels: combinedChartData.map(point => point.date),
                  datasets: filteredData.map(player => ({
                    label: player.player_name,
                    data: combinedChartData.map(point => point[player.player_name]),
                    borderColor: playerColors[player.user_id] || "#8884d8",
                    backgroundColor: `${playerColors[player.user_id]}33` || "#8884d833",
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    tension: 0.3,
                  }))
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: selectedMetricDetails?.is_lower_better ? false : true,
                      title: {
                        display: true,
                        text: selectedMetricDetails
                          ? `${selectedMetricDetails.name} (${selectedMetricDetails.unit})`
                          : "Value",
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
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y} ${selectedMetricDetails?.unit || ''}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No data available for the selected metric and time period.
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          {combinedChartData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border py-2 px-3 text-left">Date</th>
                    {filteredData.map((player) => (
                      <th
                        key={player.user_id}
                        className="border py-2 px-3 text-left"
                      >
                        {player.player_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {combinedChartData.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }
                    >
                      <td className="border py-2 px-3">{row.date}</td>
                      {filteredData.map((player) => (
                        <td key={player.user_id} className="border py-2 px-3">
                          {row[player.player_name] !== undefined
                            ? `${row[player.player_name]} ${
                                selectedMetricDetails?.unit
                              }`
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No data available for the selected metric and time period.
            </div>
          )}
        </TabsContent>

        {filteredData.length > 0 && combinedChartData.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Improvement Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((player) => {
                const metricData = player.metrics_data?.find(
                  (m) => m.metric_id === parseInt(selectedMetric)
                );

                if (!metricData || metricData.data_points?.length < 2)
                  return null;

                const firstPoint = metricData.data_points[0];
                const lastPoint =
                  metricData.data_points[metricData.data_points.length - 1];

                // Calculate improvement
                const rawDiff = lastPoint.value - firstPoint.value;
                const improvement = selectedMetricDetails?.is_lower_better
                  ? -rawDiff
                  : rawDiff;

                // Calculate percentage
                const percentage =
                  firstPoint.value !== 0
                    ? (rawDiff / firstPoint.value) * 100
                    : 0;

                const improvementPercentage =
                  selectedMetricDetails?.is_lower_better
                    ? -percentage
                    : percentage;

                // Determine if improved
                const isImproved = improvement > 0;

                return (
                  <Card key={player.user_id}>
                    <CardContent className="pt-4">
                      <h4 className="font-medium text-center mb-2">
                        {player.player_name}
                      </h4>
                      <div className="flex justify-center items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              playerColors[player.user_id] || "#8884d8",
                          }}
                        />
                        <span
                          className={
                            isImproved ? "text-green-600" : "text-red-600"
                          }
                        >
                          {improvementPercentage > 0 ? "+" : ""}
                          {improvementPercentage.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-sm text-center mt-2">
                        From {firstPoint.value} to {lastPoint.value}{" "}
                        {selectedMetricDetails?.unit}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressChart;
export { PlayerProgressMultiView };
