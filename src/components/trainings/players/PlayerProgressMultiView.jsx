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
import { usePlayerProgressById } from "@/hooks/useTrainings";
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

  // Get all available metrics
  const { metrics, isLoading: metricsLoading } = useTrainingMetrics();

  // Filter params for player progress
  const filters = useMemo(
    () => ({
      date_from: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : null,
      date_to: dateRange.to ? dateRange.to.toISOString().split("T")[0] : null,
      metric: selectedMetric,
      team: teamId,
    }),
    [dateRange, selectedMetric, teamId]
  );

  // Selected metric details
  const selectedMetricDetails = useMemo(() => {
    if (!selectedMetric || !metrics) return null;
    return metrics.find((m) => m.id === parseInt(selectedMetric));
  }, [selectedMetric, metrics]);

  // Player data collection and loading state tracking
  const [playerData, setPlayerData] = useState({});
  const [loadingPlayers, setLoadingPlayers] = useState({});

  // Generate unique colors for each player
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

    players.forEach((player, index) => {
      colors[player.user_id] = baseColors[index % baseColors.length];
    });

    return colors;
  }, [players]);

  // Format combined chart data
  const chartData = useMemo(() => {
    if (!selectedMetric || Object.keys(playerData).length === 0) return [];

    // Get all unique dates
    const allDates = new Set();
    Object.values(playerData).forEach((player) => {
      player.records?.forEach((record) => {
        allDates.add(record.date);
      });
    });

    // Create empty data structure with all dates
    const dateArray = [...allDates].sort((a, b) => new Date(a) - new Date(b));
    const formattedData = dateArray.map((date) => {
      const dataPoint = { date: new Date(date).toLocaleDateString() };

      // For each player, find data for this date
      Object.entries(playerData).forEach(([playerId, player]) => {
        const record = player.records?.find((r) => r.date === date);
        dataPoint[playerId] = record ? record.value : null;
      });

      return dataPoint;
    });

    return formattedData;
  }, [playerData, selectedMetric]);

  // When the selected metric or date range changes, fetch data for each player
  React.useEffect(() => {
    if (!selectedMetric || !players.length) return;

    // Reset data when metric changes
    setPlayerData({});

    // Track which players are being loaded
    const newLoadingState = {};

    players.forEach((player) => {
      newLoadingState[player.user_id] = true;

      // Fetch data for this player with current filters
      usePlayerProgressById(player.user_id, filters, true)
        .then(({ data: progress }) => {
          setPlayerData((prev) => ({
            ...prev,
            [player.user_id]: progress,
          }));

          setLoadingPlayers((prev) => ({
            ...prev,
            [player.user_id]: false,
          }));
        })
        .catch(() => {
          setLoadingPlayers((prev) => ({
            ...prev,
            [player.user_id]: false,
          }));
        });
    });

    setLoadingPlayers(newLoadingState);
  }, [selectedMetric, filters, players]);

  // Loading state
  const isLoading =
    metricsLoading || Object.values(loadingPlayers).some((status) => status);

  // No data message
  if (!isLoading && !metricsLoading && (!metrics || metrics.length === 0)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Player Comparison</CardTitle>
          <CardDescription>No metrics have been defined yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No players selected message
  if (!players || players.length === 0) {
    return (
      <Card className="w-full">
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
    <Card className="w-full">
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

          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full md:w-auto"
          />
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
            {" "}
            <div className="h-[400px] mt-4">
              <Line
                data={{
                  labels: chartData.map((point) => point.date),
                  datasets: players.map((player) => ({
                    label: player.name,
                    data: chartData.map((point) => point[player.user_id]),
                    borderColor: playerColors[player.user_id],
                    backgroundColor: `${playerColors[player.user_id]}20`,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    tension: 0.3,
                    spanGaps: true,
                  })),
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: selectedMetricDetails?.lower_is_better
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
              <h3 className="font-medium mb-4">Player Improvements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map((player) => {
                  const playerRecords =
                    playerData[player.user_id]?.records || [];

                  if (playerRecords.length < 2) {
                    return (
                      <Card key={player.user_id}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium text-center mb-2">
                            {player.name}
                          </h4>
                          <p className="text-sm text-center text-muted-foreground">
                            Not enough data
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }

                  // Sort by date
                  const sortedRecords = [...playerRecords].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                  );

                  const firstPoint = sortedRecords[0];
                  const lastPoint = sortedRecords[sortedRecords.length - 1];

                  // For metrics where lower is better (like sprint time), invert the calculation
                  const isLowerBetter = selectedMetricDetails?.lower_is_better;

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
                    <Card key={player.user_id}>
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-center mb-2">
                          {player.name}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerProgressMultiView;
