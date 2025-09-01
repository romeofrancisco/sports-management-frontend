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
import { RadarIcon } from "lucide-react";

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
  className = "",
}) => {
  if (
    !radarData ||
    !radarData.categories ||
    radarData.categories.length === 0
  ) {
    return (
         <div className="text-center py-8">
            <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <RadarIcon className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No progress metrics available
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Complete training sessions to see your progress
            </p>
          </div>
    );
  }
  console.log(radarData)

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
        pointRadius: 4,
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
            size: 9,
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
            size: 10,
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
            size: 11,
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
      <div className="h-80 w-full">
        <Radar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PlayerRadarChart;
