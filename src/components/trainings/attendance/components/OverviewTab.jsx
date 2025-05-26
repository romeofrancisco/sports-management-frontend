import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doughnut, Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { StatCard } from './StatCard';
import { 
  createAttendanceDistributionChart,
  distributionChartOptions,
  createTrendsChart,
  trendsChartOptions 
} from './chartConfigs';
import { CalendarDays, Users, TrendingUp, BarChart3 } from 'lucide-react';

const OverviewTab = ({ overviewData, trendsData }) => {
  if (!overviewData || !overviewData.attendance_distribution) return null;

  const attendanceDistribution = createAttendanceDistributionChart(overviewData.attendance_distribution);
  const trendsChartData = createTrendsChart(trendsData, (date) => format(parseISO(date), 'MMM dd'));
  return (
    <div className="space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div>
          <StatCard
            title="Total Sessions"
            value={overviewData.total_sessions || 0}
            subtitle="Training sessions recorded"
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>
        <div>
          <StatCard
            title="Total Attendees"
            value={overviewData.total_attendees || 0}
            subtitle="Unique participants"
            icon={<Users className="h-5 w-5" />}
          />
        </div>
        <div>
          <StatCard
            title="Attendance Rate"
            value={`${overviewData.overall_attendance_rate || 0}%`}
            subtitle="Overall performance"
            icon={<BarChart3 className="h-5 w-5" />}
          />
        </div>
        <div>
          <StatCard
            title="Avg Per Session"
            value={(overviewData.average_attendance_per_session || 0).toFixed(1)}
            subtitle="Players per session"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>
      </div>      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[30%_1fr] gap-6 lg:gap-8">
        {/* Attendance Distribution Chart */}
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📊 Attendance Distribution
            </h3>
            <p className="text-sm text-muted-foreground">Overall attendance patterns</p>
          </div>
          <div className="h-72 lg:h-80 xl:h-72 flex items-center justify-center">
            <Doughnut data={attendanceDistribution} options={distributionChartOptions} />
          </div>
        </div>

        {/* Trends Chart */}
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📈 Attendance Trends
            </h3>
            <p className="text-sm text-muted-foreground">Performance over time</p>
          </div>
          {trendsChartData ? (
            <div className="h-72 lg:h-80 xl:h-72">
              <Line className='h-full w-full' data={trendsChartData} options={trendsChartOptions} />
            </div>
          ) : (
            <div className="h-72 lg:h-80 xl:h-72 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-muted-foreground font-medium">No trends data available</p>
                <p className="text-xs text-muted-foreground">Check back once more attendance data is recorded</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
