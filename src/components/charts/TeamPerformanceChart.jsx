import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TeamPerformanceChart = ({ data, title = "Team Performance", type = "line" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = data.slice(-3).reduce((sum, item) => sum + (item.wins || 0), 0);
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + (item.wins || 0), 0);
    
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>Performance trends over time</CardDescription>
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
        <ResponsiveContainer width="100%" height={300}>
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="wins" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                name="Wins"
              />
              <Line 
                type="monotone" 
                dataKey="losses" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
                name="Losses"
              />
              {data[0]?.draws !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="draws" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 }}
                  name="Draws"
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wins" fill="hsl(var(--primary))" name="Wins" radius={[2, 2, 0, 0]} />
              <Bar dataKey="losses" fill="hsl(var(--destructive))" name="Losses" radius={[2, 2, 0, 0]} />
              {data[0]?.draws !== undefined && (
                <Bar dataKey="draws" fill="hsl(var(--muted-foreground))" name="Draws" radius={[2, 2, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceChart;
