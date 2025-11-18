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
import { TrendingUp } from "lucide-react";

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
  // Sort teams by the appropriate metric based on sport type
  const sortKey = isSetBased ? 'point_efficiency' : 'points_per_game';
  const topTeams = (teams || [])
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
        backgroundColor: "rgba(139, 21, 56, 0.7)",
        borderColor: "#8B1538",
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: isSetBased ? "Sets Win Percentage %" : "Points Conceded Per Game",
        data: topTeams.map((team) => 
          isSetBased ? (team.sets_win_percentage || 0) : (team.points_conceded_per_game || 0)
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
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
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
            const value = Math.round(context.parsed.y * 100) / 100;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
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
          text: isSetBased ? 'Efficiency Percentage' : 'Points per Game',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "600",
          },
        },
      },
      x: {
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
          text: 'Teams',
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
      title="Scoring Analysis"
      description="Team scoring performance and statistical analysis"
      className={className}
      icon={TrendingUp}
      hasData={topTeams.length > 0}
      height={300}
      emptyMessage="No scoring analysis data available. Analysis will appear here once teams have played games."
    >
      <Bar data={chartData} options={options} />
    </ChartCard>
  );
};

export default ScoringAnalysisChart;
