import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const DifferentialChart = ({ data, isSetsScoring }) => {
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // This makes the bars horizontal instead of vertical
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
        display: false, // Hide legend since color indicates positive/negative
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
          label: function(context) {
            const value = context.raw;
            return `${value}%`;
          }
        }
      }
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
          text: 'Win Percentage (%)',
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
          autoSkip: false,
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

  const title = 'Win Percentage';
  const description = isSetsScoring 
    ? 'Shows each team\'s percentage of sets won during the season. Higher percentages indicate better performance.'
    : 'Shows each team\'s percentage of games won during the season. Higher percentages indicate better performance.';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No win percentage data available";

  return (
    <ChartCard 
      title={title}
      description={description}
      hasData={hasData}
      emptyMessage={emptyMessage}
      className="lg:col-span-3"
    >
      <Bar data={data} options={horizontalBarOptions} />
    </ChartCard>
  );
};

export default DifferentialChart;