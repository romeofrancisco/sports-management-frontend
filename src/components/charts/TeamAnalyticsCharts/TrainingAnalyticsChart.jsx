import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { COLORS } from './constants';
import { getDefaultChartOptions, getChartTheme } from './utils';

export const TrainingAnalyticsChart = ({ data, title = "Training Analytics" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>Training session attendance and participation</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No training data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: 'Training Sessions',
        data: data.map(item => item.sessions),
        backgroundColor: `${COLORS.primary}80`,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Attendance Rate %',
        data: data.map(item => item.attendance_rate),
        backgroundColor: `${COLORS.secondary}80`,
        borderColor: COLORS.secondary,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    ...getDefaultChartOptions(),
    scales: {
      ...getDefaultChartOptions().scales,
      y: {
        ...getDefaultChartOptions().scales.y,
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Training Sessions',
          color: getChartTheme().textColor,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Attendance Rate (%)',
          color: getChartTheme().textColor,
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: getChartTheme().textColor,
        },
      },
    },
    plugins: {
      ...getDefaultChartOptions().plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: getChartTheme().textColor,
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>Weekly training sessions and attendance rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
