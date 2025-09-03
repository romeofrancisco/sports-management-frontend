import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../ChartCard";

const PointsChart = ({ data, isSetsScoring }) => {
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
        type: 'linear',
        display: true,
        position: 'left',
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
          text: isSetsScoring ? 'Points per Set' : 'Points',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "600",
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // Don't draw grid lines for secondary axis
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Point Differential',
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

  const title = isSetsScoring ? 'Points per Set Performance' : 'Points per Game Performance';
  const description = isSetsScoring
    ? 'Average points scored, conceded, and point differential per set. Point differential shows the average difference between scored and conceded points.'
    : 'Average points scored, conceded, and point differential per game. Point differential shows the average difference between scored and conceded points.';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No scoring data available";

  return (
    <ChartCard 
      title={title}
      description={description}
      hasData={hasData}
      emptyMessage={emptyMessage}
    >
      <Bar data={data} options={barOptions} />
    </ChartCard>
  );
};

export default PointsChart;