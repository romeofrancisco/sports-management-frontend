import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TeamStatsChart = ({ data, title = "Team Statistics", type = "pie" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No statistics data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = {
    wins: 'hsl(var(--success))',
    losses: 'hsl(var(--destructive))',
    draws: 'hsl(var(--muted-foreground))',
    home: 'hsl(var(--primary))',
    away: 'hsl(var(--secondary))',
    goals_scored: 'hsl(var(--primary))',
    goals_conceded: 'hsl(var(--destructive))',
    training_attendance: 'hsl(var(--success))',
    game_participation: 'hsl(var(--primary))',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small segments

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={PieCustomLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name] || `hsl(${index * 45}, 70%, 60%)`} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="hsl(var(--primary))" 
          radius={[4, 4, 0, 0]}
          name="Value"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Calculate totals for summary
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const maxItem = data.reduce((max, item) => (item.value > max.value) ? item : max, data[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>Statistical breakdown</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              Total: {total}
            </Badge>
            {maxItem && (
              <Badge variant="secondary">
                Top: {maxItem.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {type === "pie" ? renderPieChart() : renderBarChart()}
        
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.name] || `hsl(${index * 45}, 70%, 60%)` }}
              />
              <span className="text-sm text-muted-foreground capitalize">
                {entry.name.replace('_', ' ')}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStatsChart;
