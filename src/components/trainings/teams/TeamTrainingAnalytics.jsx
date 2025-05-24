import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  useTeamTrainingAnalytics,
  useTrainingMetrics
} from "@/hooks/useTrainings";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const TeamTrainingAnalytics = ({ teamSlug }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [activeTab, setActiveTab] = useState("attendance");
  // Format date strings for API only if dates are selected
  const formattedDateRange = useMemo(
    () => {
      if (!dateRange.from || !dateRange.to) return {};
      
      return {
        date_from: dateRange.from.toISOString().split("T")[0],
        date_to: dateRange.to.toISOString().split("T")[0],
      };
    },
    [dateRange]
  );
  // Get available metrics
  const { data: metrics = [] } = useTrainingMetrics();
  // No automatic selection of the first metric
  // User must explicitly select a metric to view data  // Build query params for analytics API
  const queryParams = useMemo(
    () => ({
      team: teamSlug,
      metric_id: selectedMetric,
      ...(dateRange.from && dateRange.to ? formattedDateRange : {})
    }),
    [teamSlug, selectedMetric, dateRange, formattedDateRange]
  );// Get team analytics data - only call API when a metric is selected
  const {
    data: analytics,
    isLoading,
    error,  } = useTeamTrainingAnalytics(
    teamSlug ? queryParams : null, 
    !!teamSlug && !!selectedMetric
  );

  // Prepare attendance data for pie chart
  const attendanceData = useMemo(() => {
    if (!analytics || !analytics.attendance_rate) return [];

    const { present_rate, absent_rate, late_rate, excused_rate } =
      analytics.attendance_rate;

    return [
      { name: "Present", value: present_rate, color: "#4CAF50" },
      { name: "Absent", value: absent_rate, color: "#F44336" },
      { name: "Late", value: late_rate, color: "#FF9800" },
      { name: "Excused", value: excused_rate, color: "#2196F3" },
    ];
  }, [analytics]);

  // Sort and format player improvement data
  const playerImprovementData = useMemo(() => {
    if (!analytics || !analytics.player_metrics_summary) return [];

    // Get selected metric details
    const metricDetails = metrics.find(
      (m) => m.id === parseInt(selectedMetric)
    );

    return analytics.player_metrics_summary
      .filter((player) => player.improvement_percentage !== null)
      .sort((a, b) => b.improvement_percentage - a.improvement_percentage);
  }, [analytics, selectedMetric, metrics]);

  if (isLoading)
    return (
      <div className="flex justify-center p-4">Loading team analytics...</div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading team analytics: {error.message}
      </div>
    );
  if (!analytics)
    return <div className="text-center p-4">No analytics data available</div>;

  // Find the metric object for the selected metric
  const selectedMetricDetails = metrics.find(
    (m) => m.id === parseInt(selectedMetric)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Training Analytics</CardTitle>
            <CardDescription>
              Performance metrics and training attendance
            </CardDescription>
          </div>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mt-4">
          <div className="w-full sm:w-64">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name} ({metric.metric_unit?.code || '-'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="improvement">Improvement</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <TabsContent value="attendance" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Training Sessions</CardTitle>
                <CardDescription>
                  Session count for selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {analytics.training_sessions_count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dateRange.from && dateRange.to ? (
                      <>
                        {new Date(dateRange.from).toLocaleDateString()} -{" "}
                        {new Date(dateRange.to).toLocaleDateString()}
                      </>
                    ) : (
                      "All time"
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
                <CardDescription>
                  Training attendance statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {" "}
                    <div className="sm:col-span-1">
                      <div style={{ height: "200px", width: "100%" }}>
                        <Pie
                          data={{
                            labels: attendanceData.map((item) => item.name),
                            datasets: [
                              {
                                data: attendanceData.map((item) => item.value),
                                backgroundColor: attendanceData.map(
                                  (item) => item.color
                                ),
                                borderColor: attendanceData.map(
                                  (item) => item.color
                                ),
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              tooltip: {
                                callbacks: {                                  label: function (context) {
                                    return `${
                                      context.label
                                    }: ${context.raw.toFixed(2)}%`;
                                  },
                                },
                              },
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="space-y-4">
                        {attendanceData.map((item) => (
                          <div key={item.name} className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: item.color }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {item.name}
                              </div>
                            </div>                            <div className="font-medium">
                              {item.value.toFixed(2)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No attendance data available for the selected period.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="improvement" className="mt-0">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Player Improvement</CardTitle>
              <CardDescription>
                {selectedMetricDetails ? (
                  <>
                    {selectedMetricDetails.name} ({selectedMetricDetails.metric_unit?.code || '-'})
                    -
                    {selectedMetricDetails.is_lower_better
                      ? " Lower values are better"
                      : " Higher values are better"}
                  </>
                ) : (
                  "Select a metric to view improvement data"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {" "}
              {playerImprovementData.length > 0 ? (
                <div style={{ height: "400px", width: "100%" }}>
                  <Bar
                    data={{
                      labels: playerImprovementData.map(
                        (item) => item.player_name
                      ),
                      datasets: [
                        {
                          label: "Improvement %",
                          data: playerImprovementData.map(
                            (item) => item.improvement_percentage
                          ),
                          backgroundColor: playerImprovementData.map((item) =>
                            item.improvement_percentage >= 0
                              ? "#4CAF50"
                              : "#F44336"
                          ),
                          borderColor: playerImprovementData.map((item) =>
                            item.improvement_percentage >= 0
                              ? "#4CAF50"
                              : "#F44336"
                          ),
                          borderWidth: 1,
                          borderRadius: 4,
                          barThickness: 20,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: "y",
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `Improvement: ${context.raw.toFixed(2)}%`;
                            },
                            title: function (tooltipItems) {
                              return `Player: ${tooltipItems[0].label}`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Percentage Improvement (%)",
                          },
                          grid: {
                            color: "rgba(0, 0, 0, 0.1)",
                          },
                        },
                        y: {
                          ticks: {
                            autoSkip: false,
                            font: {
                              size: 11,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No improvement data available for the selected metric and time
                  period.
                </div>
              )}
              {playerImprovementData.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border py-2 px-3 text-left">Player</th>
                        <th className="border py-2 px-3 text-right">
                          First Value
                        </th>
                        <th className="border py-2 px-3 text-right">
                          Last Value
                        </th>
                        <th className="border py-2 px-3 text-right">
                          Raw Improvement
                        </th>
                        <th className="border py-2 px-3 text-right">
                          Improvement %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerImprovementData.map((player, index) => (
                        <tr
                          key={player.player_id}
                          className={
                            index % 2 === 0 ? "bg-background" : "bg-muted/30"
                          }
                        >
                          <td className="border py-2 px-3">
                            {player.player_name}
                          </td>
                          <td className="border py-2 px-3 text-right">
                            {player.first_value} {selectedMetricDetails?.metric_unit?.code || '-'}
                          </td>
                          <td className="border py-2 px-3 text-right">
                            {player.last_value} {selectedMetricDetails?.metric_unit?.code || '-'}
                          </td>
                          <td className="border py-2 px-3 text-right">
                            <span
                              className={
                                player.improvement >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {player.improvement >= 0 ? "+" : ""}
                              {player.improvement.toFixed(2)}{" "}
                              {selectedMetricDetails?.metric_unit?.code || ''}
                            </span>
                          </td>
                          <td className="border py-2 px-3 text-right">
                            <span
                              className={
                                player.improvement_percentage >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {player.improvement_percentage >= 0 ? "+" : ""}
                              {player.improvement_percentage.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>{" "}
      </CardContent>
    </Card>
  );
};

export default TeamTrainingAnalytics;
