import React, { useState } from "react";
import { useTeamTrainingAnalytics } from "@/hooks/useTrainings";
import { useTeams } from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const TeamMetricsPage = () => {
  const [filters, setFilters] = useState({
    team: "",
    dateRange: "90days" // Options: 30days, 90days, all
  });

  const { data: teams, isLoading: teamsLoading } = useTeams();

  const dateRangeFilter = React.useMemo(() => {
    if (filters.dateRange === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return { start_date: format(date, "yyyy-MM-dd") };
    } else if (filters.dateRange === "90days") {
      const date = new Date();
      date.setDate(date.getDate() - 90);
      return { start_date: format(date, "yyyy-MM-dd") };
    }
    return {};
  }, [filters.dateRange]);

  const analyticsFilters = React.useMemo(() => {
    const appliedFilters = { ...dateRangeFilter };
    if (filters.team) appliedFilters.team = filters.team;
    return appliedFilters;
  }, [filters, dateRangeFilter]);
  const {
    data: teamAnalytics,
    isLoading: analyticsLoading
  } = useTeamTrainingAnalytics(analyticsFilters);

  const isLoading = teamsLoading || analyticsLoading;
  const handleFilterChange = (key, value) => {
    if (value === 'all_teams') {
      setFilters(prev => ({ ...prev, [key]: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const dateRangeOptions = [
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "all", label: "All Time" }
  ];

  // Prepare attendance data for chart
  const attendanceData = React.useMemo(() => {
    if (!teamAnalytics?.attendance) return [];
    return [
      { name: "Present", value: teamAnalytics.attendance.present, fill: "#22c55e" },
      { name: "Late", value: teamAnalytics.attendance.late, fill: "#eab308" },
      { name: "Absent", value: teamAnalytics.attendance.absent, fill: "#ef4444" },
      { name: "Excused", value: teamAnalytics.attendance.excused, fill: "#6b7280" },
    ];
  }, [teamAnalytics]);

  // Prepare improvement data for chart
  const improvementData = React.useMemo(() => {
    if (!teamAnalytics?.metrics) return [];
    return teamAnalytics.metrics.map(metric => ({
      name: metric.name,
      improvement: metric.avg_improvement,
      fill: metric.improvement > 0 ? "#22c55e" : "#ef4444",
    }));
  }, [teamAnalytics]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Select
            value={filters.team}
            onValueChange={(value) => handleFilterChange("team", value)}
          >            <SelectTrigger>
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_teams">All Teams</SelectItem>
              {teams?.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleFilterChange("dateRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !teamAnalytics ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No team metrics data found with the current filters.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try selecting a different team or date range.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Overview */}          <Card>
            <CardHeader>
              <CardTitle>Training Attendance</CardTitle>
              <CardDescription>
                Overall attendance statistics for {filters.team ? 'selected team' : 'all teams'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar 
                  data={{
                    labels: attendanceData.map(item => item.name),
                    datasets: [
                      {
                        label: 'Attendance',
                        data: attendanceData.map(item => item.value),
                        backgroundColor: attendanceData.map(item => item.fill),
                        borderColor: attendanceData.map(item => item.fill),
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Count: ${context.parsed.y}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Training Sessions Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Training Overview</CardTitle>
              <CardDescription>
                Key statistics for training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Sessions:</span>
                  <span className="font-bold">{teamAnalytics.total_sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Session Duration:</span>
                  <span className="font-bold">{teamAnalytics.avg_duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Sessions This Month:</span>
                  <span className="font-bold">{teamAnalytics.sessions_this_month}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance Rate:</span>
                  <span className={`font-bold ${
                    teamAnalytics.attendance_rate >= 80 ? 'text-green-500' :
                    teamAnalytics.attendance_rate >= 60 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {teamAnalytics.attendance_rate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Average Improvement */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Average Metric Improvements</CardTitle>
              <CardDescription>
                Average improvement across different training metrics
              </CardDescription>
            </CardHeader>            <CardContent>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: improvementData.map(item => item.name),
                    datasets: [
                      {
                        label: 'Improvement %',
                        data: improvementData.map(item => item.improvement),
                        backgroundColor: improvementData.map(item => item.fill || '#4f46e5'),
                        borderColor: improvementData.map(item => item.fill || '#4f46e5'),
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Improvement: ${context.parsed.y}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Most Improved Players */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Most Improved Players</CardTitle>
              <CardDescription>
                Players showing greatest overall improvement in training metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamAnalytics.top_players?.map((player, index) => (
                  <div key={player.player_id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="text-green-500 font-semibold">
                      +{player.improvement}%
                    </div>
                  </div>
                ))}
                
                {(!teamAnalytics.top_players || teamAnalytics.top_players.length === 0) && (
                  <div className="text-center text-muted-foreground py-4">
                    No player improvement data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TeamMetricsPage;
