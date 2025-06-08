import React from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "@/components/charts/ChartCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Performance Differential Chart component
 * Shows differential in point-based or set-based metrics
 * @param {Object} data - Chart data with labels and datasets
 * @param {boolean} isSetsScoring - Whether the sport uses sets scoring
 */
const PerformanceDifferentialChart = ({ data, isSetsScoring }) => {
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // This makes the bars horizontal instead of vertical
    plugins: {
      legend: {
        display: false, // Hide legend since color indicates positive/negative
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const label = isSetsScoring ? 
              `${value}% win rate` : 
              `${value > 0 ? '+' : ''}${value} point differential`;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    },
  };

  const title = isSetsScoring ? 'Set Win Rate (%)' : 'Point Differential';
  const hasData = data.labels.length > 0;
  const emptyMessage = "No differential data available";

  return (
    <ChartCard 
      title={title}
      hasData={hasData}
      emptyMessage={emptyMessage}
      className="lg:col-span-3"
    >
      <Bar data={data} options={horizontalBarOptions} />
    </ChartCard>
  );
};

export default PerformanceDifferentialChart;
