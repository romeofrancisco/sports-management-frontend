import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { COLORS } from './constants';
import { getDefaultChartOptions, getChartTheme } from './utils';

export const TeamPerformanceTrendsChart = ({ 
  data, 
  title = "Performance Trends", 
  subtitle = "Track team performance over time",
  dataKeys = ['win_rate', 'games_played'],
  colors = [COLORS.primary, COLORS.secondary]
}) => {
  console.log("Rendering TeamPerformanceTrendsChart with data:", data);
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }
  // Calculate trend for the first data key (primary metric)
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const primaryKey = dataKeys[0];
    const recent = data.slice(-3).reduce((sum, item) => sum + (item[primaryKey] || 0), 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + (item[primaryKey] || 0), 0) / 3;
    
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
    datasets: dataKeys.map((key, index) => {
      const color = colors[index] || COLORS.primary;
      const isSecondary = index > 0;
      
      // Get human-readable label for the key
      const getLabelForKey = (key) => {
        const labels = {
          'win_rate': 'Win Rate %',
          'games_played': 'Games Played',
          'avg_improvement': 'Avg Improvement %',
          'metrics_per_player': 'Metrics per Player',
          'active_players': 'Active Players',
          'avg_points_scored': 'Avg Points Scored',
          'avg_points_conceded': 'Avg Points Conceded',
          'point_differential': 'Point Differential',
          'attendance_rate': 'Attendance Rate %',
          'availability_score': 'Availability Score',
        };
        return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      };

      return {
        label: getLabelForKey(key),
        data: data.map(item => item[key] || 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: index === 0, // Only fill the first dataset
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: isSecondary ? 4 : 6,
        yAxisID: isSecondary ? 'y1' : 'y',
      };
    })
  };
  // Dynamic chart options based on data
  const getScaleConfig = () => {
    const primaryKey = dataKeys[0];
    const hasSecondaryAxis = dataKeys.length > 1;
    
    // Determine appropriate scale for primary axis
    const getYAxisConfig = (key) => {
      if (key.includes('rate') || key.includes('percentage')) {
        return { min: 0, max: 100, title: 'Percentage (%)' };
      } else if (key.includes('improvement')) {
        return { title: 'Improvement (%)' };
      } else if (key.includes('score') || key.includes('points')) {
        return { min: 0, title: 'Points' };
      } else {
        return { min: 0, title: 'Count' };
      }
    };

    const primaryConfig = getYAxisConfig(primaryKey);
    const secondaryConfig = hasSecondaryAxis ? getYAxisConfig(dataKeys[1]) : null;

    return {
      y: {
        ...getDefaultChartOptions().scales.y,
        type: 'linear',
        display: true,
        position: 'left',
        ...primaryConfig,
        title: {
          display: true,
          text: primaryConfig.title,
          color: getChartTheme().textColor,
        },
      },
      ...(hasSecondaryAxis && {
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: secondaryConfig.title,
            color: getChartTheme().textColor,
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: getChartTheme().textColor,
          },
          ...secondaryConfig,
        }
      })
    };
  };

  const chartOptions = {
    ...getDefaultChartOptions(),
    scales: {
      ...getDefaultChartOptions().scales,
      ...getScaleConfig(),
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
          <CardDescription>{subtitle}</CardDescription>
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
