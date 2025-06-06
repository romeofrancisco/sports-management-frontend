import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const WinDistributionChart = ({
  teams,
  isSetBased = false,
  className = "",
}) => {
  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Win Distribution</CardTitle>
          <CardDescription>
            {isSetBased
              ? "Top 5 teams match win distribution"
              : "Top 5 teams game win distribution"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No win data available</p>
        </CardContent>
      </Card>
    );
  } // Get top 5 teams by appropriate win percentage
  const winPercentageKey = isSetBased
    ? "match_win_percentage"
    : "win_percentage";
  const top5Teams = teams
    .sort((a, b) => (b[winPercentageKey] || 0) - (a[winPercentageKey] || 0))
    .slice(0, 5);

  // Generate combination of primary and secondary colors with variations
  const colors = [
    "#8B1538", // Primary red
    "#FFD700", // Secondary gold
    "#A63650", // Primary red lighter
    "#E6C200", // Secondary gold darker
    "#6B0F2A", // Primary red darker
  ];
  const chartData = {
    labels: top5Teams.map((team) => team.team_name),
    datasets: [
      {
        data: top5Teams.map((team) =>
          isSetBased ? team.matches_won || 0 : team.games_won || 0
        ),
        backgroundColor: colors.slice(0, top5Teams.length),
        borderColor: colors.slice(0, top5Teams.length),
        borderWidth: 2,
        hoverBackgroundColor: colors.slice(0, top5Teams.length),
        hoverBorderWidth: 3,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: false, // Removed since we're using Card title
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const team = top5Teams[context.dataIndex];
            const wins = isSetBased
              ? team.matches_won || 0
              : team.games_won || 0;
            const total = isSetBased
              ? team.matches_played || 0
              : team.games_played || 0;
            const percentage =
              total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
            const unit = isSetBased ? "matches" : "games";
            return `${context.label}: ${wins} ${unit} won (${percentage}%)`;
          },
        },
      },
    },
    cutout: "50%",
  };
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Win Distribution</CardTitle>
        <CardDescription>
          {isSetBased
            ? "Top 5 teams match win distribution"
            : "Top 5 teams game win distribution"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WinDistributionChart;
