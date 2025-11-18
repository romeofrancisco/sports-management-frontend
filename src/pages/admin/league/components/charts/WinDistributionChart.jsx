import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartCard from "@/components/charts/ChartCard";
import { PieChart } from "lucide-react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const WinDistributionChart = ({
  teams,
  isSetBased = false,
  className = "",
}) => {
  // Get top 5 teams by appropriate win percentage
  const winPercentageKey = isSetBased
    ? "match_win_percentage"
    : "win_percentage";
  const top5Teams = (teams || [])
    .sort((a, b) => (b[winPercentageKey] || 0) - (a[winPercentageKey] || 0))
    .slice(0, 5);

  // Generate combination of primary and secondary colors with variations and transparency
  const colors = [
    "rgba(139, 21, 56, 0.7)", // Primary red with transparency
    "rgba(255, 215, 0, 0.7)", // Secondary gold with transparency
    "rgba(166, 54, 80, 0.7)", // Primary red lighter with transparency
    "rgba(230, 194, 0, 0.7)", // Secondary gold darker with transparency
    "rgba(107, 15, 42, 0.7)", // Primary red darker with transparency
  ];

  // Border colors without transparency for crisp edges
  const borderColors = [
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
        borderColor: borderColors.slice(0, top5Teams.length),
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
        labels: {
          padding: 16,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "500",
          },
        },
      },
      title: {
        display: false, // Removed since we're using Card title
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(139, 0, 0, 0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: "600",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "400",
        },
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
    <ChartCard
      title="Win Distribution"
      description={
        isSetBased
          ? "Top 5 teams match win distribution"
          : "Top 5 teams game win distribution"
      }
      className={className}
      icon={PieChart}
      hasData={top5Teams.length > 0}
      height={300}
      emptyMessage="No win distribution data available. Data will appear here once games are completed."
    >
      <Doughnut data={chartData} options={options} />
    </ChartCard>
  );
};

export default WinDistributionChart;
