// Fixed PlayerProgressMultiView component with proper hook call
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
} from "chart.js";
import { Line } from "react-chartjs-2";
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
import { useTrainingMetrics } from "@/hooks/useTrainings";
import { useMultiPlayerProgress } from "@/hooks/useMultiPlayerProgress";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

const PlayerProgressMultiView = ({
  players = [],
  teamSlug = null,
  dateRange = null,
}) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [localDateRange, setLocalDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  // Get all available metrics
  const { data: metrics, isLoading: metricsLoading } = useTrainingMetrics();

  // Filter params for player progress - use passed dateRange if available
  const filters = useMemo(() => {
    const baseFilters = {
      metric: selectedMetric,
    };

    if (dateRange) {
      return {
        ...baseFilters,
        ...dateRange,
      };
    }

    return {
      ...baseFilters,
      date_from: localDateRange.from
        ? localDateRange.from.toISOString().split("T")[0]
        : null,
      date_to: localDateRange.to
        ? localDateRange.to.toISOString().split("T")[0]
        : null,
    };
  }, [localDateRange, dateRange, selectedMetric]);

  // Selected metric details
  const selectedMetricDetails = useMemo(() => {
    if (!selectedMetric || !metrics) return null;
    return metrics.find((m) => m.id === parseInt(selectedMetric));
  }, [selectedMetric, metrics]);
  // Use player IDs
  const playerIds = useMemo(() => {
    return players.map((player) => player.user_id || player.id).filter(Boolean);
  }, [players]);
  // Use our custom hook for a single API call to fetch data for all players
  const {
    data: multiPlayerData,
    isLoading: dataLoading,
    error,
  } = useMultiPlayerProgress({
    // Only pass playerIds if players are provided and teamSlug isn't
    ...(players.length > 0 && !teamSlug ? { players } : {}),
    teamSlug,
    filters,
    enabled: !!selectedMetric && (playerIds.length > 0 || !!teamSlug),
  });
  // Transform query results for chart display
  const chartData = useMemo(() => {
    if (!selectedMetric || !multiPlayerData) return [];

    // Get all unique dates across all players
    const allDates = new Set();
    Object.values(multiPlayerData).forEach((player) => {
      if (player.metrics_data && player.metrics_data.length > 0) {
        const metricData = player.metrics_data.find(
          (m) => m.metric_id === parseInt(selectedMetric)
        );
        metricData?.data_points?.forEach((dataPoint) => {
          allDates.add(dataPoint.date);
        });
      }
    });

    // Create empty data structure with all dates
    const dateArray = [...allDates].sort((a, b) => new Date(a) - new Date(b));
    const formattedData = dateArray.map((date) => {
      const dataPoint = { date: new Date(date).toLocaleDateString() };

      // For each player, find data for this date
      Object.entries(multiPlayerData).forEach(([playerId, player]) => {
        if (player.metrics_data && player.metrics_data.length > 0) {
          const metricData = player.metrics_data.find(
            (m) => m.metric_id === parseInt(selectedMetric)
          );
          const record = metricData?.data_points?.find((r) => r.date === date);
          dataPoint[playerId] = record ? record.value : null;
        } else {
          dataPoint[playerId] = null;
        }
      });

      return dataPoint;
    });

    return formattedData;
  }, [multiPlayerData, selectedMetric]);  // Generate unique colors for each player
  const playerColors = useMemo(() => {
    const colors = {};
    const baseColors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#0088fe",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#a4de6c",
      "#d0ed57",
    ];

    // If we have multiPlayerData, use it for player IDs, otherwise use the provided players prop
    if (multiPlayerData) {
      Object.keys(multiPlayerData).forEach((playerId, index) => {
        colors[playerId] = baseColors[index % baseColors.length];
      });
    } else {
      players.forEach((player, index) => {
        const playerId = player.user_id || player.id;
        colors[playerId] = baseColors[index % baseColors.length];
      });
    }

    return colors;
  }, [multiPlayerData, players]);

  // Loading state
  const isLoading = metricsLoading || dataLoading;

  // No data message
  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <Card className="w-full border-0">
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>No metrics have been defined yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  // No players selected message
  if (!isLoading && multiPlayerData && Object.keys(multiPlayerData).length === 0 && !teamSlug) {
    return (
      <Card className="w-full border-0">
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>
            Select players to compare their progress
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0">
      <CardHeader>
        <CardTitle>Player Comparison</CardTitle>
        <CardDescription>Compare progress between players</CardDescription>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics &&
                metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id.toString()}>
                    {metric.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {!dateRange && (
            <DateRangePicker
              date={localDateRange}
              onDateChange={setLocalDateRange}
              className="w-full md:w-auto"
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading player data...
          </div>
        ) : !selectedMetric ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Select a metric to compare players
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No data available for the selected metric and date range
          </div>
        ) : (
          <div>
            <div className="h-[400px] mt-4">              <Line
                data={{
                  labels: chartData.map((point) => point.date),
                  datasets: Object.entries(multiPlayerData || {}).map(([playerId, playerData]) => {
                    return {
                      label: playerData.player_name,
                      data: chartData.map((point) => point[playerId]),
                      borderColor: playerColors[playerId],
                      backgroundColor: `${playerColors[playerId]}20`,
                      borderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 8,
                      tension: 0.3,
                      spanGaps: true,
                    };
                  }),
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: selectedMetricDetails?.is_lower_better
                        ? false
                        : true,
                      title: {
                        display: true,
                        text: selectedMetricDetails?.unit || "Value",
                      },
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: ${
                            context.parsed.y
                          } ${selectedMetricDetails?.unit || ""}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-4">Player Improvements</h3>              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {multiPlayerData && Object.entries(multiPlayerData).map(([playerId, playerData]) => {
                  const playerMetric = playerData?.metrics_data?.find(
                    (m) => m.metric_id === parseInt(selectedMetric)
                  );
                  const playerRecords = playerMetric?.data_points || [];

                  // Check if this player's data is still loading
                  if (isLoading) {
                    return (
                      <Card key={playerId}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium text-center mb-2">
                            {playerData.player_name}
                          </h4>
                          <p className="text-sm text-center text-muted-foreground">
                            Loading data...
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }

                  if (playerRecords.length < 2) {
                    return (
                      <Card key={playerId}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium text-center mb-2">
                            {playerData.player_name}
                          </h4>
                          <p className="text-sm text-center text-muted-foreground">
                            Not enough data
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }                  const sortedRecords = [...playerRecords].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                  );

                  const firstPoint = sortedRecords[0];
                  const lastPoint = sortedRecords[sortedRecords.length - 1];

                  // For metrics where lower is better (like sprint time), invert the calculation
                  const isLowerBetter = selectedMetricDetails?.is_lower_better;

                  let improvement;
                  if (isLowerBetter) {
                    improvement = firstPoint.value - lastPoint.value;
                  } else {
                    improvement = lastPoint.value - firstPoint.value;
                  }

                  const improvementPercentage =
                    firstPoint.value !== 0
                      ? (improvement / firstPoint.value) * 100
                      : 0;

                  const isImproved = improvement > 0;

                  return (
                    <Card key={playerId}>
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-center mb-2">
                          {playerData.player_name}
                        </h4>
                        <div className="flex justify-center items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: playerColors[playerId] || "#8884d8",
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressMultiView;