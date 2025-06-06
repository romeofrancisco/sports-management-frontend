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

const PerformanceComparisonChart = ({ teams, isSetBased = false, className = "" }) => {
  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>
            Team performance metrics and win rates comparison
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }// Sort teams by win percentage for better visualization and take top 5
  const winPercentageKey = isSetBased ? 'sets_win_percentage' : 'win_percentage';
  const sortedTeams = [...teams]
    .sort((a, b) => (b[winPercentageKey] || 0) - (a[winPercentageKey] || 0))
    .slice(0, 5);

  const chartData = {
    labels: sortedTeams.map((team) => team.team_name),
    datasets: [
      {
        label: isSetBased ? "Sets Won" : "Games Won",
        data: sortedTeams.map((team) => 
          isSetBased ? (team.sets_won || 0) : (team.games_won || team.matches_won || 0)
        ),
        backgroundColor: "#8B1538",
        borderColor: "#8B1538",
        borderWidth: 1,
      },
      {
        label: isSetBased ? "Sets Lost" : "Games Lost",
        data: sortedTeams.map((team) => 
          isSetBased ? (team.sets_lost || 0) : (team.games_lost || team.matches_lost || 0)
        ),
        backgroundColor: "#FFD700",
        borderColor: "#FFD700",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          afterBody: function (tooltipItems) {
            const teamIndex = tooltipItems[0].dataIndex;
            const team = sortedTeams[teamIndex];
            const winPercentage = isSetBased 
              ? (team.sets_win_percentage || 0).toFixed(1)
              : (team.win_percentage || 0).toFixed(1);
            const totalPlayed = isSetBased 
              ? (team.sets_played || 0)
              : (team.games_played || 0);
            return [
              `Win Rate: ${winPercentage}%`, 
              `Total ${isSetBased ? 'Sets' : 'Games'}: ${totalPlayed}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: isSetBased ? 'Sets' : 'Games',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Teams',
        },
      },
    },
  };
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <CardDescription>
          Top 5 teams performance metrics and win rates comparison
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

export default PerformanceComparisonChart;