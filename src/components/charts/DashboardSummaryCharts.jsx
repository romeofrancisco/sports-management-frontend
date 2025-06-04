import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Activity Trends Chart
export const ActivityTrendsChart = ({ data, title = "Activity Trends" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="trainings" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Training Sessions"
            />
            <Line 
              type="monotone" 
              dataKey="games" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Games"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#ffc658" 
              strokeWidth={2}
              name="Total Activities"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Weekly Trends Area Chart
export const WeeklyTrendsChart = ({ data, title = "Weekly Trends" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week_start" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="sessions_count" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8"
              name="Sessions"
            />
            <Area 
              type="monotone" 
              dataKey="participants" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d"
              name="Participants"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Sport Distribution Pie Chart
export const SportDistributionChart = ({ data, title = "Sport Distribution" }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total_games"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Team Performance Bar Chart
export const TeamPerformanceChart = ({ data, title = "Team Performance" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(0, 10)} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="team_name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="games_won" fill="#82ca9d" name="Games Won" />
            <Bar dataKey="games_played" fill="#8884d8" name="Games Played" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Activity Heatmap Component
export const ActivityHeatmapChart = ({ data, title = "Activity Heatmap" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  // Group data by weeks
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex space-x-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-8 h-8 rounded ${getIntensityColor(day.intensity)} flex items-center justify-center text-xs text-white font-medium`}
                  title={`${day.date}: ${day.total_activity} activities`}
                >
                  {day.total_activity}
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Growth Analytics Chart
export const GrowthAnalyticsChart = ({ data, title = "Growth Analytics" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="new_users" 
              stroke="#8884d8" 
              name="New Users"
            />
            <Line 
              type="monotone" 
              dataKey="new_teams" 
              stroke="#82ca9d" 
              name="New Teams"
            />
            <Line 
              type="monotone" 
              dataKey="games_conducted" 
              stroke="#ffc658" 
              name="Games Conducted"
            />
            <Line 
              type="monotone" 
              dataKey="training_sessions" 
              stroke="#ff7300" 
              name="Training Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default {
  ActivityTrendsChart,
  WeeklyTrendsChart,
  SportDistributionChart,
  TeamPerformanceChart,
  ActivityHeatmapChart,
  GrowthAnalyticsChart,
};
