import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { COLORS } from './constants';
import { getDefaultChartOptions, getChartTheme } from './utils';

export const TeamPerformanceTrendsChart = ({ data, title = "Performance Trends" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>Track team performance over time</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = data.slice(-3).reduce((sum, item) => sum + (item.win_rate || 0), 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + (item.win_rate || 0), 0) / 3;
    
    if (previous === 0) return { direction: 'neutral', percentage: 0 };
    
    const percentage = ((recent - previous) / previous * 100);
    const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral';
    
    return { direction, percentage: Math.abs(percentage) };
  };

  const trend = calculateTrend();
  const TrendIcon = trend.direction === 'up' ? TrendingUp : 
                   trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? 'text-green-500' : 
                     trend.direction === 'down' ? 'text-red-500' : 'text-gray-500';

  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: 'Win Rate %',
        data: data.map(item => item.win_rate || 0),
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Games Played',
        data: data.map(item => item.games_played || 0),
        borderColor: COLORS.secondary,
        backgroundColor: `${COLORS.secondary}20`,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: COLORS.secondary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
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
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Win Rate (%)',
          color: getChartTheme().textColor,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Games Played',
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>Win rate and performance metrics over time</CardDescription>
          </div>
          {trend.direction !== 'neutral' && (
            <Badge variant="outline" className={`${trendColor} border-current`}>
              <TrendIcon className="mr-1 h-3 w-3" />
              {trend.percentage.toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
