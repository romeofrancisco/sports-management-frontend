import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { BarChart3 } from "lucide-react";

// Register Chart.js components for radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PlayerRadarChart = ({
  radarData,
  dateRange = {},
  onDateRangeChange,
  className = "",
  showControls = true,
}) => {
  if (
    !radarData ||
    !radarData.categories ||
    radarData.categories.length === 0
  ) {
    return (
      <div className={`w-full ${className} text-center pb-8`}>
        <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          No Training Data Available
        </h3>
        <p className="text-base max-w-md mx-auto text-muted-foreground">
          This player hasn't recorded performance data across different training
          categories yet. Start tracking their progress in various training
          areas.
        </p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: radarData.chart_labels,
    datasets: [
      {
        label: "Performance Score",
        data: radarData.performance_scores,
        backgroundColor: "rgba(139, 21, 56, 0.2)", // Perpetual Maroon with transparency
        borderColor: "rgba(139, 21, 56, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(139, 21, 56, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(139, 21, 56, 1)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Improvement %",
        data: radarData.improvement_percentages.map((val) =>
          Math.max(0, 50 + val)
        ), // Normalize to 0-100 scale
        backgroundColor: "rgba(255, 215, 0, 0.2)", // Perpetual Gold with transparency
        borderColor: "rgba(255, 215, 0, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 215, 0, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 215, 0, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: "rgba(148, 163, 184, 0.8)",
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.2)",
        },
        angleLines: {
          color: "rgba(148, 163, 184, 0.2)",
        },
        pointLabels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "600",
          },
          color: "rgba(51, 65, 85, 0.9)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(139, 21, 56, 0.5)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            const categoryData = radarData.categories[context.dataIndex];
            if (context.datasetIndex === 0) {
              return `Performance: ${context.parsed.r.toFixed(1)}/100`;
            } else {
              return `Improvement: ${categoryData.average_improvement.toFixed(
                1
              )}%`;
            }
          },
          afterLabel: function (context) {
            const categoryData = radarData.categories[context.dataIndex];
            return [
              `Metrics: ${categoryData.metrics_count}`,
              `Records: ${categoryData.total_records}`,
            ];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "point",
    },
  };
  return (
    <div className={`w-full ${className}`}>
      {/* Chart */}
      <div className="h-96 w-full">
        <Radar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PlayerRadarChart;
