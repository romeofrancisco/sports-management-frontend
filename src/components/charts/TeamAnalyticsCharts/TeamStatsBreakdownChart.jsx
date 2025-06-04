import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { CHART_COLORS } from './constants';

export const TeamStatsBreakdownChart = ({ data, title = "Team Statistics" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>Statistical breakdown of team performance</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No statistics data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderColor: CHART_COLORS.slice(0, data.length).map(color => `${color}80`),
        borderWidth: 2,
        hoverBackgroundColor: CHART_COLORS.slice(0, data.length).map(color => `${color}CC`),
        hoverBorderWidth: 3,
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>Wins, losses, and draws distribution</CardDescription>
      </CardHeader>      <CardContent>
        <div className="h-[300px]">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
