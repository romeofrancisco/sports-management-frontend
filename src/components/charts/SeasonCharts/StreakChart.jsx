import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const StreakChart = ({ data, isSetsScoring }) => {
  const barOptions = {
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
        position: 'bottom',
        display: false,
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
          text: isSetsScoring ? 'Sets Won' : 'Games Won',
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

  const title = isSetsScoring ? 'Longest Sets Win Streaks' : 'Longest Win Streaks';
  const description = isSetsScoring
    ? 'Maximum consecutive sets won by each team during the season.'
    : 'Maximum consecutive games won by each team during the season.';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No streak data available";

  return (
    <ChartCard 
      title={title}
      description={description}
      hasData={hasData}
      emptyMessage={emptyMessage}
      className="lg:col-span-2"
    >
      <Bar data={data} options={barOptions} />
    </ChartCard>
  );
};

export default StreakChart;