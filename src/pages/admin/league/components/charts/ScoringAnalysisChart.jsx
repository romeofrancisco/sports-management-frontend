import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoringAnalysisChart = ({ teams, isSetBased = false, className = "" }) => {
  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scoring Analysis</CardTitle>
          <CardDescription>
            Team scoring performance and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No scoring data available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort teams by the appropriate metric based on sport type
  const sortKey = isSetBased ? 'point_efficiency' : 'points_per_game';
  const topTeams = teams
    .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
    .slice(0, 8);

  // Prepare data for scoring trends with different metrics for set vs point based sports
  const chartData = {
    labels: topTeams.map((team) => team.team_name),
    datasets: [
      {
        label: isSetBased ? "Point Efficiency %" : "Points Per Game",
        data: topTeams.map((team) => 
          isSetBased ? (team.point_efficiency || 0) : (team.points_per_game || 0)
        ),
        backgroundColor: "#8B1538",
        borderColor: "#8B1538",
        borderWidth: 1,
      },
      {
        label: isSetBased ? "Sets Win Percentage %" : "Points Conceded Per Game",
        data: topTeams.map((team) => 
          isSetBased ? (team.sets_win_percentage || 0) : (team.points_conceded_per_game || 0)
        ),
        backgroundColor: "#FFD700",
        borderColor: "#FFD700",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false, // Removed since we're using Card title
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = Math.round(context.parsed.y * 100) / 100;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: isSetBased ? 'Efficiency Percentage' : 'Points per Game',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Teams',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Analysis</CardTitle>
        <CardDescription>
          Team scoring performance and statistical analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoringAnalysisChart;
