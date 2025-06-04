import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { format, parseISO, subDays } from "date-fns";
import { useTeams } from "@/hooks/useTeams";
import {
  useAttendanceOverview,
  useAttendanceTrends,
  useAttendanceHeatmap,
  usePlayerAttendanceAnalytics,
} from "@/hooks/useAttendanceAnalytics";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const AttendanceAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  // Filter states
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [trendPeriod, setTrendPeriod] = useState("daily");

  // Create filter object for queries
  const filters = {
    team_id: selectedTeam === "all" ? undefined : selectedTeam,
    start_date: startDate,
    end_date: endDate,
  };

  const trendsFilters = {
    ...filters,
    period: trendPeriod,
  };

  // Tanstack Query hooks
  const { data: teamsResponse = {}, isLoading: teamsLoading } = useTeams();
  const teams = teamsResponse.results || [];
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAttendanceOverview(filters);
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useAttendanceTrends(trendsFilters);
  const {
    data: heatmapData,
    isLoading: heatmapLoading,
    error: heatmapError,
  } = useAttendanceHeatmap(filters);
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayerAttendanceAnalytics(filters);

  // Combined loading and error states
  const isLoading =
    teamsLoading ||
    overviewLoading ||
    trendsLoading ||
    heatmapLoading ||
    playersLoading;
  const error = overviewError || trendsError || heatmapError || playersError;
  const getStatusColor = (status) => {
    const colors = {
      present: "#8B0000", // Dark maroon
      absent: "#DC143C", // Crimson
      late: "#DAA520", // Goldenrod
      excused: "#B8860B", // Dark goldenrod
      pending: "#CD853F", // Peru/brownish gold
    };
    return colors[status] || "#CD853F";
  };
  const StatCard = ({ title, value, subtitle, icon, trend, className }) => (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-900" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs ml-1",
                trend > 0 ? "text-red-900" : "text-red-600"
              )}
            >
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
  const OverviewTab = () => {
    if (!overviewData || !overviewData.attendance_distribution) return null;

    const attendanceDistribution = {
      labels: Object.keys(overviewData.attendance_distribution || {}),
      datasets: [
        {
          data: Object.values(overviewData.attendance_distribution || {}),
          backgroundColor: Object.keys(
            overviewData.attendance_distribution || {}
          ).map(getStatusColor),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };

    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall Attendance Rate"
            value={`${(overviewData.overall_attendance_rate || 0).toFixed(1)}%`}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Total Sessions"
            value={overviewData.total_sessions || 0}
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <StatCard
            title="Total Players"
            value={overviewData.total_players || 0}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Average per Session"
            value={(overviewData.average_attendance_per_session || 0).toFixed(
              1
            )}
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Attendance Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut
                  data={attendanceDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Teams/Players */}
          <Card>
            <CardHeader>
              <CardTitle>Top Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(overviewData.top_attendance || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant="secondary">
                      {(item.attendance_rate || 0).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
                {(!overviewData.top_attendance ||
                  overviewData.top_attendance.length === 0) && (
                  <div className="text-center text-muted-foreground py-4">
                    No attendance data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  const TrendsTab = () => {
    if (!trendsData) return null;

    const trendChart = {
      labels: trendsData.map((item) =>
        trendPeriod === "daily"
          ? format(parseISO(item.date), "MMM dd")
          : format(parseISO(item.date), "MMM yyyy")
      ),
      datasets: [
        {
          label: "Attendance Rate (%)",
          data: trendsData.map((item) => item.attendance_rate),
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsla(var(--primary), 0.1)",
          tension: 0.1,
          fill: true,
        },
        {
          label: "Total Records",
          data: trendsData.map((item) => item.total_records),
          borderColor: "hsl(var(--chart-2))",
          backgroundColor: "hsla(var(--chart-2), 0.1)",
          tension: 0.1,
          yAxisID: "y1",
        },
      ],
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attendance Trends</CardTitle>
            <Select value={trendPeriod} onValueChange={setTrendPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Line
                data={trendChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      title: {
                        display: true,
                        text: "Attendance Rate (%)",
                      },
                    },
                    y1: {
                      type: "linear",
                      display: true,
                      position: "right",
                      title: {
                        display: true,
                        text: "Total Attendees",
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  const PlayersTab = () => {
    if (!playersData) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Individual Player Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Player</th>
                      <th className="text-center p-2">Sessions</th>
                      <th className="text-center p-2">Present</th>
                      <th className="text-center p-2">Rate</th>
                      <th className="text-center p-2">Current Streak</th>
                      <th className="text-center p-2">Best Streak</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playersData.map((player, index) => (
                      <tr
                        key={player.player_id}
                        className={cn(
                          "border-b",
                          index % 2 === 0 ? "bg-muted/50" : ""
                        )}
                      >
                        <td className="p-2 font-medium">
                          {player.player_name}
                        </td>
                        <td className="p-2 text-center">
                          {player.total_sessions}
                        </td>
                        <td className="p-2 text-center">
                          {player.present_count}
                        </td>
                        <td className="p-2 text-center">
                          <Badge
                            variant={
                              player.attendance_rate >= 80
                                ? "default"
                                : player.attendance_rate >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {player.attendance_rate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          {player.current_streak} sessions
                        </td>
                        <td className="p-2 text-center">
                          {player.best_streak} sessions
                        </td>
                        <td className="p-2 text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              player.attendance_rate >= 80
                                ? "border-red-900 text-red-900"
                                : player.attendance_rate >= 60
                                ? "border-yellow-600 text-yellow-700"
                                : "border-red-600 text-red-700"
                            )}
                          >
                            {player.attendance_rate >= 80
                              ? "Excellent"
                              : player.attendance_rate >= 60
                              ? "Good"
                              : "Needs Improvement"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };
  const HeatmapTab = () => {
    if (!heatmapData) return null;

    // Create a simple heatmap representation using bars
    const heatmapChart = {
      labels: heatmapData.map((item) => format(parseISO(item.date), "MMM dd")),
      datasets: [
        {
          label: "Attendance Rate",
          data: heatmapData.map((item) => item.attendance_rate),
          backgroundColor: heatmapData.map((item) => {
            const rate = item.attendance_rate;
            if (rate >= 80) return "#8B0000"; // Dark maroon for excellent
            if (rate >= 60) return "#DAA520"; // Goldenrod for good
            if (rate >= 40) return "#DC143C"; // Crimson for poor
            return "#CD853F"; // Peru/brownish gold for very poor
          }),
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Bar
                data={heatmapChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Attendance: ${context.parsed.y.toFixed(1)}%`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Attendance Rate (%)",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-900 rounded" />
                <span className="text-sm">Excellent (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-600 rounded" />
                <span className="text-sm">Good (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-600 rounded" />
                <span className="text-sm">Poor (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-700 rounded" />
                <span className="text-sm">Very Poor (&lt;40%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">
        Attendance Analytics Dashboard
      </h1>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team-select">Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger id="team-select">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load attendance analytics data"}
          </AlertDescription>
        </Alert>
      )}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="trends">
            <TrendsTab />
          </TabsContent>
          <TabsContent value="players">
            <PlayersTab />
          </TabsContent>
          <TabsContent value="heatmap">
            <HeatmapTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AttendanceAnalyticsDashboard;
