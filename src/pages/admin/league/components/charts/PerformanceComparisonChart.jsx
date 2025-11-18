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
import ChartCard from "@/components/charts/ChartCard";
import { BarChart3 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceComparisonChart = ({
  teams,
  isSetBased = false,
  className = "",
}) => {
  // Sort teams by win percentage for better visualization and take top 5
  const winPercentageKey = isSetBased
    ? "sets_win_percentage"
    : "win_percentage";
  const sortedTeams = [...(teams || [])]
    .sort((a, b) => (b[winPercentageKey] || 0) - (a[winPercentageKey] || 0))
    .slice(0, 5);


  const chartData = {
    labels: sortedTeams.map((team) => team.team_name),
    datasets: [
      {
        label: isSetBased ? "Sets Won" : "Games Won",
        data: sortedTeams.map((team) =>
          isSetBased
            ? team.sets_won || 0
            : team.games_won || team.matches_won || 0
        ),
        backgroundColor: "rgba(139, 21, 56, 0.7)",
        borderColor: "#8B1538",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: isSetBased ? "Sets Lost" : "Games Lost",
        data: sortedTeams.map((team) =>
          isSetBased
            ? team.sets_lost || 0
            : team.games_lost || team.matches_lost || 0
        ),
        backgroundColor: "rgba(255, 215, 0, 0.7)",
        borderColor: "#FFD700",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
        borderWidth: 2,
      },
    },
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
          afterBody: function (tooltipItems) {
            const teamIndex = tooltipItems[0].dataIndex;
            const team = sortedTeams[teamIndex];
            const winPercentage = isSetBased
              ? (team.sets_win_percentage || 0).toFixed(1)
              : (team.win_percentage || 0).toFixed(1);
            const totalPlayed = isSetBased
              ? team.sets_played || 0
              : team.games_played || 0;
            return [
              `Win Rate: ${winPercentage}%`,
              `Total ${isSetBased ? "Sets" : "Games"}: ${totalPlayed}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        title: {
          display: true,
          text: isSetBased ? "Sets" : "Games",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "600",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        title: {
          display: true,
          text: "Teams",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Performance Comparison"
      description="Top 5 teams performance metrics and win rates comparison"
      className={className}
      icon={BarChart3}
      hasData={sortedTeams.length > 0}
      height={300}
      emptyMessage="No team performance data available. Teams will appear here once games are played."
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

export default PerformanceComparisonChart;
