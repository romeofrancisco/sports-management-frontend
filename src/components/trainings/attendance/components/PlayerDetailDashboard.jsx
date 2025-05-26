import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Doughnut, Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { StatCard } from './StatCard';
import { 
  createAttendanceDistributionChart,
  distributionChartOptions,
  createPlayerTrendsChart,
  playerTrendsChartOptions,
  createPlayerTimelineChart,
  playerTimelineChartOptions
} from './chartConfigs';
import { cn } from '@/lib/utils';
import { CalendarDays, Users, BarChart3, AlertCircle, ArrowLeft, User, BarChart, Activity, Calendar } from 'lucide-react';

const PlayerDetailDashboard = ({ 
  player, 
  playerDetailData, 
  playerDetailLoading, 
  playerDetailError,
  onBack 
}) => {
  const [chartType, setChartType] = useState('summary'); // 'summary' or 'timeline'
  if (playerDetailLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading player details...</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">Analyzing attendance patterns</p>
        </div>
      </div>
    );
  }

  if (playerDetailError || !playerDetailData) {
    return (
      <Alert className="border-red-200 bg-red-50/80 dark:bg-red-950/50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          Failed to load player details. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const data = playerDetailData;

  // Player stats cards data
  const playerStats = [
    {
      title: "Total Sessions",
      value: data.total_sessions || 0,
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      title: "Attendance Rate",
      value: `${data.attendance_rate || 0}%`,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Present",
      value: data.present_count || 0,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Absent",
      value: data.absent_count || 0,
      icon: <AlertCircle className="h-4 w-4" />,
    },
  ];
  // Attendance distribution chart
  const attendanceDistribution = createAttendanceDistributionChart(data.attendance_distribution);

  // Chart data for both summary and timeline views
  const summaryChartData = createPlayerTrendsChart(data.trends);
  const timelineChartData = createPlayerTimelineChart(data.trends);

  const currentChartData = chartType === 'summary' ? summaryChartData : timelineChartData;
  const currentChartOptions = chartType === 'summary' ? playerTrendsChartOptions : playerTimelineChartOptions;  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with back button */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-md">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-medium">Back to Players</span>
          </button>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                {data.player_name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Individual Attendance Dashboard
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Updated {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {playerStats.map((stat, index) => (
          <div key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          </div>
        ))}
      </div>      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Attendance Distribution Chart */}
        <div>
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100/80 dark:border-slate-700/80">
              <CardTitle className="flex items-center gap-3 text-lg font-bold">
                <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                  📊
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">
                    Attendance Distribution
                  </span>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                    Personal attendance breakdown
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 sm:h-72 lg:h-80 flex items-center justify-center">
                <Doughnut data={attendanceDistribution} options={distributionChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart with dual view toggle */}
        <div>
          <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100/80 dark:border-slate-700/80 space-y-3 sm:space-y-0">
              <CardTitle className="flex items-center gap-3 text-lg font-bold">
                <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                  📈
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100">
                    Recent Sessions Analysis
                  </span>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                    Track attendance patterns
                  </p>
                </div>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={chartType === 'summary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('summary')}
                  className={cn(
                    "flex items-center gap-2",
                    chartType === 'summary' 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  )}
                >
                  <BarChart className="h-3 w-3" />
                  <span className="hidden sm:inline">Summary</span>
                </Button>
                <Button
                  variant={chartType === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('timeline')}
                  className={cn(
                    "flex items-center gap-2",
                    chartType === 'timeline' 
                      ? "bg-purple-500 hover:bg-purple-600 text-white" 
                      : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  )}
                >
                  <Activity className="h-3 w-3" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {currentChartData ? (
                <div className="h-64 sm:h-72 lg:h-80">
                  <Bar data={currentChartData} options={currentChartOptions} />
                </div>
              ) : (
                <div className="h-64 sm:h-72 lg:h-80 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No recent session data available</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Data will appear once sessions are recorded</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>      {/* Recent Sessions Table */}
      <div>
        <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800">
          <CardHeader className="border-b border-slate-100/80 dark:border-slate-700/80">
            <CardTitle className="flex items-center gap-3 text-lg font-bold">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                📋
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100">
                  Recent Sessions
                </span>
                <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                  Latest attendance records
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-64 sm:h-72 pr-4">
              <div className="space-y-3">
                {data.recent_sessions && data.recent_sessions.length > 0 ? (
                  data.recent_sessions.map((session, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-700/60 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {session.session_name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(session.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Badge 
                          variant={session.status === 'present' ? "default" : "secondary"}
                          className={cn(
                            "font-medium px-3 py-1.5",
                            session.status === 'present' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-700",
                            session.status === 'absent' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-700",
                            session.status === 'late' && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 border-orange-200 dark:border-orange-700",
                            session.status === 'excused' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-700"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              session.status === 'present' && "bg-green-500",
                              session.status === 'absent' && "bg-red-500",
                              session.status === 'late' && "bg-orange-500",
                              session.status === 'excused' && "bg-blue-500"
                            )}></div>
                            {session.status || 'Pending'}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <CalendarDays className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No recent sessions found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Sessions will appear here once they are scheduled</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDetailDashboard;
